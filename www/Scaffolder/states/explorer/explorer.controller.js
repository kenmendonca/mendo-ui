(function() {
	angular.module('explorer')
		.controller('ExplorerController', ExplorerController);

	ExplorerController.$inject = ['$http', '$scope', '$rootScope', 'dataServiceScaffold', '$state'];

	function ExplorerController($http, $scope, $rootScope, dataServiceScaffold, $state) {
		$scope.data = dataServiceScaffold.data;
		$scope.existingDirectoryIndex = "";
		$scope.shownFile = "";
		$scope.chosenSession = "";

		$scope.isEmptyObject = function(object) {
			return $.isEmptyObject(object);
		};

		$scope.showFile = function(path) {
			$http.post('/showFile', {
					path: path
				})
				.success(function(response) {
					$scope.shownFile = response.data;
					$scope.shownFileName = path.substring(path.indexOf("configFiles"));
				})
				.error(function() {
					alert('An error occured getting the file, try again later.');
				});
		};

		$scope.chooseExistingDirectory = function() {
			var directory = $scope.topLevelDirectories[$scope.existingDirectoryIndex].label;
			$http.post('/loadScaffoldJson', {
					"directory": directory
				})
				.success(function(response) {
					dataServiceScaffold.data.scaffold = response.data;
					$rootScope.directory = directory;
					$rootScope.time = moment().format('LLLL');
					$state.go('scaffoldeditor');
				})
				.error(function() {
					alert('An error occured, the directory does not exist.');
				})
		};

		$scope.createNewDirectory = function() {
			var directory = prompt("Enter a directory name for the Json files");
			if (!directory || !directory.length)
				return;
			if (directory.search("^[A-Za-z][A-Za-z0-9]*$") == -1) {
				alert('Please enter an alphanumeric directory, starting with a letter');
				return;
			}
			for (var i = 0; i < $scope.topLevelDirectories.length; i++) {
				if ($scope.topLevelDirectories[i].label == directory) {
					alert('Directory already exists');
					return;
				}
			}
			$http.post('/createNewDirectory', {
					directory: directory
				})
				.success(function() {
					$rootScope.directory = directory;
					$rootScope.time = moment().format('LLLL');
					$state.go('scaffoldeditor');
				})
				.error(function() {
					alert('An error occured creating the directory, try again later.');
				});
		};

		$scope.forkDirectory = function() {
			var toForkDirectory = $scope.topLevelDirectories[$scope.existingDirectoryIndex].label;
			var newDirectory = prompt("Enter a directory name for the Json files");
			if (!newDirectory || !newDirectory.length)
				return;
			if (newDirectory.search("^[A-Za-z][A-Za-z0-9]*$") == -1) {
				alert('Please enter an alphanumeric directory, starting with a letter');
				return;
			}
			for (var i = 0; i < $scope.topLevelDirectories.length; i++) {
				if ($scope.topLevelDirectories[i].label == newDirectory) {
					alert('Directory already exists');
					return;
				}
			}
			$http.post('/forkDirectory', {
					toForkDirectory: toForkDirectory,
					newDirectory: newDirectory
				})
				.success(function(response) {
					dataServiceScaffold.data.scaffold = response.data;
					$rootScope.directory = newDirectory;
					$rootScope.time = moment().format('LLLL');
					$state.go('scaffoldeditor');
				})
				.error(function(response) {
					alert(response);
				})
		};

		$scope.removeDirectory = function() {
			var directory = $scope.topLevelDirectories[$scope.existingDirectoryIndex].label;
			if (!confirm("Are you sure you want to remove this folder?"))
				return;
			$http.post('/removeDirectory', {
					directory: directory
				})
				.success(function() {
					getFileStructure();
					$scope.existingDirectoryIndex = '';
					if ($rootScope.directory == directory)
						delete $rootScope.directory;
				})
				.error(function(response) {
					alert(response || "An error occured.");
				})
		};

		$scope.chooseSession = function() {
			var session = $scope.unsavedSessions[$scope.chosenSession];
			var directory = session.directory;
			var scaffold = session.scaffold;

			$rootScope.directory = directory;
			$rootScope.time = moment().format('LLLL');
			$scope.data.scaffold = angular.copy(scaffold);
			$state.go('scaffoldeditor');
		};
		$scope.removeSession = function() {
			if (!confirm("Are you sure you want to remove this session?"))
				return;
			delete $scope.unsavedSessions[$scope.chosenSession];
			localStorage.setItem("unsavedSessions", angular.toJson($scope.unsavedSessions));
			$scope.chosenSession = '';
		};

		var getFileStructure = function() {
			$http.get('/fileStructure')
				.success(function(response) {
					$scope.fileStructure = response.data;
					$scope.topLevelDirectories = [];
					for (var i = 0; i < $scope.fileStructure.contents.length; i++) {
						if ($scope.fileStructure.contents[i].type == 'directory') {
							var topLevelDirectory = {
								label: $scope.fileStructure.contents[i].name,
								value: $scope.fileStructure.contents[i].path,
							};
							$scope.topLevelDirectories.push(topLevelDirectory);
						}
					}
				//dev purposes only
				//$scope.existingDirectoryIndex = 0;
				//$scope.chooseExistingDirectory();
				})
				.error(function() {
					alert('An error occured getting the file structure, try again later.');
				});
		};

		(function() {
			getFileStructure();
			$scope.unsavedSessions = angular.fromJson(localStorage.getItem("unsavedSessions")) || {};
		})();
	}
})();
