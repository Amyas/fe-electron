import styles from './index.scss'
import Sidebar from './components/sidebar'
import Listbar from './components/listbar'
import Content from './components/content'
import { IpcClinet } from '@rpc/index'
import { useChatService } from '@/services/chat'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import {
	updateFriendList,
	updateHistoryMessageList,
	updateMessageList
} from '@/store/reducers/mainWindows'
import { IPrivateMessage, type IFriend } from '@/store/reducers/mainWindows/state'
import { fetchLocalUserInfo } from '@/store/reducers/mainWindows/extraReducers'

const Main = () => {
	console.log(Date.now())
	const userInfo = useAppSelector(state => state.mainWindow.userInfo)
	const dispatch = useAppDispatch()

	IpcClinet.instance.listen()

	const chatService = useChatService()

	useEffect(() => {
		dispatch(fetchLocalUserInfo())
	}, [])

	useEffect(() => {
		if (!userInfo) return
		console.log('@@@userInfo:', userInfo)
		chatService.initial(userInfo)

		// 好友列表更新
		chatService.friendListUpdated.subscribe((data: IFriend[]) => {
			console.log('friendListUpdated', data)
			dispatch(updateFriendList(data))
		})

		// 收到1对1历史消息列表
		chatService.historyMessageUpdated.subscribe((data: IPrivateMessage[]) => {
			console.log('historyMessageUpdated', data)
			dispatch(updateHistoryMessageList(data))
		})

		// 收到1对1消息
		chatService.messageUpdated.subscribe((data: IPrivateMessage) => {
			console.log('messageUpdated', data)
			dispatch(updateMessageList(data))
		})

		// 获取好友列表
		chatService.actions.getFriendList()
	}, [userInfo])

	return (
		<div className={styles.main}>
			<Sidebar />
			<Listbar />
			<Content />
		</div>
	)
}

export default Main
