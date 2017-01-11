var gulp      = require('gulp'),
    connect   = require('gulp-connect'),
    stylus    = require('gulp-stylus'),
    nib       = require('nib'),
    jshint    = require('gulp-jshint'),
    stylish   = require('jshint-stylish'),
    inject    = require('gulp-inject'),
    wiredep   = require('wiredep').stream,
    gulpif    = require('gulp-if'),
    minifyCss = require('gulp-minify-css'),
    useref    = require('gulp-useref'),
    uglify    = require('gulp-uglify'),
    watch 	  = require('gulp-watch'),
    historyApiFallback = require('connect-history-api-fallback');


// Servidor web de desarrollo 
gulp.task('server', function() {  
	connect.server({    
		root: './app',    
		hostname: '0.0.0.0',    
		port: 4000,    
		livereload: true,    
		middleware: function(connect, opt) {      
			return [ historyApiFallback ];    
		}  
	}); 
});

gulp.task('server-produccion', function() {  
	connect.server({    
		root: './dist',    
		hostname: '0.0.0.0',    
		port: 4000,    
		livereload: true,    
		middleware: function(connect, opt) {      
			return [ historyApiFallback ];    
		}  
	}); 
});


// Busca errores en el JS y nos los muestra en el terminal 
gulp.task('jshint', function() {  
	return gulp.src('./app/scripts/**/*.js')    
	.pipe(jshint('.jshintrc'))    
	.pipe(jshint.reporter('jshint-stylish'))    
	.pipe(jshint.reporter('fail')); 
});

// Recarga el navegador cuando hay cambios en el HTML 
gulp.task('html', function() {  
	gulp.src('./app/**/*.html')    
	.pipe(connect.reload()); 
});

// Busca en las carpetas de estilos y javascript los archiv os que hayamos creado // para inyectarlos en el index.html 
gulp.task('inject', function() {  
	var sources = gulp.src(['./app/scripts/**/*.js', './app/stylesheets/**/*.css']);  
	return gulp.src('index.html', {cwd: './app'})    
	.pipe(inject(sources, {      
		read: false,      
		ignorePath: '/app/'    
	}))    
	.pipe(gulp.dest('./app')); 
}); 

// Inyecta las librerias que instalemos vía Bower 
gulp.task('wiredep', function () {  
	gulp.src('./app/index.html')    
	.pipe(wiredep({ directory: './app/lib'}))   
	.pipe(gulp.dest('./app')); 
});

gulp.task('watch', function() { 
	gulp.watch(['./app/**/*.html'], ['html']);  
	gulp.watch(['./app/stylesheets/**/*.styl'], ['css','inject']);  
	gulp.watch(['./app/scripts/**/*.js', './Gulpfile.js'], ['jshint','inject']);  
	gulp.watch(['./bower.json'],['wiredep']); 
	watch('./app').pipe(connect.reload());
});



gulp.task('compress', function() {  
	gulp.src('./app/index.html')    
	.pipe(useref.assets())    
	.pipe(gulpif('*.css', minifyCss()))    
	.pipe(gulpif('*.js', uglify({mangle: false })))    
	.pipe(gulp.dest('./dist'));  
});

gulp.task('copy', function() {  
	gulp.src('./app/index.html')    
	.pipe(useref())    
	.pipe(gulp.dest('./dist'));   
	gulp.src('./app/views/*.html')        
	.pipe(gulp.dest('./dist/views')); 
	gulp.src('./app/img/**')        
	.pipe(gulp.dest('./dist/img'));
});


gulp.task('generate-service-worker', function(callback) {
  var fs = require('fs');
  var path = require('path');
  var swPrecache = require('sw-precache');
  var rootDir = './dist';
 
  swPrecache.write(path.join(rootDir, 'service-worker.js'), {
    staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}'],
    stripPrefix: rootDir
  }, callback);
});

gulp.task('produccion', ['compress','copy','generate-service-worker']);

gulp.task('default', ['server','inject','wiredep', 'watch']);