const path = require('path');
const webpack = require('webpack');
const jsPath = `[name].js`;
const fileLoaderName = '[name].[ext]';

module.exports = {
    entry: './test/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: jsPath,
    },
    module: {
        rules: [
            // Babel
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|build)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'es2015', 'react'],
                        plugins: [
                            require('babel-plugin-transform-object-rest-spread'),
                            require('babel-plugin-transform-react-jsx')
                        ]
                    }
                }
            }
        ]
    }
};
