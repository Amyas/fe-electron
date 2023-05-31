import styles from './app.scss'
import TopicList from '@/components/topic-list'
import TopicWrapper from '@/components/topic-wrapper'
import listData from '@/mock-data/list.json'

const App = () => {
	return (
		<div className={styles.app}>
			<TopicList list={listData}></TopicList>
			<TopicWrapper></TopicWrapper>
		</div>
	)
}

export default App
