(function () {
	angular.module('checkboxGroup')
	.directive('uiCheckboxGroup',uiCheckboxGroup);

	uiCheckboxGroup.$inject = ['componentService','$state'];
	function uiCheckboxGroup(componentService,$state){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '<%=componentsPath%>checkboxGroup/checkboxGroup.directive.html',
			controller : 'CheckboxGroupController'
		};

		return directive;
	}
})(); 