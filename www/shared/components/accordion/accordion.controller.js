(function () {
	angular.module('accordion')
	.controller('AccordionController',AccordionController);

	AccordionController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$q'];
	function AccordionController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$q){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var accordionComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : false,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			var hasDeferred = accordionComponent.readyDeferred ? true : false;

			var panels = $scope.component.panels;
			var promiseArr = [];
			for(var i = 0; i < panels.length; i++){
				var subHeadingIdentifier = panels[i].heading.contents.identifier;
				var subHeadingType = panels[i].heading.contents.type;

				var subHeading = componentFactory.controller.config.createSubcomponent({
					pageTitle : pageTitle,
					identifier : subHeadingIdentifier,
					componentType : subHeadingType,
					createDeferred : hasDeferred,
					assignSubcomponent : true,
					component : accordionComponent
				});

				if(hasDeferred)
					promiseArr.push(subHeading.ready);

				var subBodyIdentifier = panels[i].body.contents.identifier;
				var subBodyType = panels[i].body.contents.type;

				var subBody = componentFactory.controller.config.createSubcomponent({
					pageTitle : pageTitle,
					identifier : subBodyIdentifier,
					componentType : subBodyType,
					createDeferred : hasDeferred,
					assignSubcomponent : true,
					component : accordionComponent
				});

				if(hasDeferred)
					promiseArr.push(subBody.ready);
			}

			if(hasDeferred){
				$q.all(promiseArr).then(function(){
					$element.find('.collapse').collapse();
					accordionComponent.readyDeferred.resolve();
				});
			}

			accordionComponent.isCollapsed = function(index){
				var panelId = $scope.component.panels[index].id;
				return !$('#' + panelId).hasClass('in');
			};
			accordionComponent.setCollapsed = function(index, collapse){
				var panelId = $scope.component.panels[index].id;
				if(collapse)
					$('#' + panelId).collapse('hide');
				else
					$('#' + panelId).collapse('show');
			};
		})(); 
	}

})(); 