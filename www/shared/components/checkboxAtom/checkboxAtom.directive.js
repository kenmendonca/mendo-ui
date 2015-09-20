(function() {
	angular.module('checkboxAtom')
		.directive('uiCheckboxAtom', uiCheckboxAtom);

	uiCheckboxAtom.$inject = ['$compile', 'dataService', '$timeout','componentService','componentFactory'];

	function uiCheckboxAtom($compile, dataService, $timeout, componentService, componentFactory) {
		var directive = {
			restrict: 'E',
			scope: {
				componentCopy: '=component',
				identifier: '=',
				type : '='
			},
			templateUrl: '<%=componentsPath%>checkboxAtom/checkboxAtom.directive.html',
			controller: 'CheckboxAtomController',
			compile: compileFn,
			replace: true
		};
		return directive;

		function compileFn(tElement, tAttrs) {
			var component = componentService[tAttrs.componentIdentifier];

			var checkboxElement = tElement.find('input');
			
			if(component.model)
				checkboxElement.attr('ng-model',component.model);
			checkboxElement.attr('name', component.name);
			checkboxElement.attr('id', component.id);

			componentFactory.compiler.config.attachValidators(checkboxElement, {
				validators : component.validators,
				componentType : 'checkboxAtom',
				aliasedValidators : {
					required : 'required'
				}
			});
		
		delete componentService[tAttrs.componentIdentifier];
		};
	}
})();
