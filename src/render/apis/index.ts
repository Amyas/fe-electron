import serve from './serve'

export default {
	login: (data: unknown) => serve.post('/login', data),
	friend: {
		list: () => serve.get('/friend/list'),
		add: (data: unknown) => serve.post('/friend/add', data),
		agree: (data: unknown) => serve.post('/friend/agree', data)
	}
}
