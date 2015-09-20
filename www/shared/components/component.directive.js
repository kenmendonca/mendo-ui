(function() {
	angular.module('component')
		.directive('uiComponent', uiComponent);

	uiComponent.$inject = ['$compile','componentService','utilitiesFactory'];

	function uiComponent($compile,componentService,utilitiesFactory) {
		var directive = {
			restrict: 'E',
			link: linker,
			scope: {
				component: '='
			}
		};
		return directive;

		function linker(scope, element, attrs) {
			
			var componentIdentifier = "";

			if (attrs.ovrStrIdentifier)
				scope.identifier = angular.copy(attrs.ovrStrIdentifier);
			else
			{
				try{
				scope.identifier = angular.copy(scope.component.identifier);
			}catch(err){debugger;}
			}
			
			if (attrs.ovrStrType)
				scope.type = angular.copy(attrs.ovrStrType);
			else
				scope.type = angular.copy(scope.component.type);


			var linkedAttr = "";
			if(attrs.hasOwnProperty('linked'))
				linkedAttr = " linked ";
			//components which need the scope object in the compile function
			//can use the componentService
			//for dot notation delimit by underscores
			//if whatever is passed does not evaluate properly, it is not assigned
			//if it is malformed JSON, an error will be thrown

			//if overwritten type, this becomes the new component
			switch(scope.type){
				case 'inputAtom':
				case 'textareaAtom':
				case 'selectAtom':
				case 'radioAtom':
				case 'checkboxAtom':
				case 'checkboxListAtom':
				case 'errorMessages':
				case 'sortTable':
				case 'heading':
				case 'paragraph':
				var extendedComponentService = angular.copy(componentService[scope.identifier]) || {};
				componentService[scope.identifier] = angular.extend({},angular.copy(scope.component),extendedComponentService);
				componentIdentifier = " component-identifier='" + scope.identifier + "' ";
				
				angular.forEach(attrs,function(value, key, obj){
					var csPath;
					var csValue;
					if(key.indexOf('ovrStr') === 0){
						csPath = key.charAt(6).toLowerCase() + key.substring(7).replace(/_/g,'.');
						csValue = value;
					}
					else if(key.indexOf('ovrNum') === 0){
						csPath = key.charAt(6).toLowerCase() + key.substring(7).replace(/_/g,'.');
						csValue = Number(value);
						csValue = isFinite(csValue) ? csValue : undefined;						
					}
					else if(key.indexOf('ovrBool') === 0){
						csPath = key.charAt(7).toLowerCase() + key.substring(8).replace(/_/g,'.');
						csValue;
						if(value === "false")
							csValue = false;
						else if(value === "true")
							csValue = true;
					}
					else if(key.indexOf('ovrJson') === 0){
						csPath = key.charAt(7).toLowerCase() + key.substring(8).replace(/_/g,'.');
						csValue = angular.fromJson(value);
					}
					else
						return;
					utilitiesFactory.setNestedProperty(csPath, csValue, componentService[scope.identifier]);					
				});

				if(componentService[scope.identifier].model && componentService[scope.identifier].model.length)
					componentService[scope.identifier].model = 'data.' + componentService[scope.identifier].model;
				
			}

			var deCamelCasedComponentType = scope.type.replace(/([A-Z])/g,'-$1').toLowerCase();

			var template = "<ui-" + deCamelCasedComponentType + " type='type' identifier='identifier' component='component' " + componentIdentifier + linkedAttr + "></ui-" + deCamelCasedComponentType + ">";

			element.replaceWith($compile(template)(scope));
		};
	}
})();
