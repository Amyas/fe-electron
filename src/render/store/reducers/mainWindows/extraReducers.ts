import {
	type ActionReducerMapBuilder,
	createAsyncThunk,
	type PayloadAction
} from '@reduxjs/toolkit'
import electron from 'electron'
import { IUserInfo, State } from './state'

export const fetchLocalUserInfo = createAsyncThunk('main/fetchLocalUserInfo', async () => {
	const userInfo = await electron.ipcRenderer.invoke('get-user-info')
	return userInfo
})

function extraReducers(builder: ActionReducerMapBuilder<State>) {
	builder.addCase(
		fetchLocalUserInfo.fulfilled,
		(state: State, action: PayloadAction<IUserInfo>) => {
			state.userInfo = action.payload
		}
	)
}

export default extraReducers
