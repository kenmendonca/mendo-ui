module.exports = function(grunt) {

	// configure the tasks
	grunt.initConfig({
		concat: {
			options: {
				separator: '\n\n',
			},
			js: {
				src: [
					'app.module.js',
					'data/data.module.js',
					'states/**/*.module.js',
					'../shared/components/**/*.module.js',
					'app.*.js',
					'data/data.*.js',
					'states/**/*.js',
					'../shared/components/**/*.service.js',
					'../shared/components/**/*.js'
				],
				dest: 'build.js',
			},
			css: {
				src: ['../shared/components/**/*.css'],
				dest: '../shared/styles/build.css'
			}
		},

		clean: {
			js: {
				src: ['build.js'],
				options: {
					force: true
				}
			},
			css: {
				src: ['../shared/styles/build.css'],
				options: {
					force: true
				}
			}
		},

		watch: {
			js: {
				files: ['**/*.js', '!build.js', '../shared/components/**/*.js'],
				tasks: ['clean:js', 'concat:js']
			},
			css: {
				files: ['../shared/components/**/*.css'],
				tasks: ['clean:css', 'concat:css']
			}
		}
	});

	// load the tasks
	grunt.loadTasks('../../node_modules/grunt-contrib-clean/tasks');
	grunt.loadTasks('../../node_modules/grunt-contrib-concat/tasks');
	grunt.loadTasks('../../node_modules/grunt-contrib-watch/tasks');

	// define the tasks
	grunt.registerTask(
		'default', ['clean', 'concat', 'watch']
	);
};
