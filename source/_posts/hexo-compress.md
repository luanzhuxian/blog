---
title: 使用 Gulp 压缩 Hexo
comments: true
categories:
  - Hexo
  - gulp
tags:
  - Hexo
  - gulp
abbrlink: e5ac3b51
date: 2019-04-23 14:44:56
---

只压缩`hexo g`生成的`public`文件夹下的要发布到`github page`的源码。  

首先全局安装 [Gulp](https://www.gulpjs.com.cn/)：
```
  npm i gulp -g
```
`cd`到项目根目录本地安装`gulp`插件：
```
  npm i gulp gulp-htmlclean gulp-htmlmin gulp-imagemin gulp-minify-css gulp-uglify --save
```
`gulp -v`查看版本。  
**注意：本文用的是`gulp 3 (3.9.1)`，使用`gulp 4`或更高版本可能会不适应。**  

项目根目录新建`gulpfile.js`，添加如下内容：
```
  var gulp = require('gulp');
  var minifycss = require('gulp-minify-css');
  var uglify = require('gulp-uglify');
  var htmlmin = require('gulp-htmlmin');
  var htmlclean = require('gulp-htmlclean');

  // 获取 gulp-imagemin 模块
  var imagemin = require('gulp-imagemin')

  // 压缩 public 目录 css
  gulp.task('minify-css', function() {
      return gulp.src('./public/**/*.css')
          .pipe(minifycss())
          .pipe(gulp.dest('./public'));
  });
  // 压缩 public 目录 html
  gulp.task('minify-html', function() {
      return gulp.src('./public/**/*.html')
          .pipe(htmlclean())
          .pipe(htmlmin({
              removeComments: true,  //清除HTML注释
              collapseWhitespace: true,  //压缩HTML
              collapseBooleanAttributes: true,  //省略布尔属性的值 <input checked="true"/> ==> <input checked />
              removeEmptyAttributes: true,  //删除所有空格作属性值 <input id="" /> ==> <input />
              removeScriptTypeAttributes: true,  //删除<script>的type="text/javascript"
              removeStyleLinkTypeAttributes: true,  //删除<style>和<link>的type="text/css"
              minifyJS: true,  //压缩页面JS
              minifyCSS: true  //压缩页面CSS
          }))
          .on('error', function(err) {
              console.log('html Error!', err.message);
              this.end();
          })
          .pipe(gulp.dest('./public'))
  });
  // 压缩 public/js 目录 js
  gulp.task('minify-js', function() {
      return gulp.src('./public/**/*.js')
          .pipe(uglify())
          .pipe(gulp.dest('./public'));
  });
  // 压缩图片任务
  // 在命令行输入 gulp images 启动此任务
  gulp.task('images', function () {
      // 1. 找到图片
      gulp.src('./photos/*.*')
      // 2. 压缩图片
          .pipe(imagemin({
              progressive: true
          }))
          // 3. 另存图片
          .pipe(gulp.dest('dist/images'))
  });

  // 执行 gulp 命令时执行的任务
  gulp.task('build', ['minify-html', 'minify-css', 'minify-js', 'images']);
```
终端执行`gulp build`就会执行`gulp.task('build', ['minify-html', 'minify-css', 'minify-js', 'images']);`任务，即分别压缩`public`下的`html、css、js和图片`。  
之后每次发布前先执行`gulp build`，再执行`hexo depl`，这样提交上线的是压缩后的`public`下的代码。
