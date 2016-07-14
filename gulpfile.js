const gulp = require('gulp');
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const pump = require('pump');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const notify = require('gulp-notify');

gulp.task('clean', () => gulp.src('dest/**.*').pipe( clean() ) );

gulp.task('default', ['clean'], () => {

    gulp.src('src/*.js')
        .pipe(babel({
            presets : ['es2015']
        }))
        .pipe(gulp.dest('dest'))
        .pipe(uglify())
        .pipe(rename({ 'suffix' : '.min' }))
        .pipe(gulp.dest('dest'))
        .pipe(notify( {message : `完成时间 : ${new Date().toTimeString()}`} ));
});
