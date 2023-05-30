import path from 'path'
import { merge } from 'webpack-merge'
import webpack, { Configuration as WebpackConfiguration } from 'webpack'
import WebpackDevServer, {
	Configuration as WebpackDevServerConfiguration
} from 'webpack-dev-server'
import baseConfig from './webpack.base'

interface Configuration extends WebpackConfiguration {
	devServer?: WebpackDevServerConfiguration
}

const openBrowser = require('./utils/openBrowser')

const host = '127.0.0.1'
const port = '8082'

const devConfig: Configuration = merge(baseConfig, {
	mode: 'development',
	devtool: 'eval-cheap-module-source-map'
})

const devServer = new WebpackDevServer(
	{
		host,
		port,
		open: false,
		compress: false,
		hot: true,
		historyApiFallback: true,
		setupExitSignals: true,
		static: {
			directory: path.join(__dirname, '../public')
		},
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	},
	webpack(devConfig)
)

devServer.start().then(() => {
	openBrowser(`http://${host}:${port}`)
})

export default devConfig
