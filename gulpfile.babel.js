import gulp from 'gulp'
import yargs from 'yargs'
import webpack from 'webpack'
import gutil from 'gulp-util'

gulp.task('build', function (done) {
  process.env.NODE_ENV = yargs.argv.env || 'development'

  var config = require(`${__dirname}/src/config/${process.env.NODE_ENV}/webpack.js`)
  webpack(config, function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err)
    }
    gutil.log('[webpack]', stats.toString({}))
    done()
  })
})
