(function() {
	angular.module('utilities')
		.directive('utilAutoTab', utilAutoTab);
	//to be put on the input which require auto tabbing to immediate next input in the DOM

	function utilAutoTab() {
		var directive = {
			require: 'ngModel',
			restrict: 'A',
			link: linker
		};

		return directive;

		function linker(scope, element, attrs, ngModelController) {
			element.on('keyup', function(e) {
				var nextEl;
				for (nextEl = $(this).next(); nextEl.length != 0; nextEl = nextEl.next()) {
					if (nextEl.is('input')) break;
				}
				var maxlength = (element.attr('maxlength') || element.attr('util-auto-tab'));
				if (element.val().length == maxlength) {
					var attr = element.attr('util-numbers-only');
					if (typeof attr !== typeof undefined && attr !== false) {
						if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105))
							nextEl.focus();
					}
				}
			});
		}
	}
})();
