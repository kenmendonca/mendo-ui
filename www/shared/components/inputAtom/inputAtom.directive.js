(function() {
	angular.module('inputAtom')
		.directive('uiInputAtom', uiInputAtom);

	uiInputAtom.$inject = ['$compile', 'dataService', '$timeout','componentService','componentFactory'];

	function uiInputAtom($compile, dataService, $timeout, componentService, componentFactory) {
		var directive = {
			restrict: 'E',
			scope: {
				componentCopy: '=component',
				identifier: '=',
				type : '='
			},
			templateUrl: '<%=componentsPath%>inputAtom/inputAtom.directive.html',
			controller: 'InputAtomController',
			compile: compileFn,
			replace: true
		};
		return directive;

		function compileFn(tElement, tAttrs) {
			var component = componentService[tAttrs.componentIdentifier];

			var inputElement = tElement.find('input');
			
			if(component.hasMask.hasMask){
				inputElement.attr('ui-mask',component.hasMask.mask);
				inputElement.attr('model-view-value',component.hasMask.maskModel);
				if(component.hasMask.maskPlaceholder.length)
					inputElement.attr('ui-mask-placeholder',component.hasMask.maskPlaceholder);
			}
			
			if(component.model)
				inputElement.attr('ng-model',component.model);
			inputElement.attr('name', component.name);
			inputElement.attr('id', component.id);

			if (component.utilities) {
				var utilitiesArr = component.utilities;
				for (var i = 0; i < utilitiesArr.length; i++) {
					if (utilitiesArr[i].utility == 'maxlength')
						inputElement.attr('maxlength', utilitiesArr[i].parameters);
					else {
						var deCameled = utilitiesArr[i].utility.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
						inputElement.attr("util-" + deCameled, utilitiesArr[i].parameters);
					}
				}
			}

			componentFactory.compiler.config.attachValidators(inputElement, {
				validators : component.validators,
				componentType : 'inputAtom',
				aliasedValidators : {
					required : 'required',
					pattern : 'ng-pattern',
					minlength : 'ng-minlength',
					maxlength : 'ng-maxlength'

				}
			});
		
		delete componentService[tAttrs.componentIdentifier];
		};
	}
})();
