(function() {
	angular.module('date')
		.directive('uiValidatorDate', uiValidatorDate);

	function uiValidatorDate() {
		var directive = {
			restrict: 'A',
			require: 'ngModel',
			link: linker
		};
		return directive;

		function linker(scope, element, attrs, controller) {

			controller.$validators.date = function(value) {
				if ((value || "").length != 8)
					return true;
				else
					return moment(value, "MMDDYYYY").isValid();
			}
		}
	}
})();
