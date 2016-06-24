var gulp = require('gulp'),
    open = require('gulp-open');

gulp.task('test', function() {
  gulp.src('./scripts/tests/**/*.html')
    .pipe(open());
});