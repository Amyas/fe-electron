import { IpcServer } from '@rpc/index'
import electron from 'electron'

const Worker = () => {
	console.log(Date.now())
	IpcServer.instance.listen()
	electron.ipcRenderer.send('worker-ready', true)

	return null
}

export default Worker
