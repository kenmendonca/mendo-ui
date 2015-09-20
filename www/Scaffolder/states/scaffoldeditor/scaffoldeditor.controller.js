(function() {
	angular.module('scaffoldeditor')
		.controller('ScaffoldeditorController', ScaffoldeditorController);

	ScaffoldeditorController.$inject = ['$rootScope', '$scope', '$http', 'dataServiceScaffold', '$compile', '$timeout', '$interval', '$location'];

	function ScaffoldeditorController($rootScope, $scope, $http, dataServiceScaffold, $compile, $timeout, $interval, $location) {
		
		var assignIdentifiers = function(obj){
				for (var property in obj) {
					if (property == 'identifier') {
						if(obj.identifier.length === 0){
							var newIdentifier = Math.floor((1 + Math.random())*1e40).toString(36).substring(0,16);
							obj.identifier = newIdentifier;
						}
					}
					else if (typeof obj[property] == 'object')
						assignIdentifiers(obj[property]);
				}
		}

		$scope.data = dataServiceScaffold.data;
		$scope.data.scaffold = dataServiceScaffold.data.scaffold || [{
			title: 'Page1',
			stateName : 'Page1',
			classRow: ['container content-panel'],
			row: [
				[{
					width: 12,
					components: []
				}]
			]
		}];
		$scope.currentPage = 0;
		$scope.componentModal = {};
		$scope.editing = false;
		$scope.editingPageJson = false;
		$scope.refreshRender = $rootScope.refreshRender;	
		$scope.addPage = function() {
			var title = prompt("Enter a title for the new page");
			if (!title || !title.length)
				return;
			if (title.search("^[A-Za-z][A-Za-z0-9]*$") == -1) {
				alert('Please enter an alphanumeric title, starting with a letter');
				return;
			}
			var stateName = prompt("Enter a stateName for the new page");
			if (!stateName || !stateName.length)
				return;
			if (stateName.search("^[A-Za-z][A-Za-z0-9\.]+[A-Za-z0-9]$") == -1) {
				alert('Please enter an alphanumeric stateName, starting with a letter');
				return;
			}
			$scope.data.scaffold.push({
				title: title,
				stateName : stateName,
				classRow: ['container content-panel'],
				row: [
					[{
						width: 12,
						components: []
					}]
				]
			});
			$scope.currentPage = $scope.data.scaffold.length - 1;
		};

		$scope.removePage = function(index) {
			$scope.editPage(index);
			if (!confirm("Are you sure you want to remove this page?"))
				return;
			if ($scope.currentPage - 1 < 0)
				$scope.currentPage = 0;
			else
				$scope.currentPage = $scope.currentPage - 1;
			$scope.data.scaffold.splice(index, 1);
		};

		$scope.editPage = function(index) {
			$scope.currentPage = index;
			$rootScope.refreshRenderFunc();
		};

		$scope.editPageTitle = function(index) {
			var newTitle = prompt('Please enter a new title for ' + $scope.data.scaffold[index].title);
			if (newTitle)
				$scope.data.scaffold[index].title = newTitle;
		};

		$scope.componentModalPg1Next = function() {
			$('.componentModal-pg1').hide();
			$('.componentModal-pg2').show();

			if (!$('.componentModal').attr('editing')) {
				$scope.editing = false;
				var type = $scope.componentModal.chosenComponent;
				//$('.json-editor').attr('component',type);
				
				// $scope.componentsSchemaCopy = angular.copy($scope.componentsSchema);
				// $scope.componentsSchemaCopy.oneOf = [{
				// 	"$ref": "#/definitions/" + type
				// }];

				$scope.componentsSchema = {'$ref' :  "../shared/components/" + type + "/" + type + ".schema.json"};

				var template = '<json-editor schema="componentsSchema" on-change="updateComponentObject($editorValue)"></json-editor>';
			} else {
				//console.log('editing');
				$scope.editing = true;
				var type = $rootScope.sampleComponent.type;
				$scope.editingComponent = angular.copy($rootScope.sampleComponent);
				//delete $scope.editingComponent.type;
				//$('.json-editor').attr('component',type);
				// $scope.componentsSchemaCopy = angular.copy($scope.componentsSchema);
				// $scope.componentsSchemaCopy.oneOf = [{
				// 	"$ref": "#/definitions/" + type
				// }];

				$scope.componentsSchema = {'$ref' :  "../shared/components/" + type + "/" + type + ".schema.json"};

				var template = '<json-editor schema="componentsSchema" startVal="editingComponent" on-change="updateComponentObject($editorValue)"></json-editor>';
			}
			var el = $('.json-editor');
			var compiled = $compile(template)($scope);
			el.empty().append(compiled);
			el = compiled;
		};

		$scope.updateComponentObject = function(obj) {
			if ($scope.componentModal.showComponent) {
				$scope.componentModal.showComponent = false;
				$timeout(function() {
					delete $scope.componentModal.sampleComponent;
					$scope.componentModal.sampleComponent = angular.copy(obj);
					$scope.componentModal.showComponent = true;
				}, 10);
			} else {
				delete $scope.componentModal.sampleComponent;
				$scope.componentModal.sampleComponent = angular.copy(obj);
				$scope.componentModal.showComponent = true;
			}

		};

		$scope.editPageJson = function() {
			$scope.editingPageJson = !$scope.editingPageJson;
		};

		$scope.saveJson = function() {
			var requestData = {
				'directory': $rootScope.directory,
				'scaffoldJson': $scope.data.scaffold
			};

			$http.post('/saveScaffoldJson', requestData)
				.success(function(response) {
					var error = ((response || {}).data || {}).error || "";
					if (error.length) {
						alert(error);
						return;
					}
					alert('Save successful.');
					$scope.savedScaffold = angular.copy($scope.data.scaffold);
				})
				.error(function(response) {
					alert('An error occurred. Please try again later.');
				});
		};

		$scope.exportFiles = function(){
			var requestData = {
				'directory' : $rootScope.directory
			};

			$http.post('/exportFiles',requestData)
			.success(function(response){
				console.log('success');
				console.log(response);
				window.location.href = response;
			})
			.error(function(response){
				console.log('error');
				console.log(response);
			})
		};
		$scope.rootAddComponent = function() {
			assignIdentifiers($scope.componentModal.sampleComponent);
			$rootScope.sampleComponent = angular.copy($scope.componentModal.sampleComponent);
		};

		(function() {
			//get the schema
			$http.get('../shared/configFiles/componentsList.json').then(function(response) {
				$scope.componentsList = response.data;
			});
			//to directly edit json
			$('button[select-all]').click(function() {
				$('.page-json-editor textarea').focus().select();
			});
			//watch
			$rootScope.$watch('refreshRender', function(newValue, oldValue) {
				if (newValue !== undefined)
					$scope.refreshRender = newValue;
			});
			//refreshRender
			$rootScope.refreshRenderFunc = function() {
				$rootScope.refreshRender = false;
				$timeout(function() {
					$rootScope.refreshRender = true;
				}, 10);
			};
			$rootScope.refreshRenderFunc();

			var currentSession = angular.fromJson(localStorage.getItem("unsavedSessions")) || {};
			currentSession = currentSession[$rootScope.time];
			$scope.savedScaffold = currentSession || angular.copy($scope.data.scaffold);

			var saveIntervalPromise = $interval(function() {
				var unsavedSessions = angular.fromJson(localStorage.getItem("unsavedSessions")) || {};

				if (!angular.equals($scope.savedScaffold, $scope.data.scaffold)) {
					var toStore = {
						scaffold: $scope.data.scaffold,
						directory: $rootScope.directory
					};
					if (angular.equals(toStore, unsavedSessions[$rootScope.time])) {
						return;
					}
					unsavedSessions[$rootScope.time] = toStore;
				} else {
					delete unsavedSessions[$rootScope.time];
				}
				localStorage.setItem("unsavedSessions", angular.toJson(unsavedSessions));
			}, 5000);

			$scope.$on('$destroy', function() {
				$interval.cancel(saveIntervalPromise);
			});
		})();


	}
})();
