(function () {
	angular.module('radioGroup')
	.controller('RadioGroupController',RadioGroupController);

	RadioGroupController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$q'];
	function RadioGroupController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$q){
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

			var radioGroupComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : $scope.pageTitle,
				resolveReadyIfPresent : false,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			var hasDeferred = radioGroupComponent.readyDeferred ? true : false;

			var promiseArr = [];

			var radioAtomComponentIdentifiers = [];
			for(var i = 0; i<$scope.component.radioComponents.length;i++){	
				var subcomponentRadioAtomComponent = $scope.component.radioComponents[i].radioComponent;
				var subcomponentRadioAtomComponentIdentifier = subcomponentRadioAtomComponent.identifier;
				radioAtomComponentIdentifiers.push(subcomponentRadioAtomComponentIdentifier);
				var subcomponentRadioAtomComponentType = subcomponentRadioAtomComponent.type;

				var subcomponentRadioAtomComponent = componentFactory.controller.config.createSubcomponent({
					pageTitle : $scope.pageTitle,
					identifier : subcomponentRadioAtomComponentIdentifier,
					componentType : subcomponentRadioAtomComponentType,
					createDeferred : hasDeferred,
					assignSubcomponent : true,
					component : radioGroupComponent
				});

				if(hasDeferred)
					promiseArr.push(subcomponentRadioAtomComponent.ready);

				if($scope.component.radioComponents[i].hasLabel.hasLabel){		
					var subcomponentLabel = $scope.component.radioComponents[i].hasLabel.label;
					var subcomponentLabelIdentifier = subcomponentLabel.identifier;
					var subcomponentLabelType = subcomponentLabel.type;

					var subcomponentLabel = componentFactory.controller.config.createSubcomponent({
						pageTitle : $scope.pageTitle,
						identifier : subcomponentLabelIdentifier,
						componentType : subcomponentLabelType,
						createDeferred : hasDeferred,
						assignSubcomponent : true,
						component : radioGroupComponent
					});

					if(hasDeferred)
						promiseArr.push(subcomponentLabel.ready);
				}
			}


			if(hasDeferred){
				$q.all(promiseArr).then(function(){
					radioGroupComponent.readyDeferred.resolve();
				});
			}

			radioGroupComponent.getGroupDisabled = function(){
				var isGroupDisabled = true;
				for(var i = 0; i< radioAtomComponentIdentifiers.length; i++)
				{
					if(!radioGroupComponent.subcomponent.radioAtom[radioAtomComponentIdentifiers[i]].get('disabled'))
						isGroupDisabled = false;
				}
				return isGroupDisabled;
			};

			radioGroupComponent.setGroupDisabled = function(disabledBool){
				for(var i = 0; i< radioAtomComponentIdentifiers.length; i++)
					radioGroupComponent.subcomponent.radioAtom[radioAtomComponentIdentifiers[i]].set('disabled',disabledBool);
			};
			
		})(); 
	}

})(); 