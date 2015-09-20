(function() {

	var DIRECTORY = $('script[mendo-ui]').attr('directory');

	angular.module('app').constant('DIRECTORY', DIRECTORY);

	fetchData().then(bootstrapApplication);

	function fetchData() {
		var initInjector = angular.injector(["ng"]);
		var $http = initInjector.get("$http");
		return $http.get(DIRECTORY + "config.json").then(function(response) {
			angular.module('app').constant('CONFIG', response.data);
		}, function(errorResponse) {
			// Handle error case
		});
	}

	function bootstrapApplication() {
		angular.element(document).ready(function() {
			angular.bootstrap("#mendoApp", ["app"]);
		});
	}
}());
