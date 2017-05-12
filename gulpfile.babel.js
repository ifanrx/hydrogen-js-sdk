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

const srcFolder = './src/';
const distFolder = './dist/';
const devFile = 'sdk.dev.js';
const miniappRootFolder = '../miniapp-demo/';

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
      'sdk-config': './' + path.join(srcFolder, configFile),
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
    .pipe(gulp.dest(miniappRootFolder))
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

// 压缩、打版本
gulp.task('js:release', ['js:clean', 'js:build'], function () {
  const version = require('./src/version');

  return gulp.src([
      path.join(distFolder, devFile)
    ])
    .pipe(concat('sdk.js'))
    .pipe(rename({ suffix: '-' + version }))
    .pipe(uglify()) // 压缩
    .pipe(gulp.dest(distFolder))
    .pipe(notify({ message: 'js:release task is completed!' }));
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
