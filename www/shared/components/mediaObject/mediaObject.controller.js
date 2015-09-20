(function() {
	angular.module('mediaObject')
		.controller('MediaObjectController', MediaObjectController);

	MediaObjectController.$inject = ['$scope', 'scaffoldService', '$state', '$attrs','componentFactory','$element', '$q'];

	function MediaObjectController($scope, scaffoldService, $state, $attrs, componentFactory, $element, $q) {
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var mediaObjectComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : false,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			
			var hasDeferred = mediaObjectComponent.readyDeferred ? true : false;

			var contentsArray = $scope.component.contents.contentsArray;
			var promiseArr = [];
			for(var i = 0; i < contentsArray.length; i++){
				for(var prop in contentsArray[i]){
					var subcomponentComponent = contentsArray[i][prop];
					var subcomponentComponentIdentifier = subcomponentComponent.identifier;
					var subcomponentComponentType = subcomponentComponent.type;

					var subcomponent = componentFactory.controller.config.createSubcomponent({
						pageTitle : pageTitle,
						identifier : subcomponentComponentIdentifier,
						componentType : subcomponentComponentType,
						createDeferred : hasDeferred,
						assignSubcomponent : true,
						component : mediaObjectComponent
					});

					if(hasDeferred)
						promiseArr.push(subcomponent.ready);
				}
			}

			if(hasDeferred){
				$q.all(promiseArr).then(function(){
					mediaObjectComponent.readyDeferred.resolve();
				});
			}

		})(); 
	}

})();
