import Store from 'electron-store'
console.log(new Store().get('userInfo'))
interface IUserInfo {
	_id: string
	username: string
	nickname: string
	avatar: string
	intro: string
	email: string
	createAt: string
	updateAt: string
	token: string
}

export interface State {
	userInfo: IUserInfo
}

const initialState: State = {
	userInfo: new Store().get('userInfo') as IUserInfo
}

export default initialState
