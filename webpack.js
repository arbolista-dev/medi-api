var nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: ['babel-polyfill', __dirname + '/server'],
  output: {
    filename: 'server.js',
    path: __dirname + '/build/development'
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
