module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nw-builder');
	grunt.loadNpmTasks('grunt-phonegap-build');
	grunt.loadNpmTasks('grunt-csv2json');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-env');

	// Project configuration.
	grunt.initConfig({
		clean: ['./dist', './build'],
		env: {
			options: {

			},
			prod: {
				NODE_ENV: 'production'
			},
			dev: {
				NODE_ENV: 'development'
			}
		},
		csv2json: {
			options: {
				inputFilePath: './src/main/csv',
				outputFilePath: './src/main/js/data'
			}
		},
		sass: {
			main: {
				files: {
					'./src/main/built-css/style.css': './src/main/css/main.scss'
				}
			}
		},
		browserify: {
			main: {
				options: {
					transform: [
						['babelify', { presets: ['es2015', 'react'] }]
					]
				},
				src: ['./src/main/js/main.js'],
				dest: './src/main/built-js/main.js',
			}
		},
		copy: {
			steam: {
				cwd: './src/main',
				expand: true,
				src: '**',
				dest: './temp/steam'
			},
			steamOverrides: {
				cwd: './overrides/steam',
				expand: true,
				src: '**',
				dest: './temp/steam'
			},
			humble: {
				cwd: './src/main',
				expand: true,
				src: '**',
				dest: './temp/humble'
			},
			humbleOverrides: {
				cwd: './overrides/humble',
				expand: true,
				src: '**',
				dest: './temp/humble'
			},
			demo: {
				cwd: './src/main',
				expand: true,
				src: '**',
				dest: './temp/demo'
			},
			demoOverrides: {
				cwd: './overrides/demo',
				expand: true,
				src: '**',
				dest: './temp/demo'
			},
			phonegap: {
				cwd: './src/main',
				expand: true,
				src: '**',
				dest: './temp/phonegap'
			},
			phonegapOverrides: {
				cwd: './overrides/phonegap',
				expand: true,
				src: '**',
				dest: './temp/phonegap'
			},
			android: {
				cwd: './src/main',
				expand: true,
				src: '**',
				dest: './temp/android'
			},
			androidOverrides: {
				cwd: './overrides/android',
				expand: true,
				src: '**',
				dest: './temp/android'
			}
		},
		nwjs: {
			steam: {
				options: {
					platforms: ['win', 'osx64', 'linux'],
					buildDir: './dist/steam',
					version: '0.13.0-beta7',
					credits: './temp/steam/index.html',
					macCredits: './temp/steam/index.html',
					macIcns: './src/icons/appIcon.hqx',
					winIco: './src/icons/appIcon.ico'
				},
				src: ['./temp/steam/**/*']
			},
			humble: {
				options: {
					platforms: ['win', 'osx64', 'linux'],
					buildDir: './dist/humble',
					version: '0.13.0-beta7',
					credits: './temp/humble/index.html',
					macCredits: './temp/humble/index.html',
					macIcns: './src/icons/appIcon.hqx',
					winIco: './src/icons/appIcon.ico'
				},
				src: ['./temp/humble/**/*']
			},
			demo: {
				options: {
					platforms: ['win', 'osx64', 'linux'],
					buildDir: './dist/demo',
					version: '0.13.0-beta7',
					credits: './temp/demo/index.html',
					macCredits: './temp/demo/index.html',
					macIcns: './src/icons/appIcon.hqx',
					winIco: './src/icons/appIcon.ico'
				},
				src: ['./temp/demo/**/*']
			}
		},
		compress: {
			main: {
				options: {
					archive: 'dist/build.zip'
				},
				files: [
					{ expand: true, src: ["config.xml"], dest: '.' },
					{ expand: true, cwd: 'temp/phonegap', src: ["**"], dest: '.' }
				]
			}
		},
		//PHONEGAP BUILD ONLY WORKS IF THE FILE IS SMALL, MIGHT NEED TO BE MANUALLY UPLOADED
		"phonegap-build": {
			build: {
				options: {
					archive: "dist/build.zip",
					"appId": "XXXXXXXX",
					"user": {
						"email": "email@email.com",
						"password": "XXXXXXXXXXX"
					},
					download: {
						ios: 'dist/ios.ipa',
						android: 'dist/android.apk'
					},
					keys: {
						ios: { "password": "XXXXXXXXXXX" },
					}
				}
			}
		},
		watch: {
			scripts: {
				files: ['./src/main/js/**/*.js'],
				tasks: ['browserify']
			},
			styles: {
				files: ['./src/main/css/**/*.scss'],
				tasks: ['sass']
			},
			data: {
				files: ['./src/main/csv/**/*.csv'],
				tasks: ['csv2json:pages', 'csv2json:panels', 'browserify']
			}
		},
	})


	grunt.registerTask('cleanall', ['clean']);
	grunt.registerTask('copyall', ['copy:steam', 'copy:steamOverrides', 'copy:humble', 'copy:humbleOverrides', 'copy:demo', 'copy:demoOverrides', 'copy:phonegap', 'copy:phonegapOverrides'])
	grunt.registerTask('nwjsall', ['nwjs:steam', 'nwjs:humble', 'nwjs:demo']);
	grunt.registerTask('phonegap', ['compress', 'phonegap-build']);
	grunt.registerTask('runall', ['cleanall', 'copyall', 'nwjsall', 'phonegap']);
	grunt.registerTask('dev', ['csv2json:pages', 'csv2json:panels', 'sass', 'browserify', 'watch'])
};