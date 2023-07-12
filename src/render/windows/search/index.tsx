import apis from '@/apis'
import styles from './index.scss'
import { Input, Button, message } from 'antd'
import { useEffect, useState } from 'react'
import { useChatService } from '@/services/chat'
import { IpcClinet } from '@rpc/ipc'
import { IUserInfo } from '@/store/reducers/mainWindows/state'
import { useAppSelector } from '@/store'

const Login = () => {
	IpcClinet.instance.listen()
	const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

	const [value, setValue] = useState('')
	const [loading, setLoading] = useState(false)
	const [list, setList] = useState<IUserInfo[]>([])

	const [messageApi, contextHolder] = message.useMessage()

	const chatService = useChatService()

	useEffect(() => {
		chatService.saerchFriendOrGroupUpdated.subscribe(data => {
			setList(data)
			setLoading(false)
		})
	}, [])

	const handleSubmit = async () => {
		setLoading(true)
		chatService.actions.searchFriendOrGroup(value)
	}

	const handleAddUser = async (item: IUserInfo) => {
		try {
			await apis.friend.add({
				friendId: item._id,
				applyMessage: `你好，我是${userInfo.nickname}，请求添加你为好友。`
			})
			messageApi.open({
				type: 'success',
				content: '申请成功'
			})
		} catch (error) {
			messageApi.open({
				type: 'warning',
				content: (error as Error).message
			})
		}
	}

	return (
		<>
			{contextHolder}
			<div className={styles.login}>
				<div className={styles.header}>
					<Input value={value} onChange={e => setValue(e.target.value)} placeholder='账号/群号' />
					<Button loading={loading} style={{ width: '80px' }} type='primary' onClick={handleSubmit}>
						搜索
					</Button>
				</div>
				<div>
					{list.map(item => (
						<div className={styles.item} key={item._id}>
							<div className={styles.itemMain}>
								<div className={styles.itemAvatar}>
									<img src={item.avatar} />
								</div>
								<div className={styles.itemContent}>
									<div className={styles.itemContentNickname}>{item.nickname}</div>
									<div className={styles.itemContentUsername}>{item.username}</div>
								</div>
							</div>
							<div>
								{item.isFriend ? (
									'已添加'
								) : (
									<Button onClick={() => handleAddUser(item)}>添加</Button>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	)
}

export default Login
