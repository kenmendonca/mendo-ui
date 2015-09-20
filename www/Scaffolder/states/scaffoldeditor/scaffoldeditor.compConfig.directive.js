(function() {
	angular.module('scaffoldeditor')
		.directive('scaffoldeditorCompConfig', scaffoldeditorCompConfig);

	scaffoldeditorCompConfig.$inject = ['$compile'];

	function scaffoldeditorCompConfig($compile) {
		var directive = {
			restrict: 'A',
			scope: {
				scaffoldeditorCompConfig: '=',
				compindex: '@'
			},
			controller: 'ScaffoldeditorCompConfigController',
			link: linker
		};

		return directive;

		function linker(scope, element, attrs) {
			$compile(element.contents())(scope);
		}

	};



})();
