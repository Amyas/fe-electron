import electron from 'electron'
import { io } from 'socket.io-client'

const Worker = () => {
	const socket = io('http://127.0.0.1:3000')
	socket.on('connect', () => {
		console.log('connected')
		electron.ipcRenderer.send('worker-ready', true)
	})

	return null
}

export default Worker
