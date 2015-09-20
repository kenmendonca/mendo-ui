(function() {
	angular.module('utilities')
		.directive('utilCommas', utilCommas);

	function utilCommas() {
		var directive = {
			require: 'ngModel',
			restrict: 'A',
			link: linker
		};

		return directive;

		function linker(scope, element, attrs, ngModelController) {
			element.on('keyup', function(e) {
				if (!((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)))
					return;
				val = ($(this).val() || '').replace(/,/g, '');
				var commaVal = val.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				if (commaVal != val)
					$(this).val(commaVal);
			});
			ngModelController.$parsers.push(function(inputValue) {
				return inputValue.replace(/,/g, '');
			});
		}
	}
})();
