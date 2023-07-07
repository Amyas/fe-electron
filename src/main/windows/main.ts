import { BrowserWindow } from 'electron'
import { EventEmitter } from 'events'

export default class MainWindow extends EventEmitter {
	static createWindow(APP_URL: string) {
		const worker = new BrowserWindow({
			width: 1200,
			height: 1000,
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
				webSecurity: false
			}
		})
		worker.webContents.openDevTools({ mode: 'right' })
		worker.loadURL(APP_URL + '?windowId=main')
	}
}
