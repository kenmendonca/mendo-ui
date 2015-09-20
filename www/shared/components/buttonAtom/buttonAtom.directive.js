(function() {
	angular.module('buttonAtom')
	.directive('uiButtonAtom', uiButtonAtom);

	uiButtonAtom.$inject = ['$compile','componentService'];

	function uiButtonAtom($compile,componentService) {
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '<%=componentsPath%>buttonAtom/buttonAtom.directive.html',
			controller : 'ButtonAtomController'
		};

		return directive;
	}
})();
