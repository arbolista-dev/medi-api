var path = require('path')

const SERVER = path.join(__dirname, '..', '..')
const ROOT = path.join(SERVER, '..')

module.exports = {
  entry: {
    server: SERVER + '/server'
  },
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
  target: 'node'
}
