var nodeExternals = require('webpack-node-externals')

module.exports = {
  cache: true,
  module: {
    loaders: [{
      test: /\.js$/,
      include: /src/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        cacheDirectory: true
      }
    }]
  },
  target: 'node',
  externals: [nodeExternals()]
  // externals: [nodeExternals({
    // whitelist: ['graphql']
  // })]
}
