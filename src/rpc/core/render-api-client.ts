/* eslint-disable */

import { Service } from './service'
import { ipcRenderer } from 'electron'
import { v4 as uuid } from 'uuid'
import { Observable, Subject } from 'rxjs'
import { Dictionary, IRpcRequest, IRpcResponse } from '../types'

export class RenderApiClient {
	private promises: Dictionary<Function[]> = {}
	private actionResponses: Dictionary<Function[]> = {}
	private subscriptions: Dictionary<Subject<any>> = {}

	constructor() {
		this.listenWorkerWindowMessage()
	}

	listenWorkerWindowMessage(): void {
		const promises = this.promises

		ipcRenderer.on('services-response-async', (_, response) => {
			if (response.error) {
				this.actionResponses[response.id][1](response.error)
				return
			}
			const result = this.handleResult(response.result)

			if (result instanceof Promise) {
				result
					.then(r => this.actionResponses[response.id][0](r))
					.catch(r => this.actionResponses[response.id][1](r))
			} else {
				this.actionResponses[response.id][0](result)
			}
		})

		ipcRenderer.on('services-promise-response', (_, message) => {
			// handle only `EVENT` messages here
			if (message.result._type !== 'EVENT') return

			// handle promise reject/resolve
			if (message.result.emitter === 'PROMISE') {
				const promisePayload = message.result
				if (promisePayload) {
					// skip the promise result if this promise has been created from another window
					if (!promises[promisePayload.resourceId]) return

					// resolve or reject the promise depending on the response from the main window
					const [resolve, reject] = promises[promisePayload.resourceId]
					const callback = promisePayload.isRejected ? reject : resolve
					callback(promisePayload.data)
					delete promises[promisePayload.resourceId]
				}
			} else if (message.result.emitter === 'STREAM') {
				// handle RXJS events
				const resourceId = message.result.resourceId
				if (!this.subscriptions[resourceId]) return
				this.subscriptions[resourceId].next(message.result.data)
			}
		})
	}

	handleResult(result: any) {
		if (result && result._type === 'SUBSCRIPTION') {
			if (result.emitter === 'PROMISE') {
				return new Promise((resolve, reject) => {
					const promiseId = result.resourceId
					this.promises[promiseId] = [resolve, reject]
				})
			}

			if (result.emitter === 'STREAM') {
				return (this.subscriptions[result.resourceId] =
					this.subscriptions[result.resourceId] || new Subject())
			}
		}

		return result
	}

	applyIpcProxy(service: Service, isAction = false, shouldReturn = false): Service {
		return new Proxy(service, {
			get: (target, property: string) => {
				if (property === 'actions') {
					return this.applyIpcProxy(target, true)
				}

				if (isAction && property === 'return') {
					return this.applyIpcProxy(target, true, true)
				}

				if (!target[property]) return target[property]

				if (typeof target[property] !== 'function' && !(target[property] instanceof Observable)) {
					return target[property]
				}

				const methodName = property.toString()

				const handler = this.createRequestHandler(target, methodName, {
					isAction,
					shouldReturn
				})

				if (typeof target[property] === 'function') return handler
				if (target[property] instanceof Observable) return handler()
			}
		})
	}

	createRequestHandler(
		target: Service,
		methodName: string,
		options: { isAction: boolean; shouldReturn: boolean }
	) {
		const serviceName = target.constructor.name
		const isObservable = target[methodName] instanceof Observable

		return (...args: any[]) => {
			if (options.isAction || isObservable) {
				const request = this.createRequest(
					serviceName,
					methodName,
					{
						noReturn: !options.shouldReturn
					},
					...args
				)

				try {
					ipcRenderer.send('services-request-async', request)
				} catch (error) {
					console.error('Failed to send async services request', error, {
						request
					})
					throw error
				}

				if (isObservable) {
					const observableResourceId = `${serviceName}.${methodName}`

					return (this.subscriptions[observableResourceId] =
						this.subscriptions[observableResourceId] || new Subject())
				}

				if (options.shouldReturn) {
					return new Promise((resolve, reject) => {
						this.actionResponses[request.id] = [resolve, reject]
					}).finally(() => {
						delete this.actionResponses[request.id]
					})
				}

				return
			}

			const request: IRpcRequest = this.createRequest(
				serviceName,
				methodName,
				{
					noReturn: false
				},
				...args
			)

			const response: IRpcResponse = ipcRenderer.sendSync('services-request-sync', request)

			return this.handleResult(response.result)
		}
	}

	createRequest(
		serviceName: string,
		methodName: string,
		options: { noReturn?: boolean },
		...args: any[]
	): IRpcRequest {
		return {
			serviceName,
			methodName,
			jsonrpc: '2.0',
			id: uuid(),
			params: {
				args,
				...options
			}
		} as IRpcRequest
	}
}
