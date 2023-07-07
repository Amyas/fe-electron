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

export interface State {
	menus: IMenus
	selectedMenu: keyof IMenus
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
	selectedMenu: 'chat'
}

export default initialState
