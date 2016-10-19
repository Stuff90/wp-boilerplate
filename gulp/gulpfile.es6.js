'use strict';

import { get }  from './gulp/gulp.config';


import del               from 'del';
import gulp              from 'gulp';
import argv              from 'yargs';
import colors            from 'colors';
import cssnano           from 'cssnano';
import less              from 'gulp-less';
import gulpPrint         from 'gulp-print';
import uglify            from 'gulp-uglify';
import filter            from 'gulp-filter';
import concat            from 'gulp-concat';
import postcss           from 'gulp-postcss';
import browserSync       from 'browser-sync';
import autoprefixer      from 'autoprefixer';
import gulpSequence      from 'gulp-sequence';
import postcssPxtorem    from 'postcss-pxtorem';
import sourcemaps        from 'gulp-sourcemaps';
import mainBower         from 'main-bower-files';
import groupMediaQueries from 'less-plugin-group-css-media-queries';

// import tslint      from 'gulp-tslint';
// import typscript   from 'gulp-typescript';

const theBrowserSync = browserSync.create();


/*===============================
=            Default            =
===============================*/


gulp.task('browser' , gulpSequence( 'browser-sync:init' , 'watch' ));
gulp.task('default' , gulpSequence( 'php' , [ 'js:vendors' , 'js:dev'  , 'less:dev' ] , 'browser' ));
gulp.task('qa'      , gulpSequence( 'php' , [ 'js:vendors' , 'js:dev'  , 'less:dev' ] ));
gulp.task('prod'    , gulpSequence( 'php' , [ 'js:vendors' , 'js:dist' , 'less:dist' ] ));


/*=============================
=            Build            =
=============================*/

gulp.task('build' , [] , () => {

});



/*=============================
=            Watch            =
=============================*/

gulp.task('browser-sync:init' , () => {
    theBrowserSync.init({
        proxy: get('proxy', getSiteName())
    });
});

gulp.task('watch:js'   , [ 'js:dev' ]);
gulp.task('watch:less' , [ 'less:dev' ]);
gulp.task('watch:ts'   , [ 'typescript:dev' ] , theBrowserSync.reload );

gulp.task('watch' , () => {
    gulp.watch( get( 'javascript' , getSiteName()).src , ['js:dev']);
    gulp.watch( get( 'less' , getSiteName()).src       , ['less:dev']);
    gulp.watch( get( 'templates' , getSiteName()).src  , ['php']);

    gulp.watch( get( 'less' , getSiteName()).watch       , () =>  {
        theBrowserSync.reload({ stream: true });
    });
    gulp.watch( get( 'templates' , getSiteName()).watch  , theBrowserSync.reload );
    gulp.watch( get( 'javascript' , getSiteName()).watch , theBrowserSync.reload );
});


/*===========================
=            CSS            =
===========================*/

let transpileLess = ( env ) => {
    let postCssConfig = [
        postcssPxtorem({
            replace:false,
            propWhiteList: []
        }),
        autoprefixer()
    ]

    return gulp.src( get('less', getSiteName()).src )
        .pipe(gulpPrint(log()))
        .pipe(sourcemaps.init())
        .pipe(concat( 'style.less' ))
        .pipe(gulpPrint(log( 'Concatenate into style.less'.underline.green.bold )))
        .pipe(gulpPrint(log( 'Transpile LESS to CSS'.underline.green.bold )))
        .pipe(less({
            plugins: [ groupMediaQueries ]
        }).on('error', ( e , r, t ) => {
            console.info('error',  e , r , t);
        }))
        .pipe(gulpPrint(log( 'Run PostCss tasks'.underline.green.bold )))
        .pipe(postcss( postCssConfig.concat( env === 'dev' ? [] : cssnano())))
        .pipe( env === 'dev' ? sourcemaps.write() : gulpPrint(log( 'CSS has been minified'.underline.green.bold )))
        .pipe(gulp.dest( get('less', getSiteName()).dest ));
}


gulp.task('less:dev' , () => {
    console.info('\n' + 'Start gathering LESS files :\n'.underline.green.bold);
    return transpileLess( 'dev' )
        .pipe( theBrowserSync.reload({ stream: true}));
})


gulp.task('less:dist' , () => {
    console.info('\n' + 'Start gathering LESS files :\n'.underline.green.bold);
    return transpileLess( 'dist' );
})



/*==================================
=            Javascript            =
==================================*/

gulp.task('js:dev' , () => {
    console.info('\n' + 'Start gathering JS files :\n'.underline.green.bold);
    return gulp.src(get( 'javascript' , getSiteName()).src)
        .pipe(gulpPrint(log()))
        .pipe(concat( 'script.js' ))
        .pipe(gulpPrint(log( 'Concatenate into script.js'.underline.green.bold )))
        .pipe(gulpPrint(log( 'Saving'.underline.green.bold )))
        .pipe(gulp.dest( get('javascript', getSiteName()).dest ));
});

gulp.task('js:dist' , () => {
    console.info('\n' + 'Start gathering JS files :\n'.underline.green.bold);
    return gulp.src(get( 'javascript' , getSiteName()).src)
        .pipe(gulpPrint(log()))
        .pipe(concat( 'script.js' ))
        .pipe(gulpPrint(log( 'Concatenate into script.js'.underline.green.bold )))
        .pipe(uglify({
            mangle: true
        }))
        .pipe(gulpPrint(log( 'Uglifing & save'.underline.green.bold )))
        .pipe(gulp.dest( get('javascript', getSiteName()).dest ));
});


/*==================================
=            Typescript            =
==================================*/

let transpileTypescript = function() {
    console.info('\n' + 'Start transpiling of all TS files :\n'.underline.green.bold);
    return gulp.src(get( 'typescript' , getSiteName()).src)
        .pipe(gulpPrint(log()))
        .pipe(tslint({
            configuration: "tslint.json"
        }))
        .pipe(tslint.report('prose', {
          emitError: false
        }))
        .pipe(sourcemaps.init())
        .pipe(typscript({
            target: 'es5',
            noImplicitAny: false,
        }));
}

gulp.task('typescript:dev' , () => {
    return transpileTypescript().js
        .pipe(concat(get( 'typescript' , getSiteName()).dest))
        .pipe(sourcemaps.write())
        .pipe(gulpPrint(log( 'Generate sourcemaps & save'.underline.green.bold )))
        .pipe(gulp.dest('./'));
});

gulp.task('typescript:dist' , () => {
    return transpileTypescript().js
        .pipe(concat(get( 'typescript' , getSiteName()).dest))
        .pipe(uglify())
        .pipe(gulpPrint(log( 'Uglifing & save'.underline.green.bold )))
        .pipe(gulp.dest('./'));
});


/*==================================
=            Vendors JS            =
==================================*/

gulp.task('js:vendors' , () => {
    var bowerFiles = mainBower();
    var files = bowerFiles.concat(get('locales', getSiteName()).src);

    console.info('\n' + 'Retrieving bower main files :\n'.underline.green.bold);
    return gulp.src(files)
            .pipe(filter('**/*.js'))
            .pipe(gulpPrint(log()))
            .pipe(concat( 'vendors.js' ))
            .pipe(gulpPrint(log( 'Concatenate into vendors.js'.underline.green.bold )))
            .pipe(uglify())
            .pipe(gulpPrint(log( 'Uglifing & save'.underline.green.bold )))
            .pipe(gulp.dest( get('javascript', getSiteName()).dest ));
});


/*===========================
=            PHP            =
===========================*/

gulp.task('php' , () => {
    console.info('\n' + 'Gather php templates:\n'.underline.green.bold );
    return gulp.src( get( 'templates' , getSiteName()).src )
        .pipe(gulpPrint(log()))
        .pipe(gulp.dest( get('templates', getSiteName()).dest ));
});


/*=============================
=            Clean            =
=============================*/

gulp.task('clean' , () => {
    let theSrc = get( 'clean' , getSiteName());

    return del( theSrc ).then(() => {
        console.info('');
        for ( let i = 0; i < theSrc.length; i++ ) {
            console.info('Deleted :'.underline.red , theSrc[i].yellow );
        };
        console.info('');
    });
});




/*=============================
=            Utils            =
=============================*/


function log( msg ) {
    return (  filePath  ) => {
        console.info( msg ? '\n' + msg + '\n' : ' - ' + filePath.italic );
    }
}

function getSiteName() {
    let siteIndex = process.argv.indexOf('--site');
    if (siteIndex >= 0 && process.argv[ siteIndex + 1 ]) {
        return process.argv[ siteIndex + 1 ]
    }
    return 'default';
}


