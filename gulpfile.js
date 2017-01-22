var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var del = require('del');

var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

var destDirs = {
  dev: './public',
  build: './dist'
};

var destDir = '';

var paths = {
  scripts: ['**/*.js', '!node_modules/**', '!bower_components/**', '!gulpfile.js'],
  styles: ['./app/assets/css/**/*.scss'],
  html: ['./app/**/*.html'],
  js: [
    './app/app.js',
    './app/**/*.js'
  ],
  fonts: ['./app/assets/fonts/*.ttf']

};

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(destDir + '/assets/css'));
});

gulp.task('css-vendor', function () {
  return gulp
    .src([
      "./bower_components/bootstrap/dist/css/bootstrap.min.css",
      "./bower_components/bootstrap/dist/css/bootstrap-theme.min.css"
    ])
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(destDir + '/assets/css/'));
});

gulp.task('bower', function () {
  return gulp.src([
    './bower_components/angular/angular.js',
    "./bower_components/angular-bootstrap/ui-bootstrap.js",
    "./bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
    "./bower_components/jquery/dist/jquery.js",
    './bower_components/angular-animate/angular-animate.min.js',
    './bower_components/angular-ui-router/release/angular-ui-router.js',
    './bower_components/angular-touch/angular-touch.min.js',
    "./bower_components/bootstrap/dist/js/bootstrap.js",
    './bower_components/d3/d3.min.js',
    './bower_components/moment/min/moment.min.js'
  ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(destDir + '/assets/js'));
});

gulp.task('js', function () {
  return gulp.src(paths.js)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(destDir + '/assets/js/'));
});

gulp.task('html', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(destDir));
});

gulp.task('fonts', function () {
  gulp.src('bower_components/bootstrap/fonts/*')
    .pipe(gulp.dest(destDir + '/assets/fonts/'));
});

gulp.task('clear', () => del(destDir, { force: true }));

gulp.task('path-dev', () => destDir = destDirs.dev);
gulp.task('path-build', () => destDir = destDirs.build);


gulp.task('default', ['path-dev'], function (done) {

  browserSync.init({
    server: {
      baseDir: "./public"
    }
  });

  runSequence('clear', 'css-vendor', 'bower', 'js', 'html', 'styles', 'fonts', function () {
    ['js', 'html', 'styles', 'fonts'].forEach(function (taskName) {
      gulp.watch(paths[taskName], [taskName]);
    });
    gulp.watch('public/**/*').on('change', browserSync.reload);
  });
});