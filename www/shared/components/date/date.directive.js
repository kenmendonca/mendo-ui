(function() {
	angular.module('date')
		.directive('uiDate', uiDate);

	uiDate.$inject = ['$compile', 'dataService', '$timeout','componentService','componentFactory'];

	function uiDate($compile, dataService, $timeout, componentService, componentFactory) {
		var directive = {
			restrict: 'E',
			scope: {
				componentCopy: '=component',
				identifier: '=',
				type : '='
			},
			templateUrl: '<%=componentsPath%>date/date.directive.html',
			controller: 'DateController',
			replace: true
		};
		return directive;
	}
})();
