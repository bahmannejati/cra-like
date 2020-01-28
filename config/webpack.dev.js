const path = require("path")
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const threadLoader = require('thread-loader');
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")



module.exports = {
    mode: "development",
    devtool: "source-map",
    entry: [
        require.resolve('../src/hot-entry.js'),
        require.resolve('webpack-dev-server/client') + '?/',
        require.resolve('webpack/hot/dev-server'),

        path.resolve(__dirname, '../src/index.js'),

        // ["react", "react-dom", "antd", "moment"],
        // ["lodash", "@ant-design/icons/lib"],
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: ['node_modules', 'src/'],
        alias: {
            'aqios': 'axios',
            // 'lodash': 'lodash',
        }
    },
    output: {
        path: path.resolve(__dirname, '../dev'),
        filename: 'static/js/[name].[hash:8].js',

        // publicPath is used for url of the chunks, also used when a
        // loader inject url of file into html or css
        publicPath: '/',
    },


    // tells webpack don't bundle lodash library
    // useful when you used <script src="https://raw.githubusercontent.com/lodash/lodash/4.17.15-npm/core.js"></script>
    // afterward whenever you use `import ___ from "lodash"`
    // webpack will import global _ as ___

    // externals: {
    //     _: 'lodash',
    // },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
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
                        test: /\.ts(x?)$/,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: 'ts-loader',
                            }
                        ]
                    },
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        include: path.resolve(__dirname, '../src'),
                        use: [
                            path.resolve('./babel-loaders/fast-refresh-loader/index.js'),
                            // require.resolve("cache-loader"),
                            // require.resolve("thread-loader"),
                            {
                                loader: "babel-loader",
                                options: {
                                    cacheDirectory: true,
                                    cacheCompression: false,
                                    plugins: [
                                        require.resolve('react-refresh/babel'),
                                        require.resolve('@babel/plugin-transform-modules-commonjs'),
                                    ]
                                }
                            }
                        ],
                    },
                    {
                        test: /\.css$/,
                        exclude: /node_modules/,
                        include: path.resolve(__dirname, '../src'),
                        use: [
                            path.resolve('./babel-loaders/fast-refresh-loader/index.js'),
                            {
                                loader: require.resolve("style-loader"),

                                // this doesn't work with hot refresh!
                                // loader: MiniCssExtractPlugin.loader,
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
            filename: 'static/css/[name].[hash:8].css',
            chunkFilename: 'static/css/[name].[hash:8].chunk.css',
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
        }),
        new ForkTsCheckerWebpackPlugin({
            async: true,// true if is development
            useTypescriptIncrementalApi: true,
            checkSyntacticErrors: true,
            silent: true,
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: true
        },
        runtimeChunk: {
            name: entrypoint => `runtime-${entrypoint.name}`,
        },
    },
}