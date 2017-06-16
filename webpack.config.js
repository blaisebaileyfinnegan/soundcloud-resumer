const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const WebpackOnBuildPlugin = require('on-build-webpack');

let isProd = false;
if (process.env.NODE_ENV === 'production') {
  isProd = true;
}

const cfg = {
  entry: {
    "srp-content": path.join(__dirname, './src/content/main.js'),
    inject: path.join(__dirname, './src/content/inject.js')
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
      { test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/ }
    ]
  },
  eslint: {
    emitWarning: true
  },
  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      }
    }),
    new WebpackOnBuildPlugin((stats) => {
      if (process.env.NODE_ENV === 'production') {
        const zip = new require('node-zip')();
        const filenames = Object.keys(stats.compilation.assets);
        filenames.forEach((f) => {
          zip.file(f, fs.readFileSync(path.join(cfg.output.path, f)));
        });

        const data = zip.generate({ base64: false, compress: 'DEFLATE'});
        fs.writeFileSync(path.join(cfg.output.path, 'extension.zip'), data, 'binary');
      }
    })
  ]
};

if (isProd) {
  cfg.module.loaders.unshift(
    { test: /\.js$/, loader: "strip-loader?strip[]=console.log" }
  );
} else {
  cfg.devtool = 'cheap-module-inline-source-map';
}

module.exports = cfg;
