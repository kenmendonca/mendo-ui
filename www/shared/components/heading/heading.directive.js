(function () {
	angular.module('heading')
	.directive('uiHeading',uiHeading);

	uiHeading.$inject = ['componentService'];
	function uiHeading(componentService){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '<%=componentsPath%>heading/heading.directive.html',
			controller : 'HeadingController',
			link : linker
		};

		return directive;

		function linker(scope,element,attrs){
			var component = componentService[attrs.componentIdentifier];
			if((component.parentClass || "").length){
				scope.component.parentClass = component.parentClass;
			}
			delete componentService[attrs.componentIdentifier];
		}
	}
})(); 