import styles from './app.scss'
import Login from './windows/login'
import Main from './windows/main'
import Worker from './windows/worker'
import Search from './windows/search'
import Notice from './windows/notice'

interface Props {
	windowId: string
}

const App: React.FC<Props> = props => {
	return (
		<div className={styles.app}>
			{props.windowId === 'main' && <Main />}
			{props.windowId === 'worker' && <Worker />}
			{props.windowId === 'login' && <Login />}
			{props.windowId === 'search' && <Search />}
			{props.windowId === 'notice' && <Notice />}
		</div>
	)
}

export default App
