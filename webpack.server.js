const path = require('path')
const webpackNodeExternals = require('webpack-node-externals');
module.exports = {
    resolve: {
        extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx']
    },
    target: 'node',
    // entry: path.resolve(__dirname, 'app.js'),
    entry: './app.js',
    output: {
        filename: 'server-bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    externals: [webpackNodeExternals()],
    module: {
        exprContextCritical: false,
        rules: [
            {
                test: /\.jsx|js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                'react',
                                'stage-0',
                                ['env', {
                                        targets: {
                                            browsers: [
                                                'last 2 versions'
                                            ]
                                        }
                                    }
                                ]
                            ]
                        }

                    }

                ]
            },
            {
                test: /\.css$/,
                use: [
                    {   loader: 'style-loader'  },
                    {   loader: 'css-loader'    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "less-loader" // compiles Less to CSS
                    }
                ]
            }
        ]
    }
}