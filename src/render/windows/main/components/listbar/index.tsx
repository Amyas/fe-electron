import { useAppSelector } from '@/store'
import styles from './index.scss'
import ChatList from './components/chatList'
import PeopleList from './components/peopleList'
import { Button } from 'antd'

const Listbar = () => {
	const selectedMenu = useAppSelector(state => state.mainWindow.selectedMenu)

	const listbarMap = {
		chat: <ChatList />,
		people: <PeopleList />
	}

	return (
		<div className={styles.listbar}>
			<div className={styles.search}>
				<Button>添加好友/群</Button>
				<Button>创建群</Button>
			</div>
			{listbarMap[selectedMenu as keyof typeof listbarMap]}
		</div>
	)
}

export default Listbar
