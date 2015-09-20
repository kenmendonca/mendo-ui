(function() {
	angular.module('checkboxListAtom')
		.directive('uiValidatorMaxChecked', uiValidatorMaxChecked);

	uiValidatorMaxChecked.$inject = ['utilitiesFactory','$state'];
	function uiValidatorMaxChecked(utilitiesFactory,$state) {
		var directive = {
			restrict: 'A',
			require: 'ngModel',
			link: linker
		};
		return directive;

		function linker(scope, element, attrs, controller) {
			var param = attrs.uiValidatorMaxChecked.split('%');
			var groupModel = param[0];
			var groupNames = param[1].split(',');
			var max = param[2];
			controller.$validators.maxChecked = function(value) {
				var groupModelArray = utilitiesFactory.getNestedProperty(groupModel) || [];
				if(groupModelArray.length > max)
					return false;
				else{
					try{ var pageTitle = $state.current.data.title; }
					catch(err) { return true; }

					for(var i = 0;i<groupNames.length;i++){
						try{
							//because the other checkboxes might not be defined
							scope.form[pageTitle+'Form'][groupNames[i]].$setValidity("maxChecked",true);
						} catch(err) { return true; }
					}

					return true;
				}
			}
		}
	}
})();