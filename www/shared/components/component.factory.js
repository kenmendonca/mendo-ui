(function() {
	angular.module('component')
		.factory('componentFactory', componentFactory);

	componentFactory.$inject = ['$compile', 'dataService', '$state', 'scaffoldService', '$q','utilitiesFactory'];

	function componentFactory($compile, dataService, $state, scaffoldService, $q,utilitiesFactory) {
		var scopeVar = {};

		function linked(scope, element, attrs) {
			if (attrs.hasOwnProperty('linked'))
				scope.component = scope.componentCopy;
			else
				scope.component = angular.copy(scope.componentCopy);

			if (scope.component.compile) {
				$compile(element.contents())(scope);
			}
		}

		function getAndSet(scope, allowedVariables) {
			scope.get = function(variable) {
				if (!allowedVariables.hasOwnProperty(variable))
					return;
				return scope.component[variable];
			};

			scope.set = function(variable, value) {
				if (!allowedVariables.hasOwnProperty(variable))
					return;
				if (allowedVariables[variable] == 'String') {
					var castValue = String(value);
				} else if (allowedVariables[variable] == 'Boolean') {
					var castValue = Boolean(value);
				} else if (allowedVariables[variable] == 'Number') {
					var castValue = Number(value) || 1;
				}
				scope.component[variable] = castValue;
			};
		}

		/*
		params
		{
			pageTitle : pageTitle,
			clickAction : clickAction,
			clickFnScopePath : clickFnScopePath,
			clickFnScaffoldName : clickFnScaffoldName,
			href : href,
			validateForm : validateForm
		}
		*/
		function click(scope, params) {
				var clickFn;
				if (params.clickAction == 'anchor') {
					//null click function
					clickFn = angular.noop;
				} else if (params.clickAction == 'route') {
					clickFn = function($event) {
						$event.preventDefault();
						var formName = params.pageTitle + 'Form';
						if (params.validateForm) {
							if (dataService.form[formName].$valid)
								$state.go(params.href);
							else
							{
								dataService.form.showErrors[formName] = true;
							}
						} else
							$state.go(params.href);
					}
				} else if (params.clickAction == 'custom') {
					clickFn = function($event) {
						var fn = scaffoldService[params.pageTitle].component[scope.type][scope.identifier].clickFns[params.clickFnScaffoldName] || angular.noop;
						fn($event);
					}
				}
			utilitiesFactory.dynamicSetNestedProperty(params.clickFnScopePath, clickFn, scope);
		}

		/*
		params
		{
			pageTitle : pageTitle,
			resolveReadyIfPresent : resolveReadyIfPresent,
			bindGetAndSet : bindGetAndSet,
			allowedVariables : allowedVariables
		}
		*/
		function componentToScaffoldService(scope, params) {
			var componentType = scope.type;
			var identifier = scope.identifier;

			scaffoldService[params.pageTitle].component[componentType] = scaffoldService[params.pageTitle].component[componentType] || {};
			scaffoldService[params.pageTitle].component[componentType][identifier] = scaffoldService[params.pageTitle].component[componentType][identifier] || {};
			var component = scaffoldService[params.pageTitle].component[componentType][identifier];
			if (params.resolveReadyIfPresent && component.readyDeferred)
				component.readyDeferred.resolve();
			if (params.bindGetAndSet) {
				getAndSet(scope, params.allowedVariables);
				component.get = scope.get;
				component.set = scope.set;
			}

			return component;
		}

		/*
		params
		{
			pageTitle : pageTitle,
			identifier : identifier,
			componentType : componentType,
			createDeferred : createDeferred,
			assignSubcomponent : assignSubcomponent,
			component : component
		}
		*/
		function createSubcomponent(params) {
			scaffoldService[params.pageTitle].component[params.componentType] = scaffoldService[params.pageTitle].component[params.componentType] || {};
			scaffoldService[params.pageTitle].component[params.componentType][params.identifier] = scaffoldService[params.pageTitle].component[params.componentType][params.identifier] || {};
			var subcomponent = scaffoldService[params.pageTitle].component[params.componentType][params.identifier];
			if (params.createDeferred) {
				subcomponent.readyDeferred = $q.defer();
				subcomponent.ready = subcomponent.readyDeferred.promise;
			}
			if (params.assignSubcomponent) {
				params.component.subcomponent = params.component.subcomponent || {};
				params.component.subcomponent[params.componentType] = params.component.subcomponent[params.componentType] || {};
				params.component.subcomponent[params.componentType][params.identifier] = subcomponent;
			}
			return subcomponent;
		}

		/*
		params
		{
			validators : validators,
			aliasedValidators : {
				required : 'ng-required'
				pattern : 'ng-pattern'
				...
			}
		}
		*/
		function attachValidators(componentElement, params) {
			var validators = params.validators;
			if (validators) {
				var customValidators = "";
				for (var i = 0; i < validators.length; i++) {
					if(params.aliasedValidators.hasOwnProperty(validators[i].condition))
						componentElement.attr(params.aliasedValidators[validators[i].condition], validators[i].parameter);
					else if (validators[i].condition == 'custom')
						customValidators += validators[i].parameter + '&';
					else
						componentElement.attr('ui-validator-' + validators[i].condition.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(), validators[i].parameter);
				}
				if (customValidators.length)
					componentElement.attr('ui-validator', customValidators.substring(0, customValidators.length - 1));
			}
		}

		return {
			compiler: {
				config: {
					attachValidators: attachValidators
				}
			},
			controller: {
				config: {
					linked: linked,
					click: click,
					componentToScaffoldService: componentToScaffoldService,
					createSubcomponent: createSubcomponent
				}
			}
		}
	}
})();
