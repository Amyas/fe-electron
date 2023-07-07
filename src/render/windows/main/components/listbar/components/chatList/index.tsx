import styles from './index.scss'

const ChatList = () => {
	return (
		<div className={styles.chat}>
			<div className={styles.chatList}>
				<div className={styles.chatItem}>
					<div className={styles.chatItemAvatar}>
						<img src='https://avatars.githubusercontent.com/u/47259054?v=4' alt='avatar' />
					</div>
					<div className={styles.chatItemContent}>
						<div className={styles.chatItemHeader}>
							<div className={styles.chatItemTitle}>title</div>
							<div className={styles.chatItemLastTime}>04:33</div>
						</div>
						<div className={styles.chatItemMessage}>
							<div className={styles.chatItemMessageContent}>
								asdasdasd阿斯顿拉开三等奖拉开三等奖拉开手机丢了卡上的阿斯顿撒打算打算的
							</div>
						</div>
					</div>
				</div>
				<div className={styles.chatItem}>
					<div className={styles.chatItemAvatar}>
						<img src='https://avatars.githubusercontent.com/u/47259054?v=4' alt='avatar' />
					</div>
					<div className={styles.chatItemContent}>
						<div className={styles.chatItemHeader}>
							<div className={styles.chatItemTitle}>title</div>
							<div className={styles.chatItemLastTime}>04:33</div>
						</div>
						<div className={styles.chatItemMessage}>
							<div className={styles.chatItemMessageContent}>
								asdasdasd阿斯顿拉开三等奖拉开三等奖拉开手机丢了卡上的阿斯顿撒打算打算的
							</div>
						</div>
					</div>
				</div>
				<div className={styles.chatItem}>
					<div className={styles.chatItemAvatar}>
						<img src='https://avatars.githubusercontent.com/u/47259054?v=4' alt='avatar' />
					</div>
					<div className={styles.chatItemContent}>
						<div className={styles.chatItemHeader}>
							<div className={styles.chatItemTitle}>title</div>
							<div className={styles.chatItemLastTime}>04:33</div>
						</div>
						<div className={styles.chatItemMessage}>
							<div className={styles.chatItemMessageContent}>
								asdasdasd阿斯顿拉开三等奖拉开三等奖拉开手机丢了卡上的阿斯顿撒打算打算的
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ChatList
