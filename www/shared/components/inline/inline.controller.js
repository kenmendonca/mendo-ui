(function () {
	angular.module('inline')
	.controller('InlineController',InlineController);

	InlineController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$q'];
	function InlineController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$q){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var inlineComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : false,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			var hasDeferred = inlineComponent.readyDeferred ? true : false;

			var contents = $scope.component.contents;
			var promiseArr = [];
			for(var i = 0; i < contents.length; i++){
				var subcomponentIdentifier = contents[i].identifier;
				var subcomponentType = contents[i].type;

				var subcomponent = componentFactory.controller.config.createSubcomponent({
					pageTitle : pageTitle,
					identifier : subcomponentIdentifier,
					componentType : subcomponentType,
					createDeferred : hasDeferred,
					assignSubcomponent : true,
					component : inlineComponent
				});

				if(hasDeferred)
					promiseArr.push(subcomponent.ready);
			}

			if(hasDeferred){
				$q.all(promiseArr).then(function(){
					inlineComponent.readyDeferred.resolve();
				});
			}
		})(); 
	}

})(); 