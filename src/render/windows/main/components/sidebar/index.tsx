import classnames from 'classnames'
import { useAppDispatch, useAppSelector } from '@/store'
import styles from './index.scss'
import { updateSelectedMenu } from '@/store/reducers/mainWindows'

const Sidebar = () => {
	const dispatch = useAppDispatch()
	const menus = useAppSelector(state => state.mainWindow.menus)
	const selectedMenu = useAppSelector(state => state.mainWindow.selectedMenu)

	const renderMenu = () => {
		return Object.values(menus).map(value => {
			return (
				<div
					className={classnames(styles.menuItem, {
						[styles.selected]: value.key === selectedMenu
					})}
					key={value.name}
					onClick={() => dispatch(updateSelectedMenu(value.key))}
				>
					<img src={value.icon} alt={value.name} />
				</div>
			)
		})
	}

	return (
		<div className={styles.sidebar}>
			<div className={styles.avatar}></div>
			<div className={styles.menu}>{renderMenu()}</div>
		</div>
	)
}

export default Sidebar
