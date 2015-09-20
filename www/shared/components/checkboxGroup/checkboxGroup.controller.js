(function () {
	angular.module('checkboxGroup')
	.controller('CheckboxGroupController',CheckboxGroupController);

	CheckboxGroupController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$q'];
	function CheckboxGroupController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$q){
		$scope.data = dataService.data;
		$scope.form = dataService.form;
		
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String'
		};

		(function () {
			$scope.pageTitle = "";
			try { $scope.pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var checkboxGroupComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : $scope.pageTitle,
				resolveReadyIfPresent : false,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			var hasDeferred = checkboxGroupComponent.readyDeferred ? true : false;

			var promiseArr = [];

			var subcomponentCheckboxSubcomponents = [];
			for(var i = 0; i<$scope.component.checkboxComponents.length;i++){	
				var subcomponentCheckboxSubcomponent = $scope.component.checkboxComponents[i].checkboxComponent.checkboxComponent;
				var subcomponentCheckboxSubcomponentIdentifier = subcomponentCheckboxSubcomponent.identifier;
				var subcomponentCheckboxSubcomponentType = subcomponentCheckboxSubcomponent.type;
				subcomponentCheckboxSubcomponents.push({
					type : subcomponentCheckboxSubcomponentType,
					identifier : subcomponentCheckboxSubcomponentIdentifier
				});

				var subcomponentCheckboxSubcomponent = componentFactory.controller.config.createSubcomponent({
					pageTitle : $scope.pageTitle,
					identifier : subcomponentCheckboxSubcomponentIdentifier,
					componentType : subcomponentCheckboxSubcomponentType,
					createDeferred : hasDeferred,
					assignSubcomponent : true,
					component : checkboxGroupComponent
				});

				if(hasDeferred)
					promiseArr.push(subcomponentCheckboxSubcomponent.ready);

				if($scope.component.checkboxComponents[i].hasLabel.hasLabel){		
					var subcomponentLabel = $scope.component.checkboxComponents[i].hasLabel.label;
					var subcomponentLabelIdentifier = subcomponentLabel.identifier;
					var subcomponentLabelType = subcomponentLabel.type;

					var subcomponentLabel = componentFactory.controller.config.createSubcomponent({
						pageTitle : $scope.pageTitle,
						identifier : subcomponentLabelIdentifier,
						componentType : subcomponentLabelType,
						createDeferred : hasDeferred,
						assignSubcomponent : true,
						component : checkboxGroupComponent
					});

					if(hasDeferred)
						promiseArr.push(subcomponentLabel.ready);
				}
			}


			if(hasDeferred){
				$q.all(promiseArr).then(function(){
					checkboxGroupComponent.readyDeferred.resolve();
				});
			}

			checkboxGroupComponent.getGroupDisabled = function(){
				var isGroupDisabled = true;
				for(var i = 0; i< subcomponentCheckboxSubcomponents.length; i++)
				{
					if(!checkboxGroupComponent.subcomponent[subcomponentCheckboxSubcomponents[i].type][subcomponentCheckboxSubcomponents[i].identifier].get('disabled'))
						isGroupDisabled = false;
				}
				return isGroupDisabled;
			};

			checkboxGroupComponent.setGroupDisabled = function(disabledBool){
				for(var i = 0; i< subcomponentCheckboxSubcomponents.length; i++)
					checkboxGroupComponent.subcomponent[subcomponentCheckboxSubcomponents[i].type][subcomponentCheckboxSubcomponents[i].identifier].set('disabled',disabledBool);
			};
			
		})(); 
	}

})(); 