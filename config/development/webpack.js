var path = require('path')
var nodeExternals = require('webpack-node-externals')

const ROOT = path.join(__dirname, '..', '..')

module.exports = {
  entry: ['babel-polyfill', ROOT + '/server'],
  output: {
    filename: 'server.js',
    path: ROOT + '/build/development'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  target: 'node',
  externals: [nodeExternals()]
}
