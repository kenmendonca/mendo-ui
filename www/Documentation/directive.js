(function () {
	var app = angular.module('documentationApp');
	app.directive('mdRender',mdRender);
	mdRender.$inject = ['$http','$state','$compile','$timeout','mdFile'];
	function mdRender($http,$state,$compile,$timeout,mdFile){
		var directive = {
			restrict : 'E',
			templateUrl : 'mdRenderTpl',
			compile : compileFn
		};

		return directive;

		function compileFn(tElement,tAttrs){
			var page = $state.current.name;
			var currentMdFile = mdFile[page];
			var jsonStart = currentMdFile.indexOf('[JSON]');

			if(page != 'components'){
					jsonStart = currentMdFile.length;
				}
				
			$("#page").html(markdown.toHTML(currentMdFile.substring(0,jsonStart)));
				$("#page").find("pre").each(function() {
				hljs.highlightBlock($(this)[0]);
				});
				$('a[href^="component:"').each(function(){
					var componentType = $(this).attr('href').substring(10);
					$(this).attr('component-example','components.' + componentType);
				});
				$("h1,h2,h3,h4,h5,h6").each(function(){
					var id = $(this).text().replace(/\s/g,'');
					$(this).attr("id",id);
					var headingLevel = $(this).prop('tagName').toLowerCase();
					var absoluteUrl = window.location.href;
					var li = "<li><a href='#"+id+"' class='sidebar-"+headingLevel+"' "
					li += "ng-click='gotoSection($event)'>"+$(this).text()+"</a><a href="+absoluteUrl +"#"+id+"></a></li>"
					$("#sidebar ul").append(li);
				});

		};
		function linker(scope, element, attrs){/*
			var page = $state.current.name;
			// $http.get('/Documentation/' + page + '.md').then(function(response){
				var mdFile = response.data;
				var jsonStart = mdFile.indexOf('[JSON]');
				var jsonEnd = mdFile.indexOf('[/JSON]');
				if(page == 'components'){
					scope.components = angular.fromJson(mdFile.substring(jsonStart + 6,jsonEnd));
				}
				else{
					jsonStart = mdFile.length;
					scope.components = {};
				}
				//debugger;
				$("#page").html(markdown.toHTML(mdFile.substring(0,jsonStart)));
				$("#page").find("pre").each(function() {
				hljs.highlightBlock($(this)[0]);
				});
				$('a[href^="component:"').each(function(){
					var componentType = $(this).attr('href').substring(10);
					$(this).attr('component-example','components.' + componentType);
				});
				$("h1,h2,h3,h4,h5,h6").each(function(){
					var id = $(this).text().replace(/\s/g,'');
					$(this).attr("id",id);
					var headingLevel = $(this).prop('tagName').toLowerCase();
					var absoluteUrl = window.location.href;
					$("#sidebar ul").append("<li><a href='"+absoluteUrl+"#"+id+"' class='sidebar-"+headingLevel+"'>"+$(this).text()+"</a></li>");
				});
				$('body').scrollspy({target : '#sidebar'});
				// });
				if(page == 'components')
				{
					var html = element.html();
					$timeout(function(){
					$compile($("#page"))(scope);
					},1000);
				}
			*/};
		}


	app.directive('componentExample',componentExample);
	componentExample.$inject = ['$timeout'];
	function componentExample($timeout){
		var directive = {
			restrict : 'A',
			templateUrl : 'componentExample',
			scope : {
				component : '=componentExample'
			},
			replace : true,
			link : linker
		};
		return directive;

		function linker(scope, element, attrs){
			$timeout(function(){	
				element.find("pre").each(function() {
					hljs.highlightBlock($(this)[0]);
				});
			},0);
			if(scope.component.type == 'tooltip'){
			$timeout(function(){	
				$('[data-toggle="tooltip"]').tooltip();
			},0);
			}
		}
	};

	app.service('mdFile',mdFile);
	function mdFile(){
		var mdFile = this;
		mdFile = {};
	}
})(); 