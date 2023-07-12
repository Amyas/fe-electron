import axios from 'axios'

const serve = axios.create({
	baseURL: 'http://127.0.0.1:3000/api',
	timeout: 5000
})

// 添加请求拦截器
serve.interceptors.request.use(
	config => {
		const userInfo = localStorage.getItem('userInfo')
		if (userInfo) {
			config.headers.Authorazition = JSON.parse(userInfo).token
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

serve.interceptors.response.use(
	response => {
		if (response.data.code !== 0) {
			return Promise.reject(response.data)
		}
		return response.data.data
	},
	error => {
		return Promise.reject(error)
	}
)

export default serve
