import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store'
import App from './App'
import './index.scss'
import { loadServices } from './services'

loadServices()

const root = document.querySelector('#root')

function getWindowId(): string {
	const windowId = new URL(window.location.href).searchParams.get('windowId')
	return windowId || 'main'
}

if (root) {
	createRoot(root).render(
		<Provider store={store}>
			<App windowId={getWindowId()} />
		</Provider>
	)
}
