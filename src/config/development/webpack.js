var path = require('path')
var nodeExternals = require('webpack-node-externals')

const SRC = path.join(__dirname, '..', '..')
const ROOT = path.join(SRC, '..')

module.exports = {
  entry: ['babel-polyfill', SRC + '/server'],
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
