(function() {
	angular.module('scaffoldeditor')
		.controller('ScaffoldeditorRowConfigController', ScaffoldeditorRowConfigController);

	ScaffoldeditorRowConfigController.$inject = ['$scope', '$rootScope', '$timeout'];

	function ScaffoldeditorRowConfigController($scope, $rootScope, $timeout) {

		$scope.removeRow = function(isContainer) {
			if (!confirm("Are you sure you want to remove this row?"))
				return;
			$scope.scaffoldeditorRowConfig.splice($scope.rowindex, 1);
			$scope.scaffoldeditorClassConfig.classRow.splice($scope.rowindex, 1);
		};

		$scope.addRow = function(isContainer) {
			var rowLen = prompt("Enter numbers that add up to 12, seperated by commas");
			var rowLenArr = rowLen.split(',');
			var newRow = [];
			var i;
			for (i = 0; i < rowLenArr.length; i++)
				newRow.push({
					width: parseInt(rowLenArr[i]),
					components: []
				});
			$scope.scaffoldeditorRowConfig.splice(parseInt($scope.rowindex) + 1, 0, newRow);
			$scope.scaffoldeditorClassConfig.classRow.push('');
		};

		$scope.moveRow = function(direction, isContainer) {
			var shiftIndex = 0;
			var rowIndex = parseInt($scope.rowindex);
			if (direction == 'up') {
				shiftIndex = -1;
			} else if (direction == 'down') {
				shiftIndex = 1;
			}
			//debugger;
			var copy = angular.copy($scope.scaffoldeditorRowConfig[rowIndex]);
			$scope.scaffoldeditorRowConfig[rowIndex] = angular.copy($scope.scaffoldeditorRowConfig[rowIndex + shiftIndex]);
			$scope.scaffoldeditorRowConfig[rowIndex + shiftIndex] = copy;

			copy = angular.copy($scope.scaffoldeditorClassConfig.classRow[rowIndex]);
			$scope.scaffoldeditorClassConfig.classRow[rowIndex] = angular.copy($scope.scaffoldeditorClassConfig.classRow[rowIndex + shiftIndex]);
			$scope.scaffoldeditorClassConfig.classRow[rowIndex + shiftIndex] = copy;

			$rootScope.refreshRenderFunc();
		};

		$scope.configureClass = function() {
			var className = prompt('Class name(s) (Seperate by spaces)');
			if (className != null) {
				$scope.scaffoldeditorClassConfig.classRow[$scope.rowindex] = className;
			}
		}

	}
})();
