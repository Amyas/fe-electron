import {
	IFriend,
	IFriendNotice,
	IPrivateMessage,
	IUserInfo
} from '@/store/reducers/mainWindows/state'
import { Service } from '@rpc/index'
import { Subject } from 'rxjs'
import { io, Socket } from 'socket.io-client'

class ChatService extends Service {
	socket!: Socket
	userInfo!: IUserInfo
	friendList: IFriend[] = []
	friendListUpdated: Subject<IFriend[]> = new Subject()
	messageUpdated: Subject<IPrivateMessage> = new Subject()
	historyMessageUpdated: Subject<IPrivateMessage[]> = new Subject()
	saerchFriendOrGroupUpdated: Subject<IUserInfo[]> = new Subject()
	friendNoticeUpdated: Subject<IFriendNotice[]> = new Subject()
	initial(userInfo: IUserInfo) {
		this.userInfo = userInfo
		this.socket = io('http://127.0.0.1:3000', { autoConnect: false })
		this.socket.auth = { userId: userInfo._id }
		this.socket.connect()

		this.initialEvents()
	}

	initialEvents() {
		// 连接成功
		this.socket.on('connect', () => {
			console.log('connect')
		})

		// 获取用户列表
		this.socket.on('friend-list-receive', (data: IFriend[]) => {
			console.log('friend-list-receive', data)
			this.friendList = data
			this.friendListUpdated.next(data)
		})

		// 收到1对1消息
		this.socket.on('private-message-receive', (data: IPrivateMessage) => {
			console.log('private-message-receive', data)
			this.messageUpdated.next(data)
		})

		// 收到历史消息
		this.socket.on('history-message-receive', (data: IPrivateMessage[]) => {
			console.log('history-message-receive', data)
			this.historyMessageUpdated.next(data)
		})

		// 搜索好友或群
		this.socket.on('search-friend-or-group-receive', (data: IUserInfo[]) => {
			console.log('search-friend-or-group-receive', data)
			this.saerchFriendOrGroupUpdated.next(data)
		})

		// 收到好友通知
		this.socket.on('friend-notice-receive', (data: IFriendNotice[]) => {
			console.log('friend-notice-receive', data)
			this.friendNoticeUpdated.next(data)
		})
	}

	// 获取好友列表
	getFriendList() {
		this.socket.emit('get-friend-list')
	}

	// 获取历史消息
	getHistoryMessageList(friendUserId: string) {
		this.socket.emit('get-history-message', friendUserId)
	}

	// 1对1消息
	privateMessage(message: string, to: string) {
		this.socket.emit('private-message', {
			type: 0,
			from: this.userInfo._id,
			to,
			content: message
		})
	}

	// 搜索好友或群
	searchFriendOrGroup(keyword: string) {
		this.socket.emit('search-friend-or-group', keyword)
	}

	// 获取好友通知
	getFriendNotice() {
		this.socket.emit('get-friend-notice')
	}
}

export const useChatService = (): ChatService => {
	return ChatService.instance as ChatService
}

export default ChatService
