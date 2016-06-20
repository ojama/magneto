var gulp = require('gulp');
var uglify = require('gulp-uglify');
var obfuscate = require('gulp-obfuscate');
var concat = require('gulp-concat');
gulp.task('release', function () {
  gulp.src(['www/js/*.js','!www/js/dist'])
      .pipe(uglify({
        mangle: false,//类型：Boolean 默认：true 是否修改变量名
        compress: true,//类型：Boolean 默认：true 是否完全压缩
        preserveComments: 'all' //保留所有注释
      }))
      //.pipe(obfuscate())
      //.pipe(concat('all.min.js'))
      .pipe(gulp.dest('www/js/dist'));
});