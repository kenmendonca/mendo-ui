(function() {
	angular.module('table')
		.controller('TableController', TableController);

	TableController.$inject = ['$scope', '$element', '$attrs', '$state', '$compile', 'dataService', 'scaffoldService', 'componentFactory', '$q'];

	function TableController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory, $q) {
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope, $element, $attrs);

		var allowedVariables = {
			'shown': 'String'
		};

		(function() {
			try {
				pageTitle = $state.current.data.title;
			} catch (err) {
				return;
			}

			var tableComponent = componentFactory.controller.config.componentToScaffoldService($scope, {
				pageTitle: pageTitle,
				resolveReadyIfPresent: false,
				bindGetAndSet: true,
				allowedVariables: allowedVariables
			});

			var hasDeferred = tableComponent.readyDeferred ? true : false;

			var promiseArr = [];
			for (var i = 0; i < $scope.component.tableHeaders.length; i++) {
				//create subcomponent for the text/plaintext
				var tableHeader = $scope.component.tableHeaders[i].contents;
				var tableHeaderIdentifier = tableHeader.identifier;
				var tableHeaderType = tableHeader.type;

				var tableHeaderSubcomponent = componentFactory.controller.config.createSubcomponent({
					pageTitle: pageTitle,
					identifier: tableHeaderIdentifier,
					componentType: tableHeaderType,
					createDeferred: hasDeferred,
					assignSubcomponent: true,
					component: tableComponent
				});

				if (hasDeferred)
					promiseArr.push(tableHeaderSubcomponent.ready);

			}

			for (var i = 0; i < $scope.component.tableRows.length; i++) {
				for (var j = 0; j < $scope.component.tableRows[i].length; j++) {
					//create subcomponent for the text/plaintext
					var tableColumn = $scope.component.tableRows[i][j].contents;
					var tableColumnIdentifier = tableColumn.identifier;
					var tableColumnType = tableColumn.type;

					var tableColumnSubcomponent = componentFactory.controller.config.createSubcomponent({
						pageTitle: pageTitle,
						identifier: tableColumnIdentifier,
						componentType: tableColumnType,
						createDeferred: hasDeferred,
						assignSubcomponent: true,
						component: tableComponent
					});

					if (hasDeferred)
						promiseArr.push(tableColumnSubcomponent.ready);

				}

				if (hasDeferred) {
					$q.all(promiseArr).then(function() {
						tableComponent.readyDeferred.resolve();
					});
				}
			}
		})();
	}

})();
