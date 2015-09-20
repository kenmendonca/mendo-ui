(function () {
	angular.module('inputAtom')
	.controller('InputAtomController',InputAtomController);

	InputAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory'];

	function InputAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory){
		$scope.data = dataService.data;
		$scope.form = dataService.form;

		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'readonly' : 'Boolean',
			'disabled' : 'Boolean',
			'placeholder' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var inputAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

		})(); 
	}
})(); 