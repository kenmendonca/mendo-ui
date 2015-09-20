(function() {
	angular.module('plaintextAtom')
	.directive('uiPlaintextAtom', uiPlaintextAtom);

	uiPlaintextAtom.$inject = ['$compile','componentService'];

	function uiPlaintextAtom($compile,componentService) {
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '<%=componentsPath%>plaintextAtom/plaintextAtom.directive.html',
			controller : 'PlaintextAtomController'
		};

		return directive;
	}
})();
