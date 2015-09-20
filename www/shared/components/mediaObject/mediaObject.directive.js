(function(){
	angular.module('mediaObject')
	.directive('uiMediaObject',uiMediaObject);

	uiMediaObject.$inject = ['$compile'];

	function uiMediaObject($compile){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			templateUrl : '<%=componentsPath%>mediaObject/mediaObject.directive.html',
			controller: 'MediaObjectController',
			replace: true
		};
		
		return directive;
		}
})();