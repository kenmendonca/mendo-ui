(function () {
	angular.module('paginationAtom')
	.controller('PaginationAtomController',PaginationAtomController);

	PaginationAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$q','utilitiesFactory'];
	function PaginationAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$q,utilitiesFactory){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String'
		};

		$scope.leftEllipsis = false;
		$scope.rightEllipsis = false;

		$scope.numberPages;
		$scope.currentPage;
		
		$scope.$watch('data.' + $scope.component.model + '.currentPage',function(newValue, oldValue){
			if(newValue != oldValue)
			{
				if($scope.currentPage != newValue)
				{
					$scope.currentPage = newValue;
					calculatePages();
				}
			}
		});
		$scope.$watch('data.' + $scope.component.model + '.numberPages',function(newValue, oldValue){
			if(newValue != oldValue)
			{
				if($scope.numberPages != newValue)
				{
				$scope.numberPages = newValue;
				calculatePages();
				}
			}
		});
		
		var calculatePages = function(){
			var paginationAtomModelValue = angular.copy(utilitiesFactory.getNestedProperty($scope.component.model) || {});
			
			var numberPages = $scope.numberPages || paginationAtomModelValue.numberPages || 1;
			var currentPage = $scope.currentPage || paginationAtomModelValue.currentPage || 1;

			var offset = parseInt($scope.component.maxWidth/2);

			var pages = [];
			var leftEllipsis = false;
			var rightEllipsis = false;
			for(var i = 0; i<$scope.component.maxWidth; i++){
				var page = currentPage - offset + i;

				if(page >= 2 && page <= numberPages - 1)
					pages.push({
						pageNumber : page
						//$$hashKey : function() {return angular.toJson(this)}
					});
			}
			
			if((pages[0] || {}).pageNumber > 2)
				leftEllipsis = true;
			
			if((pages[pages.length - 1] || {}).pageNumber < numberPages - 1)
				rightEllipsis = true;
			
		$scope.leftEllipsis = leftEllipsis;
		$scope.rightEllipsis = rightEllipsis;

		$scope.numberPages = numberPages;
		$scope.currentPage = currentPage;

		utilitiesFactory.setNestedProperty($scope.component.model,{
			numberPages : numberPages,
			currentPage : currentPage
		});
		$scope.pages = pages;
		};

		$scope.gotoPage = function(index,event){
			if(event)
				event.preventDefault();
			if($scope.currentPage == index || index < 1 || index > $scope.numberPages)
				return;
			$scope.currentPage = index;
			calculatePages();
		};

		(function () {
			calculatePages();
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var paginationAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});
		})(); 
	}

})(); 