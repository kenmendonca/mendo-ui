(function () {
	angular.module('paragraph')
	.controller('ParagraphController',ParagraphController);

	ParagraphController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$q'];
	function ParagraphController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$q){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var paragraphComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : false,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			var hasDeferred = paragraphComponent.readyDeferred ? true : false;

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
					component : paragraphComponent
				});

				if(hasDeferred)
					promiseArr.push(subcomponent.ready);
			}

			if(hasDeferred){
				$q.all(promiseArr).then(function(){
					paragraphComponent.readyDeferred.resolve();
				});
			}
		})(); 
	}

})(); 