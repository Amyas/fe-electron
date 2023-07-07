import path from 'path'
import { app, dialog, ipcMain } from 'electron'
import Store from 'electron-store'
import WorkerWindow from '@main/windows/worker'
import MainWindow from '@main/windows/main'

import * as Utils from '@main/utils'
import LoginWindow from './windows/login'

Utils.hiddenSecurityWarnings()

const store = new Store()
store.clear()

const APP_URL = app.isPackaged
	? 'file://' + path.join(__dirname, 'index.html')
	: `http://127.0.0.1:8082/`

app.whenReady().then(() => {
	startApp()

	ipcMain.handle('show-message-box', async (_, args) => {
		const { type, title, message } = args
		const result = await dialog.showMessageBox({
			type,
			title,
			message,
			buttons: ['OK']
		})
		return result
	})

	ipcMain.handle('get-user-info', () => {
		return store.get('userInfo')
	})
})

async function startApp() {
	let userInfo = store.get('userInfo')
	if (!userInfo) {
		userInfo = await LoginWindow.createWindow(APP_URL)
		store.set('userInfo', userInfo)
	}

	const workerIsReady = await WorkerWindow.createWindow(APP_URL)
	if (!workerIsReady) {
		// TODO: Handle error
		return
	}

	MainWindow.createWindow(APP_URL)
}
