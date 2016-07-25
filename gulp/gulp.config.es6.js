'use strict';

const themePath = './wp-content/themes/faena/';

export function get( key ) {
    let paths = {
        proxy: 'http://com.faena',
        clean: [
            // 'node_modules',
            themePath + 'dist',
            themePath + 'style.css',
            themePath + 'js/scripts.js',
            themePath + 'js/bower_components'
        ],
        templates: {
            dest: themePath + 'dist',
            src: [
                themePath + 'app/templates/**/*.php',
                // '!' + themePath + 'app/templates/{header,footer}.php',
            ],
            watch: [
                themePath + 'setup/**/*.php',
                themePath + 'class/**/*.php',
                themePath + 'app/templates/**/*.php',
            ]
        },
        less: {
            src: [
                themePath + 'app/less/config/theme.less',
                themePath + 'app/less/config/reset.less',
                themePath + 'app/less/config/colorscheme.less',
                themePath + 'app/less/config/**/*.less',
                themePath + 'app/less/global/**/*.less',
                themePath + 'app/less/pages/**/*.less',
            ],
            dest: themePath,
            watch: themePath + '/style.css'
        },
        javascript: {
            src: [
                themePath + 'app/js/modules/**/*.config.js',
                themePath + 'app/js/modules/**/*.js',
                themePath + 'app/js/app.js',
            ],
            dest: themePath,
            watch: themePath + '/script.js'
        },
    };

    return paths[key];
}
