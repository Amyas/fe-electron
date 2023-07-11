import { BrowserWindow, ipcMain } from 'electron'
import { EventEmitter } from 'events'
import { IpcConnector } from '@rpc/index'

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
				IpcConnector.instance.listen(worker)
				resolve(isReady)
			})
		})
	}
}
