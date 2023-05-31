import path from 'path'
import { app, BrowserWindow } from 'electron'

import * as Utils from '@main/utils'

Utils.hiddenSecurityWarnings()

const APP_URL = app.isPackaged
	? 'file://' + path.join(__dirname, 'index.html')
	: `http://127.0.0.1:8082/`

app.whenReady().then(() => {
	const win = new BrowserWindow({
		width: 1200,
		height: 1000,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	})
	win.webContents.openDevTools()
	win.loadURL(APP_URL)
})
