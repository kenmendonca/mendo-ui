module.exports = function(grunt) {
	var componentFormPath = 'www/ComponentForm/';
	var scaffolderPath = 'www/Scaffolder/';
	var sharedPath = 'www/shared/';
	var componentsPath = '../shared/components/';
	// configure the tasks
	grunt.initConfig({
		concat: {
			options: {
				separator: '\n\n',
				process : function(src, filepath){
					if(filepath.indexOf('directive.js') != -1){
						if(src.indexOf('<%=componentsPath%>') != -1)
							return src.replace(/<%=componentsPath%>/g,componentsPath);
						else
							return src;
					}
					return src;
				}
			},
			jsScaffolder: {
				src:[
					scaffolderPath + 'app.module.js',
					scaffolderPath + 'data/data.module.js',
					scaffolderPath + 'states/**/*.module.js',
					sharedPath + 'components/**/*.module.js',
					scaffolderPath + 'app.*.js',
					scaffolderPath + 'data/data.*.js',
					scaffolderPath + 'states/**/*.js',
					sharedPath + 'components/**/*.service.js',
					sharedPath + 'components/**/*.js'
				],
				dest: scaffolderPath + 'build.js',
			},
			jsComponentForm : {
				src :[
					componentFormPath + 'app.module.js',
					componentFormPath + 'data/data.module.js',
					sharedPath + 'components/**/*.module.js',
					componentFormPath + 'app.*.js',
					componentFormPath + 'data/data.*.js',
					sharedPath + 'components/**/*.service.js',
					sharedPath + 'components/**/*.js',
					componentFormPath + 'config.js'
				],
				dest: componentFormPath + 'build.js'
			},
			css: {
				src: [sharedPath + 'components/**/*.css'],
				dest: sharedPath + 'styles/build.css'
			}
		},
		clean: {
			jsScaffolder: {
				src: [scaffolderPath + 'build.js']
			},
			jsComponentForm: {
				src: [componentFormPath + 'build.js']
			},
			css: {
				src: [sharedPath + 'styles/build.css']
			}
		},

		watch: {
			js: {
				files: [
				componentFormPath + '*.js',
				componentFormPath + 'data/*.js',
				componentFormPath + '!build.js',
				//for some reason, '/*.js' causes a loop
				//deeming the below statement not needed
				//scaffolderPath + '!build.js'
				scaffolderPath + 'app.controller.js',
				scaffolderPath + 'app.module.js',
				scaffolderPath + 'app.router.js',

				scaffolderPath + 'data/*.js',
				scaffolderPath + 'states/**/*.js',
				sharedPath + 'components/**/*.js'
				],
				tasks: [
				'clean:jsComponentForm',
				'clean:jsScaffolder',
				'concat:jsComponentForm',
				'concat:jsScaffolder'
				]
			},
			css: {
				files: [sharedPath + 'components/**/*.css'],
				tasks: ['clean:css', 'concat:css']
			}
		},
		execute : {
			target : {
				src : ['server.js']
			}
		}
	});

	// load the tasks
	grunt.loadTasks('node_modules/grunt-contrib-clean/tasks');
	grunt.loadTasks('node_modules/grunt-contrib-concat/tasks');
	grunt.loadTasks('node_modules/grunt-contrib-watch/tasks');

	//clean and concat not executed by default so as to not change what's in 
	//the filesystem UNLESS there's a change
	grunt.registerTask(
		'default', ['watch']
	);
};