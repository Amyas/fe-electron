import path from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import baseConfig from './webpack.base'
// eslint-disable-next-line import/default
import CopyPlugin from 'copy-webpack-plugin'

const prodConfig: Configuration = merge(baseConfig, {
	mode: 'production',
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					// 提取node_modules代码
					test: /node_modules/, // 只匹配node_modules里面的模块
					name: 'vendors', // 提取文件命名为vendors,js后缀和chunkhash会自动加
					minChunks: 1, // 只要使用一次就提取出来
					chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
					minSize: 0, // 提取代码体积大于0就提取出来
					priority: 1 // 提取优先级为1
				},
				commons: {
					// 提取页面公共代码
					name: 'commons', // 提取文件命名为commons
					minChunks: 2, // 只要使用两次就提取出来
					chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
					minSize: 0 // 提取代码体积大于0就提取出来
				}
			}
		},
		runtimeChunk: {
			name: 'mainifels'
		},
		minimize: true
	},
	performance: {
		hints: false,
		maxAssetSize: 4000000, // 整数类型（以字节为单位）
		maxEntrypointSize: 5000000 // 整数类型（以字节为单位）
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: path.join(__dirname, '../public'),
					to: path.join(__dirname, '../dist'),
					filter: source => !source.includes('index.html')
				}
			]
		}),
		new MiniCssExtractPlugin({
			filename: 'static/css/[name].[contenthash:8].css'
		})
	]
})

export default prodConfig
