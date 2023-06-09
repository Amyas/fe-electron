import { BrowserWindow } from 'electron'
import { EventEmitter } from 'events'

export default class SearchWindow extends EventEmitter {
	static window: BrowserWindow | null = null
	static createWindow(APP_URL: string, options?: Electron.BrowserWindowConstructorOptions) {
		const login = new BrowserWindow({
			width: 320,
			height: 424,
			...options,
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
				webSecurity: false
			}
		})
		login.webContents.openDevTools({ mode: 'undocked' })
		login.loadURL(APP_URL + '?windowId=search')
		this.window = login
	}
}
