var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    content: './src/content/main.js',
    inject: './src/content/inject.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      { test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/ }
    ]
  },
  eslint: {
    emitWarning: true
  },
  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: '\'' + process.env.NODE_ENV + '\''
        }
      }
    })
  ]
};