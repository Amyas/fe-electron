import { Service } from './service'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TServices = { [key: string]: any }

export class ServiceManager extends Service {
	services: TServices = {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	register(Services: TServices) {
		Object.keys(Services).forEach(key => {
			this.registerSerivce(Services[key])
		})
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private registerSerivce(Service: any) {
		this.services[Service.constructor.name] = Service
	}

	getService(serviceName: string): Service {
		const services = this.services
		const _serviceName =
			Object.keys(services).find(v => services[v].constructor.name === serviceName) || ''
		return services[_serviceName]
	}
}
