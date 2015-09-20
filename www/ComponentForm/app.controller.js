(function() {
	angular.module('app')
		.controller('AppController', AppController);

	AppController.$inject = ['$scope', 'dataService'];

	function AppController($scope, dataService) {
		$scope.data = dataService.data;
	}
})();