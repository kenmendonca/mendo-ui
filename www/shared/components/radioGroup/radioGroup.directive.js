(function () {
	angular.module('radioGroup')
	.directive('uiRadioGroup',uiRadioGroup);

	uiRadioGroup.$inject = ['componentService','$state'];
	function uiRadioGroup(componentService,$state){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '<%=componentsPath%>radioGroup/radioGroup.directive.html',
			controller : 'RadioGroupController'
		};

		return directive;
	}
})(); 