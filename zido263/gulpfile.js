const gulp = require('gulp');
const browserify = require('browserify');
const watchify = require('watchify');
const errorify = require('errorify');
const del = require('del');
const tsify = require('tsify');
const gulpTypings = require('gulp-typings');
const source = require('vinyl-source-stream');
const runSequence = require('run-sequence');
const uglify = require('gulp-uglify');
const pump = require('pump');
const rename = require('gulp-rename');

function createBrowserifier(entry) {
    return browserify({
        basedir: '.',
        debug: true,
        entries: [entry],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .plugin(watchify)
    .plugin(errorify);
}

function bundle(browserifier, bundleName, destination) {
    return browserifier
        .bundle()
        .pipe(source(bundleName))
        .pipe(gulp.dest(destination));
}

gulp.task('clean', () => {
    return del('./bundled/**/*')
});

gulp.task('installTypings', () => {
    return gulp.src('typings.json').pipe(gulpTypings());
});

gulp.task('tsc-browserify-src', () => {
    return bundle(
        createBrowserifier('./scripts/main.ts'),
        'bundle.js',
        'bundled');
});

gulp.task('deploy', (cb) => {
    bundle(
        createBrowserifier('./scripts/main.ts'),
        'bundle.js',
        'bundled');

    pump([
        gulp.src('./bundled/bundle.js'),
        uglify(),
        rename('bundle.min.js'),
        gulp.dest('./bundled')
    ], cb);
});

gulp.task('default', (done) => {
    runSequence(['clean', 'installTypings'], 'tsc-browserify-src', () => {
            console.log('Watching...')
            gulp.watch(['scripts/**/*.ts'], 
                       ['tsc-browserify-src']);		
    });
});