'use strict';
(function() {
	var util = require('gulp-util');
	var bs 	= require('browser-sync').create();
	var argv = require('yargs').argv;
	var gulp = require('gulp');
	var watch = require('gulp-watch');
	var plumber = require('gulp-plumber');
	var sourcemaps = require('gulp-sourcemaps');
	var sass = require('gulp-sass');
	var autoprefixer = require('gulp-autoprefixer');
	var concat = require('gulp-concat');
	var uglify = require('gulp-uglify');
	var file = require('gulp-file');

	function errorHandler(error) {
		util.beep();
		util.beep();
		util.beep();
		console.log(error.toString());
		return true;
	}

	var refreshFunction = function () {
		bs.reload();
		return;
	}

	var sassPublicFunction = function() {
		return gulp.src('./assets/_dev/public/styles/**/*')
		.pipe(plumber(errorHandler))
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'compressed',
			includePaths: [
			]
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(plumber.stop())
		.pipe(gulp.dest('./assets/'))
		.pipe(bs.stream({match: '**/*.css'}));
	};

	var jsPublicFunction = function() {
		return gulp.src([
				'./assets/_dev/public/scripts/**/*.js',
			])
			.pipe(plumber(errorHandler))
			.pipe(sourcemaps.init())
			.pipe(concat('script.js'))
			.pipe(uglify())
			.pipe(sourcemaps.write('./'))
			.pipe(plumber.stop())
			.pipe(gulp.dest('./assets/'))
			.pipe(bs.stream());
	};

	var sassAdminFunction = function() {
		return gulp.src('./assets/_dev/admin/styles/**/*')
		.pipe(plumber(errorHandler))
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'compressed',
			includePaths: [
			]
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(plumber.stop())
		.pipe(gulp.dest('./assets/'))
		.pipe(bs.stream({match: '**/*.css'}));
	};

	var jsAdminFunction = function() {
		return gulp.src([
			'./assets/_dev/admin/scripts/**/*.js',
		])
		.pipe(plumber(errorHandler))
		.pipe(sourcemaps.init())
		.pipe(concat('admin.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(plumber.stop())
		.pipe(gulp.dest('./assets/'))
		.pipe(bs.stream());
	};

	var ciNewModule = function() {
		if ( argv.name.length > 0 ) {
			var modulesPath = './application/modules/';
			var controllerFile = argv.name.charAt(0).toUpperCase() + argv.name.slice(1) + '.php';
			return gulp.src(modulesPath)
			.pipe(gulp.dest(modulesPath + argv.name))
			.pipe(gulp.dest(modulesPath + argv.name + '/models/'))
			.pipe(gulp.dest(modulesPath + argv.name + '/views/'))
			.pipe(file(controllerFile, ''))
			.pipe(gulp.dest(modulesPath + argv.name + '/controllers/'));
		} else {
			return;
		}
	};

	gulp.task('sass-public', sassPublicFunction);
	gulp.task('js-public', jsPublicFunction);
	gulp.task('sass-admin', sassAdminFunction);
	gulp.task('js-admin', jsAdminFunction);
	gulp.task('ci-new-module', ciNewModule);
	
	gulp.task(
		'default', 
		function() {
			bs.init({
				proxy: 'localhost/'
			});
			gulp.watch('./assets/_dev/public/styles/**/*', sassPublicFunction);
			gulp.watch('./assets/_dev/public/scripts/**/*.js', jsPublicFunction);
			gulp.watch('./assets/_dev/admin/styles/**/*', sassAdminFunction);
			gulp.watch('./assets/_dev/admin/scripts/**/*.js', jsAdminFunction);
			gulp.watch(['./application/*.php', './application/**/*.php'], refreshFunction);
		}
	);
})();