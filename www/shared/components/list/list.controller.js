(function () {
	angular.module('list')
	.controller('ListController',ListController);

	ListController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$q'];
	function ListController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$q){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var listComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : false,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			var hasDeferred = listComponent.readyDeferred ? true : false;

			var listItems = $scope.component.listItems;
			var promiseArr = [];
			for(var i = 0; i < listItems.length; i++){
				//create subcomponent for the text/plaintext
				var textSubcomponentIdentifier = listItems[i].contents.identifier;
				var textSubcomponentType = listItems[i].contents.type;

				var textSubcomponent = componentFactory.controller.config.createSubcomponent({
					pageTitle : pageTitle,
					identifier : textSubcomponentIdentifier,
					componentType : textSubcomponentType,
					createDeferred : hasDeferred,
					assignSubcomponent : true,
					component : listComponent
				});

				if(hasDeferred)
					promiseArr.push(textSubcomponent.ready);

				//create subcomponent for a sublist, if present
				if(listItems[i].subList.hasSubList){
					var listSubcomponentIdentifier = listItems[i].subList.list.identifier;
					var listSubcomponentType = listItems[i].subList.list.type;

					var listSubcomponent = componentFactory.controller.config.createSubcomponent({
						pageTitle : pageTitle,
						identifier : listSubcomponentIdentifier,
						componentType : listSubcomponentType,
						createDeferred : hasDeferred,
						assignSubcomponent : true,
						component : listComponent
					});

					if(hasDeferred)
						promiseArr.push(listSubcomponent.ready);
				}


				
			}

			if(hasDeferred){
				$q.all(promiseArr).then(function(){
					listComponent.readyDeferred.resolve();
				});
			}
		})(); 
	}

})(); 