import styles from './index.scss'
import { useEffect, useState } from 'react'
import { useChatService } from '@/services/chat'
import { IpcClinet } from '@rpc/ipc'
import { IFriendNotice, IUserInfo } from '@/store/reducers/mainWindows/state'
import { Button, message } from 'antd'
import apis from '@/apis'

const Login = () => {
	IpcClinet.instance.listen()
	const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
	const [messageApi, contextHolder] = message.useMessage()

	const [list, setList] = useState<IFriendNotice[]>([])

	const chatService = useChatService()

	useEffect(() => {
		chatService.actions.getFriendNotice()
		chatService.friendNoticeUpdated.subscribe(data => {
			setList(data)
		})
	}, [])

	const handleAgree = async (item: IFriendNotice) => {
		try {
			await apis.friend.agree({
				applyId: item._id
			})
		} catch (error) {
			messageApi.open({
				type: 'warning',
				content: (error as Error).message
			})
		}
	}

	const renderNoticeBtn = (item: IFriendNotice, isMeActive: boolean) => {
		switch (item.status) {
			case 0:
				return isMeActive ? '等待验证' : <Button onClick={() => handleAgree(item)}>同意</Button>
			case 1:
				return '已同意'
			case 2:
				return '已拒绝'
		}
	}

	return (
		<>
			{contextHolder}
			<div className={styles.notice}>
				{list.map(item => {
					const isMeActive = item.userId._id === userInfo._id
					const user = isMeActive ? item.friendId : item.userId
					return (
						<div className={styles.noticeItem} key={item._id}>
							<div className={styles.noticeItemMain}>
								<div className={styles.noticeItemAvatar}>
									<img src={user.avatar} />
								</div>
								<div className={styles.noticeItemContent}>
									<div className={styles.noticeItemContentHeader}>
										<span className={styles.nickname}>{user.nickname}</span>
										{isMeActive ? '正在验证你的邀请' : '请求加为好友'}
										<span>{new Date(item.createdAt).toLocaleDateString()}</span>
									</div>
									<div className={styles.noticeItemContentMessage}>
										{!isMeActive && `留言：${item.applyMessage}`}
									</div>
								</div>
							</div>
							<div className={styles.noticeItemBtn}>{renderNoticeBtn(item, isMeActive)}</div>
						</div>
					)
				})}
			</div>
		</>
	)
}

export default Login
