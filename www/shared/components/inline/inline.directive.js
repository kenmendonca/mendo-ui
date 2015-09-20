(function () {
	angular.module('inline')
	.directive('uiInline',uiInline);

	function uiInline(){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '<%=componentsPath%>inline/inline.directive.html',
			controller : 'InlineController'
		};

		return directive;
	}
})(); 