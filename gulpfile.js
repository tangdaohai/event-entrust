const gulp = require('gulp');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const notify = require('gulp-notify');

gulp.task('clean', function(){ gulp.src('dest/**.*').pipe(clean()) });

gulp.task('default', ['clean'], function(){
    gulp.src('src/*.js')
        .pipe(gulp.dest('dest'))
        .pipe(uglify())
        .pipe(rename({ 'suffix' : '.min' }))
        .pipe(gulp.dest('dest'))
        .pipe(notify( {message : '完成时间 : ' + new Date().toTimeString()} ));
});
