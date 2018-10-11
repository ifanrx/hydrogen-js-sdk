import gulp from 'gulp';
import watch from 'gulp-watch';
import notify from 'gulp-notify';
import babelify from 'babelify';
import watchify from 'watchify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import del from 'del';
import concat from 'gulp-concat';
import path from 'path';
import shell from 'gulp-shell';
import aliasify from 'aliasify';

const config = require('../core/config')

const srcFolder = './src/';
const distFolder = './dist/';
const npmDistFolder = '../lib/'
const devFile = 'sdk.dev.js';

// watch
gulp.task('watch', function () {
  // js
  watch([
    'src/**/*.js'
  ], function () {
    gulp.start('js:build');
    gulp.start('test');
  });
  // test
  watch([
    'test/**/*.js'
  ], function () {
    gulp.start('test');
  });
});

// build js
gulp.task('js:build', function () {

  var configFile = 'config.js';
  if (process.env.NODE_ENV === 'dev') {
    configFile = 'config.dev.js';
  };
  var aliasifyConfig = {
    aliases: {
      'sdk-config': path.join('../core',configFile),
    },
    appliesTo: {
      'includeExtensions': ['.js']
    }
  };

  var b = watchify(browserify({
    entries: [path.join(srcFolder, '/index.js')],
  }));

  return b
    .transform(babelify)
    .transform(aliasify, aliasifyConfig)
    .bundle()
    .on('error', function (err) {
      console.log(err + '');
      this.emit('end');
    })
    .pipe(source(devFile))
    .pipe(buffer())
    .pipe(gulp.dest(distFolder))
    .pipe(notify({ message: 'js:build task is completed!' }));
});

// dev
gulp.task('dev', ['js:build'], function () {
  gulp.start('watch');
});

// 删除旧版本文件
gulp.task('js:clean', function () {
  return del([
    path.join(distFolder, '/sdk-*.js')
  ]);
});

// 删除旧版本文件 - npm
gulp.task('js:clean-npm', function () {
  return del([
    path.join(npmDistFolder, '/sdk.js'),
  ], {force: true});
});

// 压缩、打版本
gulp.task('js:release', ['js:clean', 'js:build'], function () {
  return gulp.src([
      path.join(distFolder, devFile)
    ])
    .pipe(concat('sdk.js'))
    .pipe(rename({ suffix: '-' + config.VERSION }))
    .pipe(uglify()) // 压缩
    .pipe(gulp.dest(distFolder))
    .pipe(notify({ message: 'js:release task is completed!' }));
});

// 发布 npm
gulp.task('js:release-npm', ['js:clean-npm', 'js:build'], function () {
  return gulp.src([
      path.join(distFolder, devFile)
    ])
    .pipe(concat('sdk.js'))
    .pipe(rename('index.js'))
    .pipe(uglify()) // 压缩
    .pipe(gulp.dest(npmDistFolder))
    .pipe(notify({ message: 'js:release-npm task is completed!' }));
});

// release-npm
gulp.task('release-npm', ['js:release-npm'], function () {
  setTimeout(function () {
    process.exit(0);
  }, 1000);
});

// release
gulp.task('release', ['js:release'], function () {
  setTimeout(function () {
    process.exit(0);
  }, 1000);
});

// test
gulp.task('test', shell.task(['npm test'], {
  ignoreErrors: false
}));
