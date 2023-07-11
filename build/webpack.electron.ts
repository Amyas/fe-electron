import path from 'path'
import { Configuration } from 'webpack'
const electronConfig: Configuration = {
	target: 'electron-main',
	entry: path.join(__dirname, '../src/main/index.ts'),
	output: {
		path: path.join(__dirname, '../dist'),
		filename: '[name].js',
		clean: true,
		library: {
			type: 'umd'
		}
	},
	resolve: {
		extensions: ['.ts'],
		alias: {
			'@main': path.join(__dirname, '../src/main'),
			'@rpc': path.join(__dirname, '../src/rpc')
		}
	}
}

export default electronConfig
