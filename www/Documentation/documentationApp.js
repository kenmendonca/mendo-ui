	var ANGULARIZE = PAGE_NAME == 'components';
	if (ANGULARIZE) {
		var app = angular.module('documentationApp', ['data', 'component', 'scaffold']);

		//for the purposes of this documentation

		app.directive('componentExample', componentExample);
		componentExample.$inject = ['$timeout'];

		function componentExample($timeout) {
			var directive = {
				restrict: 'A',
				templateUrl: 'componentExampleTpl.html',
				scope: {
					component: '=componentExample'
				},
				replace: true,
				link: linker
			};
			return directive;

			function linker(scope, element, attrs) {
				$timeout(function() {
					element.find("pre").each(function() {
						hljs.highlightBlock($(this)[0]);
					});
				}, 0);
				if (scope.component.type == 'tooltip') {
					$timeout(function() {
						$('[data-toggle="tooltip"]').tooltip();
					}, 0);
				}
			}
		};

		app.controller('ComponentExamples', ComponentExamples);
		ComponentExamples.$inject = ['$scope', 'dataService', '$timeout', 'componentsJson'];

		function ComponentExamples($scope, dataService, $timeout, componentsJson) {
			$scope.components = componentsJson;
			$scope.data = dataService.data;
			$scope.data.paginationAtomModel = {
				currentPage: 2,
				numberPages: 10
			};

			$scope.data.sortTableData = [{
				name: 'Bob',
				age: 12
			}, {
				name: 'Ken',
				age: 22
			}, {
				name: 'Jim',
				age: 90
			}, {
				name: 'John',
				age: 13
			}, {
				name: 'Bill',
				age: 31
			}];

			$timeout(function() {
				$("a[href='#']").click(function(event) {
					event.preventDefault();
				});
			}, 1000);
		};

		app.service('$state', function() {
			var state = this;
			state = {};
		});

	}
	$.get('/Documentation/' + PAGE_NAME + '.md', function(data) {
		var jsonStart = data.indexOf('[JSON]');
		var jsonEnd = data.indexOf('[/JSON]');
		if (ANGULARIZE){
			angular.module('documentationApp').constant('componentsJson', JSON.parse(data.substring(jsonStart + 6, jsonEnd)));
		}
		else
			jsonStart = data.length;
		var mdHTML = data.substring(0, jsonStart);
		$("#page").html(markdown.toHTML(mdHTML));
		$("#page").find("pre").each(function() {
			hljs.highlightBlock($(this)[0]);
		});
		$('a[href^="component:"').each(function() {
			var componentType = $(this).attr('href').substring(10);
			$(this).attr('component-example', 'components.' + componentType);
		});

		var headings = $(":header");
		for(var i = 0;i<headings.length;i++){
			var currentHeading = headings.eq(i);
			var id = currentHeading.text().replace(/\s/g, '');
			currentHeading.attr('id',id);
			var currentHeadingLevel = parseInt(currentHeading.prop('tagName').substring(1));

			if(currentHeadingLevel == 1){
				var li = "<li><a href='#" + id + "'>" + currentHeading.text() + "</a></li>";
				$("#sidebar ul").append(li);
			}
			else{
				//if first li, make ul in parent
				var previousHeading = headings.eq(i-1);
				var previousHeadingLevel = parseInt(previousHeading.prop('tagName').substring(1));
				if(previousHeadingLevel == currentHeadingLevel - 1)
				{
					var previousHeadingId = previousHeading.attr('id');
					var li = "<li><a href='#" + id + "'>" + currentHeading.text() + "</a></li>";
					$("a[href='#"+previousHeadingId+"']").parent('li')
					.append('<ul class="nav-pills nav-stacked">' + li + '</ul>');
				}
				else{
					for(var j = i-1; j >= 0; j--){
						previousHeading = headings.eq(j);
						previousHeadingLevel = parseInt(previousHeading.prop('tagName').substring(1));
						if(previousHeadingLevel == currentHeadingLevel - 1)
						{
							var previousHeadingId = previousHeading.attr('id');
							var li = "<li><a href='#" + id + "'>" + currentHeading.text() + "</a></li>";
							$("a[href='#"+previousHeadingId+"']").parent('li')
							.find('ul').first()
							.append(li);
							break;
						}
					}
				}
			}
		}
		/*
		$("h1,h2,h3,h4,h5,h6").each(function() {
			var id = $(this).text().replace(/\s/g, '');
			$(this).attr("id", id);
			var headingLevel = $(this).prop('tagName').toLowerCase();
			var li = "<li><a href='#" + id + "' class='sidebar-" + headingLevel + "'>" + $(this).text() + "</a></li>";
			$("#sidebar ul").append(li);
		});
		*/
		$('body').scrollspy({
			target: '#sidebar'
		});
		$("#sidebar > ul ul:first").show()
		if (ANGULARIZE) {
			angular.element(document).ready(function() {
				angular.bootstrap('#page', ['documentationApp']);
			});
		}
	});