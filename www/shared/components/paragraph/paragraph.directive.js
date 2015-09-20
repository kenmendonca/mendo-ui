(function () {
	angular.module('paragraph')
	.directive('uiParagraph',uiParagraph);

	uiParagraph.$inject = ['componentService'];
	function uiParagraph(componentService){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '<%=componentsPath%>paragraph/paragraph.directive.html',
			controller : 'ParagraphController',
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