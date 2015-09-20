(function () {
	angular.module('list')
	.directive('uiList',uiList);

	function uiList(){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '<%=componentsPath%>list/list.directive.html',
			controller : 'ListController'
		};

		return directive;
	}
})(); 