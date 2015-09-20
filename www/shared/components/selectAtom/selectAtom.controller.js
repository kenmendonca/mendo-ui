(function () {
	angular.module('selectAtom')
	.controller('SelectAtomController',SelectAtomController);

	SelectAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory'];

	function SelectAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory){
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

			var selectAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

		})(); 
	}
})(); 