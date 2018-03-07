const gulp = require('gulp');
const requireDir = require('require-dir');

requireDir('./gulp');

gulp.task('default', [
  'images',
  'styles'
]);

gulp.task('watch', [
  'images-watch',
  'styles-watch'
]);
