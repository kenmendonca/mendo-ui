(function () {
	angular.module('subView')
	.directive('uiSubView',uiSubView);

	function uiSubView(){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '<%=componentsPath%>components/subView/subView.directive.html',
			controller : 'SubViewController'
		};

		return directive;
	}
})(); 