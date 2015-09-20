(function () {
	angular.module('paginationAtom')
	.directive('uiPaginationAtom',uiPaginationAtom);

	uiPaginationAtom.$inject = ['componentService'];
	function uiPaginationAtom(componentService){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '<%=componentsPath%>paginationAtom/paginationAtom.directive.html',
			controller : 'PaginationAtomController'
		};

		return directive;
	}
})(); 