const path = require('path');
const webpack = require('webpack');

const plugins = process.env.NODE_ENV === 'production'
  ? [
    new webpack.optimize.UglifyJsPlugin()
  ]
  : [];

module.exports = {
  entry: './<%= paths.assets.scripts.source %>',
  output: {
    filename: '<%= paths.assets.scripts.filename %>',
    path: path.resolve(__dirname, '<%= paths.assets.scripts.destination %>')
  },
  <%_ if (config.target === 'node') { _%>
  target: 'node',
  <%_ } _%>
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: plugins
};
