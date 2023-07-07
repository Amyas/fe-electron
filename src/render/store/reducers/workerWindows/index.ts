import { createSlice } from '@reduxjs/toolkit'
import initialState from './state'
import reducers from './reducers'

export const workerSlice = createSlice({
	name: 'main',
	initialState,
	reducers
})

export const { updateSelectedMenu } = workerSlice.actions

export default workerSlice.reducer
