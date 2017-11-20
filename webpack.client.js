const path = require('path')

module.exports = {
    // entry: path.resolve(__dirname, 'app.js'),
    resolve: {
        extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx']
    },
    entry: './src/client/client.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
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