import { type PayloadAction } from '@reduxjs/toolkit'
import { type State } from './state'

const reducers = {
	updateSelectedMenu: (state: State, action: PayloadAction<string>) => {
		state.selectedMenu = action.payload
	}
}

export default reducers
