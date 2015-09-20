(function() {
	angular.module('scaffoldeditor')
		.controller('ScaffoldeditorCompConfigController', ScaffoldeditorCompConfigController);

	ScaffoldeditorCompConfigController.$inject = ['$rootScope', '$scope', '$compile', '$timeout'];

	function ScaffoldeditorCompConfigController($rootScope, $scope, $compile, $timeout) {
		$scope.moveComponent = function(direction) {
			var shiftIndex = 0;
			var compIndex = parseInt($scope.compindex);
			if (direction == 'up') {
				shiftIndex = -1;
			} else if (direction == 'down') {
				shiftIndex = 1;
			}
			
			var copy = angular.copy($scope.scaffoldeditorCompConfig[compIndex]);
			$scope.scaffoldeditorCompConfig[compIndex] = angular.copy($scope.scaffoldeditorCompConfig[compIndex + shiftIndex]);
			$scope.scaffoldeditorCompConfig[compIndex + shiftIndex] = copy;

			$rootScope.refreshRenderFunc();

		};
		$scope.removeComponent = function() {
			$scope.scaffoldeditorCompConfig.splice($scope.compindex, 1);
			$rootScope.refreshRenderFunc();
		};

		$scope.editComponent = function() {

			$rootScope.sampleComponent = angular.copy($scope.scaffoldeditorCompConfig[$scope.compindex]);
			$(".componentModal").modal('show'); 
			$(".componentModal").attr('editing', 'true');

			$(".componentModal-pg1").show();
			$(".componentModal-pg2").hide();
			$(".componentModal").one('shown.bs.modal', function() {
				$(".componentModal-pg1 button").trigger('click');
			});
			var unregister = $rootScope.$watch('sampleComponent', function(newValue, oldValue) {
				if ($rootScope.sampleComponent && newValue != oldValue) {
					$scope.scaffoldeditorCompConfig[$scope.compindex] = angular.copy($rootScope.sampleComponent);
					$(".componentModal").modal('hide');

					$rootScope.refreshRenderFunc();
					unregister();
				}
			});

			$(".componentModal").one('hide.bs.modal', function() {
				$(".componentModal").removeAttr('editing');
				unregister();
			})

		};
	}
})();
