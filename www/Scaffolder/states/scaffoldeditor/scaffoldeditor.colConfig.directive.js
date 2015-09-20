(function() {
	angular.module('scaffoldeditor')
		.directive('scaffoldeditorColConfig', scaffoldeditorColConfig);

	scaffoldeditorColConfig.$inject = ['$compile'];

	function scaffoldeditorColConfig($compile) {
		var directive = {
			restrict: 'A',
			scope: {
				scaffoldeditorColConfig: '=',
				scaffoldeditorClassConfig: '=',
				colindex: '@'
			},
			controller: 'ScaffoldeditorColConfigController',
			link: linker
		};

		return directive;

		function linker(scope, element, attrs) {
			$compile(element.contents())(scope);

			element.on('mouseenter', function() {
				if (element.find('.scaffoldeditor-col.shown').length == 0) {
					element.children('.scaffoldeditor-col').addClass('shown');
					element.parents('.scaffoldeditor-col-wrap').children('.scaffoldeditor-col.shown').removeClass('shown');
				}
				element.attr('mouseenter', '1');
			});

			element.on('mouseleave', function() {
				element.children('.scaffoldeditor-col').removeClass('shown');
				element.removeAttr('mouseenter');
				element.parents('.scaffoldeditor-col-wrap[mouseenter]').first().children('.scaffoldeditor-col').addClass('shown');
			});
		}

	};



})();
