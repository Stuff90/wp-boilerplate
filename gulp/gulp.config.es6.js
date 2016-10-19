'use strict';

export function get( key , site ) {
    let siteSetup = {
        default: {
            proxy: 'http://<proxy>',
            theme: '<theme-name>',
        },
    }
    let themePath = './wp-content/themes/' + siteSetup[ site ].theme + '/';

    let paths = {
        proxy: siteSetup[ site ].proxy,
        clean: [
            themePath + 'dist',
            themePath + 'style.css',
            themePath + 'js/scripts.js',
            themePath + 'js/bower_components'
        ],
        templates: {
            dest: themePath + 'dist',
            src: [
                themePath + 'app/templates/**/*.php',
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
                themePath + 'app/less/config/icomoon.less',
                themePath + 'app/less/config/**/*.less',
                themePath + 'app/less/global/**/*.less',
                themePath + 'app/less/fragments/**/*.less',
                themePath + 'app/less/pages/**/*.less',
                themePath + 'app/less/**/*.less',
            ],
            dest: themePath,
            watch: themePath + '/style.css'
        },
        javascript: {
            src: [
                themePath + 'app/js/modules/**/*.config.js',
                themePath + 'app/js/modules/**/*.js',
                themePath + 'app/js/pages/**/*.js',
                themePath + 'app/js/app.js',
            ],
            dest: themePath,
            watch: themePath + '/script.js'
        },
        locales: {
            src: [
                themePath + 'app/js/bower_components/moment/locale/es.js',
                themePath + 'app/js/bower_components/moment/locale/pt.js'
            ]
        }
    };

    return paths[key];
}
