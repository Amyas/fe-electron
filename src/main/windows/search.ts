import { BrowserWindow } from 'electron'
import { EventEmitter } from 'events'

export default class SearchWindow extends EventEmitter {
	static createWindow(APP_URL: string) {
		const login = new BrowserWindow({
			width: 320,
			height: 424,
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
				webSecurity: false
			}
		})
		login.webContents.openDevTools({ mode: 'undocked' })
		login.loadURL(APP_URL + '?windowId=search')
	}
}
