import { RenderApiClient } from '../core/render-api-client'
import { Service } from '../core/service'

export class IpcClinet extends Service {
	renderApiClient!: RenderApiClient

	listen() {
		this.renderApiClient = new RenderApiClient()
		Service.setupProxy(service => this.renderApiClient.applyIpcProxy(service))
	}
}
