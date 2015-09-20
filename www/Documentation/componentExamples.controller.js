(function () {
	angular.module('documentationApp')
	.controller('ComponentExamples',ComponentExamples);
	ComponentExamples.$inject = ['$scope','dataService','$timeout','mdFile','$state','$location'];
	function ComponentExamples($scope,dataService,$timeout, mdFile, $state,$location){
		var page = $state.current.name;
		var currentMdFile = mdFile[page];
		var jsonStart = currentMdFile.indexOf('[JSON]');
		var jsonEnd = currentMdFile.indexOf('[/JSON]');
		if(page == 'components'){
			$scope.components = angular.fromJson(currentMdFile.substring(jsonStart + 6,jsonEnd));
		}

		$scope.data = dataService.data;
		$scope.data.paginationAtomModel = {
			currentPage : 2,
			numberPages : 10
		};
		$scope.gotoSection = function(event){
			/*
			var el = angular.element(event.currentTarget);
			el.next().trigger('click');
			*/
		};
		$scope.data.sortTableData = [{
									name : 'Bob',
									age : 12
								 },
								 {
								 	name : 'Ken',
								 	age : 22
								 },
								 {
								 	name : 'Jim',
								 	age : 90
								 },
								 {
								 	name : 'John',
								 	age : 13
								 },
								 {
								 	name : 'Bill',
								 	age : 31
								 }];

		$timeout(function(){
			$("a[href='#']").click(function(event){
				event.preventDefault();
			});
		},1000);
	$('body').scrollspy({target : '#sidebar'});
	};
})(); 