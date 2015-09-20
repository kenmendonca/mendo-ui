(function () {
	angular.module('table')
	.directive('uiTable',uiTable);

	function uiTable(){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '<%=componentsPath%>table/table.directive.html',
			controller : 'TableController'
		};

		return directive;
	}
})(); 