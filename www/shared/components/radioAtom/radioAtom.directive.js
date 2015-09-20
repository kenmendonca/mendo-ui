(function() {
	angular.module('radioAtom')
		.directive('uiRadioAtom', uiRadioAtom);

	uiRadioAtom.$inject = ['$compile', 'dataService', '$timeout','componentService','componentFactory'];

	function uiRadioAtom($compile, dataService, $timeout, componentService, componentFactory) {
		var directive = {
			restrict: 'E',
			scope: {
				componentCopy: '=component',
				identifier: '=',
				type : '='
			},
			templateUrl: '<%=componentsPath%>radioAtom/radioAtom.directive.html',
			controller: 'RadioAtomController',
			compile: compileFn,
			replace: true
		};
		return directive;

		function compileFn(tElement, tAttrs) {
			var component = componentService[tAttrs.componentIdentifier];

			var radioElement = tElement.find('input');
			
			
			if(component.model)
				radioElement.attr('ng-model',component.model);
			radioElement.attr('name', component.name);
			radioElement.attr('id', component.id);

			componentFactory.compiler.config.attachValidators(radioElement, {
				validators : component.validators,
				componentType : 'radioAtom',
				aliasedValidators : {
					required : 'required'
				}
			});
		
		delete componentService[tAttrs.componentIdentifier];
		};
	}
})();
