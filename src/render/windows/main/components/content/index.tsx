import styles from './index.scss'
import { useAppSelector } from '@/store'

const Content = () => {
	const selectedMenu = useAppSelector(state => state.mainWindow.selectedMenu)
	return <div className={styles.content}>{selectedMenu}</div>
}

export default Content
