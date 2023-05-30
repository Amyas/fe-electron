declare module '*.jpeg'
declare module '*.scss' {
	const classes: { [key: string]: string }
	export default classes
}

declare module 'process' {
	global {
		namespace NodeJS {
			export interface ProcessEnv {
				REACT_APP_API_URL: string
			}
		}
	}
}
