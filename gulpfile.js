
let build_params = {
	source: false,
	url: "http://shooternew.own",
	dev: true,
}


var gulp = require('gulp'),
sass 	 = require('gulp-sass'),
minCss 	 = require('gulp-csso'),
imageMin = require('gulp-imagemin');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var babel = require('gulp-babel');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var browserify = require("browserify");
var babelify = require("babelify");
var gutil = require('gulp-util');
var concat = require('gulp-concat');

var del = require('del') 

gulp.task('clear', function(){
	del.sync('build');
});

gulp.task('js', function(){
	// gulp.src('app/js/main.js')
	//     .pipe(babel({
 //            presets: ['env']
 //        }))
	// 	.pipe( gulp.dest('build/js') )
	browserify({ debug: true })
		.transform(babelify)
		.require("./app/js/main.js", { entry: true })
		.bundle()
		.on('error',gutil.log)
		.pipe(source('bundle.js'))
    	.pipe(gulp.dest('./build/js'))
    	.pipe( browserSync.reload({stream: true}) );
});


gulp.task('css', function(){
	return gulp.src('app/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe( sass({
				includePaths: ['./node_modules'],
			}) ).on('error', function(err) {
            const type = err.type || '';
            const message = err.message || '';
            const extract = err.extract || [];
            const line = err.line || '';
            const column = err.column || '';
            gutil.log(gutil.colors.red.bold('[Less error]') +' '+ gutil.colors.bgRed(type) +' ('+ line +':'+ column +')');
            gutil.log(gutil.colors.bold('message:') +' '+ message);
            gutil.log(gutil.colors.bold('codeframe:') +'\n'+ extract.join('\n'));
            this.emit('end');
        })
		.pipe( minCss() )
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
		
	    .pipe( concat('css.css') )
	    .pipe( sourcemaps.write() )
		.pipe( gulp.dest('build/css') )
		.pipe( browserSync.reload({stream: true}) );



	// gulp.src('app/scss/_loader.css')
	// 	.pipe( gulp.dest('build/css') )
	// 	.pipe( browserSync.reload({stream: true}) );
});



gulp.task('image', function(){
	build_params.dev === true
	? gulp.src(['app/images/**/*' , '!app/images/video'])
		.pipe( gulp.dest('build/images') )
		.pipe( browserSync.reload({stream: true}) )
	: gulp.src(['app/images/**/*' , '!app/images/video'])
		.imageMin()
		.pipe( gulp.dest('build/images') )
		.pipe( browserSync.reload({stream: true}) );
});


gulp.task('php_html', function(){
	gulp.src('app/*.php')
		.pipe( gulp.dest('build/') )
		.pipe( browserSync.reload({stream: true}) );

	gulp.src('app/*.html')
		.pipe( gulp.dest('build/') )
		.pipe( browserSync.reload({stream: true}) );
});

gulp.task('sounds', function(){
	gulp.src('app/sounds/**/*')
		.pipe( gulp.dest('build/sounds') )
		.pipe( browserSync.reload({stream: true}) );
});


gulp.task('serv_init',['clear', 'php_html', 'css', 'image' ,'js', 'sounds'], function(){
    browserSync.init({
		proxy: build_params.url
    });

	gulp.watch( 'app/sounds/**/*', ['sounds'] );
	gulp.watch( 'app/scss/**/*',   ['css'] );
	gulp.watch( ['app/images/**/*.png', 'app/images/**/*.jpg', 'app/images/**/*.jpeg'], ['image'] );
	gulp.watch( 'app/js/**/*',		['js'] );
	gulp.watch( 'app/*.php',	['php_html'] );
	gulp.watch( 'app/*.html',	['php_html'] );


});

gulp.task('default', ['serv_init']);

