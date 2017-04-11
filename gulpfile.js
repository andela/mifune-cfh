const gulp = require('gulp');

const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const browsers = require('browser-sync');
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
    browserSync.init({
        proxy: "http://localhost:3000",
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
    gulp.watch('public/css/**', browserSync.reload);
    gulp.watch('app/views/**', browserSync.reload);
    gulp.watch('public/views/**', browserSync.reload);
    gulp.watch(['public/js/**', 'app/**/*.js'], browserSync.reload)
    livereload.listen();
});

gulp.task('default', ['server', 'watch']);