const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const watch = require('gulp-watch');

gulp.task('images', () => {
  return gulp
    .src('<%= paths.assets.images.source %>')
    .pipe(imagemin({
      optimizationLevel: process.env.NODE_ENV === 'production' ? 7 : 0,
      progressive: true,
      interlaced: true,
      multipass: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest('<%= paths.assets.images.destination %>'));
});

gulp.task('images-watch', () => {
  watch('<%= paths.assets.images.watch %>', () => gulp.start('images'));
});
