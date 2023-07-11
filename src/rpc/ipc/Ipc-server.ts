/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcRenderer, IpcRendererEvent } from 'electron'
import { Observable, Subscription } from 'rxjs'
import { v4 as uuid } from 'uuid'

import { ServiceManager } from '../core/service-manager'
import { Service } from '../core/service'

import { Dictionary, IRpcRequest, IRpcResponse } from '../types'

export enum E_JSON_RPC_ERROR {
	PARSE_ERROR = -32700,
	INVALID_REQUEST = -32600,
	METHOD_NOT_FOUND = -32601,
	INVALID_PARAMS = -32602,
	INTERNAL_JSON_RPC_ERROR = -32603,
	INTERNAL_SERVER_ERROR = -32000
}

export class IpcServer extends Service {
	private requestErrors: any[] = []
	subscriptions: Dictionary<Subscription> = {}

	listen() {
		this.requestHandler = this.requestHandler.bind(this)
		ipcRenderer.on('services-request', this.requestHandler)
	}

	requestHandler(_: IpcRendererEvent, request: IRpcRequest) {
		const response: IRpcResponse = this.exec(request)

		if (!request.params.noReturn) {
			try {
				ipcRenderer.send('services-response', response)
			} catch (e) {
				console.error('Failed to send async services response', e, {
					request,
					response
				})
			}
		}
	}

	exec(request: IRpcRequest): IRpcResponse {
		let response!: IRpcResponse
		this.requestErrors = []

		try {
			response = this.handleServiceRequest(request)
		} catch (error) {
			this.requestErrors.push(error)
		}

		if (this.requestErrors.length) {
			response = this.createError(request.id, {
				code: E_JSON_RPC_ERROR.INTERNAL_SERVER_ERROR,
				method: request.methodName,
				message: this.requestErrors
					.map((e: any) =>
						e instanceof Error ? `${e.message} ${e.stack && e.stack.toString()}` : e
					)
					.join(';')
			})
		}

		return response
	}

	handleServiceRequest(request: IRpcRequest): IRpcResponse {
		const {
			serviceName,
			methodName,
			params: { args }
		} = request

		const service = ServiceManager.instance.getService(serviceName)

		let errorResponse!: IRpcResponse

		if (!service) {
			errorResponse = this.createError(request.id, {
				code: E_JSON_RPC_ERROR.INVALID_PARAMS,
				method: request.methodName,
				message: `service not found: ${service}`
			})
		} else if (service[methodName] === 0) {
			errorResponse = this.createError(request.id, {
				code: E_JSON_RPC_ERROR.METHOD_NOT_FOUND,
				method: request.methodName,
				message: methodName
			})
		}

		if (errorResponse) return errorResponse

		const payload =
			typeof service[methodName] === 'function'
				? // eslint-disable-next-line prefer-spread
				  service[methodName].apply(service, args)
				: service[methodName]

		const response = this.serializePayload(service, payload, request)

		return response
	}

	serializePayload(service: any, responsePayload: any, request: IRpcRequest): IRpcResponse {
		if (!(responsePayload instanceof Object)) {
			return this.createResponse(request.id, responsePayload)
		}

		// if response is RxJs Observable then subscribe to it and return subscription
		if (responsePayload instanceof Observable) {
			// each subscription has unique id
			const subscriptionId = `${request.serviceName}.${request.methodName}`

			// create the subscription if it doesn't exist
			if (!this.subscriptions[subscriptionId]) {
				const subscriptionName = subscriptionId.split('.')[1]
				this.subscriptions[subscriptionId] = service[subscriptionName].subscribe((data: any) => {
					ipcRenderer.send(
						'services-promise-response',
						this.createResponse(uuid(), {
							_type: 'EVENT',
							emitter: 'STREAM',
							data,
							resourceId: subscriptionId
						})
					)
				})
			}

			// return subscription
			// the API client can use subscriptionId to listen events from this subscription
			return this.createResponse(request.id, {
				_type: 'SUBSCRIPTION',
				resourceId: subscriptionId,
				emitter: 'STREAM'
			})
		}

		const isPromise = !!responsePayload.then
		if (isPromise) {
			const promiseId = uuid()
			const promise = responsePayload as Promise<any>
			promise.then(
				data => this.sendPromiseMessage({ data, promiseId, isRejected: false }),
				data => this.sendPromiseMessage({ data, promiseId, isRejected: true })
			)

			return this.createResponse(request.id, {
				_type: 'SUBSCRIPTION',
				resourceId: promiseId,
				emitter: 'PROMISE'
			})
		}

		return this.createResponse(request.id, responsePayload)
	}

	sendPromiseMessage(info: { isRejected: boolean; promiseId: string; data: any }) {
		if (info.data instanceof Error || info.data instanceof Response) {
			info.data = JSON.parse(JSON.stringify(info.data))
		}

		const serializedData = info.isRejected
			? { message: info.data && info.data.message, ...info.data }
			: info.data

		ipcRenderer.send(
			'services-promise-response',
			this.createResponse(uuid(), {
				_type: 'EVENT',
				emitter: 'PROMISE',
				data: serializedData,
				resourceId: info.promiseId,
				isRejected: info.isRejected
			})
		)
	}

	createResponse(id: string, result: any): IRpcResponse {
		return {
			id,
			result,
			jsonrpc: '2.0'
		} as IRpcResponse
	}

	createError(
		id: string,
		options: {
			code: E_JSON_RPC_ERROR
			method: string
			message?: string
		}
	): IRpcResponse {
		return {
			id,
			jsonrpc: '2.0',
			error: {
				code: options.code,
				method: options.method,
				message: E_JSON_RPC_ERROR[options.code] + (options.message ? ' ' + options.message : '')
			}
		} as IRpcResponse
	}

	/**
	 * @description 停止services-request监听
	 */
	stopListener() {
		ipcRenderer.removeListener('services-request', this.requestHandler)
	}
}
