(function () {
	angular.module('textAtom')
	.controller('TextAtomController',TextAtomController);

	TextAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$timeout'];

	function TextAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$timeout){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		/*
		if($scope.component.style != 'custom class'){
			var styleElement = '';
			switch($scope.component.style){
				case 'bold':
				styleElement = 'b';
				break;
				case 'italics':
				styleElement = 'em';
				break;
				case 'underline':
				styleElement = 'u';
				break;
				case 'strikethrough':
				styleElement = 's';
				break;	
				case 'small':
				styleElement = 'small';
				break;														
			}
			$element.wrapInner('<' + styleElement + '/>');
		}
		
		*/

		var allowedVariables = {
			'content' : 'String',
			'shown' : 'String'
		};

		if($scope.component.compile)
			{
				$timeout(function(){
					$compile($element.contents())($scope);
				},0);
			}

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			if($scope.component.textType == 'link')
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

			var textAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			textAtomComponent.recompile = function(){
				$compile($element.contents())($scope);
			}
		})(); 
	}
})(); 