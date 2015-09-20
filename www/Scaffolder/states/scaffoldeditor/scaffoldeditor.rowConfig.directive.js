(function() {
	angular.module('scaffoldeditor')
		.directive('scaffoldeditorRowConfig', scaffoldeditorRowConfig);

	scaffoldeditorRowConfig.$inject = ['$compile'];

	function scaffoldeditorRowConfig($compile) {
		var directive = {
			restrict: 'A',
			scope: {
				scaffoldeditorRowConfig: '=',
				scaffoldeditorClassConfig: '=',
				rowindex: '@'
			},
			controller: 'ScaffoldeditorRowConfigController',
			link: linker
		};

		return directive;

		function linker(scope, element, attrs) {
			$compile(element.contents())(scope);

			element.on('mouseenter', function() {
				if (element.find('.scaffoldeditor-row.shown').length == 0) {
					element.children('.scaffoldeditor-row').addClass('shown');
					element.parents('.scaffoldeditor-row-wrap').children('.scaffoldeditor-row.shown').removeClass('shown');
				}
				element.attr('mouseenter', '1');
			});

			element.on('mouseleave', function() {
				element.children('.scaffoldeditor-row').removeClass('shown');
				element.removeAttr('mouseenter');
				element.parents('.scaffoldeditor-row-wrap[mouseenter]').first().children('.scaffoldeditor-row').addClass('shown');
			});
		}

	};



})();
