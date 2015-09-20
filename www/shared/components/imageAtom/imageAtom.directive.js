(function() {
	angular.module('imageAtom')
	.directive('uiImageAtom', uiImageAtom);

	uiImageAtom.$inject = ['$compile','componentService'];

	function uiImageAtom($compile,componentService) {
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '<%=componentsPath%>imageAtom/imageAtom.directive.html',
			controller : 'ImageAtomController'
		};

		return directive;

	}
})();
