const path = require('path');
const webpack = require('webpack');

const config = require('./config');

module.exports = {
  entry: './' + config.paths.scripts.src,
  output: {
    filename: config.paths.scripts.filename,
    path: path.resolve(__dirname, config.paths.scripts.dest)
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};
