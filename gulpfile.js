var del     = require('del'),
gulp        = require('gulp'),
fs          = require('vinyl-fs'),
clc         = require('cli-color'),
less        = require('gulp-less'),
watch       = require('gulp-watch'),
print       = require('gulp-print'),
concat      = require('gulp-concat'),
gulpFilter  = require('gulp-filter'),
uglify      = require('gulp-uglify'),
inject      = require('gulp-inject'),
plumber     = require('gulp-plumber'),
addsrc      = require('gulp-add-src'),
sourcemaps  = require('gulp-sourcemaps'),
minifyCss   = require('gulp-minify-css'),
minifyHTML  = require('gulp-minify-html'),
bowerMain   = require('main-bower-files'),
browserSync = require('browser-sync').create();


var themeName = 'theme',
themePath     = './wp-content/themes/' + themeName,
themeAppPath  = './wp-content/themes/' + themeName + '/app',
themeDistPath = './wp-content/themes/' + themeName + '/dist';

var warn = clc.yellow.bold,
notice   = clc.blue.bold,
error    = clc.red.bold;




// gulp.task('minify', function () {

//     gulp.src( themeAppPath + '/templates/index.php')
//     .pipe(minifyHTML({
//         conditionals: true,
//         spare:true,
//         empty:true,
//     }))
//     .pipe(gulp.dest(themeDistPath));

//     gulp.src( themeAppPath + '/templates/**/*.php')
//     .pipe(minifyHTML({
//         conditionals: true,
//         spare:true,
//         empty:true,
//     }))
//     .pipe(gulp.dest(themeDistPath));
// });


// gulp.task('bower', function () {

//   gulp.src( themeAppPath + '/templates/{header,footer}.php')
//     .pipe(wiredep({
//       optional: 'configuration',
//       goes: 'here'
//     }))
//     .pipe(gulp.dest(themeDistPath));
// });







gulp.task('less', function () {
    var lessFilePaths = [
        themePath    + '/bower_components/remixings/remixins.less',
        themeAppPath + '/less/{conf,pages,fragments}/*.less',
    ];

    return gulp.src(lessFilePaths)
        .pipe(plumber())
        .pipe(print( filePath => {
            console.info(notice('LESS File added:'), filePath);
        }))
        .pipe(concat('style.less'))
        .pipe(less())
        .pipe(sourcemaps.init())
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest( themeDistPath ));
});





gulp.task('php:footer-header', function () {

    var paths = fs.src([
        themePath + '/style.css',
        themePath + '/main.js',
    ]);

    return gulp.src( themeAppPath + '/templates/{header,footer}.php')
         .pipe(plumber())
         .pipe(inject( paths , { read: false }))
         .pipe(gulp.dest(themeDistPath));
});


gulp.task('php:build', ['php:footer-header'] , function () {

         var minifyHTMLOptions = {
             conditionals: true,
             spare:true,
             empty:true,
         }

         return gulp.src([ themeAppPath + '/templates/**/*.php' , '!' + themeAppPath + '/templates/{header,footer}.php' ])
             .pipe(plumber())
             .pipe(print())
             .pipe(minifyHTML(minifyHTMLOptions))
             .pipe(gulp.dest(themeDistPath));

 });







// gulp.task('browser-sync', function() {
//     browserSync.init({
//         proxy: "http://com.gulp"
//     });
// });









/**
 *
 * CLEANUP
 *
 */



gulp.task('clean', function () {

    var cleanablePaths = [
        themeDistPath,
        themePath + '/main.js',
        themePath + '/style.css',
    ];

    del(cleanablePaths).then( paths => {
        for (var i = 0; i < paths.length; i++) {
            console.info(warn('Deleted:'), paths[i]);
        };
    });
});


/**
 *
 * WATCH
 *
 */


var BSReload = () => {browserSync.reload();}

gulp.task('watch:js', ['concat:js'], BSReload);
gulp.task('watch:less', ['style:dev'], BSReload);
gulp.task('watch:php', ['php:build'], BSReload);

/**
 *
 * DEV
 *
 */



gulp.task('style:dev' , ['less'] , function () {
    return gulp.src([
            themeAppPath + '/theme.info',
            themeDistPath + '/style.css',
        ])
        .pipe(plumber())
        .pipe(concat('style.css'))
        .pipe(gulp.dest( themePath ));
});






gulp.task('concat:js' , () => {

    var jsFilter = gulpFilter('*.js', {restore: true});

    return gulp.src([
            themeAppPath + '/js/main.js',
            themeAppPath + '/js/plugins/*.js',
        ])
        .pipe(addsrc.prepend(bowerMain()))
        .pipe( jsFilter )
        .pipe(print( filePath => {
            console.info(notice('JS File added:'), filePath);
        }))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(themePath));
});




 gulp.task('serve' , [ 'concat:js' , 'style:dev' , 'php:build' ] , () => {

    browserSync.init({
        proxy: "http://com.gulp"
    });


    gulp.watch( themeAppPath + '/js/**', ['watch:js']);
    gulp.watch( themeAppPath + '/less/**', ['watch:less']);
    gulp.watch( themeAppPath + '/templates/**', ['watch:php']);

    console.info(notice('Gulp now watching'));


         // var minifyHTMLOptions = {
         //     conditionals: true,
         //     spare:true,
         //     empty:true,
         // }


        // var paths = fs.src([
        //     themePath + '/style.css',
        //     themePath + '/main.js',
        // ]);

         // gulp.src( themeAppPath + '/templates/{header,footer}.php')
         //     .pipe(plumber())
         //     .pipe(inject( paths , { read: false }))
         //     .pipe(gulp.dest(themeDistPath));

         // gulp.src([ themeAppPath + '/templates/**/*.php' , '!' + themeAppPath + '/templates/{header,footer}.php' ])
         //     .pipe(plumber())
         //     .pipe(gulp.dest(themeDistPath));

 });





/**
 *
 * BUILD
 *
 */






gulp.task('js:dist' , function () {

    return gulp.src([
        themeDistPath + '/vendor.js',
        themeAppPath + '/js/main.js',
        themeAppPath + '/js/**/*.js',
    ])
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest( themePath ));
});





 gulp.task('style:dist' , ['concat:vendor' , 'less'] , function () {
     return gulp.src([
         themeAppPath + '/theme.info',
         themeDistPath + '/vendor.css',
         themeDistPath + '/style.css',
     ])
     .pipe(plumber())
     .pipe(minifyCss())
     .pipe(concat('style.css'))
     .pipe(gulp.dest( themePath ));
 });





 gulp.task('concat:vendor' , function () {

     var jsFilter = gulpFilter('*.js', {restore: true}),
     cssFilter    = gulpFilter('*.css', {restore: true});

     return gulp.src(bowerMain())
         .pipe( jsFilter )
         .pipe(concat('vendor.js'))
         .pipe(gulp.dest(themeDistPath))
         .pipe( jsFilter.restore)
         .pipe(cssFilter)
         .pipe(concat('vendor.css'))
         .pipe(gulp.dest(themeDistPath))
 });





 gulp.task('build' , [ 'clean' , 'style:dist' , 'js:dist' ] , function () {

         var minifyHTMLOptions = {
             conditionals: true,
             spare:true,
             empty:true,
         }


        var paths = fs.src([
            themePath + '/style.css',
            themePath + '/main.js',
        ]);

         gulp.src( themeAppPath + '/templates/{header,footer}.php')
             .pipe(plumber())
             .pipe(inject( paths , { read: false }))
             .pipe(gulp.dest(themeDistPath));

         gulp.src([ themeAppPath + '/templates/**/*.php' , '!' + themeAppPath + '/templates/{header,footer}.php' ])
             .pipe(plumber())
             .pipe(print())
             .pipe(minifyHTML(minifyHTMLOptions))
             .pipe(gulp.dest(themeDistPath));

 });

