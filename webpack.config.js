const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeJsPlugin = require('optimize-js-plugin');

var env = process.env.NODE_ENV || 'development';
var plugins = [
    new HtmlWebpackPlugin({
        template: 'client/index.html',
        filename: 'index.html',
        inject: 'body',
    })
];

console.log('NODE_ENV:', env);

if (env === 'production') {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin(),
        new OptimizeJsPlugin({
            sourceMap: false
        })
    );
}

module.exports = {
    entry: [//'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:8080',
        //'webpack/hot/only-dev-server',
        './client/index.js'],
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js'        
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
                // options: {
                //     presets: ['es2015']
                // }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            module: true
                        }
                    }
                ]
            }
        ]        
    },
    plugins: plugins
};

