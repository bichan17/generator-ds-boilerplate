const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');

const paths = require('../config').paths;

gulp.task('scripts', () => {
  return browserify({
      entries: paths.scripts.src,
      debug: true
    })
    .bundle()
    .pipe(source(paths.scripts.filename))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify({
      output: {
        max_line_len: 500
      }
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.scripts.dest));
});

gulp.task('scripts-watch', () => {
  watch(paths.scripts.watch, () => gulp.start('scripts'));
});
