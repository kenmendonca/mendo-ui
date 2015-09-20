(function () {
	angular.module('checkboxListAtom')
	.controller('CheckboxListAtomController',CheckboxListAtomController);

	CheckboxListAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','utilitiesFactory'];

	function CheckboxListAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory, utilitiesFactory){
		$scope.data = dataService.data;
		$scope.form = dataService.form;

		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'disabled' : 'Boolean'
		};

		$scope.updateCheckboxListGroup = function(){
			var isChecked = utilitiesFactory.getNestedProperty($scope.component.model);
			var checkboxListGroupArray = utilitiesFactory.getNestedProperty($scope.component.groupModel);
			if(isChecked){
			//add to groupModel
			if(!angular.isArray(checkboxListGroupArray))
				utilitiesFactory.dynamicSetNestedProperty($scope.component.groupModel, [$scope.component.value]);
			else
				utilitiesFactory.nestedArrayPush($scope.component.groupModel, $scope.component.value);
			}
			else{
			//remove from groupModel
			var index = checkboxListGroupArray.indexOf($scope.component.value);
			if(index != -1){
					utilitiesFactory.nestedArraySplice($scope.component.groupModel, index, 1);
			}
			}
		};
		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var checkboxListAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

		})(); 
	}
})(); 