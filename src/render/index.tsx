import { createRoot } from 'react-dom/client'
import App from './App'
import './index.scss'

const root = document.querySelector('#root')

if (root) {
	createRoot(root).render(<App />)
}