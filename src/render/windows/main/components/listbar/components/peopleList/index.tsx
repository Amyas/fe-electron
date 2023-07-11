import { useAppDispatch, useAppSelector } from '@/store'
import styles from './index.scss'
import { IUserInfo } from '@/store/reducers/mainWindows/state'
import classNames from 'classnames'
import { updateSelectedFriend } from '@/store/reducers/mainWindows'

const PeopleList = () => {
	const dispatch = useAppDispatch()
	const friendList = useAppSelector(state => state.mainWindow.friendList)
	const selectedFriend = useAppSelector(state => state.mainWindow.selectedFriend)

	const handleClickFriend = (friend: IUserInfo) => {
		dispatch(updateSelectedFriend(friend))
	}

	const renderFriendList = () => {
		return friendList.map(friend => {
			return (
				<div
					className={classNames(styles.chatItem, {
						[styles.chatItemActive]: friend.friendId._id === selectedFriend?._id
					})}
					key={friend._id}
					onClick={() => handleClickFriend(friend.friendId)}
				>
					<div className={styles.chatItemAvatar}>
						<img src='https://avatars.githubusercontent.com/u/47259054?v=4' alt='avatar' />
					</div>
					<div className={styles.chatItemContent}>
						<div className={styles.chatItemHeader}>
							<div className={styles.chatItemTitle}>{friend.friendId.username}</div>
						</div>
						<div className={styles.chatItemMessage}>
							<div className={styles.chatItemMessageContent}>{friend.friendId.intro}</div>
						</div>
					</div>
				</div>
			)
		})
	}

	return (
		<div className={styles.chat}>
			<div className={styles.chatList}>{renderFriendList()}</div>
		</div>
	)
}

export default PeopleList
