import { configureStore } from '@reduxjs/toolkit'
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import mainWindow from './reducers/mainWindows'

const store = configureStore({
	reducer: {
		mainWindow
	}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
