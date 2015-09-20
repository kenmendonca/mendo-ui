var express = require('express');
var request = require('request');
var fs = require('fs');
var bodyParser = require('body-parser');
var ncp = require('ncp').ncp;
var grunt = require('grunt');
var archiver = require('archiver');
var mime = require('mime');

var dirnameFlipped = __dirname.replace(/\\/g, '/');
var PORT = 8080;
var URL = 'http://localhost:' + PORT + '/';

var app = express();
app.use(bodyParser.json());
var staticOptions = {
	index: false
};
app.use(express.static(dirnameFlipped + '/www', staticOptions));

var iterateThroughObject = function(obj, fn) {
	for (var property in obj) {
		if (obj.hasOwnProperty(property)) {
			if (typeof obj[property] == "object")
				iterateThroughObject(obj[property], fn);
			else
				fn(obj, property);
		}
	}
};

var emptyDirectory = function(dirPath, removeSelf, extensions) {
	if (removeSelf === undefined)
		removeSelf = true;
	try {
		var files = fs.readdirSync(dirPath);
	} catch (e) {
		return;
	}
	if (files.length > 0)
		for (var i = 0; i < files.length; i++) {
			var filePath = dirPath + '/' + files[i];
			if (fs.statSync(filePath).isFile()) {
				var currExtension = filePath.substring(filePath.lastIndexOf('.') + 1);
				for (var j = 0; j < extensions.length; j++) {
					if (currExtension == extensions[j] || extensions[j] == "*")
						fs.unlinkSync(filePath);
				}

			} else
				emptyDirectory(filePath, true, extensions);
		}
	if (removeSelf)
		fs.rmdirSync(dirPath);
};

var sampleController = function(title) {
	//alternative is to read from a file
	var controllerStr = "(function(){\n";
	controllerStr += "\tangular.module('app')\n";
	controllerStr += "\t.controller('" + title + "Controller'," + title + "Controller);\n";
	controllerStr += "\t" + title + "Controller.$inject = ['$scope','dataService','scaffoldService','validatorService','$state'];\n";
	controllerStr += "\tfunction " + title + "Controller($scope,dataService,scaffoldService,validatorService,$state){\n";
	controllerStr += "\t\t$scope.data = dataService.data;\n";
	controllerStr += "\t\t$scope.form = dataService.form;\n";
	controllerStr += "\t\t$scope.scaffoldService = scaffoldService[$state.current.data.title];\n";
	controllerStr += "\t\t$scope.validatorService = validatorService;\n";
	controllerStr += "\n";
	controllerStr += "\t\t$scope.scaffoldService.ready.then(function(){\n";
	controllerStr += "\t\t});\n";
	controllerStr += "\t}\n";
	controllerStr += "})();\n";

	return controllerStr;
};

var fileStructureObj = function(path) {
	var stats = fs.lstatSync(path);
	var name = path.substring(path.lastIndexOf('/') + 1);
	if (stats.isFile())
		return {
			"type": "file",
			"path": path,
			"name": name
		};
	else if (stats.isDirectory()) {
		var fileArr = fs.readdirSync(path);
		var directoryObj = {
			"type": "directory",
			"path": path,
			"name": name,
			"collapsed": true,
			"contents": []
		};
		for (var i = 0; i < fileArr.length; i++) {
			directoryObj.contents.push(fileStructureObj(path + '/' + fileArr[i]));
		}
		return directoryObj;
	}
};


grunt.tasks(['default']);

app.post('/createNewDirectory', function(req, res) {
	var requestData = req.body;
	var absoluteDirectory = dirnameFlipped + '/www/shared/configFiles/' + requestData.directory + '/';

	fs.mkdir(absoluteDirectory, mkdirCallback);
	var responseData = {
		data: {
			existingDirectory: false
		}
	};

	function mkdirCallback(e) {
		if (e && e.code == 'EEXIST') {
			responseData.data.existingDirectory = true;
		}
		res.status(200).send(responseData);
	}
});

app.get('/Scaffolder/', function(req, res) {
	var index_html = fs.readFileSync(dirnameFlipped + '/www/Scaffolder/index.html', 'utf8');
	res.status(200).send(index_html);
});
app.get('/Documentation/', function(req, res) {
	var index_html = fs.readFileSync(dirnameFlipped + '/www/Documentation/index.html', 'utf8');
	res.status(200).send(index_html);
});
app.get('/ComponentForm*/', function(req, res) {
	var url = req.url;
	var params = url.substring(url.lastIndexOf('?') + 1);

	var componentFormDirectory = dirnameFlipped + '/www/ComponentForm/';
	var index_html = fs.readFileSync(componentFormDirectory + 'index.html', 'utf8');

	if (params == url) {
		var absoluteDirectory = dirnameFlipped + '/www/shared/configFiles/';

		var options = {
			url: URL + 'fileStructure',
			method: 'GET'
		};

		var fileArr = fs.readdirSync(absoluteDirectory);
		var template = 'Choose a directory for the ComponentForm from the following list:<br>';
		for (var i = 0; i < fileArr.length; i++) {
			var stats = fs.lstatSync(absoluteDirectory + fileArr[i]);
			if (stats.isDirectory()) {
				var ComponentFormURL = URL + 'ComponentForm' + '?directory=' + fileArr[i];
				template += '<a href="' + ComponentFormURL + '">' + fileArr[i] + '</a><br>';
			}
		}

		res.status(200).send(template);
		return;
	}

	directory = params.substring(params.indexOf("directory=") + 10);

	if (directory)
		var absoluteDirectory = dirnameFlipped + '/www/shared/configFiles/' + directory + '/';

	var config = fs.readFileSync(absoluteDirectory + 'config.json', 'utf8');
	config = JSON.parse(config);

	//change DIRECTORY
	index_html = index_html.replace(/<%=directory%>/, '../shared/configFiles/' + directory + '/');
	//add in CONTROLLERs
	var controllersScripts = '';
	for (i = 0; i < config.length; i++) {
		controllersScripts += '<script type="text/javascript" src="../shared/configFiles/' + directory + '/' + config[i].controller + '.js"></script>\n';
	}
	var devOnlyRegExp = new RegExp("<%devOnly=[A-Za-z0-9\\\/\"\'\\s\\_\\-<>=\.]+%>","g");
	index_html = index_html
	.replace(/<%=controllers%>/g, controllersScripts)
	.replace(/<%=buildCssPath%>/g, '../shared/styles/build.css')
	.replace(/<%=buildJsPath%>/g, 'build.js')
	.replace(devOnlyRegExp, function(matchedStr){
		return matchedStr.replace('<%devOnly=','').replace('%>','');
	});
	res.status(200).send(index_html);
});

app.get('/fileStructure', function(req, res) {
	var absoluteDirectory = dirnameFlipped + '/www/shared/configFiles';
	res.status(200).send({
		data: fileStructureObj(absoluteDirectory)
	});
});
app.post('/showFile', function(req, res) {
	var requestData = req.body;
	var path = requestData.path;
	var stats = fs.lstatSync(path);
	if (!stats.isFile())
		res.status(400).end();
	var file = fs.readFileSync(path, 'utf8');
	res.status(200).send({
		data: file
	});
});
app.post('/saveScaffoldJson', function(req, res) {
	var requestData = req.body;

	var absoluteDirectory = dirnameFlipped + '/www/shared/configFiles/' + requestData.directory + '/';

	var titles = [];
	for (var i = 0; i < requestData.scaffoldJson.length; i++) {
		var title = requestData.scaffoldJson[i].title;
		titles.push(title);
		if (titles.indexOf(title) != titles.lastIndexOf(title))
			res.status(200).send({
				data: {
					error: "Error: duplicate page titles."
				}
			});
	}

	emptyDirectory(absoluteDirectory, false, ['json']);

	var title = "";
	var config = [];
	for (var i = 0; i < requestData.scaffoldJson.length; i++) {
		title = requestData.scaffoldJson[i].title;
		stateName = requestData.scaffoldJson[i].stateName;
		config.push({
			"title": title,
			"stateName": stateName,
			"controller": title + "Controller",
			"pageJSON": title + ".json"
		});
		try {
			var stats = fs.lstatSync(absoluteDirectory + title + 'Controller.js');
		} catch (e) {
			fs.writeFileSync(absoluteDirectory + title + 'Controller.js', sampleController(title));
		}
		fs.writeFileSync(absoluteDirectory + title + '.json', JSON.stringify(requestData.scaffoldJson[i], null, '\t'));
	}

	fs.writeFileSync(absoluteDirectory + 'config.json', JSON.stringify(config, null, '\t'));
	//fs.writeFileSync(componentFormDirectory + 'index.html',index_html);
	res.status(200).end();
});

app.post('/exportFiles', function(req, res) {
	var requestData = req.body;
	var absoluteDirectory = dirnameFlipped + '/www/shared/configFiles/' + requestData.directory + '/';
	try {
		var stats = fs.lstatSync(absoluteDirectory);
		if (stats.isDirectory()) {
			var config = JSON.parse(fs.readFileSync(absoluteDirectory + 'config.json', 'utf8'));
			var components = {};
			for (var i = 0; i < config.length; i++) {
				var pageJSON = JSON.parse(fs.readFileSync(absoluteDirectory + config[i].pageJSON, 'utf8'));
				iterateThroughObject(pageJSON, function(obj, prop) {
					if (prop == "type")
						components[obj[prop]] = "";
				});
			}

			components = Object.keys(components).toString();
			grunt.event.once('buildSuccess', function() {
				try {
					var files = fs.readdirSync(absoluteDirectory);
				} catch (e) {
					res.status(400).send('error3');
				}
				var archiveFile = fs.createWriteStream(absoluteDirectory + requestData.directory + '.zip');
				var archive = archiver.create('zip', {});

				archive.pipe(archiveFile);

				archive.once('end', function() {
					setTimeout(function() {
						res.status(200).send('/shared/configFiles/' + requestData.directory + '/' + requestData.directory + '.zip');
					}, 500);
				});
				for (var j = 0; j < files.length; j++){
					if(files[j].indexOf('.zip') == -1)
					archive.file(absoluteDirectory + files[j], {
						name: files[j]
					});
				}

				archive.finalize();
			});
			//send zipped files
			grunt.event.emit('build', components, requestData.directory, config);

		} else {
			res.status(400).send('error1');
		}
	} catch (e) {
		res.status(400).send('error2');
	}
});
app.post('/loadScaffoldJson', function(req, res) {
	var requestData = req.body;
	var absoluteDirectory = dirnameFlipped + '/www/shared/configFiles/' + requestData.directory + '/';
	try {
		var stats = fs.lstatSync(absoluteDirectory);
		if (stats.isDirectory()) {
			var config = JSON.parse(fs.readFileSync(absoluteDirectory + 'config.json', 'utf8'));
			var scaffoldJson = [];
			for (var i = 0; i < config.length; i++) {
				var pageJSON = JSON.parse(fs.readFileSync(absoluteDirectory + config[i].pageJSON, 'utf8'));
				scaffoldJson.push(pageJSON);
			}
			var responseData = {
				data: scaffoldJson
			};
			res.status(200).send(responseData);
		} else {
			res.status(400).end();
		}
	} catch (e) {
		res.status(400).end();
	}
});

app.post('/forkDirectory', function(req, res) {
	var requestData = req.body;
	var toForkDirectory = dirnameFlipped + '/www/shared/configFiles/' + requestData.toForkDirectory + '/';
	var newDirectory = dirnameFlipped + '/www/shared/configFiles/' + requestData.newDirectory + '/';

	fs.mkdir(newDirectory, function() {
		ncp(toForkDirectory, newDirectory, function(err) {
			if (err) {
				res.status(400).send("Error copying directory");
			}

			var options = {
				url: URL + 'loadScaffoldJson',
				method: 'POST',
				json: {
					directory: requestData.newDirectory
				}
			};

			request(options, function(reqError, reqResponse, reqBody) {
				if (reqError) {
					res.status(400).send("Error making request to /loadScaffoldJson");
				} else {
					res.status(200).send(reqBody);
				}
			});

		});
	});
});

app.post('/removeDirectory', function(req, res) {
	var requestData = req.body;
	var absoluteDirectory = dirnameFlipped + '/www/shared/configFiles/' + requestData.directory + '/';
	emptyDirectory(absoluteDirectory, true, ["*"]);
	res.status(200).end();
});
var server = app.listen(PORT, function() {});
