import { BrowserWindow, ipcMain } from 'electron'
import { EventEmitter } from 'events'

export default class LoginWindow extends EventEmitter {
	static createWindow(APP_URL: string) {
		return new Promise(resolve => {
			const login = new BrowserWindow({
				width: 320,
				height: 448,
				webPreferences: {
					nodeIntegration: true,
					contextIsolation: false,
					webSecurity: false
				}
			})
			login.webContents.openDevTools({ mode: 'right' })
			login.loadURL(APP_URL + '?windowId=login')
			ipcMain.on('login-ready', (_, data) => {
				login.hide()
				resolve(data)
			})
		})
	}
}
