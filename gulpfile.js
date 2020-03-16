var gulp = require('gulp')
var htmlclean = require('gulp-htmlclean')
var htmlmin = require('gulp-htmlmin')
var cleanCSS = require('gulp-clean-css')
var uglify = require('gulp-uglify')
var imagemin = require('gulp-imagemin')

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
            console.log('html Error!', err.message)
            this.end()
        })
        .pipe(gulp.dest('./public'))
})

// 压缩 public 目录 css
gulp.task('minify-css', function() {
    return gulp.src('./public/**/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('./public'))
})

// 压缩 public 目录 js
gulp.task('minify-js', function() {
    return gulp.src('./public/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./public'))
})

// 压缩图片
gulp.task('images', function () {
    return gulp.src('./photos/*.*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/images'))
})

gulp.task('build', gulp.series('minify-html', 'minify-css', 'minify-js', 'images'))