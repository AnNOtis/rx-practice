var gulp = require('gulp');
var livereload = require('gulp-livereload');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('reload', function() {
  livereload.reload()
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('app.js', ['reload']);
  gulp.watch('index.html', ['reload']);
});
