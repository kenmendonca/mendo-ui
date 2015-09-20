(function () {
	angular.module('accordion')
	.directive('uiAccordion',uiAccordion);

	function uiAccordion(){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '<%=componentsPath%>accordion/accordion.directive.html',
			controller : 'AccordionController'
		};

		return directive;
	}
})(); 