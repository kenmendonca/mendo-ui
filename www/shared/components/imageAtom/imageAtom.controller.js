(function () {
	angular.module('imageAtom')
	.controller('ImageAtomController',ImageAtomController);

	ImageAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory'];

	function ImageAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String'
		};


		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			if($scope.component.imageType == 'link')
			{
				componentFactory.controller.config.click($scope,{
					pageTitle : pageTitle,
					clickAction : $scope.component.clickAction,
					clickFnScopePath : 'clickFn',
					clickFnScaffoldName : 'clickFn',
					href : $scope.component.href,
					validateForm : $scope.component.validateForm
				});
			}

			var imageAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

		})(); 
	}
})(); 