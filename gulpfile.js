'use strict';

const gulp = require('gulp'),
  cleanCSS = require('gulp-clean-css'),
  rev = require('gulp-rev'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat');

gulp.task('css', function() {
  return gulp.src('./app/public/home/css/index.css')
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleanCSS())
    .pipe(rev())
    .pipe(gulp.dest('./app/public/home/css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/css'));
});

gulp.task('js', function() {
  return gulp.src('./app/public/home/js/*.js')
    .pipe(concat('index.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(rev())
    .pipe(uglify())
    .pipe(gulp.dest('./app/public/home/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/js'));
});
