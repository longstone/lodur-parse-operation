/**
 * Created by lag on 06.02.2017.
 */
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeExternals = require('webpack-node-externals');

module.exports ={
    target: 'node',
    externals: [nodeExternals()],
    devtool: "cheap-module-source-map", // faster than 'source-map'
    output: {
        // sourcemap support for IntelliJ/Webstorm
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader"
            }
        ]
    },
    mode: 'development',
};
