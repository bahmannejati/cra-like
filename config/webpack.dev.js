const path = require("path")
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');



module.exports = {
    mode: "development",
    entry: {
        main: path.resolve(__dirname, '../src/index.js'),
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
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
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, '../src'),
                loader: 'eslint-loader',
                options: {
                    cache: true,
                }
            },
            {
                oneOf: [
                    {
                        test: /\.(bmp|gif|png|jpe?g)$/,
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: 'static/media/url-loader/[name].[hash:8].[ext]',
                        }
                    },
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        include: path.resolve(__dirname, '../src'),
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            cacheCompression: false,
                        }
                    },
                    {
                        test: /\.css$/,
                        exclude: /node_modules/,
                        include: path.resolve(__dirname, '../src'),
                        use: [
                            {
                                // loader: require.resolve("style-loader"),
                                loader: MiniCssExtractPlugin.loader,
                            },
                            {
                                loader: require.resolve("css-loader"),
                            },
                            {
                                loader: require.resolve("postcss-loader"),
                                options: {
                                    plugins: () => [
                                        require('postcss-flexbugs-fixes'),
                                        require('postcss-preset-env'),
                                    ]
                                }
                            },
                        ],
                    },
                    {
                        exclude: /\.(js|mjs|jsx|ts|tsx|html|json)$/,
                        loader: require.resolve('file-loader'),
                        options: {
                            name: 'static/media/file-loader/[name].[hash:8].[ext]',
                        },
                    },
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // filename: '[name].css',
            // chunkFilename: '[id].css',
        }),
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