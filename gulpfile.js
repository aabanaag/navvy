var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var del = require('del');
var args = require('yargs').argv;
var gulpif = require('gulp-if');
var merge = require('merge-stream');

var isDebug = false;
isDebug = (args.debug) ? true : false;
var isRelease = false;
isRelease = (args.release) ? true : false;

var path = {
  src: {
    main: './src',
    system: {
      main: './src/system',
      js: './src/system/js',
      css: './src/system/css',
      img: './src/system/images'
    },
    patch: {
      main: './src/patch',
      controls: {
        main: './src/patch/controls/Compass',
        js: './src/patch/controls/Compass/js',
        css: './src/patch/controls/Compass/css',
        img: './src/patch/controls/Compass/images'
      },
      templates: {
        main: './src/patch/templates/Compass',
        js: './src/patch/templates/Compass/js',
        css: './src/patch/templates/Compass/css',
        img: './src/patch/templates/Compass/images'
      }
    }
  },
  debug: './debug',
  release: './release',
  installer: './installer'
};

gulp.task('clean', function () {
  del([
    path.debug,
    path.release
  ]);
});

gulp.task('js', ['clean'], function () {
  var s = gulp.src(path.src.system.js + '/**/*.js', {base: path.src.system.main})
  .pipe(gulpif(isRelease, uglify()))
  .pipe(gulp.dest(gulpif(isRelease, path.release + '/system', path.debug + '/system')));

  var p = gulp.src(path.src.patch.main + '/**/*.js', {base: path.src.patch.main})
  .pipe(gulpif(isRelease, uglify()))
  .pipe(gulp.dest(gulpif(isRelease, path.release + '/patch', path.debug + '/patch')));
});

gulp.task('css', ['clean'], function () {
  var s = gulp.src(path.src.system.css + '/**/*.scss', {base: path.src.system.main})
  .pipe(sass())
  .pipe(gulp.dest(gulpif(isRelease, path.release + '/system', path.debug + '/system')));
  
  var l = gulp.src(path.src.system.css + '/**/*.css', {base: path.src.system.main})
  .pipe(gulp.dest(gulpif(isRelease, path.release + '/system', path.debug + '/system')));

  var p = gulp.src(path.src.patch.main + '/**/*.scss', {base: path.src.patch.main})
  .pipe(sass())
  .pipe(gulp.dest(gulpif(isRelease, path.release + '/patch', path.debug + '/patch')));
})
