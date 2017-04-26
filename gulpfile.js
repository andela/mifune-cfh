const gulp = require('gulp');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const browser = require('browser-sync');
const sass = require('gulp-sass');
const eslint = require('gulp-eslint');
const bower = require('gulp-bower');
const istanbul = require('gulp-istanbul');
const coveralls = require('gulp-coveralls');
const gutil = require('gulp-util');
const Server = require('karma').Server;
require('dotenv').config();

gulp.task('nodemon', () => {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: { NODE_ENV: 'development' }
  });
});

gulp.task('server', ['nodemon'], () => {
  browser.init({
    // This is where the real app is launched using Express.
    // Note the use of back-ticks below (i.e ``).
    proxy: `http://localhost:${process.env.PORT}`,
    // This gives BS a port to bind to.
    port: 3000,
    files: ['public/**/*.*'],
    reloadOnRestart: true
  });
});

gulp.task('pre-test', () =>
  gulp.src(['app/**/*.js'])
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire())
);

gulp.task('test-backend', ['pre-test'], () =>
  gulp.src('test/backend/**/*.js', { read: false })
    .pipe(mocha())
    .pipe(istanbul.writeReports(
      {
        dir: './coverage',
        reporters: ['lcov', 'json', 'text', 'text-summary'],
        reportOpts: { dir: './coverage' }
      }
    ))
    // Enforce a coverage of at least 90%
    // .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
    .once('error', (err) => {
      // eslint-disable-line
      console.log(err);
    })
);

gulp.task('test-frontend', ['test-backend'], (done) => {
  // new Server({
  //   configFile: `${__dirname}/karma.conf.js`
  // }, () => {
  //   done();

  const server = new Server({
    configFile: `${__dirname}/karma.conf.js`,
    singleRun: true
  });

  server.on('browser_error', (browsers, err) => {
    gutil.log(`Karma Run Failed: ${err.message}`);
    throw err;
  });

  server.on('run_complete', (browsers, results) => {
    if (results.failed) {
      throw new Error('Karma: Tests Failed');
    }
    gutil.log('Karma Run Complete: No Failures');
    done();
  });

  server.start();
});

gulp.task('test-dev', ['test-frontend', 'test-backend'], () => {
  process.exit();
});

gulp.task('test', ['test-frontend', 'test-backend'], () =>
  gulp.src('./coverage/lcov.info')
    .pipe(coveralls())
    .once('end', () => {
      process.exit();
    })
);

gulp.task('sass', () => gulp.src('./public/css/common.scss')
  .pipe(sass())
  .pipe(gulp.dest('./public/css')));

gulp.task('bower', () => {
  bower();
});

gulp.task('lint', () => gulp.src([
  'app/**/*.js',
  '*.js',
  'test/**/*.js',
  'public/js/**/*.js'
]).pipe(eslint({
  configFile: '.eslintrc',
  useEslintrc: true,
}))
  .pipe(eslint.format())
  .pipe(eslint.failOnError())
);

gulp.task('watch', () => {
  gulp.watch(['public/css/common.scss'], ['sass']);
  gulp.watch('public/css/*.css', ['sass']);
  gulp.watch('public/css/**', browser.reload);
  gulp.watch('app/views/**', browser.reload);
  gulp.watch('public/views/**', browser.reload);
  gulp.watch(['public/js/**', 'app/**/*.js'], browser.reload);
});

gulp.task('default', ['server', 'watch']);
