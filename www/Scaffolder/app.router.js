(function() {
	angular.module('app')
		.config(config);

	function config($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
			.state('explorer', {
				url: '/',
				templateUrl: '/Scaffolder/states/explorer/explorer.html',
				controller: 'ExplorerController'
			})
			.state('scaffoldeditor', {
				url: '/scaffoldeditor',
				templateUrl: '/Scaffolder/states/scaffoldeditor/scaffoldeditor.html',
				controller: 'ScaffoldeditorController'
			})
			.state('preview', {
				url: '/preview',
				templateUrl: '/Scaffolder/states/preview/preview.html',
				controller: 'PreviewController'
			});
	}
})();
