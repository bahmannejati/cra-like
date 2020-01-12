const path = require("path")
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');



module.exports = {
    mode: "development",
    entry: {
        main: path.resolve(__dirname, '../src/index.js'),
    },
    resolve: {
        modules: ['node_modules', 'src/'],
        alias: {
            'aqios': 'axios',
            // 'lodash': 'lodash',
        }
    },
    output: {
        path: path.resolve(__dirname, '../dev'),
        filename: 'bundle.js',

        // publicPath is used for url of the chunks, also used when a
        // loader inject url of file into html or css
        publicPath: '/',
    },
    // externals: {
    //     _: 'lodash',
    // },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(__dirname, '../public/index.html')
        }),
        new InterpolateHtmlPlugin({
            PUBLIC_URL: '',
        }),
        new webpack.ProvidePlugin({
            '_': 'lodash'
        }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify({
                test: 'google',
                mode: 'development',
            }),
        })
    ]
}