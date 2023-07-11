import { createSlice } from '@reduxjs/toolkit'
import initialState from './state'
import reducers from './reducers'
import extraReducers from './extraReducers'

export const mainSlice = createSlice({
	name: 'main',
	initialState,
	reducers,
	extraReducers
})

export const {
	updateSelectedMenu,
	updateFriendList,
	updateSelectedFriend,
	updateHistoryMessageList,
	updateMessageList
} = mainSlice.actions

export default mainSlice.reducer
