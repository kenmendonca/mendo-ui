(function () {
	angular.module('formGroup')
	.directive('uiFormGroup',uiFormGroup);

	uiFormGroup.$inject = ['componentService','$state'];
	function uiFormGroup(componentService,$state){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '<%=componentsPath%>formGroup/formGroup.directive.html',
			controller : 'FormGroupController'
		};

		return directive;
	}
})(); 