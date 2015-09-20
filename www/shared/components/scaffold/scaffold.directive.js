(function(){
	angular.module('scaffold')
	.directive('uiScaffold', uiScaffold);

	uiScaffold.$inject = ['$compile','$http','$state','DIRECTORY','dataService','scaffoldService'];

	function uiScaffold($compile,$http,$state,DIRECTORY,dataService,scaffoldService){
		var directive = {
			restrict : 'E',
			link : linker,
			templateUrl : '<%=componentsPath%>scaffold/scaffold.directive.html',
			replace : true
		};

		return directive;

		function linker(scope, element, attrs) {
			var title = $state.current.data.title;
			scope.config = scaffoldService[title].config;
			scope.form = dataService.form;
			scope.form.showErrors[scope.config.title+'Form'] = false;

			scope.debuggerx = function(event){
				event.preventDefault();
			};
		}

	}
})();