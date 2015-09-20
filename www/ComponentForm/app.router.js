(function() {
	angular.module('app')
		.config(config)
		.run(runFn);

	function config($urlRouterProvider, $stateProvider, CONFIG, DIRECTORY) {
		$urlRouterProvider.otherwise('/');

		var configObj = angular.copy(CONFIG);
		var i;
		for (i = 0; i < configObj.length; i++) {
			var url = configObj[i].title;
			if (i == 0)
				url = '';
			var stateObj = {
				url: '/' + url,
				template: '<ui-scaffold></ui-scaffold>',
				data: {
					title: configObj[i].title,
					stateName: configObj[i].stateName,
					pageJSON: configObj[i].pageJSON
				}
			};

			if (configObj[i].controller) {
				stateObj.controller = configObj[i].controller;
			}
			$stateProvider.state(configObj[i].stateName, stateObj);
		}
	}

	runFn.$inject = ['$rootScope', 'DIRECTORY', 'scaffoldService', '$state', '$http', '$q', 'dataService'];

	function runFn($rootScope, DIRECTORY, scaffoldService, $state, $http, $q, dataService) {

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			var title = toState.data.title;
			var stateName = toState.data.stateName;
			var pageJSON = toState.data.pageJSON;

			//config is loaded, set up event 
			try {
				var config = scaffoldService[title].config;
			} catch (err) {
				event.preventDefault();
				var options = {
					method: 'GET',
					url: DIRECTORY + pageJSON
				};

				$http(options).then(function(response) {
					scaffoldService[title] = scaffoldService[title] || {};
					scaffoldService[title].config = response.data;
					$state.go(stateName);
				});
				return;
			}

			var componentArray = [];

			scaffoldService[title].component = scaffoldService[title].component || {};

			//console.log('from:',fromState,'\nto: ',toState,'\n',scaffoldService[title].component);

			iterateComponents(config);

			function iterateComponents(obj) {
				for (var property in obj) {
					if (property == 'components') {
						var comp_array = obj[property];
						for (var i = 0; i < comp_array.length; i++) {
							if (comp_array[i].hasOwnProperty('identifier') && comp_array[i]['identifier'].length > 0) {
								var type = comp_array[i]['type'];
								scaffoldService[title].component[type] = scaffoldService[title].component[type] || {};
								componentArray.push({
									type: comp_array[i]['type'],
									identifier: comp_array[i]['identifier']
								});
							}
						}
					}
					if (typeof obj[property] == 'object')
						iterateComponents(obj[property]);
				}
			}

			var promiseArr = [];
			for (var i = 0; i < componentArray.length; i++) {
				var type = componentArray[i].type;
				var identifier = componentArray[i].identifier;
				scaffoldService[title].component[type][identifier] = {
					readyDeferred: $q.defer()
				};

				var newPromise = scaffoldService[title].component[type][identifier].readyDeferred.promise;
				scaffoldService[title].component[type][identifier].ready = newPromise;
				promiseArr.push(newPromise);
			}

			scaffoldService[title].ready = $q.all(promiseArr);
			//stuff to execute on each page load
			scaffoldService[title].ready.then(function() {
				$('[data-toggle=tooltip]').tooltip();
			});
		});
	}
})();
