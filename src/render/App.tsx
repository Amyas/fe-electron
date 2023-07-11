import styles from './app.scss'
import Login from './windows/login'
import Main from './windows/main'
import Worker from './windows/worker'

interface Props {
	windowId: string
}

const App: React.FC<Props> = props => {
	return (
		<div className={styles.app}>
			{props.windowId === 'main' && <Main />}
			{props.windowId === 'worker' && <Worker />}
			{props.windowId === 'login' && <Login />}
		</div>
	)
}

export default App
