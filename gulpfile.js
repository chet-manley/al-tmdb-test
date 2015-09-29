var gulp     = require('gulp');
var concat   = require('gulp-concat');
var download = require('gulp-download');
var uglify   = require('gulp-uglify');

//Convenience command
//throws libs from bower_components folder and overwrites old stuff
//note: its probably best to branch before overwrite to prevent introducing breaking changes
gulp.task('libs', function(){
	//I could build this from bower_components i think, or just download the latest like a lazy person :P
	download('http://flightjs.github.io/release/latest/flight.min.js').pipe(gulp.dest('js/lib/'));

	//AMD
	gulp.src('bower_components/requirejs/require.js').pipe(gulp.dest('js/lib/'));
	
	//Thine Bread and Butter
	gulp.src('bower_components/jquery/dist/jquery.min.js').pipe(gulp.dest('js/lib/'));
	gulp.src('bower_components/jquery/dist/jquery.min.map').pipe(gulp.dest('js/lib/'));

	//Template Engine
	gulp.src('bower_components/transparency/dist/transparency.min.js').pipe(gulp.dest('js/lib/'));
});