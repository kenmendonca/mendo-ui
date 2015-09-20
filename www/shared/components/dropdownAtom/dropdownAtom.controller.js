(function () {
	angular.module('dropdownAtom')
	.controller('DropdownAtomController',DropdownAtomController);

	DropdownAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory'];

	function DropdownAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'title' : 'String',
			'disabled' : 'Boolean'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			$scope.clickFns = [];
			for(var i = 0; i<$scope.component.dropdownMenu.length; i++){
				(function () {
					var menuItem = $scope.component.dropdownMenu[i];
					if(menuItem.menuItemType == 'link'){
						componentFactory.controller.config.click($scope,{
							pageTitle : pageTitle,
							clickAction : menuItem.clickAction,
							clickFnScopePath : 'clickFns['+menuItem.clickFnName+']',
							clickFnScaffoldName : menuItem.clickFnName,
							href : menuItem.href,
							validateForm : menuItem.validateForm
						});
					}
				})(); 
			}

			var dropdownAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			dropdownAtomComponent.clickFns = dropdownAtomComponent.clickFns || {};
		})(); 
	}
})(); 