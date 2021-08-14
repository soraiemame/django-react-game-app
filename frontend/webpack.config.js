const path = require("path");
const webpack = require("webpack");

module.exports = {
    // entry: "./frontend/src/index.js",
    exntry: "./src/index.js",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-react', '@babel/preset-env'],
                    plugins: ['@babel/plugin-transform-runtime'],
                }
            },
            {
                test: /\.css$/,
                exclude: /(node_modules|bower_components)/,
                use: ['style-loader','css-loader']
            }
        ]
    },
    optimization: {
        minimize: true,
    },
    output: {
        // path: __dirname + "/frontend/static/frontend",
        path: __dirname + "/static/frontend",
        filename: "main.js"
    },
};