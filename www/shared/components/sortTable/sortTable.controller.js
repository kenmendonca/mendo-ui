(function() {
	angular.module('sortTable')
		.controller('SortTableController', SortTableController);

	SortTableController.$inject = ['$scope', '$element', '$attrs', '$state', '$compile', 'dataService', 'scaffoldService', 'componentFactory', '$q','utilitiesFactory','$filter'];

	function SortTableController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory, $q, utilitiesFactory, $filter) {
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope, $element, $attrs);

		var allowedVariables = {
			'shown': 'String'
		};
		$scope.predicate = "";
		$scope.reverse = false;
		var reassignedPerPageModel = utilitiesFactory.getNestedProperty($scope.component.perPageModel) || "100";
		utilitiesFactory.setNestedProperty($scope.component.perPageModel,reassignedPerPageModel);

		var reassignNumberPages = function(searchModel, perPageModel){
			var modelValue = angular.copy(utilitiesFactory.getNestedProperty($scope.component.model)) || [];
			var subArray = $filter('filter')(modelValue,searchModel,false);

			//debugger;
			utilitiesFactory.setNestedProperty($scope.component.paginationModel,{
				currentPage : 1, 
				numberPages : Math.ceil(subArray.length/perPageModel)
			});
		};
		
		reassignNumberPages("",reassignedPerPageModel);

		$scope.columnAssignComponent = function(trIndex, tdIndex, rowData){
			var tableColumn = angular.copy($scope.component.columns[tdIndex]);
			var componentToAssign = tableColumn.tableData.contents;
			var key = tableColumn.key;
			var data = rowData[key] || "";
			utilitiesFactory.iterateThroughObject(componentToAssign,function(object,property){
				if(property === 'identifier')
					object[property] = object[property] + '_' + trIndex;
				if(property == 'content'){
					var content = angular.copy(object[property]);
					if(angular.isString(content) && content.indexOf('REPLACE') !== -1){
						content = content.replace(/REPLACE/g, data);
						object[property] = content;
					}
				}
			});
			return componentToAssign;
		};

		$scope.$watch('data.' + $scope.component.searchModel,function(newValue, oldValue){
			var perPageModel = utilitiesFactory.getNestedProperty($scope.component.perPageModel);
			reassignNumberPages(newValue, perPageModel);
		});

		$scope.$watch('data.' + $scope.component.perPageModel,function(newValue, oldValue){
			var searchModel = utilitiesFactory.getNestedProperty($scope.component.searchModel);
			reassignNumberPages(searchModel, newValue);
		});

		$scope.sortColumn = function(key){
			if($scope.predicate !== key)
				$scope.predicate = key;
			else
				$scope.reverse = !$scope.reverse;
		};

		/*
		$scope.refreshTable = function(){
			var copy = angular.copy(utilitiesFactory.getNestedProperty($scope.component.model));
			console.log(copy);
			utilitiesFactory.setNestedProperty($scope.component.model,[]);
			utilitiesFactory.setNestedProperty($scope.component.model,copy);
		};
		*/
		
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

			if(hasDeferred)
				tableComponent.readyDeferred.resolve();
			/*
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

				*/
			})();
	}

})();
