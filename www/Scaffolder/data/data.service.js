(function() {
	angular.module('data')
		.service('dataService', dataService)
		.service('dataServiceScaffold', dataServiceScaffold);

	function dataService() {
		var dataService = this;
		dataService.data = {};
	}

	function dataServiceScaffold() {
		var dataServiceScaffold = this;
		dataServiceScaffold.data = {};
	}
})();
