var gulp = require('gulp');
var del = require('del');

var packager = require('electron-packager');

gulp.task('clean', function () {
    return del.sync('dist', {force: true})
});

gulp.task('package-mac', ['clear'], function() {
    packager({
        dir: '.',
        name: 'AconexToiletMonitor',
        version: '0.36.1',
        out: 'dist',
        all: true
    }, function done (err, appPath) {
    });
});

gulp.task('build', ['package-mac']);