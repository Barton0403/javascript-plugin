module.exports = (grunt) => {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		babel: {
			options: {
				sourceMap: true,
				presets: [
					['es2015', {
						loose: true, // 兼容IE8
						module: false
					}]
				],
				plugins: [
					'transform-es2015-modules-strip'
				]
			},
			dist: {
				files: {
					'dist/js/banner.js': 'js/banner.js',
					'dist/js/loader.js': 'js/loader.js',
					'dist/js/form.js': 'js/form.js',
					'dist/js/form.cache.js': 'js/form.cache.js',
					'dist/js/form.check.js': 'js/form.check.js',
					'dist/js/form.date.js': 'js/form.date.js',
					'dist/js/speed.js': 'js/speed.js'
				}
			}
		},
		sass: {
			options: {
				sourceMap: true
			},
			dist: {
				files: {
					'dist/css/barton.css': 'scss/barton.scss',
					'dist/css/barton-plugin.css': 'scss/barton-plugin.scss'
				}
			}
		},
		watch: {
			es6: {
				files: 'js/*.js',
				tasks: ['js']
			},
			sass: {
				files: 'scss/*.scss',
				tasks: ['css']
			}
		},
		postcss: {
			options: {
				processors: [
					require('autoprefixer')({
						browsers: ['last 4 versions']
					}), // add vendor prefixes
					require('cssnano')({
						banner: '/**************************************************************\n' +
							'* BartonCSS v<%= pkg.version %>\n' +
							'*\n' +
							'* 作者：李成浩\n' +
							'* 邮箱：lichenghao0403@gmail.com\n' +
							'*\n' +
							'* 更新日期：' + (new Date()).toLocaleString() + '\n' +
							'***************************************************************/\n'
					}) // minify the result
				],
				map: true,
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'dist/css/',
					src: '*.css',
					dest: 'dist/css/',
					ext: '.min.css',
					extDot: 'last'
				}]
			}
		},
		uglify: {
			options: {
				banner: '/**************************************************************\n' +
					'* BartonJS v<%= pkg.version %>\n' +
					'*\n' +
					'* 作者：李成浩\n' +
					'* 邮箱：lichenghao0403@gmail.com\n' +
					'*\n' +
					'* 更新日期：' + (new Date()).toLocaleString() + '\n' +
					'***************************************************************/\n',
				screwIE8: false, // for IE6-8,
				sourceMap: true
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'dist/js',
					src: '*.js',
					dest: 'dist/js/',
					ext: '.min.js',
					extDot: 'last'
				}]
			}
		},
		clean: {
			css: ['dist/css'],
			js: ['dist/js']
		},
		concat: {
			js: {
				options: {
					banner: '/**************************************************************\n' +
						'* BartonJS v<%= pkg.version %>\n' +
						'*\n' +
						'* 作者：李成浩\n' +
						'* 邮箱：lichenghao0403@gmail.com\n' +
						'*\n' +
						'* 更新日期：' + (new Date()).toLocaleString() + '\n' +
						'***************************************************************/\n',
					sourceMap: true
				},
				files: {
					'dist/js/barton-plugin.js': [
						'dist/js/banner.js',
						'dist/js/form.js',
						'dist/js/form.cache.js',
						'dist/js/form.check.js',
						'dist/js/form.date.js',
						'dist/js/loader.js'
					],
				}
			},
			css: {
				options: {
					banner: '/**************************************************************\n' +
						'* BartonCSS v<%= pkg.version %>\n' +
						'*\n' +
						'* 作者：李成浩\n' +
						'* 邮箱：lichenghao0403@gmail.com\n' +
						'*\n' +
						'* 更新日期：' + (new Date()).toLocaleString() + '\n' +
						'***************************************************************/\n',
				},
				files: {
					'dist/css/barton-plugin.min.css': [
						'dist/css/barton-plugin.min.css'
					],
					'dist/css/barton.min.css': [
						'dist/css/barton.min.css'
					]
				}
			}
		},
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', ['clean', 'babel', 'concat:js', 'uglify', 'sass', 'postcss', 'concat:css', 'watch']);
	grunt.registerTask('css', ['clean:css', 'sass', 'postcss', 'concat:css', 'watch:sass']);
	grunt.registerTask('js', ['clean:js', 'babel', 'concat:js', 'uglify', 'watch:es6']);
};
