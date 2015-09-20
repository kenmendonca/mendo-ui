(function () {
	angular.module('buttonAtom')
	.controller('ButtonAtomController',ButtonAtomController);

	ButtonAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory'];

	function ButtonAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'content' : 'String',
			'disabled' : 'Boolean',
			'href' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }
			componentFactory.controller.config.click($scope,{
				pageTitle : pageTitle,
				clickAction : $scope.component.clickAction,
				clickFnScopePath : 'clickFn',
				clickFnScaffoldName : 'clickFn',
				href : $scope.component.href,
				validateForm : $scope.component.validateForm
			});

			var buttonAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});
		})(); 
	}
})(); 