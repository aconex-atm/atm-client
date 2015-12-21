var gulp = require('gulp');
var del = require('del');

var packager = require('electron-packager');

gulp.task('clean', function () {
    return del.sync('dist', {force: true})
});

gulp.task('package', ['clean'], function(done) {
    packager({
        dir: '.',
        name: 'AconexToiletMonitor',
        version: '0.36.1',
        out: 'dist',
        all: true
    }, function done (err, appPath) {
        done();
    });
});

gulp.task('build', ['package']);