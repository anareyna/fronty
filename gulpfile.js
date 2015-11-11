var gulp = require('gulp');
var gutil = require('gulp-util');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var jeet = require('jeet');
var rupture = require('rupture');
var coffee = require('gulp-coffee');
var spritesmith = require("gulp.spritesmith");
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var pleeease = require('gulp-pleeease');
var iconfont = require('gulp-iconfont');
var consolidate = require("gulp-consolidate");
var fs = require('fs');

var path = {
	frontend: 'src/',
	jade: 'src/preprocessors/jade/',
	stylusFiles: 'src/preprocessors/stylus/**/*.styl',
	coffeeFiles: 'src/preprocessors/coffee/**/*.coffee',
	spriteStylDist: 'src/preprocessors/stylus/_mixins/',
	stylusSrc: 'src/preprocessors/stylus/',
	jsSrc: 'src/js/**/*.js',
	html: './dist/',
	css: './dist/css/',
	js: './dist/js/',
	spriteSrc: 'src/img/sprite/*.png',
	imgSrc: 'src/img/',
	imgDist: './dist/img/',
};

gulp.task('jade', function() {
	gulp.src([
		path.jade + '*.jade',
		path.jade + '**/*.jade',
		'!' + path.jade + '_**/*.jade',
		'!' + path.jade + '/**/_**/*.jade',
		'!' + path.jade + '/**/_*.jade'
		])
		.pipe(jade({
			pretty : true
		}))
		.pipe(gulp.dest(path.html));
});

gulp.task('stylus', function () {
	return gulp.src(path.stylusFiles)
		.pipe(stylus({
			use: [
				jeet(),
				rupture()
			]
		}))
		.pipe(pleeease())
		.pipe(gulp.dest(path.css));
});


gulp.task('coffee', function() {
	return gulp.src(path.coffeeFiles)
		.pipe(coffee({bare: true}).on('error', gutil.log))
		.pipe(gulp.dest(path.js))
});


gulp.task('sprite', function () {
	var spriteData = gulp.src(path.spriteSrc).pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: 'sprite.styl',
		padding: 2,
		algorithm: 'binary-tree',
		imgPath: '../img/sprite.png'
	}));
	// Pipe image stream through image optimizer and onto disk
	spriteData.img.pipe(imagemin()).pipe(gulp.dest(path.imgDist));
	//spriteData.img.pipe(gulp.dest(path.imgSrc)); // No optimization
	spriteData.css.pipe(gulp.dest(path.spriteStylDist));
});

gulp.task('imagemin', function () {
	return gulp.src(path.imgSrc + '**')
	.pipe(imagemin({
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	}))
	.pipe(gulp.dest(path.imgDist));
	});

gulp.task('lint', function() {
	return gulp.src(path.js)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
 });

gulp.task('concatjs', function() {
	return gulp.src([path.jsSrc, path.js + 'app.js' ])
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
		.pipe(gulp.dest(path.stylusSrc));
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
			.pipe(gulp.dest(path.stylusSrc + '/_helpers'));
		})
		.pipe(gulp.dest(path.frontend + '/fonts/iconFonts'));
});

gulp.task('copy:fonts', function() {
	return gulp.src(
			path.frontend + 'fonts/**/*.*',
    		{ base : path.frontend })
		.pipe(gulp.dest(path.html));
});

gulp.task('browserSync', function(){
	return browserSync({
		notify: true,
		server: {
			baseDir : [path.html]
		}
	});
});

gulp.task('watch', function() {
	gulp.start('browserSync');
	gulp.watch([path.jade + '**/*.jade'],['jade', reload]);
	gulp.watch([path.stylus],['stylus', reload]);
	gulp.watch([path.coffee], ['coffee', reload]);
});

gulp.task('fonts', function(cb){
	runSequence('fonts:compile', 'stylus', 'copy:fonts', cb)
});

gulp.task('icons', function(cb){
	runSequence('icons:compile', 'fonts:compile', 'stylus', 'copy:fonts', cb)
});

gulp.task('default', function(cb) {
	runSequence('jade', 'coffee', 'lint', 'stylus', 'sprite', 'imagemin', 'fonts', 'icons', cb);
});
