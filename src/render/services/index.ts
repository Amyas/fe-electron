import { ServiceManager } from '@rpc/index'
import ChatService from './chat'

function createServices() {
	return {
		ChatService: ChatService.instance as ChatService
	}
}

export function loadServices() {
	ServiceManager.instance.register(createServices())
}
