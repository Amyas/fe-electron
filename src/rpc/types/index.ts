export type TServiceTerminal = 'server' | 'clinet' | 'connector'

export interface Dictionary<TItemType> {
	[key: string]: TItemType
}

export interface IRpcRequest {
	id: string
	serviceName: string
	methodName: string
	jsonrpc: '2.0'
	params: {
		args?: any[]
		noReturn?: boolean
	}
}

export interface IRpcResponse {
	jsonrpc: '2.0'
	id: string | number
	result?: any
	error?: {
		code: number
		message?: string
	}
}
