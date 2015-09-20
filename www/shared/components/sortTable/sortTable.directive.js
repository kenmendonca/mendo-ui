(function () {
	angular.module('sortTable')
	.directive('uiSortTable',uiSortTable);

	uiSortTable.$inject = ['componentService'];
	function uiSortTable(componentService){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '<%=componentsPath%>sortTable/sortTable.directive.html',
			controller : 'SortTableController',
			compile : compileFn
		};

		return directive;

		function compileFn(tElement, tAttrs) {
			var component = componentService[tAttrs.componentIdentifier];
			var searchModelFilter = "";
			var currentPageFilter = "";
			if(component.searchModel.length)
				searchModelFilter = " | filter:data." + component.searchModel;
			if(component.paginationModel.length && component.perPageModel.length)
				currentPageFilter = " | limitTo:data." + component.paginationModel + ".currentPage*data." + component.perPageModel + ' | limitTo:-data.' + component.perPageModel;
			var ngRepeatStr = ' in ' + component.model + ' | orderBy:predicate:reverse' + searchModelFilter + currentPageFilter;
			tElement.find("[sort-table-repeat]").each(function() {
				var ngRepeatVar = $(this).attr('ng-repeat');
				$(this).attr("ng-repeat", ngRepeatVar + ngRepeatStr);
			});
		delete componentService[tAttrs.componentIdentifier];
		}
	}
})(); 