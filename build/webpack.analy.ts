import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import prodConfig from './webpack.prod'

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin') // 引入webpack打包速度分析插件
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const smp = new SpeedMeasurePlugin() // 实例化分析插件

const analyConfig: Configuration = smp.wrap(
	merge(prodConfig, {
		plugins: [new BundleAnalyzerPlugin()]
	})
)

export default analyConfig
