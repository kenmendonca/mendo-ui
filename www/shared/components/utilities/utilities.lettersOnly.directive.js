(function(){
	angular.module('utilities')
	.directive('utilLettersOnly',utilLettersOnly);

	function utilLettersOnly(){
		var directive = {
			require : 'ngModel',
			restrict : 'A',
			link : linker
		};

		return directive;

		function linker(scope, element, attrs, ngModelController) {
		    ngModelController.$parsers.push(function (inputValue) {
		        // this next if is necessary for when using ng-required on your input. 
		        // In such cases, when a letter is typed first, this parser will be called
		        // again, and the 2nd time, the value will be undefined
		        if (inputValue == undefined) return ''
		        var transformedInput = inputValue.replace(/[^A-Za-z]/g, '');
		        if (transformedInput != inputValue) {
		            ngModelController.$setViewValue(transformedInput);
		            ngModelController.$render();
		        }


		        return transformedInput;
		    });
		}
	}
})();