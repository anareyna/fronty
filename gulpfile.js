var gulp = require('gulp');
var gutil = require('gulp-util');
var pug = require('gulp-pug');
var stylus = require('gulp-stylus');
var rupture = require('rupture');
var poststylus = require('poststylus');
var lost = require('lost');
var coffee = require('gulp-coffee');
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
var bower = require('gulp-bower');
var fs = require('fs');

var config = {
	is_minified: false
}

var path = {
	frontend: 'src/',
	src_html: 'src/preprocessors/pug/',
	src_css: 'src/preprocessors/stylus/',
	src_js: 'src/preprocessors/coffee/',
	jsSrc: 'src/js/**/*.js',
	dist_html: './dist/',
	dist_css: './dist/css/',
	dist_js: './dist/js/',
	src_sprite: 'src/img/sprite/*.png',
	src_img: 'src/img/',
	dist_img: './dist/img/',
	js_hint: ['./dist/js/**/*.js', '!./dist/js/libs/**/*.js']
};

gulp.task('pug', function() {
	gulp.src([
		path.src_html + '*.pug',
		path.src_html + '**/*.pug',
		'!' + path.src_html + '_**/*.pug',
		'!' + path.src_html + '/**/_**/*.pug',
		'!' + path.src_html + '/**/_*.pug'
		]).pipe(plumberNotifier())
		.pipe(pug({
			pretty : !config.is_minified
		}))
		.pipe(gulp.dest(path.dist_html));
});

gulp.task('stylus', function () {
	console.log("path.src_css", path.src_css);
	console.log("path.dist_css", path.dist_css);
	return gulp.src([
		path.src_css + '**/*.styl',
		'!' + path.src_css + '**/**/_**/*.styl',
		'!' + path.src_css + '_**/*.styl',
		'!' + path.src_css + '**/_*.styl'
	])
	.pipe(plumberNotifier())
	.pipe(stylus({
		use: [
			rupture(),
			poststylus(['lost'])
		]
	}))
	.pipe(pleeease({minifier:config.is_minified}))
	.pipe(gulp.dest(path.dist_css));
});


gulp.task('coffee', function() {
	return gulp.src([
		path.src_js + '**/*.coffee',
		'!' + path.src_js + '**/_*.coffee'
	])
	.pipe(plumberNotifier())
	.pipe(coffee({bare: true}).on('error', gutil.log))
	.pipe(uglify({
		mangle  : false,
		output: { beautify: !config.is_minified }
	}))
	.pipe(gulp.dest(path.dist_js))
});

gulp.task('sprite', function () {
	var spriteData = gulp.src(path.src_sprite).pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: 'sprite.styl',
		padding: 2,
		algorithm: 'binary-tree',
		imgPath: '../img/sprite.png'
	}));
	// Pipe image stream through image optimizer and onto disk
	spriteData.img.pipe(imagemin()).pipe(gulp.dest(path.dist_img));
	//spriteData.img.pipe(gulp.dest(path.src_img)); // No optimization
	spriteData.css.pipe(gulp.dest(path.src_css + '_mixins/'));
});

gulp.task('imagemin', function () {
	return gulp.src(path.src_img + '**')
	.pipe(imagemin({
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	}))
	.pipe(gulp.dest(path.dist_img));
	});


 gulp.task('jshint', function() {
	 return gulp.src(path.js_hint)
		.pipe(jshint('.jshintrc'))
		.pipe(plumberNotifier())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
 });

gulp.task('concatjs', function() {
	return gulp.src([path.jsSrc, path.dist_js + 'app.js' ])
		.pipe(concat('app.js'))
		.pipe(gulp.dest(path.js));
});

gulp.task('fonts:compile', function(cb){
	var dirList = []
	fs.readdirSync(path.frontend +  "fonts/").forEach(function(file){
		if(/^[^_]*$/g.test(file)){
			dirList.push(file)
		}
	});
	return gulp.src(path.frontend + '/fonts/_template/fonts.styl')
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

gulp.task('copy:fonts', function() {
	return gulp.src(
			path.frontend + 'fonts/**/*.*',
				{ base : path.frontend })
		.pipe(gulp.dest(path.dist_html));
});

gulp.task('js', function(cb) {
	return runSequence('coffee', 'jshint', cb);
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
	gulp.watch([path.src_html + '**/*.pug'], ['pug', browserSync.reload]);
	gulp.watch([path.src_css + '**/*.styl'], ['stylus', browserSync.reload]);
	gulp.watch([path.src_js + '**/*.coffee'], ['js', browserSync.reload]);
});

gulp.task('fonts', function(cb){
	runSequence('fonts:compile', 'stylus', 'copy:fonts', cb)
});

gulp.task('icons', function(cb){
	runSequence('icons:compile', 'fonts:compile', 'stylus', 'copy:fonts', cb)
});

gulp.task('bower', function() {
	return bower();
});

gulp.task('default', function(cb) {
	runSequence('bower', 'pug', 'js', 'stylus', 'sprite', 'imagemin', 'fonts', 'icons', cb);
});
