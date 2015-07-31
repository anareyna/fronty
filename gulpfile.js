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

var path = {
	jade: 'src/preprocessors/jade/**.*',
	stylus: 'src/preprocessors/stylus/**/*.styl',
	coffee: 'src/preprocessors/coffee/**/*.coffee',
	spriteStylDist: 'src/preprocessors/stylus/_mixins/',
	jsSrc: 'src/js/**/*.js',
	html: './dist/',
	css: './dist/css',
	js: './dist/js',
	spriteSrc: 'src/img/sprite/*.png',
	imgSrc: 'src/img/',
	imgDist: './dist/img/'

};

gulp.task('jade', function() {
	gulp.src(path.jade)
		.pipe(jade({
			pretty : true
		}))
		.pipe(gulp.dest(path.html));
});

gulp.task('stylus', function () {
	return gulp.src(path.stylus)
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
	return gulp.src(path.coffee)
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
	return gulp.src(path.imgSrc + '**') // searches in subdirectories
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
	gulp.watch([path.jade],['jade', reload]);
	gulp.watch([path.stylus],['stylus', reload]);
	gulp.watch([path.coffee], ['coffee', reload]);
});


gulp.task('default', function() {
	runSequence(['jade', 'coffee', 'lint', 'stylus', 'sprite', 'imagemin']);
});
