import apis from '@/apis'
import styles from './index.scss'
import { Form, Input, Button } from 'antd'
import { useState } from 'react'
import electron from 'electron'

const Login = () => {
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		form
			.validateFields()
			.then(async formData => {
				setLoading(true)
				try {
					const data = await apis.login(formData)
					electron.ipcRenderer.send('login-ready', data)
				} catch (error) {
					await electron.ipcRenderer.invoke('show-message-box', {
						type: 'error',
						title: '登录失败',
						message: (error as Error).message
					})
				} finally {
					setLoading(false)
				}
			})
			.catch(() => ({}))
	}

	return (
		<div className={styles.login}>
			<div className={styles.title}>岛语</div>
			<Form
				form={form}
				layout={'vertical'}
				disabled={loading}
				labelCol={{ span: 4 }}
				wrapperCol={{ span: 14 }}
			>
				<Form.Item label='账号' name='username' rules={[{ required: true, message: '请输入账号' }]}>
					<Input />
				</Form.Item>
				<Form.Item label='密码' name='password' rules={[{ required: true, message: '请输入密码' }]}>
					<Input.Password />
				</Form.Item>
				<Form.Item>
					<Button loading={loading} style={{ width: '100%' }} type='primary' onClick={handleSubmit}>
						登录
					</Button>
				</Form.Item>
			</Form>
		</div>
	)
}

export default Login
