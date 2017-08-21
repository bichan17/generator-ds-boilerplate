const gulp = require('gulp');
const requireDir = require('require-dir');

requireDir('./gulp');

gulp.task('default', [
  'images',<% if (answers['task-runner'] === 'Gulp' && answers['module-loader'] === 'Browserify') { %>
  'scripts',<% } %>
  'styles'
]);

gulp.task('watch', [
  'images-watch',<% if (answers['task-runner'] === 'Gulp' && answers['module-loader'] === 'Browserify') { %>
  'scripts-watch',<% } %>
  'styles-watch'
]);
