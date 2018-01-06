const webpack = require('webpack');
const path = require('path');
const libraryName = 'app';
const outputFile = libraryName + '.js';

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
	entry: __dirname + '/src/app.scss',
	devtool: 'source-map',
	output: {
		path: __dirname + '/build',
		filename: outputFile,
		library: libraryName,
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	node: {
	  fs: 'empty',
		tls: 'empty',
		net: 'empty'
	},
	module: {
		loaders: [
			{
				test: /(\.jsx|\.js)$/,
				loader: 'babel-loader',
				exclude: /(node_modules|bower_components)/
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract(
					'css-loader!sass-loader!postcss-loader'
				)
			},
			{
			  test: /\.(png|jpg|gif)$/,
			  loader: 'url-loader'
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				loader: 'file-loader?name=public/fonts/[name].[ext]'
			}
		]
	},
	resolve: {
		modules: [__dirname, 'node_modules'],
		extensions: ['*', '.js', '.css', '.jsx']
	},
	plugins: [new ExtractTextPlugin({ filename: 'style.css', allChunks: true })]
};

module.exports = config;
