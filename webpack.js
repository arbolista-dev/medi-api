var webpack = require('webpack')
var nodeExternals = require('webpack-node-externals')
var path = require('path')

var appConfig = {
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './app/index.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname + 'public', 'assets')
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      include: path.join(__dirname + 'app'),
      loaders: ['react-hot', 'babel&plugins[]=' + path.join(__dirname, 'relayPlugin')]
    }]
  }
}

var serverConfig = {
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

module.exports = [appConfig, serverConfig]
