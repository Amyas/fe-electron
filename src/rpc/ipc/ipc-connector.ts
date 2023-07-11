import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron'
import { Service } from '../core/service'
import { IRpcRequest } from '../types'

type TServiceRequest = IRpcRequest & {
	event: IpcMainEvent
	sync: boolean
}

type TServiceRequests = {
	[key: string]: TServiceRequest
}

export class IpcConnector extends Service {
	private serviceRequests: TServiceRequests = {}
	private server!: BrowserWindow

	private sendRequest(payload: IRpcRequest, event: IpcMainEvent | null = null, sync = false) {
		if (this.server.isDestroyed()) {
			console.log('Tried to send request but worker window was missing...')
			return
		}

		this.server.webContents.send('services-request', payload)

		if (!event || !!payload.params.noReturn) return

		this.serviceRequests[payload.id] = Object.assign({}, payload, {
			event,
			sync
		})
	}

	listen(server: BrowserWindow) {
		this.serviceRequests = {}
		this.server = server
		ipcMain.on('services-request-async', (event, payload) => {
			this.sendRequest(payload, event)
		})

		ipcMain.on('services-request-sync', (event, payload) => {
			this.sendRequest(payload, event, true)
		})

		ipcMain.on('services-response', (_, response) => {
			const req = this.serviceRequests[response.id]

			if (!req) return

			if (req.sync) {
				req.event.returnValue = response
			} else {
				req.event.reply('services-response-async', response)
			}

			delete this.serviceRequests[response.id]
		})

		ipcMain.on('services-promise-response', (_, payload) => {
			const windows = BrowserWindow.getAllWindows()
			windows.forEach(window => {
				if (window.id === server.id || window.isDestroyed()) return
				window.webContents.send('services-promise-response', payload)
			})
		})
	}
}
