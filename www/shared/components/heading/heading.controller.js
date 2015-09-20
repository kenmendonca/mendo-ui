(function () {
	angular.module('heading')
	.controller('HeadingController',HeadingController);

	HeadingController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$q'];
	function HeadingController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$q){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String',
			'headingContent' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var headingComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : false,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			var hasDeferred = headingComponent.readyDeferred ? true : false;

			var promiseArr = [];

				var subcomponentIdentifier = $scope.component.contents.identifier;
				var subcomponentType = $scope.component.contents.type;

				var subcomponent = componentFactory.controller.config.createSubcomponent({
					pageTitle : pageTitle,
					identifier : subcomponentIdentifier,
					componentType : subcomponentType,
					createDeferred : hasDeferred,
					assignSubcomponent : true,
					component : headingComponent
				});

				if(hasDeferred)
					promiseArr.push(subcomponent.ready);

			if(hasDeferred){
				$q.all(promiseArr).then(function(){
					headingComponent.readyDeferred.resolve();
				});
			}
		})(); 
	}

})(); 