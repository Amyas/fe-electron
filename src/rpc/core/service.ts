/* eslint-disable */

type TInstances = {
	[key: string]: Service
}

/**
 * Makes all functions return a Promise and sets other types to never
 */
type TPromisifyFunctions<T> = {
	[P in keyof T]: T[P] extends (...args: any[]) => any ? TPromisifyFunction<T[P]> : never
}

/**
 * Wraps the return type in a promise if it doesn't already return a promise
 */
type TPromisifyFunction<T> = T extends (...args: infer P) => infer R
	? T extends (...args: any) => Promise<any>
		? (...args: P) => R
		: (...args: P) => Promise<R>
	: T

/**
 * Makes all functions return void and sets other types to never
 */
export type TVoidFunctions<T> = {
	[P in keyof T]: T[P] extends (...args: any[]) => any ? TVoidFunction<T[P]> : never
}

/**
 * Takes a function and makes its return type void
 */
type TVoidFunction<T> = T extends (...args: infer P) => any ? (...args: P) => void : T

export interface IActionsReturn<T> {
	return: TPromisifyFunctions<T>
}

/**
 * Creates a Proxy for handling action calls from the worker process.
 * Although Promises are still returned, all execution happens
 * synchronously.
 * @param service The service to wrap
 * @param isReturn Whether to return the result
 */
function getActionProxy<T extends Service>(
	service: T,
	isReturn = false
): TVoidFunctions<T> & IActionsReturn<T> {
	return new Proxy(service, {
		get: (target, key: string) => {
			if (key === 'return' && !isReturn) {
				return getActionProxy(target, true)
			}

			return (...args: unknown[]) => {
				return new Promise<unknown>((resolve, reject) => {
					try {
						const result: unknown = (target[key] as Function).apply(target, args)
						isReturn ? resolve(result) : resolve(undefined)
					} catch (e) {
						reject(e)
					}
				})
			}
		}
	}) as unknown as TVoidFunctions<T> & IActionsReturn<T>
}

const singleton = Symbol('singleton')
const singletonEnforcer = Symbol('singletonEnforcer')

const instances: TInstances = {}

export abstract class Service {
	[key: string]: any
	private static proxyFn: (service: Service) => Service

	static get hasInstance(): boolean {
		return !!instances[this.name]
	}

	static get instance(): any {
		const instance = !this.hasInstance ? Service.createInstance(this) : instances[this.name]

		return this.proxyFn ? this.proxyFn(instance) : instance
	}

	static setupProxy(fn: (service: Service) => Service) {
		this.proxyFn = fn
	}

	static createInstance(ServiceClass: any): Service {
		if (ServiceClass.hasInstance) {
			throw new Error('Unable to create more than one singleton service')
		}

		const instance = new ServiceClass(singletonEnforcer)
		ServiceClass[singleton] = instance
		instances[ServiceClass.name] = instance

		instance.init()

		return instance
	}

	/**
	 * Actions are a restricted way to call methods on a service.
	 * It is an async representation of the service that discards
	 * return values by default.
	 */
	get actions(): TVoidFunctions<this> & IActionsReturn<this> {
		// The internal API client handles this via Proxies at runtime
		// for renderer processes. For the worker process, we use a simple
		// proxy that synchronously executes the calls.
		return getActionProxy(this)
	}

	init() {}
}
