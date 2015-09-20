module.exports = function(grunt) {
	var sharedPath = 'www/shared/';
	var sharedComponentsPath = sharedPath + 'components/';
	var componentFormPath = 'www/ComponentForm/';
	var componentsPath = '/mendo-ui/www/shared/components/';
	
	var configCleanAndConcat = function(c, d, configObj) {
		var directory = d;
		var components = c.split(',');

		components.push('scaffold', 'utilities', 'validator', 'componentSevered');
		var jsSrc1 = [
			componentFormPath + 'app.module.js',
			componentFormPath + 'data/data.module.js',
			sharedComponentsPath + 'component.module.js'
		];
		var jsSrc2 = [];
		var jsSrc3 = [componentFormPath + 'app.*.js',
			componentFormPath + 'data/data.*.js',
			sharedComponentsPath + 'component.*.js'
		];
		var jsSrc4 = [];
		var jsSrc5 = [componentFormPath + 'config.js'];
		var cssSrc = [];
		var COMPONENT_MODULE_STRING = "(function() {\n\tangular.module('component', [";
		for (var i = 0; i < components.length; i++) {
			var type = components[i];
			//js
			jsSrc2.push(sharedComponentsPath + type + '/*.module.js');
			jsSrc4.push(sharedComponentsPath + type + '/*.service.js');
			jsSrc4.push(sharedComponentsPath + type + '/*.js');
			switch (type) {
				case 'scaffold':
				case 'validator':
				case 'componentSevered':
					break;
				default:
					COMPONENT_MODULE_STRING = COMPONENT_MODULE_STRING + "\n\t\t'" + type + "',";
			}
			//css
			cssSrc.push(sharedComponentsPath + type + '/*.css');
		}
		COMPONENT_MODULE_STRING = COMPONENT_MODULE_STRING.substring(0, COMPONENT_MODULE_STRING.length - 1) + "\n\t]);\n})();";
		var jsSrc = [].concat(jsSrc1, jsSrc2, jsSrc3, jsSrc4, jsSrc5);
		config = {
			clean: {
				js: {
					src: [sharedPath + 'configFiles/' + directory + 'build.' + directory + '.mendo-ui.js'],
					options: {
						force: true
					}
				},
				css: {
					src: [sharedPath + 'configFiles/' + directory + 'build.' + directory + '.mendo-ui.css'],
					options: {
						force: true
					}
				},
				html : {
					src: [sharedPath + 'configFiles/' + directory + 'index.html'],
					options: {
						force: true
					}
				}
			},
			concat: {
				options: {
					separator: '\n\n',
					process: function(src, filepath) {
						if (filepath.indexOf('component.module.js') != -1)
							return COMPONENT_MODULE_STRING;
						else if (filepath.indexOf('directive.js') != -1) {
							if (src.indexOf('<%=componentsPath%>') != -1)
								return src.replace(/<%=componentsPath%>/g, componentsPath);
							else
								return src;
						}
						else if(filepath.indexOf('index.html') != -1){
							var controllersScripts = '\n';
							for(var i = 0; i< configObj.length; i++){
								controllersScripts += '<script type="text/javascript" '
								controllersScripts += 'src="/path/to/'+configObj[i].controller+'.js"></script>\n';
							}
							var devOnlyRegExp = new RegExp("<%devOnly=[A-Za-z0-9\\\/\"\'\\s\\_\\-<>=\.]+%>","g");
							return src
							.replace(/<%=controllers%>/g, controllersScripts)
							.replace(/<%=directory%>/g, '/path/to/json/')
							.replace(/<%=buildCssPath%>/g, '/path/to/build.' + directory + '.mendo-ui.css')
							.replace(/<%=buildJsPath%>/g, '/path/to/build.' + directory + '.mendo-ui.js')
							.replace(devOnlyRegExp,'');
						}
						else
							return src;
					}
				},
				js: {
					src: jsSrc,
					dest: sharedPath + 'configFiles/' + directory + '/build.' + directory + '.mendo-ui.js'
				},
				css: {
					src: cssSrc,
					dest: sharedPath + 'configFiles/' + directory + '/build.' + directory + '.mendo-ui.css'
				},
				html : {
					src : [componentFormPath + 'index.html'],
					dest : sharedPath + 'configFiles/' + directory + '/index.html'
				}
			}
		};

		grunt.config.set('clean', config.clean);
		grunt.config.set('concat', config.concat);

		if (!grunt.task.exists('clean') && !grunt.task.exists('concat')) {
			grunt.task.loadNpmTasks('grunt-contrib-clean');
			grunt.task.loadNpmTasks('grunt-contrib-concat');

			grunt.task.registerTask('cleanAndConcat', ['clean', 'concat', 'default']);

			grunt.task.run('cleanAndConcat');
		} else
			grunt.task.run('cleanAndConcat');
	};

	grunt.registerTask('default', function() {
		//don't exit this task, as that would close the server
		var done = this.async();
		grunt.event.once('build', function(components, directory, configObj) {
			configCleanAndConcat(components, directory, configObj);
			setTimeout(function() {
				//spo that the files have actually been added to directory
				grunt.event.emit('buildSuccess');
			}, 1000);
			done();
		});
	});
}
