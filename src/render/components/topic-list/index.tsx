import { Collapse } from 'antd'
import styles from './index.scss'

const { Panel } = Collapse

type TTopicList = {
	result: {
		[key: string]: {
			[key: string]: {
				title: string
				id: number
				author: string
				body: string
				label: string
				issuesId: number
				time: number
				releaseTime: string
				comment_count: number | null
				timeStr: string
			}
		}
	}
	times: {
		[key: string]: {
			time: number
			timeStr: string
		}
	}
}

type TTopicListProps = {
	list: TTopicList
}

const TopicList = (props: TTopicListProps) => {
	const { times, result } = props.list

	const renderPanels = () => {
		return Object.entries(times).map(([timeKey, timeValue]) => {
			return (
				<Panel header={timeValue.timeStr} key={timeKey}>
					{renderItemPanels(timeKey)}
				</Panel>
			)
		})
	}

	const renderItemPanels = (timeKey: string) => {
		return Object.entries(result[timeKey]).map(([itemKey, itemValue]) => {
			return (
				<Panel header={itemKey} key={itemKey}>
					{itemValue.title}
				</Panel>
			)
		})
	}

	return (
		<div className={styles.topicList}>
			<Collapse>{renderPanels()}</Collapse>
		</div>
	)
}

export default TopicList
