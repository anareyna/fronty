var gulp = require('gulp');
var pug = require('gulp-pug');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
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
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var lost = require('lost');
var bower = require('gulp-bower');
var fs = require('fs');

var config = {
	is_minified: false
}

var path = {

	src_html: 'patterns/_04-pages/html/',
	src_css: 'patterns/',
	src_js: 'preprocessors/pre_js/',
	src_img: 'assets/img/',
	src_fonts: 'assets/fonts/',
	src_sprite: 'assets/img/sprite/*.png',

	dist: './dist/',
	dist_html: './dist/',
	dist_css: './dist/css/',
	dist_js: './dist/js/',
	dist_img: './dist/img/',
	bower: './dist/js/libs/'
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
	.pipe(sass(
		{
			includePaths:
			[
				path.bower + 'breakpoint-sass/stylesheets',
				path.bower + 'breakpoint-slicer/stylesheets'
			],
			outputStyle:'compressed'
		 }
	))
	.pipe(postcss([
			lost(),
			autoprefixer()
		]))
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

gulp.task('sprite', function () {
	var spriteData = gulp.src(path.src_sprite).pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: 'sprite.scss',
		padding: 2,
		algorithm: 'binary-tree',
		imgPath: '../img/sprite.png'
	}));
	// Pipe image stream through image optimizer and onto disk
	spriteData.img.pipe(gulp.dest(path.dist_img));
	//spriteData.img.pipe(gulp.dest(path.src_img)); // No optimization
	spriteData.css.pipe(gulp.dest(path.src_css + '_00-toolbox/css/'));
});


gulp.task('fonts:compile', function(cb){
	var dirList = []
	fs.readdirSync(path.src_fonts).forEach(function(file){
		if(/^[^_]*$/g.test(file)){
			dirList.push(file)
		}
	});
	return gulp.src(path.src_fonts + '_template/fonts.scss')
		.pipe(consolidate('lodash', { dirList: dirList }))
		.pipe(gulp.dest(path.src_css));
});

gulp.task('icons:compile', function(cb){
	return gulp.src(path.frontend + '/icons/*.svg')
		.pipe(iconfont({
			normalize: true,
			fontName: 'iconFonts-webfont',
			appendUnicode: false
		}))
		.on('codepoints', function(codepoints, options) {
			gulp.src(path.frontend + '/icons/_template/icons.styl') //Template
			.pipe(consolidate('lodash', {
				glyphs: codepoints,
				fontName: 'iconFonts'
			}))
			.pipe(gulp.dest(path.src_css + '/_helpers'));
		})
		.pipe(gulp.dest(path.frontend + '/fonts/iconFonts'));
});

gulp.task('fonts:copy', function() {
	return gulp.src(
			path.frontend + 'fonts/**/*.*',
				{ base : path.frontend })
		.pipe(gulp.dest(path.dist_html));
});


gulp.task('bower', function() {
	return bower();
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
	gulp.watch([path.src_css + '**/*.scss', path.src_css + '**/**/*.scss'], ['css', browserSync.reload]);
	gulp.watch([path.src_html + '**/*.pug'], ['html', browserSync.reload]);
	gulp.watch([path.src_js + '**/*.js'], ['js', browserSync.reload]);
});

gulp.task('fonts', function(cb){
	runSequence('fonts:compile', 'css', 'fonts:copy', cb)
});
gulp.task('default', function(cb) {
	runSequence('bower', 'html', 'css', 'js', cb);
});
