"use strict";
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');

// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// These files will be imported in every sass file
// const sassResourcesPaths = [
//   path.resolve(__dirname, 'styles/abstracts/_variables.sass'),
//   path.resolve(__dirname, 'styles/abstracts/_mixins.sass'),
// ];
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "7357";


module.exports = {
  entry: [
    // POLYFILL: Set up an ES6-ish environment
    // 'babel-polyfill',  // The entire babel-polyfill
    // Or pick es6 features needed (included into babel-polyfill)
    'core-js/fn/promise',
    'core-js/es6/object',
    'core-js/es6/array',

    './src/index.jsx', // your app's entry point
  ],
  devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { // handle images
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: "file-loader"
        }
      },
      { // handles css in legacy app
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      { // handle sass
        test: /\.sass$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
          // {
          //   loader: "sass-resources-loader",
          //   options: {
          //     resources: sassResourcesPaths
          //   }
          // }

        ]
      },
      { // process index alone as application root
        test: /\.html$/,
        use: "html-loader"
      },
      { // handles angular templates referenced in js
        test: /\.json/,
        include: path.resolve(__dirname, "fixtures/mocks"),
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, "src"),
        use: 'babel-loader'
      }
    ]
  },  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.join(__dirname, "src"),
      path.join(__dirname, "node_modules"), // the old 'fallback' option (needed for npm link-ed packages)
    ],
    alias: {
      "styles": path.resolve(__dirname, 'styles/'),
    }
  },
  devServer: {
    contentBase: "./public",
    // do not print bundle build stats
    noInfo: true,
    // enable HMR
    hot: true,
    // embed the webpack-dev-server runtime into the bundle
    inline: true,
    // serve index.html in place of 404 responses to allow HTML5 history
    historyApiFallback: true,
    port: PORT,
    host: HOST
  },
  performance: { hints: false },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new DashboardPlugin(),
    new HtmlWebpackPlugin({
      template: './src/template.html',
      files: {
        css: ['style.css'],
        js: [ "bundle.js"],
      }
    }),
  ]
};
