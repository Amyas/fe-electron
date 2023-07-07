import serve from './serve'

export default {
	login: (data: unknown) => serve.post('/login', data)
}
