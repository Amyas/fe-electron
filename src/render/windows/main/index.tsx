import styles from './index.scss'
import Sidebar from './components/sidebar'
import Listbar from './components/listbar'
import Content from './components/content'

const Main = () => {
	return (
		<div className={styles.main}>
			<Sidebar />
			<Listbar />
			<Content />
		</div>
	)
}

export default Main
