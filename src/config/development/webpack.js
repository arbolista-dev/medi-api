var path = require('path')

const SRC = path.join(__dirname, '..', '..')
const ROOT = path.join(SRC, '..')

module.exports = {
  entry: {
    server: SRC + '/server'
  },
  output: {
    filename: 'server.js',
    path: ROOT + '/build/development'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: [
        path.join(ROOT, 'node_modules'),
      ],
      loader: 'babel'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  target: 'node'
}
