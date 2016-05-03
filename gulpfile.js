// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    htmlmin = require('gulp-htmlmin'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    rename = require('gulp-rename');

var basedir = 'app/';

// Lint Task
gulp.task('lint', function() {
    return gulp.src(basedir + 'js/**/*.js')
        .pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
 });

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src(basedir + 'scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([basedir + 'js/**/*.js', '!' + basedir + 'js/**/*.test.js'])
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Deploy dependency JS
gulp.task('dependency', function() {
    return gulp.src([
      'node_modules/angular/angular.min.js',
      'node_modules/angular-resource/angular-resource.min.js',
      'node_modules/angular-route/angular-route.min.js',
      'bower_components/hammerjs/hammer.min.js',
      'bower_components/angular-gestures/gestures.min.js'
    ])
    .pipe(gulp.dest('dist/js'));
        
});

//Compile HTML
gulp.task('html', function() {
    gulp.src(basedir + '/**/*.html')
        .pipe(htmlmin({"collapseWhitespace": true}))
        .pipe(gulp.dest('dist'));
});

//Move static files
gulp.task('static', function() {
    gulp.src(basedir + '/static/*')
        .pipe(gulp.dest('dist/static'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(basedir + 'js/**/*.js', ['lint', 'scripts']);
    gulp.watch(basedir + 'scss/**/*.scss', ['sass']);
    gulp.watch(basedir + '**/*.html', ['html']);
    gulp.watch(basedir + 'static/*', ['static']);
});

// Build task
gulp.task('build', ['lint', 'sass', 'dependency', 'scripts', 'html', 'static']);

// Default Task
gulp.task('default', ['build', 'watch']);
