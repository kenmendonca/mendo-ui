(function () {
	angular.module('componentSevered')
	.directive('uiComponentSevered',uiComponentSevered);

	uiComponentSevered.$inject = ['componentService','utilitiesFactory','$compile'];

	function uiComponentSevered(componentService, utilitiesFactory,$compile){
		var directive = {
			restrict : 'E',
			link : linker,
			scope : {}
		};

		return directive;

		function linker(scope, element, attrs){

			scope.component = angular.fromJson(attrs.component);
			template = '<span><ui-component component="component"></ui-component></span>';
			element.replaceWith($compile(template)(scope));

		}
	}
})(); 