import { type PayloadAction } from '@reduxjs/toolkit'
import { type IFriend, IUserInfo, type State, IPrivateMessage } from './state'

const reducers = {
	updateSelectedMenu: (state: State, action: PayloadAction<string>) => {
		state.selectedMenu = action.payload
	},
	updateFriendList: (state: State, action: PayloadAction<IFriend[]>) => {
		state.friendList = action.payload
	},
	updateSelectedFriend: (state: State, action: PayloadAction<IUserInfo>) => {
		state.selectedFriend = action.payload
	},
	updateHistoryMessageList(state: State, action: PayloadAction<IPrivateMessage[]>) {
		const userMessages = state.messages[state.selectedFriend!._id] || []
		state.messages[state.selectedFriend!._id] = [...userMessages, ...action.payload]
	},
	updateMessageList(state: State, action: PayloadAction<IPrivateMessage>) {
		const userMessages = state.messages[state.selectedFriend!._id] || []
		console.log(action.payload)
		state.messages[state.selectedFriend!._id] = [...userMessages, action.payload]
	}
}

export default reducers
