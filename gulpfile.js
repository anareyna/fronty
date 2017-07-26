var gulp = require('gulp')
var pug = require('gulp-pug')
var stylus = require('gulp-stylus')
var rupture = require('rupture')
var poststylus = require('poststylus')
var spritesmith = require('gulp.spritesmith')
var imagemin = require('gulp-imagemin')
var changed = require('gulp-changed')
var pngquant = require('imagemin-pngquant')
var runSequence = require('run-sequence')
var browserSync = require('browser-sync')
var uglify = require('gulp-uglify')
var pleeease = require('gulp-pleeease')
var iconfont = require('gulp-iconfont')
var consolidate = require('gulp-consolidate')
var plumberNotifier = require('gulp-plumber-notifier')
var bower = require('gulp-bower')
var babel = require('gulp-babel')
var eslint = require('gulp-eslint')
var fs = require('fs')

var config = {
  is_minified: false
}

var path = {
  frontend: 'src/',
  src_html: 'src/preprocessors/pug/',
  src_css: 'src/preprocessors/stylus/',
  src_js: 'src/preprocessors/js/',
  jsSrc: 'src/js/**/*.js',
  dist_html: './dist/',
  dist_css: './dist/css/',
  dist_js: './dist/js/',
  src_sprite: 'src/img/sprite/*.png',
  src_img: 'src/img/',
  dist_img: './dist/img/',
  js_hint: ['./dist/js/**/*.js', '!./dist/js/libs/**/*.js']
}

gulp.task('html', function () {
  gulp.src([
    path.src_html + '*.pug',
    path.src_html + '**/*.pug',
    '!' + path.src_html + '_**/*.pug',
    '!' + path.src_html + '/**/_**/*.pug',
    '!' + path.src_html + '/**/_*.pug'
  ]).pipe(plumberNotifier())
    .pipe(pug({
      pretty: !config.is_minified
    }))
    .pipe(gulp.dest(path.dist_html))
})

gulp.task('css', function () {
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
    .pipe(pleeease({ minifier: config.is_minified }))
    .pipe(gulp.dest(path.dist_css))
})

gulp.task('js', function (cb) {
  return gulp.src([
    path.src_js + '**/*.js',
    '!' + path.src_js + '_**/*.js',
    '!' + path.src_js + '**/_*.js'
  ])
    .pipe(plumberNotifier())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(eslint())
    // .pipe(eslint.format())
    .pipe(uglify({
      mangle: false,
      compress: {
        drop_console: false,
        drop_debugger: true
      },
      output: { beautify: !config.is_minified }
    }))
    .pipe(gulp.dest(path.dist_js))
})

gulp.task('sprite', function () {
  var spriteData = gulp.src(path.src_sprite).pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.styl',
    padding: 2,
    algorithm: 'binary-tree',
    imgPath: '../img/sprite.png'
  }))
  // Pipe image stream through image optimizer and onto disk
  spriteData.img.pipe(imagemin()).pipe(gulp.dest(path.dist_img))
  // spriteData.img.pipe(gulp.dest(path.src_img)); // No optimization
  spriteData.css.pipe(gulp.dest(path.src_css + '_mixins/'))
})

gulp.task('imagemin', function () {
  return gulp.src(path.src_img + '**/*.*')
    .pipe(changed(path.dist_img))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()]
    }))
    .on('data', function (file) {
      console.log('changed file : ', file.path)
    })
    .pipe(gulp.dest(path.dist_img))
})

gulp.task('fonts:compile', function (cb) {
  var dirList = []
  fs.readdirSync(path.frontend + 'fonts/').forEach(function (file) {
    if (/^[^_]*$/g.test(file)) {
      dirList.push(file)
    }
  })
  return gulp.src(path.frontend + '/fonts/_template/fonts.styl')
    .pipe(consolidate('lodash', { dirList: dirList }))
    .pipe(gulp.dest(path.src_css))
})

gulp.task('icons:compile', function (cb) {
  return gulp.src(path.frontend + '/icons/*.svg')
    .pipe(iconfont({
      normalize: true,
      fontName: 'iconFonts-webfont',
      appendUnicode: false
    }))
    .on('codepoints', function (codepoints, options) {
      gulp.src(path.frontend + '/icons/_template/icons.styl') // Template
        .pipe(consolidate('lodash', {
          glyphs: codepoints,
          fontName: 'iconFonts'
        }))
        .pipe(gulp.dest(path.src_css + '/_helpers'))
    })
    .pipe(gulp.dest(path.frontend + '/fonts/iconFonts'))
})

gulp.task('copy:fonts', function () {
  return gulp.src(
    path.frontend + 'fonts/**/*.*',
    { base: path.frontend })
    .pipe(gulp.dest(path.dist_html))
})

gulp.task('browserSync', function () {
  return browserSync({
    notify: true,
    server: {
      baseDir: [path.dist_html]
    }
  })
})

gulp.task('watch', function () {
  gulp.start('browserSync')
  gulp.watch([path.src_html + '**/*.pug'], ['html', browserSync.reload])
  gulp.watch([path.src_css + '**/*.styl'], ['css', browserSync.reload])
  gulp.watch([path.src_js + '**/*.js'], ['js', browserSync.reload])
})

gulp.task('fonts', function (cb) {
  runSequence('fonts:compile', 'css', 'copy:fonts', cb)
})

gulp.task('icons', function (cb) {
  runSequence('icons:compile', 'fonts:compile', 'css', 'copy:fonts', cb)
})

gulp.task('bower', function () {
  return bower()
})

gulp.task('default', function (cb) {
  runSequence('bower', 'html', 'js', 'css', 'sprite', 'imagemin', 'fonts', 'icons', cb)
})
