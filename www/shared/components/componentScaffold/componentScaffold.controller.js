(function() {
	angular.module('componentScaffold')
		.controller('ComponentScaffoldController', ComponentScaffoldController);

	ComponentScaffoldController.$inject = ['$scope', '$element', '$attrs', '$state', '$compile', 'dataService', 'scaffoldService', 'componentFactory', '$q'];

	function ComponentScaffoldController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory, $q) {

		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope, $element, $attrs);

		var allowedVariables = {
			'shown': 'String'
		};

		(function() {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var componentScaffoldComponent = componentFactory.controller.config.componentToScaffoldService($scope, {
				pageTitle: pageTitle,
				resolveReadyIfPresent: false,
				bindGetAndSet: true,
				allowedVariables: allowedVariables
			});

			var hasDeferred = componentScaffoldComponent.readyDeferred ? true : false;

			var promiseArr = [];

			//triply nested for loop!!!
			for (var i = 0; i < $scope.component.row.length; i++) {
				for (var j = 0; j < $scope.component.row[i].length; j++) {
					//create subcomponent for a sub-subcomponentScaffold, if present
					var column = $scope.component.row[i][j];
					if (column.subComponentScaffold.hasSubComponentScaffold) {
						var subComponentScaffoldIdentifier = column.subComponentScaffold.componentScaffold.identifier;
						var subComponentScaffoldType = column.subComponentScaffold.componentScaffold.type;

						var subComponentScaffoldSubcomponent = componentFactory.controller.config.createSubcomponent({
							pageTitle: pageTitle,
							identifier: subComponentScaffoldIdentifier,
							componentType: subComponentScaffoldType,
							createDeferred: hasDeferred,
							assignSubcomponent: true,
							component: componentScaffoldComponent
						});

						if (hasDeferred)
							promiseArr.push(subComponentScaffoldSubcomponent.ready);
					}

					for (var k = 0; k < $scope.component.row[i][j].scaffoldComponents.length; k++) {
						//create subcomponent for the text/plaintext
						var scaffoldComponent = $scope.component.row[i][j].scaffoldComponents[k];
						var scaffoldComponentIdentifier = scaffoldComponent.identifier;
						var scaffoldComponentType = scaffoldComponent.type;

						var scaffoldComponentSubcomponent = componentFactory.controller.config.createSubcomponent({
							pageTitle: pageTitle,
							identifier: scaffoldComponentIdentifier,
							componentType: scaffoldComponentType,
							createDeferred: hasDeferred,
							assignSubcomponent: true,
							component: componentScaffoldComponent
						});

						if (hasDeferred)
							promiseArr.push(scaffoldComponentSubcomponent.ready);
					}

				}
			}


			if (hasDeferred) {
				$q.all(promiseArr).then(function() {
					componentScaffoldComponent.readyDeferred.resolve();
				});
			}
		})();

	}

})();
