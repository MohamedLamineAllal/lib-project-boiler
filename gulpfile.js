const {
    series,
    parallel,
    src,
    dest,
    watch
} = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const fs = require('fs');
const colors = require('colors');
const cleanCss = require('gulp-clean-css');
const gulpSass = require('gulp-sass');
gulpSass.compiler = require('node-sass');
const strip = require('gulp-strip-comments');
const prettify = require('gulp-jsbeautifier');

const PATH = require('path');
// const sourcemaps = require('gulp-sourcemaps');

function jsminify(done, source) {
    console.log('js minify task start'.yellow);
    if (!source) {
        source = 'src/**/*.js';
    }

    return src(source)
        //.pipe(babel())   
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest('dist/js/')).on('end', function () {
            console.log('js minify task end'.yellow);
            done();
        });
}

function jsCopy(done, source) {
    console.log('js copy task start'.yellow);
    if (!source) {
        source = 'src/**/*.js';
    }

    return src(source)
        .pipe(strip({trim: true}))
        .pipe(dest('dist/js'))
        .on('end', function () {
            console.log('js copy task end'.yellow);
            done();
        });;
}

function css(done, source) {
    if (!source) {
        source = 'src/style/**/*.css';
    }
    Promise.all([
            new Promise(function (resolve, reject) {
                src(source)
                    // .pipe(sourcemaps.init())
                    .pipe(cleanCss({
                        compatibility: 'ie8'
                    }))
                    // .pipe(sourcemaps.write())
                    .pipe(rename({
                        extname: '.min.css'
                    }))
                    .pipe(dest('dist/css')).on('end', function () {
                        console.log('css minify task end'.yellow);
                        src
                        resolve();
                    });
            }),
            new Promise(function (resolve, reject) {
                src(source)
                    .pipe(strip.text({trim: true}))
                    .pipe(dest('dist/css/').on('end', function () {
                        console.log('css copy task end'.yellow);
                        resolve();
                    }))
            })
        ])
        .then(function () {
            done();
        })
        .catch(function (err) {
            console.error(err.red);
        });
}

function sass(done, source) {
    if (!source) {
        source = 'src/style/**/*.{scss,sass}';
    }


    Promise.all([
            new Promise(function (resolve, reject) {
                src(source)
                    .pipe(gulpSass().on('error', gulpSass.logError))
                    // .pipe(sourcemaps.init())
                    .pipe(cleanCss({
                        compatibility: 'ie8'
                    }))
                    // .pipe(sourcemaps.write())
                    .pipe(rename({
                        extname: '.min.css'
                    }))
                    .pipe(dest('dist/css')).on('end', function () {
                        console.log('sass compile and optimisation task end'.yellow);
                        resolve();
                    });
            }),
            new Promise(function (resolve, reject) {
                src(source)
                    .pipe(gulpSass().on('error', gulpSass.logError))
                    .pipe(strip.text({trim: true}))
                    .pipe(prettify())
                    .pipe(dest('dist/css')).on('end', function () {
                        console.log('sass compile task end'.yellow);
                        resolve();
                    });
            })
        ])
        .then(function () {
            done();
        })
        .catch(function (err) {
            console.error(err.red);
        });
}


function style() {
    return parallel(css, sass);
}


const data = {
    jsminify: {
        src: null
    },
    jsCopy: {
        src: null
    },
    css: {
        src: null
    },
    sass: {
        src: null
    }
}

const delayed = {
    jsminify: delay(jsminify, 2000).bind(data.jsminify),
    jsCopy: delay(jsCopy, 2000).bind(data.jsCopy),
    css: delay(css, 2000).bind(data.css),
    sass: delay(sass, 2000).bind(data.sass)
}

const srcOnChange = function (path) {
    console.log((path + ' is changed').gray);
    let ext = PATH.extname(path);
    console.log('ext = ' + ext);
    switch (ext) {
        case '.js':
            data.jsminify.src = path;
            data.jsCopy.src = path;
            parallel(delayed.jsminify, delayed.jsCopy)();
            break;
        case '.sass':
        case '.scss':
            data.sass.src = path;
            series(delayed.sass)();
            break;
        case '.css':
            data.css.src = path;
            series(delayed.css)();
            break;
        default:
    }
};

const srcOnAdd = function (path) {
    if (fs.readFileSync(path).length > 0) {
        srcOnChange(path);
    } else {
        // console.log('new empty created file'.gray);
    }
};

function watchTask() {
    watch('src/**/*.{js,css,scss,sass}')
        .on('change', srcOnChange)
        .on('add', srcOnAdd); // when a changment happen to one of the files, this will be triggered, but, this get executed after 2000 ms , and only if not other triggering happen, otherwise counting start all over
}


exports.default = series(watchTask);

exports.jsminify = jsminify;
exports.jsCopy = jsCopy;
exports.css = css;
exports.sass = sass;
exports.style = style;

function delay(cb, ms) {
    let timer = null;

    return function (done) {
        clearTimeout(timer);
        setTimeout(cb.bind(null, done, this.src), ms);
    }
}