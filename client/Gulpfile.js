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
		port: 3000,    
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
	var sources = gulp.src(['./app/scripts/**/*.js','./app/stylesheets/**/*.css']);  
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

gulp.task('default', ['server','inject','wiredep', 'watch']);