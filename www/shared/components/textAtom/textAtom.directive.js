(function() {
	angular.module('textAtom')
	.directive('uiTextAtom', uiTextAtom);

	uiTextAtom.$inject = ['$compile','componentService'];

	function uiTextAtom($compile,componentService) {
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '<%=componentsPath%>textAtom/textAtom.directive.html',
			controller : 'TextAtomController',
			link : linker
		};

		return directive;

		function linker(scope,element,attrs){
		if(scope.component.style != 'custom class' && scope.component.style != 'default'){
			var styleElement = '';
			switch(scope.component.style){
				case 'bold':
				styleElement = 'b';
				break;
				case 'italics':
				styleElement = 'em';
				break;
				case 'underline':
				styleElement = 'u';
				break;
				case 'strikethrough':
				styleElement = 's';
				break;	
				case 'small':
				styleElement = 'small';
				break;														
			}
			element.wrapInner('<' + styleElement + '/>');
		}
		}
	}
})();
