import ChatPNG from '@/assets/images/main/chat.png'
import PeoplePNG from '@/assets/images/main/people.png'
import SettingPNG from '@/assets/images/main/setting.png'

interface IMenus {
	[key: string]: {
		key: string
		name: string
		icon: string
	}
}

export interface IUserInfo {
	_id: string
	username: string
	nickname: string
	avatar: string
	intro: string
	email: string
	createdAt: string
	updatedAt: string
	token: string
	isFriend?: string
}

export interface IFriend {
	_id: string
	userId: string
	createdAt: string
	updatedAt: string
	friendId: IUserInfo
}

export interface IPrivateMessage {
	_id: string
	userId: IUserInfo
	friendId: IUserInfo
	type: number
	content: string
	createdAt: string
	updatedAt: string
}

export interface IFriendNotice {
	_id: string
	createdAt: string
	updatedAt: string
	userId: IUserInfo
	friendId: IUserInfo
	applyMessage: string
	status: number
}

export interface Imessages {
	[key: string]: IPrivateMessage[]
}

export interface State {
	menus: IMenus
	selectedMenu: keyof IMenus
	userInfo: IUserInfo | null
	friendList: IFriend[]
	selectedFriend: IUserInfo | null
	messages: Imessages
}

const initialState: State = {
	menus: {
		chat: {
			key: 'chat',
			name: '聊天',
			icon: ChatPNG
		},
		people: {
			key: 'people',
			name: '联系人',
			icon: PeoplePNG
		},
		setting: {
			key: 'setting',
			name: '设置',
			icon: SettingPNG
		}
	},
	selectedMenu: 'people',
	userInfo: null,
	friendList: [],
	selectedFriend: null,
	messages: {}
}

export default initialState
