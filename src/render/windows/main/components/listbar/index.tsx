import { useAppSelector } from '@/store'
import styles from './index.scss'
import ChatList from './components/chatList'
import PeopleList from './components/peopleList'

const Listbar = () => {
	const selectedMenu = useAppSelector(state => state.mainWindow.selectedMenu)

	const listbarMap = {
		chat: <ChatList />,
		people: <PeopleList />
	}

	return <div className={styles.listbar}>{listbarMap[selectedMenu as keyof typeof listbarMap]}</div>
}

export default Listbar
