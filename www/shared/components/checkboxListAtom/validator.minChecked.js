(function() {
	angular.module('checkboxListAtom')
		.directive('uiValidatorMinChecked', uiValidatorMinChecked);

	uiValidatorMinChecked.$inject = ['utilitiesFactory','$state'];
	function uiValidatorMinChecked(utilitiesFactory,$state) {
		var directive = {
			restrict: 'A',
			require: 'ngModel',
			link: linker
		};
		return directive;

		function linker(scope, element, attrs, controller) {
			var param = attrs.uiValidatorMinChecked.split('%');
			var groupModel = param[0];
			var groupNames = param[1].split(',');
			var min = param[2];
			controller.$validators.minChecked = function(value) {
				var groupModelArray = utilitiesFactory.getNestedProperty(groupModel) || [];
				if(groupModelArray.length < min)
					return false;
				else{
					try{ var pageTitle = $state.current.data.title; }
					catch(err) { return true; }

					for(var i = 0;i<groupNames.length;i++){
						try{
							//because the other checkboxes might not be defined
							scope.form[pageTitle+'Form'][groupNames[i]].$setValidity("minChecked",true);
						} catch(err) { return true; }
					}

					return true;
				}
			}
		}
	}
})();