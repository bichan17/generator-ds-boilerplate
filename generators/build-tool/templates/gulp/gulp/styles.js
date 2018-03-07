const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const watch = require('gulp-watch');

gulp.task('styles', () => {
  return gulp
    .src('<%= paths.assets.styles.source %>')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('<%= paths.assets.styles.destination %>'));
});

gulp.task('styles-watch', () => {
  watch('<%= paths.assets.styles.watch %>', () => gulp.start('styles'));
});
