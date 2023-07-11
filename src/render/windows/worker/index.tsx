import { IpcServer } from '@rpc/index'
import electron from 'electron'

const Worker = () => {
	IpcServer.instance.listen()
	electron.ipcRenderer.send('worker-ready', true)

	return null
}

export default Worker
