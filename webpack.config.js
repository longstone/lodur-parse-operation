/**
 * Created by lag on 06.02.2017.
 */
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    name: 'server',
    target: 'node',
    entry: './src/app.js',
    output: {
        libraryTarget: 'commonjs',
        path: path.resolve(__dirname, 'bin'),
        filename: 'app.bundle.js',
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    },
    externals: nodeModules,
    resolve: {
        modules: [path.join(__dirname, "node_modules")],
        descriptionFiles: ['package.json']
    },
    devtool: 'source-map',
    module: {
        rules: [
            {   test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            }

        ]
    },
    mode: 'production',
    plugins: [
        new webpack.IgnorePlugin(/vertx/)
    ]
   
};