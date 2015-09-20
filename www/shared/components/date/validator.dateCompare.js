(function() {
	angular.module('date')
		.directive('uiValidatorDateCompare', uiValidatorDateCompare);

	function uiValidatorDateCompare() {
		var directive = {
			restrict: 'A',
			require: 'ngModel',
			link: linker
		};
		return directive;

		function linker(scope, element, attrs, controller) {
			var aftersArr = attrs.uiValidatorDateCompare.split(',');
			var i;
			for (i = 0; i < aftersArr.length; i++) {
				var prefix = i.toString();
				if (aftersArr.length == 1)
					prefix = "";
				var comparison = aftersArr[i].split(':');
				if (comparison[0] == 'after') {
					(function() {
						//entered date is after given date
						var givenDateMoment = moment();
						if (comparison[1] != 'today')
							givenDateMoment = moment(comparison[1], "MM/DD/YYYY");
						controller.$validators['dateAfter' + prefix] = function(value) {
							if ((value || "").length != 8)
								return true;
							else {
								return moment(value, "MMDDYYYY").isAfter(givenDateMoment);
							}
						}
					})();
				} else if (comparison[0] == 'before') {
					(function() {
						//entered date is before given date
						var givenDateMoment = moment();
						if (comparison[1] != 'today')
							givenDateMoment = moment(comparison[1], "MM/DD/YYYY");

						controller.$validators['dateBefore' + prefix] = function(value) {
							if ((value || "").length != 8)
								return true;
							else {
								return moment(value, "MMDDYYYY").isBefore(givenDateMoment);
							}
						}
					})();
				} else if (comparison[0] == 'greaterPast') {
					(function() {
						//today - entered date > given date
						//entered date + given date < today
						//today must be after entered date
						//if not, true is returned
						var splitDate = comparison[1].split('/');

						controller.$validators['greaterPast' + prefix] = function(value) {
							if ((value || "").length != 8)
								return true;
							else {
								var todayMoment = moment();
								var givenDateMoment = moment(value, "MMDDYYYY");
								if (todayMoment.isAfter(givenDateMoment)) {
									givenDateMoment.add({
										M: splitDate[0],
										d: splitDate[1],
										y: splitDate[2]
									});
									return givenDateMoment.isBefore(todayMoment);
								}
								return true;
							}
						}
					})();
				} else if (comparison[0] == 'greaterFuture') {
					(function() {
						//entered date - today > given date
						//today + given date < entered date	
						//today must be before entered date
						//if not, true is returned
						var splitDate = comparison[1].split('/');

						controller.$validators['greaterFuture' + prefix] = function(value) {
							if ((value || "").length != 8)
								return true;
							else {
								var todayMoment = moment();
								var givenDateMoment = moment(value, "MMDDYYYY");
								if (todayMoment.isBefore(givenDateMoment)) {
									todayMoment.add({
										M: splitDate[0],
										d: splitDate[1],
										y: splitDate[2]
									});
									return todayMoment.isBefore(givenDateMoment);
								}
								return true;
							}
						}
					})();
				} else if (comparison[0] == 'lessPast') {
					(function() {
						//today - entered date < given date
						//entered date + given date > today
						//today must be before entered date
						//if not, true is returned
						var splitDate = comparison[1].split('/');

						controller.$validators['lessPast' + prefix] = function(value) {
							if ((value || "").length != 8)
								return true;
							else {
								var todayMoment = moment();
								var givenDateMoment = moment(value, "MMDDYYYY");
								if (todayMoment.isAfter(givenDateMoment)) {
									givenDateMoment.add({
										M: splitDate[0],
										d: splitDate[1],
										y: splitDate[2]
									});
									return givenDateMoment.isAfter(todayMoment);
								}
								return true;
							}
						}
					})();
				} else if (comparison[0] == 'lessFuture') {
					(function() {
						//entered date - today < given date
						//today + given date > entered date
						//today must be after entered date
						//if not, true is returned
						var splitDate = comparison[1].split('/');

						controller.$validators['lessFuture' + prefix] = function(value) {
							if ((value || "").length != 8)
								return true;
							else {
								var todayMoment = moment();
								var givenDateMoment = moment(value, "MMDDYYYY");
								if (todayMoment.isBefore(givenDateMoment)) {
									todayMoment.add({
										M: splitDate[0],
										d: splitDate[1],
										y: splitDate[2]
									});
									return todayMoment.isAfter(givenDateMoment);
								}
								return true;
							}
						}
					})();
				}


			}

		}
	}
})();
