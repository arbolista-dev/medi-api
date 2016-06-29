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
    publicPath: '/',
    path: path.join(__dirname + 'public')
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'react-hot!babel'
    }]
  },
  resolve: {
    extensions: ['', '.js']
  },
  devServer: {
    contentBase: path.join(__dirname + 'public'),
    hot: true
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
