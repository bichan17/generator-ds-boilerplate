const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const watch = require('gulp-watch');

const paths = require('../config').paths;

gulp.task('styles', () => {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.styles.dest));
});

gulp.task('styles-watch', () => {
  watch(paths.styles.watch, () => gulp.start('styles'));
});
