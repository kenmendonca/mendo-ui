(function() {
	angular.module('dropdownAtom')
	.directive('uiDropdownAtom', uiDropdownAtom);

	uiDropdownAtom.$inject = ['$compile','componentService'];

	function uiDropdownAtom($compile,componentService) {
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '<%=componentsPath%>dropdownAtom/dropdownAtom.directive.html',
			controller : 'DropdownAtomController'
		};

		return directive;
	}
})();
