import gulp from 'gulp'
import webpack from 'webpack'
import gutil from 'gulp-util'
import schema from 'gulp-graphql'
var nodeExternals = require('webpack-node-externals')

gulp.task('build', function (done) {

  var config = require('./webpack.js')
  webpack(config, function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err)
    }
    gutil.log('[webpack]', stats.toString({}))
    done()
  })
})

gulp.task('db-seed', function (done) {

  var config =  {
    entry: ['babel-polyfill', __dirname + '/db/seed'],
    output: {
      filename: 'seed.js',
      path: __dirname + '/build/test'
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

gulp.task('generate-schema', () => {
  return gulp.src('graphql/schema.js')
    .pipe(schema({
      json: true,
      graphql: true
    }))
    .on('error', err => {
      console.error('Schema pipe error: ', err.message)
    })
    .pipe(gulp.dest('graphql/schema'))
    .on('err', err => {
      console.error(err.message)
    })
})
//
// gulp.task('write-schema', function (done) {
//
//   var config =  {
//     entry: ['babel-polyfill', __dirname + '/utils/updateSchema'],
//     output: {
//       filename: 'updateSchema.js',
//       path: __dirname + '/build/development'
//     },
//     module: {
//       loaders: [{
//         test: /\.js$/,
//         exclude: /node_modules/,
//         loader: 'babel'
//       }, {
//         test: /\.json$/,
//         loader: 'json-loader'
//       }]
//     },
//     target: 'node',
//     externals: [nodeExternals()]
//   }
//
//   webpack(config).run(function (err, stats) {
//     if (err) {
//       throw new gutil.PluginError('webpack', err)
//     }
//     gutil.log('[webpack]', stats.toString({}))
//     done()
//   })
// })
