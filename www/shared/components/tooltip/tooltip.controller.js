(function () {
	angular.module('tooltip')
	.controller('TooltipController',TooltipController);

	TooltipController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$q'];
	function TooltipController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$q){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String',
			'tooltipContent' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var tooltipComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : false,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			var hasDeferred = tooltipComponent.readyDeferred ? true : false;

			var promiseArr = [];

				var subcomponentIdentifier = $scope.component.contents.identifier;
				var subcomponentType = $scope.component.contents.type;

				var subcomponent = componentFactory.controller.config.createSubcomponent({
					pageTitle : pageTitle,
					identifier : subcomponentIdentifier,
					componentType : subcomponentType,
					createDeferred : hasDeferred,
					assignSubcomponent : true,
					component : tooltipComponent
				});

				if(hasDeferred)
					promiseArr.push(subcomponent.ready);

			if(hasDeferred){
				$q.all(promiseArr).then(function(){
					tooltipComponent.readyDeferred.resolve();
				});
			}
		})(); 
	}

})(); 