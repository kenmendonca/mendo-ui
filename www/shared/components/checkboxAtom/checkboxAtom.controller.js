(function () {
	angular.module('checkboxAtom')
	.controller('CheckboxAtomController',CheckboxAtomController);

	CheckboxAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory'];

	function CheckboxAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory){
		$scope.data = dataService.data;
		$scope.form = dataService.form;

		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'disabled' : 'Boolean'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var checkboxAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

		})(); 
	}
})(); 