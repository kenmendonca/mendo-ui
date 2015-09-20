(function () {
	angular.module('errorMessages')
	.controller('ErrorMessagesController',ErrorMessagesController);

	ErrorMessagesController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$q'];
	function ErrorMessagesController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$q){
		$scope.data = dataService.data;
		$scope.form = dataService.form;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var errorMessagesComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : false,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			var hasDeferred = errorMessagesComponent.readyDeferred ? true : false;

			var validatorsArr = $scope.component.validators;
			var promiseArr = [];
			for(var i = 0; i < validatorsArr.length; i++){
				var subcomponentIdentifier = validatorsArr[i].contents.identifier;
				var subcomponentType = validatorsArr[i].contents.type;

				var subcomponent = componentFactory.controller.config.createSubcomponent({
					pageTitle : pageTitle,
					identifier : subcomponentIdentifier,
					componentType : subcomponentType,
					createDeferred : hasDeferred,
					assignSubcomponent : true,
					component : errorMessagesComponent
				});

				if(hasDeferred)
					promiseArr.push(subcomponent.ready);
			}

			if(hasDeferred){
				$q.all(promiseArr).then(function(){
					errorMessagesComponent.readyDeferred.resolve();
				});
			}
		})(); 
	}

})(); 