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
                    'dist/js/loader.js': 'js/loader.js',
                    'dist/js/form.cache.js': 'js/form.cache.js',
                    'dist/js/form.check.js': 'js/form.check.js'
                }
            }
        },
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/css/index.css': 'scss/index.scss',
                    'dist/css/form.css': 'scss/form.scss'
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

    grunt.registerTask('default', ['babel', 'sass', 'watch']);
};
