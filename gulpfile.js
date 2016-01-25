 //  Plugins
var gulp = require('gulp'),
    browserSync     = require('browser-sync'),
    compass         = require('gulp-compass'),
    plumber         = require('gulp-plumber'),
    autoprefixer    = require('gulp-autoprefixer'),
    cp              = require('child_process');

//  Messages
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

//  Jekyll Build
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll.bat', ['build'], {stdio: 'inherit'})
        .on('close', done);

});

//  Jekyll Rebuild & Reload
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

//  Jekyll Serve
gulp.task('browser-sync', ['compass', 'jekyll-build'], function() {
    browserSync.init({
        server: '_site',
        notify: false
    });
});

//  Compass
gulp.task('compass', function() {
    gulp.src('_sass/**/*.scss')
        .pipe(plumber())
        .pipe(compass({
            config_file:  'config.rb',
            css:          '_site/css',
            sass:         '_sass'
        }))
        .pipe(autoprefixer({
            browsers:  ['last 2 versions'],
            cascade:   false
        }))
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.reload({
            stream:true
        }))
        .pipe(gulp.dest('css'));
});

//  Watch
gulp.task('watch', function () {
    gulp.watch('_sass/**/*.scss', ['compass']);
    gulp.watch(['*.html', 'js/*.js', '_layouts/*.html', '_posts/*', '_includes/*.html'], ['jekyll-rebuild']);
});

//  Default
gulp.task('default', ['browser-sync', 'watch']);
