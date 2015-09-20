(function() {
	angular.module('selectAtom')
		.directive('uiSelectAtom', uiSelectAtom);

	uiSelectAtom.$inject = ['$compile', 'dataService', '$timeout','componentService','componentFactory'];

	function uiSelectAtom($compile, dataService, $timeout, componentService, componentFactory) {
		var directive = {
			restrict: 'E',
			scope: {
				componentCopy: '=component',
				identifier: '=',
				type : '='
			},
			templateUrl: '<%=componentsPath%>selectAtom/selectAtom.directive.html',
			controller: 'SelectAtomController',
			compile: compileFn,
			replace: true
		};
		return directive;

		function compileFn(tElement, tAttrs) {
			var component = componentService[tAttrs.componentIdentifier];

			var selectElement = tElement.find('select');
			
			
			if(component.model)
				selectElement.attr('ng-model',component.model);
			selectElement.attr('name', component.name);
			selectElement.attr('id', component.id);
			if(component.multiple)
				selectElement.attr('multiple','');

			componentFactory.compiler.config.attachValidators(selectElement, {
				validators : component.validators,
				componentType : 'selectAtom',
				aliasedValidators : {
					required : 'required'
				}
			});
		
		delete componentService[tAttrs.componentIdentifier];
		};
	}
})();
