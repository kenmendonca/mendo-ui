(function () {
	angular.module('tooltip')
	.directive('uiTooltip',uiTooltip);

	function uiTooltip(){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '<%=componentsPath%>tooltip/tooltip.directive.html',
			controller : 'TooltipController'
		};

		return directive;
	}
})(); 