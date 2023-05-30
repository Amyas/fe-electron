declare module '*.jpeg'

declare module 'process' {
	global {
		namespace NodeJS {
			export interface ProcessEnv {
				REACT_APP_API_URL: string
			}
		}
	}
}
