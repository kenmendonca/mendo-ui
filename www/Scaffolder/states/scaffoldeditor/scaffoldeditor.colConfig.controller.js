(function() {
	angular.module('scaffoldeditor')
		.controller('ScaffoldeditorColConfigController', ScaffoldeditorColConfigController);

	ScaffoldeditorColConfigController.$inject = ['$rootScope', '$scope', '$compile', '$timeout'];

	function ScaffoldeditorColConfigController($rootScope, $scope, $compile, $timeout) {

		$scope.componentModal = {};
		$scope.addComponent = function() {
			$scope.componentsSchema = {};

			$(".componentModal").modal('show');
			$(".componentModal-pg1").show();
			$(".componentModal-pg2").hide();

			var unregister = $rootScope.$watch('sampleComponent', function(newValue, oldValue) {
				if ($rootScope.sampleComponent && newValue != oldValue) {
					var comp = angular.copy($rootScope.sampleComponent);
					$scope.scaffoldeditorColConfig[$scope.colindex].components.push(comp);
					$(".componentModal").modal('hide').removeAttr("colindex");
					$(".componentModal-pg1").show();
					$(".componentModal-pg2").hide();

					$rootScope.refreshRenderFunc();

					unregister();
				}
			});

			$(".componentModal").one('hide.bs.modal', function() {
				$(".componentModal-pg1").show();
				$(".componentModal-pg2").hide();
				unregister();
			});


		};

		$scope.splitCol = function() {
			var currCol = $scope.scaffoldeditorColConfig[$scope.colindex];
			var colLen = prompt("Enter numbers that add up to " + currCol.width + ", seperated by commas");
			var colLenArr = colLen.split(',');
			$scope.scaffoldeditorColConfig[$scope.colindex].width = parseInt(colLenArr[0]);
			var newCols = [];
			var i;
			for (i = 1; i < colLenArr.length; i++)
				newCols.push({
					width: parseInt(colLenArr[i]),
					components: []
				});
			var tmpColConfig = angular.copy($scope.scaffoldeditorColConfig);
			var colIndex = parseInt($scope.colindex);
			for (i = 0; i < newCols.length; i++) {
				$scope.scaffoldeditorColConfig.splice($scope.colindex + i, 0, newCols[i]);
			}

		};

		$scope.removeCol = function() {
			var colLength = $scope.scaffoldeditorColConfig.length;
			var promptText = "Enter " + (colLength - 1);
			promptText += " numbers that add up to 12 to change widths of the remaining columns, seperated by commas";
			var colWidth = prompt(promptText);
			var colWidthArr = colWidth.split(',');
			var i;
			var j = 0;
			for (i = 0; i < colLength; i++) {
				if (i == $scope.colindex)
					continue;
				else {
					$scope.scaffoldeditorColConfig[i].width = parseInt(colWidthArr[j]);
					j++;
				}
			}
			$scope.scaffoldeditorColConfig.splice($scope.colindex, 1);
		};

		$scope.moveCol = function(direction) {
			var shiftIndex = 0;
			var colIndex = parseInt($scope.colindex);
			if (direction == 'left') {
				shiftIndex = -1;
			} else if (direction == 'right') {
				shiftIndex = 1;
			}
			//debugger;
			var copy = angular.copy($scope.scaffoldeditorColConfig[colIndex]);
			$scope.scaffoldeditorColConfig[colIndex] = angular.copy($scope.scaffoldeditorColConfig[colIndex + shiftIndex]);
			$scope.scaffoldeditorColConfig[colIndex + shiftIndex] = copy;

			$rootScope.refreshRenderFunc();
		};

		$scope.addColRow = function() {
			var rowLen = prompt("Enter numbers that add up to 12, seperated by commas");
			var rowLenArr = rowLen.split(',');
			var newRow = [];
			var i;
			for (i = 0; i < rowLenArr.length; i++)
				newRow.push({
					width: parseInt(rowLenArr[i]),
					components: []
				});
			$scope.scaffoldeditorColConfig[$scope.colindex].row = [newRow];
			$scope.scaffoldeditorClassConfig[$scope.colindex].classRow = [''];
		};

		$scope.configureClass = function() {
			var className = prompt('Class name(s) (seperate by spaces)');
			if (className != null) {
				$scope.scaffoldeditorClassConfig[$scope.colindex].classCol = className;
			}
		}

	}
})();
