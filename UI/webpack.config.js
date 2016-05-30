var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ENV = process.env.ENV = 'development';
var HOST = process.env.HOST || 'localhost';
var PORT = process.env.PORT || 8080;

var metadata = {
    host: HOST,
    port: PORT,
    ENV: ENV
};

/*
 * config
 */
module.exports = {
    // static data for index.html
    metadata: metadata,

    // Emit SourceMap to enhance debugging
    devtool: 'source-map',

    devServer: {
        // This is required for webpack-dev-server. The path should
        // be an absolute path to your build destination.
        outputPath: path.join(__dirname, 'dist')
    },

    // Switch loaders to debug mode
    debug: true,

    // Our angular app
    entry: {
        'polyfills': path.resolve(__dirname, "src/polyfills.ts"),
        'app': path.resolve(__dirname, "src/main.ts")
    },

    // Config for our build file
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].bundle.js',
        sourcemapFilename: '[name].map'
    },

    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.ts', '.tsx', '.js']
    },

    module: {
        loaders: [
            // Support for .ts files
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                include: [ path.resolve(__dirname, "./src") ]
            },
            // Support for .html as raw text
            {
                test: /\.html$/,
                loader: 'raw-loader',
                exclude: [ path.resolve(__dirname, "src/index.html") ]
            }
        ]
    },

    plugins: [
        // Copy static assets to the build folder
        new CopyWebpackPlugin([{ from: 'src/assets', to: 'assets' }]),
        // Generate the index.html
        new HtmlWebpackPlugin({ template: 'src/index.html' })
    ]
};