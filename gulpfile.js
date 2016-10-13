var gulp = require('gulp');
var pug = require('gulp-pug');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var postcss = require('gulp-postcss');
var spritesmith = require("gulp.spritesmith");
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var pleeease = require('gulp-pleeease');
var iconfont = require('gulp-iconfont');
var consolidate = require("gulp-consolidate");
var plumberNotifier = require('gulp-plumber-notifier');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var rename = require("gulp-rename");

var fs = require('fs');

var config = {
	is_minified: false
}

var path = {

	src_html: 'preprocessors/pre_html/',
	src_css: 'patterns/',
	src_js: 'preprocessors/pre_js/',
  src_img: 'assets/img/',

	dist_html: './dist/',
	dist_css: './dist/css/',
	dist_js: './dist/js/',
	dist_img: './dist/img/'

};


gulp.task('css', function () {
	return gulp.src([
		path.src_css + '**/*.scss',
		'!' + path.src_css + '**/**/_**/*.scss',
		'!' + path.src_css + '_**/*.scss',
		'!' + path.src_css + '_**/**/*.scss',
		'!' + path.src_css + '**/_*.scss'
	])
	.pipe(plumberNotifier())
	.pipe(sassGlob())
	.pipe(sass())
	.pipe(gulp.dest(path.dist_css));
});

gulp.task('html', function() {
  gulp.src([
    path.src_html + '*.pug',
    path.src_html + '**/**/*.pug',
    path.src_html + '**/*.pug',
    '!' + path.src_html + '_**/*.pug',
    '!' + path.src_html + '/**/_**/*.pug',
    '!' + path.src_html + '/**/_*.pug'
    ])
  	.pipe(plumberNotifier())
    .pipe(pug({
      pretty : config.is_minified
    }))
    // .pipe(rename({
    //     extname: ".phtml"
    // }))
    .pipe(gulp.dest(path.dist_html));
});


gulp.task('js', function(cb) {
    return gulp.src([
		path.src_js + '**/*.js',
		'!' + path.src_js + '_**/*.js',
		'!' + path.src_js + '**/_*.js'
	])
	.pipe(plumberNotifier())
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'))
	.pipe(jshint.reporter('fail'))
 	.pipe(babel({
 	    presets: ['es2015']
 	}))
	.pipe(uglify({
		mangle  : false,
		compress: {
			drop_console: false,
			drop_debugger: true
		},
		output: { beautify: !config.is_minified }
	}))
  .pipe(gulp.dest(path.dist_js));
});


gulp.task('browserSync', function(){
	return browserSync({
		notify: true,
		server: {
			baseDir : [path.dist_html]
		}
	});
});

gulp.task('watch', function() {
	gulp.start('browserSync');
  gulp.watch([path.src_css + '**/*.scss'], ['css', browserSync.reload]);
	gulp.watch([path.src_html + '**/*.pug'], ['html', browserSync.reload]);
	gulp.watch([path.src_js + '**/*.js'], ['js', browserSync.reload]);
});
