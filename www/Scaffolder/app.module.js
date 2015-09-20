(function() {
	angular.module('app', [
		'ui.router',
		'data',
		'explorer',
		'scaffoldeditor',
		'preview',
		'scaffold'
	]).run(initApp);

	initApp.$inject = ['$rootScope', '$state'];

	function initApp($rootScope, $state) {
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			if (toState.name === "scaffoldeditor" || toState.name === "preview") {
				if (!$rootScope.directory) {
					event.preventDefault();
					$state.go('explorer');
				}
			}

		});
	}
})();
