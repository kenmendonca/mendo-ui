(function () {
	angular.module('documentationApp',['data','component','scaffold','ui.router'])
	.config(config);

	function config($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('editor', {
			url: '/',
			template: '<md-render></md-render>',
			controller: 'ComponentExamples',
			resolve : {
				mdResolve : ['$http','mdFile',function($http, mdFile){
				return $http.get('/Documentation/editor.md')
				.then(function(response){
					mdFile.editor = response.data;
					return response.data;
				});
			}]
			}
		})
		.state('components', {
			url: '/components',
			template: '<md-render></md-render>',
			controller: 'ComponentExamples',
			resolve : {
				mdResolve : ['$http','mdFile',function($http, mdFile){
				return $http.get('/Documentation/components.md')
				.then(function(response){
					mdFile.components = response.data;
					return response.data;
				});
			}]
			}
		})
		.state('businesslogic', {
			url: '/businesslogic',
			template: '<md-render></md-render>',
			controller: 'ComponentExamples',
			resolve : {
				mdResolve : ['$http','mdFile',function($http, mdFile){
				return $http.get('/Documentation/businesslogic.md')
				.then(function(response){
					mdFile.businesslogic = response.data;
					return response.data;
				});
			}]
			}
		});
	}

})(); 