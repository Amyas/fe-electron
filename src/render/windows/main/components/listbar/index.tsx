import { useAppSelector } from '@/store'
import styles from './index.scss'
import ChatList from './components/chatList'
import PeopleList from './components/peopleList'
import { Button } from 'antd'
import electron from 'electron'

const Listbar = () => {
	const selectedMenu = useAppSelector(state => state.mainWindow.selectedMenu)

	const listbarMap = {
		chat: <ChatList />,
		people: <PeopleList />
	}

	const handleShowSearchWindow = () => {
		electron.ipcRenderer.send('show-search-window')
	}

	const handleShowNoticehWindow = () => {
		electron.ipcRenderer.send('show-notice-window')
	}

	return (
		<div className={styles.listbar}>
			<div className={styles.search}>
				<Button onClick={handleShowSearchWindow}>添加好友/群</Button>
				<Button onClick={handleShowNoticehWindow}>好友通知</Button>
			</div>
			{listbarMap[selectedMenu as keyof typeof listbarMap]}
		</div>
	)
}

export default Listbar
