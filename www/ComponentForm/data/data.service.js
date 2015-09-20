(function() {
	angular.module('data')
		.service('dataService', dataService);

	dataService.$inject = ['$http'];

	function dataService($http) {
		var dataService = this;
		dataService.data = {};
		dataService.form = {
			showErrors: {}
		};
	}
})();
