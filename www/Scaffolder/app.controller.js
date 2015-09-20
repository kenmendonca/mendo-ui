(function() {
	angular.module('app')
		.controller('AppController', AppController);

	AppController.$inject = ['$scope', '$rootScope'];

	function AppController($scope, $rootScope) {
		(function() {
			$scope.session = $("body").attr("session");
			$rootScope.$watch('directory', function(newValue, oldValue) {
				$scope.directory = newValue || oldValue;
			});
		})();
	}
})();
