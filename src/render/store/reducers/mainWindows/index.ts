import { createSlice } from '@reduxjs/toolkit'
import initialState from './state'
import reducers from './reducers'

export const mainSlice = createSlice({
	name: 'main',
	initialState,
	reducers
})

// extraReducers: builder => {
// 	// builder.addCase('main/extraReducers', (state, action) => {})
// }
// export const { increment, decrement, incrementByAmount } = mainSlice.actions
export const { updateSelectedMenu } = mainSlice.actions

export default mainSlice.reducer
