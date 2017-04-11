const gulp = require('gulp');

const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const browser = require('browser-sync');
const sass = require('gulp-sass'); 
const eslint = require('gulp-eslint');
require('dotenv').config();


gulp.task('nodemon', () => {
  nodemon({
    script: 'server.js'
  , ext: 'js'
  , env: { 'NODE_ENV': 'development' }
  })
});

gulp.task('server', ['nodemon'], () => {
    browser.init({
        proxy: "http://localhost:6000",
        port: 5000,
        files: ["public/**/*.*"],
        reloadOnRestart: true
    });
});
 
gulp.task('test', () =>
    gulp.src('test/**/*.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}))
);

gulp.task('sass', () => {
  return gulp.src('./public/css/common.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/css'))
});
gulp.task('bower', () => {
    bower()
        .pipe(gulp.dest('./public/lib/'));
});

gulp.task('lint', () => gulp.src([
    'gruntfile.js', 
    'app/**/*.js',
    '*.js',
    'test/**/*.js',
    'public/js/*.js',
    'public/js/**/*.js'
  ]).pipe(eslint({
    configFile: '.eslintrc.json',
    useEslintrc: true,
  }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
  );

gulp.task('watch', () => {
    gulp.watch(['public/css/common.scss, public/css/views/articles.scss'], ['sass']);
    gulp.watch('public/css/*.css');
    gulp.watch('public/css/**', browser.reload);
    gulp.watch('app/views/**', browser.reload);
    gulp.watch('public/views/**', browser.reload);
    gulp.watch(['public/js/**', 'app/**/*.js'], browser.reload)
});

gulp.task('default', ['server', 'watch']);