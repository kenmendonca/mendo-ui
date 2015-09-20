(function () {
	angular.module('plaintextAtom')
	.controller('PlaintextAtomController',PlaintextAtomController);

	PlaintextAtomController.$inject = ['$scope','$element','$attrs','$state','dataService','componentFactory'];

	function PlaintextAtomController($scope, $element, $attrs, $state, dataService, componentFactory){
			
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'content' : 'String',
			'shown' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }
			var plaintextAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

		})(); 
	}
})(); 