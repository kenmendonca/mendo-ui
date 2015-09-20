(function () {
	angular.module('formGroup')
	.controller('FormGroupController',FormGroupController);

	FormGroupController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$q'];
	function FormGroupController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$q){
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

			var formGroupComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : $scope.pageTitle,
				resolveReadyIfPresent : false,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			var hasDeferred = formGroupComponent.readyDeferred ? true : false;

			var promiseArr = [];

			var subcomponentFormComponent = $scope.component.formComponent.formComponent;
			var subcomponentFormComponentIdentifier = subcomponentFormComponent.identifier;
			var subcomponentFormComponentType = subcomponentFormComponent.type;

			var subcomponentFormComponent = componentFactory.controller.config.createSubcomponent({
				pageTitle : $scope.pageTitle,
				identifier : subcomponentFormComponentIdentifier,
				componentType : subcomponentFormComponentType,
				createDeferred : hasDeferred,
				assignSubcomponent : true,
				component : formGroupComponent
			});

			if(hasDeferred)
				promiseArr.push(subcomponentFormComponent.ready);

			if($scope.component.hasLabel.hasLabel){		
				var subcomponentLabel = $scope.component.hasLabel.label;
				var subcomponentLabelIdentifier = subcomponentLabel.identifier;
				var subcomponentLabelType = subcomponentLabel.type;

				var subcomponentLabel = componentFactory.controller.config.createSubcomponent({
					pageTitle : $scope.pageTitle,
					identifier : subcomponentLabelIdentifier,
					componentType : subcomponentLabelType,
					createDeferred : hasDeferred,
					assignSubcomponent : true,
					component : formGroupComponent
				});

				if(hasDeferred)
					promiseArr.push(subcomponentLabel.ready);
			}

			if($scope.component.hasHelpText.hasHelpText){		
				var subcomponentHelpTextComponent = $scope.component.hasHelpText.helpText;
				var subcomponentHelpTextIdentifier = subcomponentHelpTextComponent.identifier;
				var subcomponentHelpTextType = subcomponentHelpTextComponent.type;

				var subcomponentHelpText = componentFactory.controller.config.createSubcomponent({
					pageTitle : $scope.pageTitle,
					identifier : subcomponentHelpTextIdentifier,
					componentType : subcomponentHelpTextType,
					createDeferred : hasDeferred,
					assignSubcomponent : true,
					component : formGroupComponent
				});

				if(hasDeferred)
					promiseArr.push(subcomponentHelpText.ready);
			}

			if(hasDeferred){
				$q.all(promiseArr).then(function(){
					formGroupComponent.readyDeferred.resolve();
				});
			}
		})(); 
	}

})(); 