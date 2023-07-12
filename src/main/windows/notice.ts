import { BrowserWindow } from 'electron'
import { EventEmitter } from 'events'

export default class NoticeWindow extends EventEmitter {
	static window: BrowserWindow | null = null
	static createWindow(APP_URL: string, options?: Electron.BrowserWindowConstructorOptions) {
		const window = new BrowserWindow({
			width: 680,
			height: 630,
			...options,
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
				webSecurity: false
			}
		})
		window.webContents.openDevTools({ mode: 'undocked' })
		window.loadURL(APP_URL + '?windowId=notice')
		this.window = window
	}
}
