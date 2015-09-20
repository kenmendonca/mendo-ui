(function() {
	angular.module('preview')
		.controller('PreviewController', PreviewController);

	PreviewController.$inject = ['$scope', '$rootScope'];

	function PreviewController($scope, $rootScope) {
		$scope.directory = angular.copy($rootScope.directory);
		$scope.previewMode = 'laptop';
		$scope.previousHistoryLength = document.getElementsByName("previewIframe")[0].contentWindow.history.length + 1;
		$scope.dimensions = {
			laptop: {
				dimensionsX: 1366,
				dimensionsY: 768
			},
			tablet: {
				dimensionsX: 1024,
				dimensionsY: 768
			},
			phone: {
				dimensionsX: 480,
				dimensionsY: 320
			}
		}

		$scope.previewModeFunc = function() {
			if ($scope.previewMode == 'custom') {
				$scope.dimensionsX = $scope.customDimensionsX;
				$scope.dimensionsY = $scope.customDimensionsY;
			} else {
				$scope.dimensionsX = $scope.dimensions[$scope.previewMode].dimensionsX;
				$scope.customDimensionsX = $scope.dimensions[$scope.previewMode].dimensionsX;
				$scope.dimensionsY = $scope.dimensions[$scope.previewMode].dimensionsY;
				$scope.customDimensionsY = $scope.dimensions[$scope.previewMode].dimensionsY;
			}
		};
		(function() {
			$scope.previewModeFunc();
		})();
	}
})();
