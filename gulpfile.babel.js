import gulp from 'gulp'
import webpack from 'webpack'
import gutil from 'gulp-util'

gulp.task('build', function (done) {

  var config = require(`./webpack.js`)
  webpack(config, function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err)
    }
    gutil.log('[webpack]', stats.toString({}))
    done()
  })
})
