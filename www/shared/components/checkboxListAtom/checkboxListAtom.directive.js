(function() {
	angular.module('checkboxListAtom')
		.directive('uiCheckboxListAtom', uiCheckboxListAtom);

	uiCheckboxListAtom.$inject = ['$compile', 'dataService', '$timeout','componentService','componentFactory'];

	function uiCheckboxListAtom($compile, dataService, $timeout, componentService, componentFactory) {
		var directive = {
			restrict: 'E',
			scope: {
				componentCopy: '=component',
				identifier: '=',
				type : '='
			},
			templateUrl: '<%=componentsPath%>checkboxListAtom/checkboxListAtom.directive.html',
			controller: 'CheckboxListAtomController',
			compile: compileFn,
			replace: true
		};
		return directive;

		function compileFn(tElement, tAttrs) {
			var component = componentService[tAttrs.componentIdentifier];

			var checkboxListElement = tElement.find('input');
			
			
			if(component.model)
				checkboxListElement.attr('ng-model',component.model);
			checkboxListElement.attr('name', component.name);
			checkboxListElement.attr('id', component.id);

			componentFactory.compiler.config.attachValidators(checkboxListElement, {
				validators : component.validators,
				componentType : 'checkboxListAtom',
				aliasedValidators : {
					required : 'required'
				}
			});
		
		delete componentService[tAttrs.componentIdentifier];
		};
	}
})();
