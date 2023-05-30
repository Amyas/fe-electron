import './App.scss'
import Kb10Img from '@/assets/images/10kb_img.jpeg'
import test from './test.json'
console.log(test.wangjianpeng)

// const testa = 1

function hello(name: string) {
	return `hello ${name}`
}

hello('123')

const App = () => {
	return (
		<div>
			<h2 className='test'>hello 12341world</h2>
			{test.wangjianpeng.obj}
			<div>process.env: {JSON.stringify(process.env)}</div>
			<img src={Kb10Img} alt='' />
			<img src={require('@/assets/images/8kb_img.png')} alt='' />
		</div>
	)
}

export default App
