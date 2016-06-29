import gulp from 'gulp'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import nodemon from 'nodemon'
import gutil from 'gulp-util'
import schema from 'gulp-graphql'
import path from 'path'
var nodeExternals = require('webpack-node-externals')

import configs from './webpack'
const [ appConfig, serverConfig ] = configs

gulp.task('build', function (done) {
  webpack(serverConfig, function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err)
    }
    gutil.log('[webpack]', stats.toString({}))
    done()
  })
})

gulp.task('server-watch', () => {
  return new Promise((resolve, reject) => {
    let compiled = false
    webpack(serverConfig).watch(100, (err, stats) => {
      if (err)
        return reject(err)
      if (!compiled) {
        compiled = true
        resolve()
      } else {
        nodemon.restart
      }
    })
  })
})

gulp.task('webpack', () => {
  let server = new WebpackDevServer(webpack(appConfig), {
    contentBase: path.join(__dirname, 'public'),
    hot: true,
    noInfo: true,
    stats: { colors: true },
    historyApiFallback: true,
    proxy: {
      '/graphql': 'http://localhost:3003/graphql'
    }
  })
  server.listen(3000, 'localhost', (err, res) => {
    if (err)
      return console.error(err)
    console.log('[webpackDevServer]: listening on localhost:3000')
  })
})

gulp.task('db-seed', function (done) {
  var config =  {
    entry: ['babel-polyfill', path.join(__dirname, 'db', 'seed')],
    output: {
      filename: 'seed.js',
      path: path.join(__dirname, 'build', 'test')
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

  webpack(config).run(function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err)
    }
    gutil.log('[webpack]', stats.toString({}))
    done()
  })
})

gulp.task('server', ['server-watch'], () => {
  nodemon({
    execMap: {
      js: 'node'
    },
    script: path.join(__dirname, 'build', 'development', 'server.js'),
    // do not watch any directory/files to refresh
    // all refreshes should be manual
    watch: ['foo/'],
    ext: 'noop',
    ignore: ['*']
  }).on('restart', () => {
    console.log('[nodemon]: restart')
  })
})

gulp.task('default', ['webpack', 'server'])
