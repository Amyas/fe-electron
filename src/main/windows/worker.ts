import { BrowserWindow, ipcMain } from 'electron'
import { EventEmitter } from 'events'

export default class WorkerWindow extends EventEmitter {
	static createWindow(APP_URL: string) {
		return new Promise(resolve => {
			const worker = new BrowserWindow({
				show: false,
				webPreferences: {
					nodeIntegration: true,
					contextIsolation: false,
					webSecurity: false
				}
			})
			worker.webContents.openDevTools({ mode: 'undocked' })
			worker.loadURL(APP_URL + '?windowId=worker')
			ipcMain.on('worker-ready', (_, isReady: boolean) => {
				resolve(isReady)
			})
		})
	}
}
