const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const newer = require('gulp-newer');

const src = 'src/**/*.js';
const dest = 'dist';

gulp.task('lint', () => {
  return gulp.src([src])
    .pipe(newer(dest))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('babel', ['lint'], () => {
  return gulp.src([src])
    .pipe(newer(dest))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
  gulp.watch(src, ['babel']);
});

gulp.task('default', ['watch']);
