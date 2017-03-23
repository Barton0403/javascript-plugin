module.exports = (grunt) => {
    grunt.initConfig({
        babel: {
            options: {
                sourceMap: true,
                presets: [
                  ['es2015', {
                    loose: true // 兼容IE8
                  }]
                ]
            },
            dist: {
                files: {
                    'dist/js/banner.js': 'js/banner.js',
                    'dist/js/loader.js': 'js/loader.js'
                }
            }
        },
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/css/index.css': 'scss/index.scss'
                }
            }
        },
        watch: {
            es6: {
                files: 'js/*.js',
                tasks: ['babel']
            },
            sass: {
                files: 'scss/*.scss',
                tasks: ['sass']
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['watch']);
};
