import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './index.scss'
import { useAppDispatch, useAppSelector } from '@/store'
import { useChatService } from '@/services/chat'
import { updateMessageList } from '@/store/reducers/mainWindows'
import { IUserInfo } from '@/store/reducers/mainWindows/state'
import classNames from 'classnames'

const Content = () => {
	const dispatch = useAppDispatch()
	const userInfo = useAppSelector(state => state.mainWindow.userInfo)
	const selectedFriend = useAppSelector(state => state.mainWindow.selectedFriend)
	const messages = useAppSelector(state => state.mainWindow.messages)
	const currentChatMesssages = useMemo(() => {
		return messages[selectedFriend?._id || ''] || []
	}, [messages])

	const contentScrollRef = useRef<HTMLDivElement>(null)

	const [message, setMessage] = useState('')

	const chatService = useChatService()

	useEffect(() => {
		if (!selectedFriend) return
		chatService.actions.getHistoryMessageList(selectedFriend!._id)
	}, [selectedFriend])

	useEffect(() => {
		if (contentScrollRef.current) {
			contentScrollRef.current.scrollTop = contentScrollRef.current.scrollHeight
		}
	}, [currentChatMesssages])

	const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			console.log('send message', message)
			dispatch(
				updateMessageList({
					_id: Date.now() + '',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					content: message,
					type: 0,
					friendId: selectedFriend as IUserInfo,
					userId: userInfo as IUserInfo
				})
			)
			chatService.actions.privateMessage(message, selectedFriend!._id)
			setMessage('')
		}
	}

	const renderEmpty = () => {
		return <div>请选择一个好友</div>
	}

	const renderContent = () => {
		if (!selectedFriend) return null
		return (
			<div className={styles.main}>
				<div className={styles.mainHeader}>{selectedFriend.nickname}</div>
				<div className={styles.mainContent}>
					<div ref={contentScrollRef} className={styles.mainContentScroll}>
						{currentChatMesssages.map(item => {
							return (
								<div
									className={classNames(styles.messageItem, {
										[styles.messageItemRight]: item.userId._id === userInfo?._id
									})}
									key={item._id}
								>
									<div className={styles.messageItemAvatar}>
										<img src={item.userId.avatar} />
									</div>
									<div className={styles.messageItemContent}>
										<div className={styles.messageItemContentName}>{item.userId.nickname}</div>
										<div className={styles.messageItemContentMessage}>{item.content}</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>
				<div className={styles.mainBottom}>
					<div className={styles.mainInput}>
						<textarea
							value={message}
							onChange={event => setMessage(event.target.value)}
							onKeyDown={handleKeyPress}
							spellCheck={false}
						/>
					</div>
				</div>
			</div>
		)
	}

	return <div className={styles.content}>{selectedFriend ? renderContent() : renderEmpty()}</div>
}

export default Content
