import { useAppSelector } from '@/store'
import styles from './index.scss'

const Listbar = () => {
	const selectedMenu = useAppSelector(state => state.mainWindow.selectedMenu)

	return <div className={styles.listbar}>{selectedMenu}</div>
}

export default Listbar
