import path from 'path'
import { Configuration, DefinePlugin } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackBar from 'webpackbar'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as dotenv from 'dotenv'

const isDev = process.env.NODE_ENV === 'development'

const envConfig = dotenv.config({
	path: path.join(__dirname, '../env/.env.' + process.env.BASE_ENV)
})

const baseConfig: Configuration = {
	entry: path.join(__dirname, '../src/render/index.tsx'),
	output: {
		filename: 'static/js/[name].[chunkhash:8].js',
		path: path.join(__dirname, '../dist'),
		clean: true,
		publicPath: '/',
		assetModuleFilename: 'images/[hash][ext][query]'
	},
	cache: {
		type: 'filesystem'
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/i,
				exclude: /node_modules/,
				use: ['thread-loader', 'babel-loader']
			},
			{
				test: /\.scss$/i,
				use: [
					isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							modules: true
						}
					},
					'postcss-loader',
					'sass-loader'
				]
			},
			{
				test: /\.(png|jpe?g|gif|svf)$/i,
				type: 'asset',
				parser: {
					dataUrlCondition: {
						maxSize: 9 * 1024 // 小于10kb的图片转成base64
					}
				},
				generator: {
					filename: 'static/images/[name].[contenthash:8][ext][query]'
				}
			},
			{
				test: /.(woff2?|eot|ttf|otf)$/i, // 匹配字体图标文件
				type: 'asset', // type选择asset
				parser: {
					dataUrlCondition: {
						maxSize: 10 * 1024 // 小于10kb转base64
					}
				},
				generator: {
					filename: 'static/fonts/[name].[contenthash:8][ext][query]' // 文件输出目录和命名
				}
			},
			{
				test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/i, // 匹配媒体文件
				type: 'asset', // type选择asset
				parser: {
					dataUrlCondition: {
						maxSize: 10 * 1024 // 小于10kb转base64
					}
				},
				generator: {
					filename: 'static/media/[name].[contenthash:8][ext][query]' // 文件输出目录和命名
				}
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.jsx'],
		alias: {
			'@': path.join(__dirname, '../src/render'),
			'@main': path.join(__dirname, '../src/main')
		}
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'webpack-react-ts',
			filename: 'index.html',
			template: path.join(__dirname, '../public/index.html'),
			inject: true,
			hash: true,
			cache: false,
			minify: {
				removeAttributeQuotes: true,
				collapseWhitespace: true,
				removeComments: true,
				minifyJS: true,
				minifyCSS: true
			}
		}),
		new DefinePlugin({
			'process.env': JSON.stringify(envConfig.parsed)
		}),
		new WebpackBar()
	]
}

export default baseConfig
