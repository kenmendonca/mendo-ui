(function () {
	angular.module('componentScaffold')
	.directive('uiComponentScaffold',uiComponentScaffold);

	function uiComponentScaffold(){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '<%=componentsPath%>componentScaffold/componentScaffold.directive.html',
			controller : 'ComponentScaffoldController'
		};

		return directive;
	}
})(); 