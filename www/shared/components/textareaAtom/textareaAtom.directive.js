(function() {
	angular.module('textareaAtom')
		.directive('uiTextareaAtom', uiTextareaAtom);

	uiTextareaAtom.$inject = ['$compile', 'dataService', '$timeout','componentService','componentFactory'];

	function uiTextareaAtom($compile, dataService, $timeout, componentService, componentFactory) {
		var directive = {
			restrict: 'E',
			scope: {
				componentCopy: '=component',
				identifier: '=',
				type : '='
			},
			templateUrl: '<%=componentsPath%>textareaAtom/textareaAtom.directive.html',
			controller: 'TextareaAtomController',
			compile: compileFn,
			replace: true
		};
		return directive;

		function compileFn(tElement, tAttrs) {
			var component = componentService[tAttrs.componentIdentifier];

			var textareaElement = tElement.find('textarea');
			
			if(component.hasMask.hasMask){
				textareaElement.attr('ui-mask',component.hasMask.mask);
				textareaElement.attr('model-view-value',component.hasMask.maskModel);
				if(component.hasMask.maskPlaceholder.length)
					textareaElement.attr('ui-mask-placeholder',component.hasMask.maskPlaceholder);
			}
			
			if(component.model)
				textareaElement.attr('ng-model',component.model);
			textareaElement.attr('name', component.name);
			textareaElement.attr('id', component.id);

			if (component.utilities) {
				var utilitiesArr = component.utilities;
				for (var i = 0; i < utilitiesArr.length; i++) {
					if (utilitiesArr[i].utility == 'maxlength')
						textareaElement.attr('maxlength', utilitiesArr[i].parameters);
					else {
						var deCameled = utilitiesArr[i].utility.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
						textareaElement.attr("util-" + deCameled, utilitiesArr[i].parameters);
					}
				}
			}

			componentFactory.compiler.config.attachValidators(textareaElement, {
				validators : component.validators,
				componentType : 'textareaAtom',
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
