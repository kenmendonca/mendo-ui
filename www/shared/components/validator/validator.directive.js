(function() {
	angular.module('validator')
		.directive('uiValidator', uiValidator);

	uiValidator.$inject = ['scaffoldService', 'validatorService', '$q'];

	function uiValidator(scaffoldService, validatorService, $q) {
		var directive = {
			restrict: 'A',
			require: 'ngModel',
			link: linker
		};
		return directive;

		function linker(scope, element, attrs, controller) {

			//which component
			//var componentType = scope.type;

			var validators = attrs['uiValidator'].split('&');

			for (var i = 0; i < validators.length; i++) {
				(function() {
					var splitValidator = validators[i].split('%');
					var sync = (splitValidator[0] == 'sync');
					var condition = splitValidator[1];
					var validatorParameter = splitValidator[2];

					controller.$validators[condition] = function(value) {
						var param = validatorParameter;
						var validatorFn = validatorService.getValidator(sync,condition); 
						return validatorFn(param, value);
					}
				})();
			}


		}
	}
})();
