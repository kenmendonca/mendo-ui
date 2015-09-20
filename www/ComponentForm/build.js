(function() {
	angular.module('app', [
		'scaffold',
		'data',
		'ui.router',
		'validator'
		]);
})();


(function() {
	angular.module('data', []);
})();


(function () {
	angular.module('accordion',[]);
})(); 

(function () {
	angular.module('buttonAtom',[]);
})(); 

(function () {
	angular.module('checkboxAtom',[]);
})(); 

(function () {
	angular.module('checkboxGroup',[]);
})(); 

(function () {
	angular.module('checkboxListAtom',[]);
})(); 

(function() {
	angular.module('component', [
		//atoms
		'textAtom',
		'plaintextAtom',
		'inputAtom',
		'textareaAtom',
		'selectAtom',
		'radioAtom',
		'checkboxAtom',
		'checkboxListAtom',
		'buttonAtom',
		'dropdownAtom',
		'date',
		'paginationAtom',
		//form related
		'formGroup',
		'radioGroup',
		'checkboxGroup',
		//text related
		'paragraph',
		'inline',
		'tooltip',
		'heading',
		'list',
		'table',
		//utilities
		'utilities',
		//scaffolding
		'componentScaffold',
		'subView',
		//validation ui
		'errorMessages',
		//complex components
		'sortTable',
		'accordion',
		'mediaObject'
		]);
})();


(function () {
	angular.module('componentScaffold',[]);
})(); 

(function () {
	angular.module('componentSevered',['component']);
})(); 

(function () {
	angular.module('date',[]);
})(); 

(function () {
	angular.module('dropdownAtom',[]);
})(); 

(function () {
	angular.module('errorMessages',['ngMessages']);
})(); 

(function () {
	angular.module('formGroup',[]);
})(); 

(function () {
	angular.module('heading',[]);
})(); 

(function () {
	angular.module('imageAtom',[]);
})(); 

(function () {
	angular.module('inline',[]);
})(); 

(function () {
	angular.module('inputAtom',['ui.mask']);
})(); 

(function () {
	angular.module('list',[]);
})(); 

(function () {
	angular.module('mediaObject',[]);
})(); 

(function () {
	angular.module('paginationAtom',[]);
})(); 

(function () {
	angular.module('paragraph',[]);
})(); 

(function () {
	angular.module('plaintextAtom',[]);
})(); 

(function () {
	angular.module('radioAtom',[]);
})(); 

(function () {
	angular.module('radioGroup',[]);
})(); 

(function(){
	angular.module('scaffold',['component','componentSevered']);
})();

(function () {
	angular.module('selectAtom',[]);
})(); 

(function () {
	angular.module('sortTable',[]);
})(); 

(function () {
	angular.module('subView',[]);
})(); 

(function () {
	angular.module('table',[]);
})(); 

(function () {
	angular.module('textAtom',['ngSanitize']);
})(); 

(function () {
	angular.module('textareaAtom',['ui.mask']);
})(); 

(function () {
	angular.module('tooltip',[]);
})(); 

(function(){
	angular.module('utilities',['data']);
})();

(function () {
	angular.module('validator',[]);
})(); 

(function() {
	angular.module('app')
		.controller('AppController', AppController);

	AppController.$inject = ['$scope', 'dataService'];

	function AppController($scope, dataService) {
		$scope.data = dataService.data;
	}
})();

(function() {
	angular.module('app')
		.config(config)
		.run(runFn);

	function config($urlRouterProvider, $stateProvider, CONFIG, DIRECTORY) {
		$urlRouterProvider.otherwise('/');

		var configObj = angular.copy(CONFIG);
		var i;
		for (i = 0; i < configObj.length; i++) {
			var url = configObj[i].title;
			if (i == 0)
				url = '';
			var stateObj = {
				url: '/' + url,
				template: '<ui-scaffold></ui-scaffold>',
				data: {
					title: configObj[i].title,
					stateName: configObj[i].stateName,
					pageJSON: configObj[i].pageJSON
				}
			};

			if (configObj[i].controller) {
				stateObj.controller = configObj[i].controller;
			}
			$stateProvider.state(configObj[i].stateName, stateObj);
		}
	}

	runFn.$inject = ['$rootScope', 'DIRECTORY', 'scaffoldService', '$state', '$http', '$q', 'dataService'];

	function runFn($rootScope, DIRECTORY, scaffoldService, $state, $http, $q, dataService) {

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			var title = toState.data.title;
			var stateName = toState.data.stateName;
			var pageJSON = toState.data.pageJSON;

			//config is loaded, set up event 
			try {
				var config = scaffoldService[title].config;
			} catch (err) {
				event.preventDefault();
				var options = {
					method: 'GET',
					url: DIRECTORY + pageJSON
				};

				$http(options).then(function(response) {
					scaffoldService[title] = scaffoldService[title] || {};
					scaffoldService[title].config = response.data;
					$state.go(stateName);
				});
				return;
			}

			var componentArray = [];

			scaffoldService[title].component = scaffoldService[title].component || {};

			//console.log('from:',fromState,'\nto: ',toState,'\n',scaffoldService[title].component);

			iterateComponents(config);

			function iterateComponents(obj) {
				for (var property in obj) {
					if (property == 'components') {
						var comp_array = obj[property];
						for (var i = 0; i < comp_array.length; i++) {
							if (comp_array[i].hasOwnProperty('identifier') && comp_array[i]['identifier'].length > 0) {
								var type = comp_array[i]['type'];
								scaffoldService[title].component[type] = scaffoldService[title].component[type] || {};
								componentArray.push({
									type: comp_array[i]['type'],
									identifier: comp_array[i]['identifier']
								});
							}
						}
					}
					if (typeof obj[property] == 'object')
						iterateComponents(obj[property]);
				}
			}

			var promiseArr = [];
			for (var i = 0; i < componentArray.length; i++) {
				var type = componentArray[i].type;
				var identifier = componentArray[i].identifier;
				scaffoldService[title].component[type][identifier] = {
					readyDeferred: $q.defer()
				};

				var newPromise = scaffoldService[title].component[type][identifier].readyDeferred.promise;
				scaffoldService[title].component[type][identifier].ready = newPromise;
				promiseArr.push(newPromise);
			}

			scaffoldService[title].ready = $q.all(promiseArr);
			//stuff to execute on each page load
			scaffoldService[title].ready.then(function() {
				$('[data-toggle=tooltip]').tooltip();
			});
		});
	}
})();


(function() {
	angular.module('data')
		.service('dataService', dataService);

	dataService.$inject = ['$http'];

	function dataService($http) {
		var dataService = this;
		dataService.data = {};
		dataService.form = {
			showErrors: {}
		};
	}
})();


(function () {
	angular.module('component')
	.service('componentService',componentService);

	function componentService(){
		var componentService = this;
		componentService = {};
	}
})(); 

(function () {
	angular.module('scaffold')
	.service('scaffoldService',scaffoldService);

	function scaffoldService(){
		var scaffoldService = this;
	}
})(); 

(function () {
	angular.module('validator')
	.service('validatorService',validatorService);

	validatorService.$inject = ['$q'];

	function validatorService(){
		var validator = {};
		var validatorService = this;

		validatorService.getValidator = getValidator;
		validatorService.setValidator = setValidator;

		function noopSyncValidator(param, value) {
				return true;
		}

		function noopAsyncValidator(param, value) {
			var deferred = $q.defer();
			deferred.resolve();
			return deferred.promise;
		}

		function getValidator(sync,condition){
			return validator[condition] || (sync ? noopSyncValidator : noopAsyncValidator);
		};
		function setValidator(sync,condition,fn){
			validator[condition] = fn;
		};
	}
})(); 

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

(function () {
	angular.module('accordion')
	.directive('uiAccordion',uiAccordion);

	function uiAccordion(){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/accordion/accordion.directive.html',
			controller : 'AccordionController'
		};

		return directive;
	}
})(); 

(function () {
	angular.module('buttonAtom')
	.controller('ButtonAtomController',ButtonAtomController);

	ButtonAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory'];

	function ButtonAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'content' : 'String',
			'disabled' : 'Boolean',
			'href' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }
			componentFactory.controller.config.click($scope,{
				pageTitle : pageTitle,
				clickAction : $scope.component.clickAction,
				clickFnScopePath : 'clickFn',
				clickFnScaffoldName : 'clickFn',
				href : $scope.component.href,
				validateForm : $scope.component.validateForm
			});

			var buttonAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});
		})(); 
	}
})(); 

(function() {
	angular.module('buttonAtom')
	.directive('uiButtonAtom', uiButtonAtom);

	uiButtonAtom.$inject = ['$compile','componentService'];

	function uiButtonAtom($compile,componentService) {
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/buttonAtom/buttonAtom.directive.html',
			controller : 'ButtonAtomController'
		};

		return directive;
	}
})();


(function () {
	angular.module('checkboxAtom')
	.controller('CheckboxAtomController',CheckboxAtomController);

	CheckboxAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory'];

	function CheckboxAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory){
		$scope.data = dataService.data;
		$scope.form = dataService.form;

		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'disabled' : 'Boolean'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var checkboxAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

		})(); 
	}
})(); 

(function() {
	angular.module('checkboxAtom')
		.directive('uiCheckboxAtom', uiCheckboxAtom);

	uiCheckboxAtom.$inject = ['$compile', 'dataService', '$timeout','componentService','componentFactory'];

	function uiCheckboxAtom($compile, dataService, $timeout, componentService, componentFactory) {
		var directive = {
			restrict: 'E',
			scope: {
				componentCopy: '=component',
				identifier: '=',
				type : '='
			},
			templateUrl: '../shared/components/checkboxAtom/checkboxAtom.directive.html',
			controller: 'CheckboxAtomController',
			compile: compileFn,
			replace: true
		};
		return directive;

		function compileFn(tElement, tAttrs) {
			var component = componentService[tAttrs.componentIdentifier];

			var checkboxElement = tElement.find('input');
			
			if(component.model)
				checkboxElement.attr('ng-model',component.model);
			checkboxElement.attr('name', component.name);
			checkboxElement.attr('id', component.id);

			componentFactory.compiler.config.attachValidators(checkboxElement, {
				validators : component.validators,
				componentType : 'checkboxAtom',
				aliasedValidators : {
					required : 'required'
				}
			});
		
		delete componentService[tAttrs.componentIdentifier];
		};
	}
})();


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

(function () {
	angular.module('checkboxGroup')
	.directive('uiCheckboxGroup',uiCheckboxGroup);

	uiCheckboxGroup.$inject = ['componentService','$state'];
	function uiCheckboxGroup(componentService,$state){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/checkboxGroup/checkboxGroup.directive.html',
			controller : 'CheckboxGroupController'
		};

		return directive;
	}
})(); 

(function () {
	angular.module('checkboxListAtom')
	.controller('CheckboxListAtomController',CheckboxListAtomController);

	CheckboxListAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','utilitiesFactory'];

	function CheckboxListAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory, utilitiesFactory){
		$scope.data = dataService.data;
		$scope.form = dataService.form;

		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'disabled' : 'Boolean'
		};

		$scope.updateCheckboxListGroup = function(){
			var isChecked = utilitiesFactory.getNestedProperty($scope.component.model);
			var checkboxListGroupArray = utilitiesFactory.getNestedProperty($scope.component.groupModel);
			if(isChecked){
			//add to groupModel
			if(!angular.isArray(checkboxListGroupArray))
				utilitiesFactory.dynamicSetNestedProperty($scope.component.groupModel, [$scope.component.value]);
			else
				utilitiesFactory.nestedArrayPush($scope.component.groupModel, $scope.component.value);
			}
			else{
			//remove from groupModel
			var index = checkboxListGroupArray.indexOf($scope.component.value);
			if(index != -1){
					utilitiesFactory.nestedArraySplice($scope.component.groupModel, index, 1);
			}
			}
		};
		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var checkboxListAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

		})(); 
	}
})(); 

(function() {
	angular.module('checkboxListAtom')
		.directive('uiCheckboxListAtom', uiCheckboxListAtom);

	uiCheckboxListAtom.$inject = ['$compile', 'dataService', '$timeout','componentService','componentFactory'];

	function uiCheckboxListAtom($compile, dataService, $timeout, componentService, componentFactory) {
		var directive = {
			restrict: 'E',
			scope: {
				componentCopy: '=component',
				identifier: '=',
				type : '='
			},
			templateUrl: '../shared/components/checkboxListAtom/checkboxListAtom.directive.html',
			controller: 'CheckboxListAtomController',
			compile: compileFn,
			replace: true
		};
		return directive;

		function compileFn(tElement, tAttrs) {
			var component = componentService[tAttrs.componentIdentifier];

			var checkboxListElement = tElement.find('input');
			
			
			if(component.model)
				checkboxListElement.attr('ng-model',component.model);
			checkboxListElement.attr('name', component.name);
			checkboxListElement.attr('id', component.id);

			componentFactory.compiler.config.attachValidators(checkboxListElement, {
				validators : component.validators,
				componentType : 'checkboxListAtom',
				aliasedValidators : {
					required : 'required'
				}
			});
		
		delete componentService[tAttrs.componentIdentifier];
		};
	}
})();


(function() {
	angular.module('checkboxListAtom')
		.directive('uiValidatorMaxChecked', uiValidatorMaxChecked);

	uiValidatorMaxChecked.$inject = ['utilitiesFactory','$state'];
	function uiValidatorMaxChecked(utilitiesFactory,$state) {
		var directive = {
			restrict: 'A',
			require: 'ngModel',
			link: linker
		};
		return directive;

		function linker(scope, element, attrs, controller) {
			var param = attrs.uiValidatorMaxChecked.split('%');
			var groupModel = param[0];
			var groupNames = param[1].split(',');
			var max = param[2];
			controller.$validators.maxChecked = function(value) {
				var groupModelArray = utilitiesFactory.getNestedProperty(groupModel) || [];
				if(groupModelArray.length > max)
					return false;
				else{
					try{ var pageTitle = $state.current.data.title; }
					catch(err) { return true; }

					for(var i = 0;i<groupNames.length;i++){
						try{
							//because the other checkboxes might not be defined
							scope.form[pageTitle+'Form'][groupNames[i]].$setValidity("maxChecked",true);
						} catch(err) { return true; }
					}

					return true;
				}
			}
		}
	}
})();

(function() {
	angular.module('checkboxListAtom')
		.directive('uiValidatorMinChecked', uiValidatorMinChecked);

	uiValidatorMinChecked.$inject = ['utilitiesFactory','$state'];
	function uiValidatorMinChecked(utilitiesFactory,$state) {
		var directive = {
			restrict: 'A',
			require: 'ngModel',
			link: linker
		};
		return directive;

		function linker(scope, element, attrs, controller) {
			var param = attrs.uiValidatorMinChecked.split('%');
			var groupModel = param[0];
			var groupNames = param[1].split(',');
			var min = param[2];
			controller.$validators.minChecked = function(value) {
				var groupModelArray = utilitiesFactory.getNestedProperty(groupModel) || [];
				if(groupModelArray.length < min)
					return false;
				else{
					try{ var pageTitle = $state.current.data.title; }
					catch(err) { return true; }

					for(var i = 0;i<groupNames.length;i++){
						try{
							//because the other checkboxes might not be defined
							scope.form[pageTitle+'Form'][groupNames[i]].$setValidity("minChecked",true);
						} catch(err) { return true; }
					}

					return true;
				}
			}
		}
	}
})();

(function() {
	angular.module('component')
		.directive('uiComponent', uiComponent);

	uiComponent.$inject = ['$compile','componentService','utilitiesFactory'];

	function uiComponent($compile,componentService,utilitiesFactory) {
		var directive = {
			restrict: 'E',
			link: linker,
			scope: {
				component: '='
			}
		};
		return directive;

		function linker(scope, element, attrs) {
			
			var componentIdentifier = "";

			if (attrs.ovrStrIdentifier)
				scope.identifier = angular.copy(attrs.ovrStrIdentifier);
			else
			{
				try{
				scope.identifier = angular.copy(scope.component.identifier);
			}catch(err){debugger;}
			}
			
			if (attrs.ovrStrType)
				scope.type = angular.copy(attrs.ovrStrType);
			else
				scope.type = angular.copy(scope.component.type);


			var linkedAttr = "";
			if(attrs.hasOwnProperty('linked'))
				linkedAttr = " linked ";
			//components which need the scope object in the compile function
			//can use the componentService
			//for dot notation delimit by underscores
			//if whatever is passed does not evaluate properly, it is not assigned
			//if it is malformed JSON, an error will be thrown

			//if overwritten type, this becomes the new component
			switch(scope.type){
				case 'inputAtom':
				case 'textareaAtom':
				case 'selectAtom':
				case 'radioAtom':
				case 'checkboxAtom':
				case 'checkboxListAtom':
				case 'errorMessages':
				case 'sortTable':
				case 'heading':
				case 'paragraph':
				var extendedComponentService = angular.copy(componentService[scope.identifier]) || {};
				componentService[scope.identifier] = angular.extend({},angular.copy(scope.component),extendedComponentService);
				componentIdentifier = " component-identifier='" + scope.identifier + "' ";
				
				angular.forEach(attrs,function(value, key, obj){
					var csPath;
					var csValue;
					if(key.indexOf('ovrStr') === 0){
						csPath = key.charAt(6).toLowerCase() + key.substring(7).replace(/_/g,'.');
						csValue = value;
					}
					else if(key.indexOf('ovrNum') === 0){
						csPath = key.charAt(6).toLowerCase() + key.substring(7).replace(/_/g,'.');
						csValue = Number(value);
						csValue = isFinite(csValue) ? csValue : undefined;						
					}
					else if(key.indexOf('ovrBool') === 0){
						csPath = key.charAt(7).toLowerCase() + key.substring(8).replace(/_/g,'.');
						csValue;
						if(value === "false")
							csValue = false;
						else if(value === "true")
							csValue = true;
					}
					else if(key.indexOf('ovrJson') === 0){
						csPath = key.charAt(7).toLowerCase() + key.substring(8).replace(/_/g,'.');
						csValue = angular.fromJson(value);
					}
					else
						return;
					utilitiesFactory.setNestedProperty(csPath, csValue, componentService[scope.identifier]);					
				});

				if(componentService[scope.identifier].model && componentService[scope.identifier].model.length)
					componentService[scope.identifier].model = 'data.' + componentService[scope.identifier].model;
				
			}

			var deCamelCasedComponentType = scope.type.replace(/([A-Z])/g,'-$1').toLowerCase();

			var template = "<ui-" + deCamelCasedComponentType + " type='type' identifier='identifier' component='component' " + componentIdentifier + linkedAttr + "></ui-" + deCamelCasedComponentType + ">";

			element.replaceWith($compile(template)(scope));
		};
	}
})();


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


(function() {
	angular.module('componentScaffold')
		.controller('ComponentScaffoldController', ComponentScaffoldController);

	ComponentScaffoldController.$inject = ['$scope', '$element', '$attrs', '$state', '$compile', 'dataService', 'scaffoldService', 'componentFactory', '$q'];

	function ComponentScaffoldController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory, $q) {

		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope, $element, $attrs);

		var allowedVariables = {
			'shown': 'String'
		};

		(function() {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var componentScaffoldComponent = componentFactory.controller.config.componentToScaffoldService($scope, {
				pageTitle: pageTitle,
				resolveReadyIfPresent: false,
				bindGetAndSet: true,
				allowedVariables: allowedVariables
			});

			var hasDeferred = componentScaffoldComponent.readyDeferred ? true : false;

			var promiseArr = [];

			//triply nested for loop!!!
			for (var i = 0; i < $scope.component.row.length; i++) {
				for (var j = 0; j < $scope.component.row[i].length; j++) {
					//create subcomponent for a sub-subcomponentScaffold, if present
					var column = $scope.component.row[i][j];
					if (column.subComponentScaffold.hasSubComponentScaffold) {
						var subComponentScaffoldIdentifier = column.subComponentScaffold.componentScaffold.identifier;
						var subComponentScaffoldType = column.subComponentScaffold.componentScaffold.type;

						var subComponentScaffoldSubcomponent = componentFactory.controller.config.createSubcomponent({
							pageTitle: pageTitle,
							identifier: subComponentScaffoldIdentifier,
							componentType: subComponentScaffoldType,
							createDeferred: hasDeferred,
							assignSubcomponent: true,
							component: componentScaffoldComponent
						});

						if (hasDeferred)
							promiseArr.push(subComponentScaffoldSubcomponent.ready);
					}

					for (var k = 0; k < $scope.component.row[i][j].scaffoldComponents.length; k++) {
						//create subcomponent for the text/plaintext
						var scaffoldComponent = $scope.component.row[i][j].scaffoldComponents[k];
						var scaffoldComponentIdentifier = scaffoldComponent.identifier;
						var scaffoldComponentType = scaffoldComponent.type;

						var scaffoldComponentSubcomponent = componentFactory.controller.config.createSubcomponent({
							pageTitle: pageTitle,
							identifier: scaffoldComponentIdentifier,
							componentType: scaffoldComponentType,
							createDeferred: hasDeferred,
							assignSubcomponent: true,
							component: componentScaffoldComponent
						});

						if (hasDeferred)
							promiseArr.push(scaffoldComponentSubcomponent.ready);
					}

				}
			}


			if (hasDeferred) {
				$q.all(promiseArr).then(function() {
					componentScaffoldComponent.readyDeferred.resolve();
				});
			}
		})();

	}

})();


(function () {
	angular.module('componentScaffold')
	.directive('uiComponentScaffold',uiComponentScaffold);

	function uiComponentScaffold(){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/componentScaffold/componentScaffold.directive.html',
			controller : 'ComponentScaffoldController'
		};

		return directive;
	}
})(); 

(function () {
	angular.module('componentSevered')
	.directive('uiComponentSevered',uiComponentSevered);

	uiComponentSevered.$inject = ['componentService','utilitiesFactory','$compile'];

	function uiComponentSevered(componentService, utilitiesFactory,$compile){
		var directive = {
			restrict : 'E',
			link : linker,
			scope : {}
		};

		return directive;

		function linker(scope, element, attrs){

			scope.component = angular.fromJson(attrs.component);
			template = '<span><ui-component component="component"></ui-component></span>';
			element.replaceWith($compile(template)(scope));

		}
	}
})(); 

(function () {
	angular.module('date')
	.controller('DateController',DateController);

	DateController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory'];

	function DateController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory){
		$scope.data = dataService.data;
		$scope.form = dataService.form;

		componentFactory.controller.config.linked($scope,$element,$attrs);

		$scope.hasMask = {
	    "hasMask": true,
	    "mask": "99/99/9999",
	    "maskPlaceholder": "--/--/----",
	    "maskModel": $scope.component.maskModel
  		};


		var allowedVariables = {
			'readonly' : 'Boolean',
			'disabled' : 'Boolean',
			'placeholder' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var dateComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : false,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

		})(); 
	}
})(); 

(function() {
	angular.module('date')
		.directive('uiDate', uiDate);

	uiDate.$inject = ['$compile', 'dataService', '$timeout','componentService','componentFactory'];

	function uiDate($compile, dataService, $timeout, componentService, componentFactory) {
		var directive = {
			restrict: 'E',
			scope: {
				componentCopy: '=component',
				identifier: '=',
				type : '='
			},
			templateUrl: '../shared/components/date/date.directive.html',
			controller: 'DateController',
			replace: true
		};
		return directive;
	}
})();


(function() {
	angular.module('date')
		.directive('uiValidatorDate', uiValidatorDate);

	function uiValidatorDate() {
		var directive = {
			restrict: 'A',
			require: 'ngModel',
			link: linker
		};
		return directive;

		function linker(scope, element, attrs, controller) {

			controller.$validators.date = function(value) {
				if ((value || "").length != 8)
					return true;
				else
					return moment(value, "MMDDYYYY").isValid();
			}
		}
	}
})();


(function() {
	angular.module('date')
		.directive('uiValidatorDateCompare', uiValidatorDateCompare);

	function uiValidatorDateCompare() {
		var directive = {
			restrict: 'A',
			require: 'ngModel',
			link: linker
		};
		return directive;

		function linker(scope, element, attrs, controller) {
			var aftersArr = attrs.uiValidatorDateCompare.split(',');
			var i;
			for (i = 0; i < aftersArr.length; i++) {
				var prefix = i.toString();
				if (aftersArr.length == 1)
					prefix = "";
				var comparison = aftersArr[i].split(':');
				if (comparison[0] == 'after') {
					(function() {
						//entered date is after given date
						var givenDateMoment = moment();
						if (comparison[1] != 'today')
							givenDateMoment = moment(comparison[1], "MM/DD/YYYY");
						controller.$validators['dateAfter' + prefix] = function(value) {
							if ((value || "").length != 8)
								return true;
							else {
								return moment(value, "MMDDYYYY").isAfter(givenDateMoment);
							}
						}
					})();
				} else if (comparison[0] == 'before') {
					(function() {
						//entered date is before given date
						var givenDateMoment = moment();
						if (comparison[1] != 'today')
							givenDateMoment = moment(comparison[1], "MM/DD/YYYY");

						controller.$validators['dateBefore' + prefix] = function(value) {
							if ((value || "").length != 8)
								return true;
							else {
								return moment(value, "MMDDYYYY").isBefore(givenDateMoment);
							}
						}
					})();
				} else if (comparison[0] == 'greaterPast') {
					(function() {
						//today - entered date > given date
						//entered date + given date < today
						//today must be after entered date
						//if not, true is returned
						var splitDate = comparison[1].split('/');

						controller.$validators['greaterPast' + prefix] = function(value) {
							if ((value || "").length != 8)
								return true;
							else {
								var todayMoment = moment();
								var givenDateMoment = moment(value, "MMDDYYYY");
								if (todayMoment.isAfter(givenDateMoment)) {
									givenDateMoment.add({
										M: splitDate[0],
										d: splitDate[1],
										y: splitDate[2]
									});
									return givenDateMoment.isBefore(todayMoment);
								}
								return true;
							}
						}
					})();
				} else if (comparison[0] == 'greaterFuture') {
					(function() {
						//entered date - today > given date
						//today + given date < entered date	
						//today must be before entered date
						//if not, true is returned
						var splitDate = comparison[1].split('/');

						controller.$validators['greaterFuture' + prefix] = function(value) {
							if ((value || "").length != 8)
								return true;
							else {
								var todayMoment = moment();
								var givenDateMoment = moment(value, "MMDDYYYY");
								if (todayMoment.isBefore(givenDateMoment)) {
									todayMoment.add({
										M: splitDate[0],
										d: splitDate[1],
										y: splitDate[2]
									});
									return todayMoment.isBefore(givenDateMoment);
								}
								return true;
							}
						}
					})();
				} else if (comparison[0] == 'lessPast') {
					(function() {
						//today - entered date < given date
						//entered date + given date > today
						//today must be before entered date
						//if not, true is returned
						var splitDate = comparison[1].split('/');

						controller.$validators['lessPast' + prefix] = function(value) {
							if ((value || "").length != 8)
								return true;
							else {
								var todayMoment = moment();
								var givenDateMoment = moment(value, "MMDDYYYY");
								if (todayMoment.isAfter(givenDateMoment)) {
									givenDateMoment.add({
										M: splitDate[0],
										d: splitDate[1],
										y: splitDate[2]
									});
									return givenDateMoment.isAfter(todayMoment);
								}
								return true;
							}
						}
					})();
				} else if (comparison[0] == 'lessFuture') {
					(function() {
						//entered date - today < given date
						//today + given date > entered date
						//today must be after entered date
						//if not, true is returned
						var splitDate = comparison[1].split('/');

						controller.$validators['lessFuture' + prefix] = function(value) {
							if ((value || "").length != 8)
								return true;
							else {
								var todayMoment = moment();
								var givenDateMoment = moment(value, "MMDDYYYY");
								if (todayMoment.isBefore(givenDateMoment)) {
									todayMoment.add({
										M: splitDate[0],
										d: splitDate[1],
										y: splitDate[2]
									});
									return todayMoment.isAfter(givenDateMoment);
								}
								return true;
							}
						}
					})();
				}


			}

		}
	}
})();


(function () {
	angular.module('dropdownAtom')
	.controller('DropdownAtomController',DropdownAtomController);

	DropdownAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory'];

	function DropdownAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'title' : 'String',
			'disabled' : 'Boolean'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			$scope.clickFns = [];
			for(var i = 0; i<$scope.component.dropdownMenu.length; i++){
				(function () {
					var menuItem = $scope.component.dropdownMenu[i];
					if(menuItem.menuItemType == 'link'){
						componentFactory.controller.config.click($scope,{
							pageTitle : pageTitle,
							clickAction : menuItem.clickAction,
							clickFnScopePath : 'clickFns['+menuItem.clickFnName+']',
							clickFnScaffoldName : menuItem.clickFnName,
							href : menuItem.href,
							validateForm : menuItem.validateForm
						});
					}
				})(); 
			}

			var dropdownAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			dropdownAtomComponent.clickFns = dropdownAtomComponent.clickFns || {};
		})(); 
	}
})(); 

(function() {
	angular.module('dropdownAtom')
	.directive('uiDropdownAtom', uiDropdownAtom);

	uiDropdownAtom.$inject = ['$compile','componentService'];

	function uiDropdownAtom($compile,componentService) {
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/dropdownAtom/dropdownAtom.directive.html',
			controller : 'DropdownAtomController'
		};

		return directive;
	}
})();


(function () {
	angular.module('errorMessages')
	.controller('ErrorMessagesController',ErrorMessagesController);

	ErrorMessagesController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$q'];
	function ErrorMessagesController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$q){
		$scope.data = dataService.data;
		$scope.form = dataService.form;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var errorMessagesComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : false,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			var hasDeferred = errorMessagesComponent.readyDeferred ? true : false;

			var validatorsArr = $scope.component.validators;
			var promiseArr = [];
			for(var i = 0; i < validatorsArr.length; i++){
				var subcomponentIdentifier = validatorsArr[i].contents.identifier;
				var subcomponentType = validatorsArr[i].contents.type;

				var subcomponent = componentFactory.controller.config.createSubcomponent({
					pageTitle : pageTitle,
					identifier : subcomponentIdentifier,
					componentType : subcomponentType,
					createDeferred : hasDeferred,
					assignSubcomponent : true,
					component : errorMessagesComponent
				});

				if(hasDeferred)
					promiseArr.push(subcomponent.ready);
			}

			if(hasDeferred){
				$q.all(promiseArr).then(function(){
					errorMessagesComponent.readyDeferred.resolve();
				});
			}
		})(); 
	}

})(); 

(function () {
	angular.module('errorMessages')
	.directive('uiErrorMessages',uiErrorMessages);

	uiErrorMessages.$inject = ['componentService','$state'];
	function uiErrorMessages(componentService,$state){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/errorMessages/errorMessages.directive.html',
			controller : 'ErrorMessagesController',
			compile : compileFn
		};

		return directive;

		function compileFn(tElement,tAttrs){
			var component = componentService[tAttrs.componentIdentifier];
			var name = component.name;

			var errormessagesElement = tElement.find('[ui-error-messages]');
			
			var pageTitle;
			try { pageTitle = $state.current.data.title; }
			catch (err) { 
				errormessagesElement.find('[ng-message]').removeAttr('ng-message');
				delete componentService[tAttrs.componentIdentifier];
				return;
				 }
			var form = pageTitle + 'Form';
			errormessagesElement.attr('ng-messages', 'form.' + form + '.' + name + '.$error');
			errormessagesElement.attr('ng-show', 'form.showErrors.' + form);

			delete componentService[tAttrs.componentIdentifier];
		}
	}
})(); 

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

(function () {
	angular.module('formGroup')
	.directive('uiFormGroup',uiFormGroup);

	uiFormGroup.$inject = ['componentService','$state'];
	function uiFormGroup(componentService,$state){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/formGroup/formGroup.directive.html',
			controller : 'FormGroupController'
		};

		return directive;
	}
})(); 

(function () {
	angular.module('heading')
	.controller('HeadingController',HeadingController);

	HeadingController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$q'];
	function HeadingController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$q){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String',
			'headingContent' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var headingComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : false,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			var hasDeferred = headingComponent.readyDeferred ? true : false;

			var promiseArr = [];

				var subcomponentIdentifier = $scope.component.contents.identifier;
				var subcomponentType = $scope.component.contents.type;

				var subcomponent = componentFactory.controller.config.createSubcomponent({
					pageTitle : pageTitle,
					identifier : subcomponentIdentifier,
					componentType : subcomponentType,
					createDeferred : hasDeferred,
					assignSubcomponent : true,
					component : headingComponent
				});

				if(hasDeferred)
					promiseArr.push(subcomponent.ready);

			if(hasDeferred){
				$q.all(promiseArr).then(function(){
					headingComponent.readyDeferred.resolve();
				});
			}
		})(); 
	}

})(); 

(function () {
	angular.module('heading')
	.directive('uiHeading',uiHeading);

	uiHeading.$inject = ['componentService'];
	function uiHeading(componentService){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/heading/heading.directive.html',
			controller : 'HeadingController',
			link : linker
		};

		return directive;

		function linker(scope,element,attrs){
			var component = componentService[attrs.componentIdentifier];
			if((component.parentClass || "").length){
				scope.component.parentClass = component.parentClass;
			}
			delete componentService[attrs.componentIdentifier];
		}
	}
})(); 

(function () {
	angular.module('imageAtom')
	.controller('ImageAtomController',ImageAtomController);

	ImageAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory'];

	function ImageAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String'
		};


		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			if($scope.component.imageType == 'link')
			{
				componentFactory.controller.config.click($scope,{
					pageTitle : pageTitle,
					clickAction : $scope.component.clickAction,
					clickFnScopePath : 'clickFn',
					clickFnScaffoldName : 'clickFn',
					href : $scope.component.href,
					validateForm : $scope.component.validateForm
				});
			}

			var imageAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

		})(); 
	}
})(); 

(function() {
	angular.module('imageAtom')
	.directive('uiImageAtom', uiImageAtom);

	uiImageAtom.$inject = ['$compile','componentService'];

	function uiImageAtom($compile,componentService) {
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/imageAtom/imageAtom.directive.html',
			controller : 'ImageAtomController'
		};

		return directive;

	}
})();


(function () {
	angular.module('inline')
	.controller('InlineController',InlineController);

	InlineController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$q'];
	function InlineController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$q){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var inlineComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : false,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			var hasDeferred = inlineComponent.readyDeferred ? true : false;

			var contents = $scope.component.contents;
			var promiseArr = [];
			for(var i = 0; i < contents.length; i++){
				var subcomponentIdentifier = contents[i].identifier;
				var subcomponentType = contents[i].type;

				var subcomponent = componentFactory.controller.config.createSubcomponent({
					pageTitle : pageTitle,
					identifier : subcomponentIdentifier,
					componentType : subcomponentType,
					createDeferred : hasDeferred,
					assignSubcomponent : true,
					component : inlineComponent
				});

				if(hasDeferred)
					promiseArr.push(subcomponent.ready);
			}

			if(hasDeferred){
				$q.all(promiseArr).then(function(){
					inlineComponent.readyDeferred.resolve();
				});
			}
		})(); 
	}

})(); 

(function () {
	angular.module('inline')
	.directive('uiInline',uiInline);

	function uiInline(){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/inline/inline.directive.html',
			controller : 'InlineController'
		};

		return directive;
	}
})(); 

(function () {
	angular.module('inputAtom')
	.controller('InputAtomController',InputAtomController);

	InputAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory'];

	function InputAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory){
		$scope.data = dataService.data;
		$scope.form = dataService.form;

		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'readonly' : 'Boolean',
			'disabled' : 'Boolean',
			'placeholder' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var inputAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

		})(); 
	}
})(); 

(function() {
	angular.module('inputAtom')
		.directive('uiInputAtom', uiInputAtom);

	uiInputAtom.$inject = ['$compile', 'dataService', '$timeout','componentService','componentFactory'];

	function uiInputAtom($compile, dataService, $timeout, componentService, componentFactory) {
		var directive = {
			restrict: 'E',
			scope: {
				componentCopy: '=component',
				identifier: '=',
				type : '='
			},
			templateUrl: '../shared/components/inputAtom/inputAtom.directive.html',
			controller: 'InputAtomController',
			compile: compileFn,
			replace: true
		};
		return directive;

		function compileFn(tElement, tAttrs) {
			var component = componentService[tAttrs.componentIdentifier];

			var inputElement = tElement.find('input');
			
			if(component.hasMask.hasMask){
				inputElement.attr('ui-mask',component.hasMask.mask);
				inputElement.attr('model-view-value',component.hasMask.maskModel);
				if(component.hasMask.maskPlaceholder.length)
					inputElement.attr('ui-mask-placeholder',component.hasMask.maskPlaceholder);
			}
			
			if(component.model)
				inputElement.attr('ng-model',component.model);
			inputElement.attr('name', component.name);
			inputElement.attr('id', component.id);

			if (component.utilities) {
				var utilitiesArr = component.utilities;
				for (var i = 0; i < utilitiesArr.length; i++) {
					if (utilitiesArr[i].utility == 'maxlength')
						inputElement.attr('maxlength', utilitiesArr[i].parameters);
					else {
						var deCameled = utilitiesArr[i].utility.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
						inputElement.attr("util-" + deCameled, utilitiesArr[i].parameters);
					}
				}
			}

			componentFactory.compiler.config.attachValidators(inputElement, {
				validators : component.validators,
				componentType : 'inputAtom',
				aliasedValidators : {
					required : 'required',
					pattern : 'ng-pattern',
					minlength : 'ng-minlength',
					maxlength : 'ng-maxlength'

				}
			});
		
		delete componentService[tAttrs.componentIdentifier];
		};
	}
})();


(function () {
	angular.module('list')
	.controller('ListController',ListController);

	ListController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$q'];
	function ListController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$q){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var listComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : false,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			var hasDeferred = listComponent.readyDeferred ? true : false;

			var listItems = $scope.component.listItems;
			var promiseArr = [];
			for(var i = 0; i < listItems.length; i++){
				//create subcomponent for the text/plaintext
				var textSubcomponentIdentifier = listItems[i].contents.identifier;
				var textSubcomponentType = listItems[i].contents.type;

				var textSubcomponent = componentFactory.controller.config.createSubcomponent({
					pageTitle : pageTitle,
					identifier : textSubcomponentIdentifier,
					componentType : textSubcomponentType,
					createDeferred : hasDeferred,
					assignSubcomponent : true,
					component : listComponent
				});

				if(hasDeferred)
					promiseArr.push(textSubcomponent.ready);

				//create subcomponent for a sublist, if present
				if(listItems[i].subList.hasSubList){
					var listSubcomponentIdentifier = listItems[i].subList.list.identifier;
					var listSubcomponentType = listItems[i].subList.list.type;

					var listSubcomponent = componentFactory.controller.config.createSubcomponent({
						pageTitle : pageTitle,
						identifier : listSubcomponentIdentifier,
						componentType : listSubcomponentType,
						createDeferred : hasDeferred,
						assignSubcomponent : true,
						component : listComponent
					});

					if(hasDeferred)
						promiseArr.push(listSubcomponent.ready);
				}


				
			}

			if(hasDeferred){
				$q.all(promiseArr).then(function(){
					listComponent.readyDeferred.resolve();
				});
			}
		})(); 
	}

})(); 

(function () {
	angular.module('list')
	.directive('uiList',uiList);

	function uiList(){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/list/list.directive.html',
			controller : 'ListController'
		};

		return directive;
	}
})(); 

(function() {
	angular.module('mediaObject')
		.controller('MediaObjectController', MediaObjectController);

	MediaObjectController.$inject = ['$scope', 'scaffoldService', '$state', '$attrs','componentFactory','$element', '$q'];

	function MediaObjectController($scope, scaffoldService, $state, $attrs, componentFactory, $element, $q) {
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var mediaObjectComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : false,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			
			var hasDeferred = mediaObjectComponent.readyDeferred ? true : false;

			var contentsArray = $scope.component.contents.contentsArray;
			var promiseArr = [];
			for(var i = 0; i < contentsArray.length; i++){
				for(var prop in contentsArray[i]){
					var subcomponentComponent = contentsArray[i][prop];
					var subcomponentComponentIdentifier = subcomponentComponent.identifier;
					var subcomponentComponentType = subcomponentComponent.type;

					var subcomponent = componentFactory.controller.config.createSubcomponent({
						pageTitle : pageTitle,
						identifier : subcomponentComponentIdentifier,
						componentType : subcomponentComponentType,
						createDeferred : hasDeferred,
						assignSubcomponent : true,
						component : mediaObjectComponent
					});

					if(hasDeferred)
						promiseArr.push(subcomponent.ready);
				}
			}

			if(hasDeferred){
				$q.all(promiseArr).then(function(){
					mediaObjectComponent.readyDeferred.resolve();
				});
			}

		})(); 
	}

})();


(function(){
	angular.module('mediaObject')
	.directive('uiMediaObject',uiMediaObject);

	uiMediaObject.$inject = ['$compile'];

	function uiMediaObject($compile){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			templateUrl : '../shared/components/mediaObject/mediaObject.directive.html',
			controller: 'MediaObjectController',
			replace: true
		};
		
		return directive;
		}
})();

(function () {
	angular.module('paginationAtom')
	.controller('PaginationAtomController',PaginationAtomController);

	PaginationAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$q','utilitiesFactory'];
	function PaginationAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$q,utilitiesFactory){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String'
		};

		$scope.leftEllipsis = false;
		$scope.rightEllipsis = false;

		$scope.numberPages;
		$scope.currentPage;
		
		$scope.$watch('data.' + $scope.component.model + '.currentPage',function(newValue, oldValue){
			if(newValue != oldValue)
			{
				if($scope.currentPage != newValue)
				{
					$scope.currentPage = newValue;
					calculatePages();
				}
			}
		});
		$scope.$watch('data.' + $scope.component.model + '.numberPages',function(newValue, oldValue){
			if(newValue != oldValue)
			{
				if($scope.numberPages != newValue)
				{
				$scope.numberPages = newValue;
				calculatePages();
				}
			}
		});
		
		var calculatePages = function(){
			var paginationAtomModelValue = angular.copy(utilitiesFactory.getNestedProperty($scope.component.model) || {});
			
			var numberPages = $scope.numberPages || paginationAtomModelValue.numberPages || 1;
			var currentPage = $scope.currentPage || paginationAtomModelValue.currentPage || 1;

			var offset = parseInt($scope.component.maxWidth/2);

			var pages = [];
			var leftEllipsis = false;
			var rightEllipsis = false;
			for(var i = 0; i<$scope.component.maxWidth; i++){
				var page = currentPage - offset + i;

				if(page >= 2 && page <= numberPages - 1)
					pages.push({
						pageNumber : page
						//$$hashKey : function() {return angular.toJson(this)}
					});
			}
			
			if((pages[0] || {}).pageNumber > 2)
				leftEllipsis = true;
			
			if((pages[pages.length - 1] || {}).pageNumber < numberPages - 1)
				rightEllipsis = true;
			
		$scope.leftEllipsis = leftEllipsis;
		$scope.rightEllipsis = rightEllipsis;

		$scope.numberPages = numberPages;
		$scope.currentPage = currentPage;

		utilitiesFactory.setNestedProperty($scope.component.model,{
			numberPages : numberPages,
			currentPage : currentPage
		});
		$scope.pages = pages;
		};

		$scope.gotoPage = function(index,event){
			if(event)
				event.preventDefault();
			if($scope.currentPage == index || index < 1 || index > $scope.numberPages)
				return;
			$scope.currentPage = index;
			calculatePages();
		};

		(function () {
			calculatePages();
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var paginationAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});
		})(); 
	}

})(); 

(function () {
	angular.module('paginationAtom')
	.directive('uiPaginationAtom',uiPaginationAtom);

	uiPaginationAtom.$inject = ['componentService'];
	function uiPaginationAtom(componentService){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/paginationAtom/paginationAtom.directive.html',
			controller : 'PaginationAtomController'
		};

		return directive;
	}
})(); 

(function () {
	angular.module('paragraph')
	.controller('ParagraphController',ParagraphController);

	ParagraphController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$q'];
	function ParagraphController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$q){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var paragraphComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : false,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			var hasDeferred = paragraphComponent.readyDeferred ? true : false;

			var contents = $scope.component.contents;
			var promiseArr = [];
			for(var i = 0; i < contents.length; i++){
				var subcomponentIdentifier = contents[i].identifier;
				var subcomponentType = contents[i].type;

				var subcomponent = componentFactory.controller.config.createSubcomponent({
					pageTitle : pageTitle,
					identifier : subcomponentIdentifier,
					componentType : subcomponentType,
					createDeferred : hasDeferred,
					assignSubcomponent : true,
					component : paragraphComponent
				});

				if(hasDeferred)
					promiseArr.push(subcomponent.ready);
			}

			if(hasDeferred){
				$q.all(promiseArr).then(function(){
					paragraphComponent.readyDeferred.resolve();
				});
			}
		})(); 
	}

})(); 

(function () {
	angular.module('paragraph')
	.directive('uiParagraph',uiParagraph);

	uiParagraph.$inject = ['componentService'];
	function uiParagraph(componentService){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/paragraph/paragraph.directive.html',
			controller : 'ParagraphController',
			link : linker
		};

		return directive;

		function linker(scope,element,attrs){
			var component = componentService[attrs.componentIdentifier];
			if((component.parentClass || "").length){
				scope.component.parentClass = component.parentClass;
			}
			delete componentService[attrs.componentIdentifier];
		}
	}
})(); 

(function () {
	angular.module('plaintextAtom')
	.controller('PlaintextAtomController',PlaintextAtomController);

	PlaintextAtomController.$inject = ['$scope','$element','$attrs','$state','dataService','componentFactory'];

	function PlaintextAtomController($scope, $element, $attrs, $state, dataService, componentFactory){
			
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'content' : 'String',
			'shown' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }
			var plaintextAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

		})(); 
	}
})(); 

(function() {
	angular.module('plaintextAtom')
	.directive('uiPlaintextAtom', uiPlaintextAtom);

	uiPlaintextAtom.$inject = ['$compile','componentService'];

	function uiPlaintextAtom($compile,componentService) {
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/plaintextAtom/plaintextAtom.directive.html',
			controller : 'PlaintextAtomController'
		};

		return directive;
	}
})();


(function () {
	angular.module('radioAtom')
	.controller('RadioAtomController',RadioAtomController);

	RadioAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory'];

	function RadioAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory){
		$scope.data = dataService.data;
		$scope.form = dataService.form;

		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'disabled' : 'Boolean'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var radioAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

		})(); 
	}
})(); 

(function() {
	angular.module('radioAtom')
		.directive('uiRadioAtom', uiRadioAtom);

	uiRadioAtom.$inject = ['$compile', 'dataService', '$timeout','componentService','componentFactory'];

	function uiRadioAtom($compile, dataService, $timeout, componentService, componentFactory) {
		var directive = {
			restrict: 'E',
			scope: {
				componentCopy: '=component',
				identifier: '=',
				type : '='
			},
			templateUrl: '../shared/components/radioAtom/radioAtom.directive.html',
			controller: 'RadioAtomController',
			compile: compileFn,
			replace: true
		};
		return directive;

		function compileFn(tElement, tAttrs) {
			var component = componentService[tAttrs.componentIdentifier];

			var radioElement = tElement.find('input');
			
			
			if(component.model)
				radioElement.attr('ng-model',component.model);
			radioElement.attr('name', component.name);
			radioElement.attr('id', component.id);

			componentFactory.compiler.config.attachValidators(radioElement, {
				validators : component.validators,
				componentType : 'radioAtom',
				aliasedValidators : {
					required : 'required'
				}
			});
		
		delete componentService[tAttrs.componentIdentifier];
		};
	}
})();


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

(function () {
	angular.module('radioGroup')
	.directive('uiRadioGroup',uiRadioGroup);

	uiRadioGroup.$inject = ['componentService','$state'];
	function uiRadioGroup(componentService,$state){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/radioGroup/radioGroup.directive.html',
			controller : 'RadioGroupController'
		};

		return directive;
	}
})(); 

(function(){
	angular.module('scaffold')
	.directive('uiScaffold', uiScaffold);

	uiScaffold.$inject = ['$compile','$http','$state','DIRECTORY','dataService','scaffoldService'];

	function uiScaffold($compile,$http,$state,DIRECTORY,dataService,scaffoldService){
		var directive = {
			restrict : 'E',
			link : linker,
			templateUrl : '../shared/components/scaffold/scaffold.directive.html',
			replace : true
		};

		return directive;

		function linker(scope, element, attrs) {
			var title = $state.current.data.title;
			scope.config = scaffoldService[title].config;
			scope.form = dataService.form;
			scope.form.showErrors[scope.config.title+'Form'] = false;

			scope.debuggerx = function(event){
				event.preventDefault();
			};
		}

	}
})();

(function () {
	angular.module('selectAtom')
	.controller('SelectAtomController',SelectAtomController);

	SelectAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory'];

	function SelectAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory){
		$scope.data = dataService.data;
		$scope.form = dataService.form;

		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'readonly' : 'Boolean',
			'disabled' : 'Boolean',
			'placeholder' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var selectAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

		})(); 
	}
})(); 

(function() {
	angular.module('selectAtom')
		.directive('uiSelectAtom', uiSelectAtom);

	uiSelectAtom.$inject = ['$compile', 'dataService', '$timeout','componentService','componentFactory'];

	function uiSelectAtom($compile, dataService, $timeout, componentService, componentFactory) {
		var directive = {
			restrict: 'E',
			scope: {
				componentCopy: '=component',
				identifier: '=',
				type : '='
			},
			templateUrl: '../shared/components/selectAtom/selectAtom.directive.html',
			controller: 'SelectAtomController',
			compile: compileFn,
			replace: true
		};
		return directive;

		function compileFn(tElement, tAttrs) {
			var component = componentService[tAttrs.componentIdentifier];

			var selectElement = tElement.find('select');
			
			
			if(component.model)
				selectElement.attr('ng-model',component.model);
			selectElement.attr('name', component.name);
			selectElement.attr('id', component.id);
			if(component.multiple)
				selectElement.attr('multiple','');

			componentFactory.compiler.config.attachValidators(selectElement, {
				validators : component.validators,
				componentType : 'selectAtom',
				aliasedValidators : {
					required : 'required'
				}
			});
		
		delete componentService[tAttrs.componentIdentifier];
		};
	}
})();


(function() {
	angular.module('sortTable')
		.controller('SortTableController', SortTableController);

	SortTableController.$inject = ['$scope', '$element', '$attrs', '$state', '$compile', 'dataService', 'scaffoldService', 'componentFactory', '$q','utilitiesFactory','$filter'];

	function SortTableController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory, $q, utilitiesFactory, $filter) {
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope, $element, $attrs);

		var allowedVariables = {
			'shown': 'String'
		};
		$scope.predicate = "";
		$scope.reverse = false;
		var reassignedPerPageModel = utilitiesFactory.getNestedProperty($scope.component.perPageModel) || "100";
		utilitiesFactory.setNestedProperty($scope.component.perPageModel,reassignedPerPageModel);

		var reassignNumberPages = function(searchModel, perPageModel){
			var modelValue = angular.copy(utilitiesFactory.getNestedProperty($scope.component.model)) || [];
			var subArray = $filter('filter')(modelValue,searchModel,false);

			//debugger;
			utilitiesFactory.setNestedProperty($scope.component.paginationModel,{
				currentPage : 1, 
				numberPages : Math.ceil(subArray.length/perPageModel)
			});
		};
		
		reassignNumberPages("",reassignedPerPageModel);

		$scope.columnAssignComponent = function(trIndex, tdIndex, rowData){
			var tableColumn = angular.copy($scope.component.columns[tdIndex]);
			var componentToAssign = tableColumn.tableData.contents;
			var key = tableColumn.key;
			var data = rowData[key] || "";
			utilitiesFactory.iterateThroughObject(componentToAssign,function(object,property){
				if(property === 'identifier')
					object[property] = object[property] + '_' + trIndex;
				if(property == 'content'){
					var content = angular.copy(object[property]);
					if(angular.isString(content) && content.indexOf('REPLACE') !== -1){
						content = content.replace(/REPLACE/g, data);
						object[property] = content;
					}
				}
			});
			return componentToAssign;
		};

		$scope.$watch('data.' + $scope.component.searchModel,function(newValue, oldValue){
			var perPageModel = utilitiesFactory.getNestedProperty($scope.component.perPageModel);
			reassignNumberPages(newValue, perPageModel);
		});

		$scope.$watch('data.' + $scope.component.perPageModel,function(newValue, oldValue){
			var searchModel = utilitiesFactory.getNestedProperty($scope.component.searchModel);
			reassignNumberPages(searchModel, newValue);
		});

		$scope.sortColumn = function(key){
			if($scope.predicate !== key)
				$scope.predicate = key;
			else
				$scope.reverse = !$scope.reverse;
		};

		/*
		$scope.refreshTable = function(){
			var copy = angular.copy(utilitiesFactory.getNestedProperty($scope.component.model));
			console.log(copy);
			utilitiesFactory.setNestedProperty($scope.component.model,[]);
			utilitiesFactory.setNestedProperty($scope.component.model,copy);
		};
		*/
		
		(function() {
			try {
				pageTitle = $state.current.data.title;
			} catch (err) {
				return;
			}

			var tableComponent = componentFactory.controller.config.componentToScaffoldService($scope, {
				pageTitle: pageTitle,
				resolveReadyIfPresent: false,
				bindGetAndSet: true,
				allowedVariables: allowedVariables
			});

			var hasDeferred = tableComponent.readyDeferred ? true : false;

			var promiseArr = [];

			if(hasDeferred)
				tableComponent.readyDeferred.resolve();
			/*
			for (var i = 0; i < $scope.component.tableHeaders.length; i++) {
				//create subcomponent for the text/plaintext
				var tableHeader = $scope.component.tableHeaders[i].contents;
				var tableHeaderIdentifier = tableHeader.identifier;
				var tableHeaderType = tableHeader.type;

				var tableHeaderSubcomponent = componentFactory.controller.config.createSubcomponent({
					pageTitle: pageTitle,
					identifier: tableHeaderIdentifier,
					componentType: tableHeaderType,
					createDeferred: hasDeferred,
					assignSubcomponent: true,
					component: tableComponent
				});

				if (hasDeferred)
					promiseArr.push(tableHeaderSubcomponent.ready);

			}

			for (var i = 0; i < $scope.component.tableRows.length; i++) {
				for (var j = 0; j < $scope.component.tableRows[i].length; j++) {
					//create subcomponent for the text/plaintext
					var tableColumn = $scope.component.tableRows[i][j].contents;
					var tableColumnIdentifier = tableColumn.identifier;
					var tableColumnType = tableColumn.type;

					var tableColumnSubcomponent = componentFactory.controller.config.createSubcomponent({
						pageTitle: pageTitle,
						identifier: tableColumnIdentifier,
						componentType: tableColumnType,
						createDeferred: hasDeferred,
						assignSubcomponent: true,
						component: tableComponent
					});

					if (hasDeferred)
						promiseArr.push(tableColumnSubcomponent.ready);

				}

				if (hasDeferred) {
					$q.all(promiseArr).then(function() {
						tableComponent.readyDeferred.resolve();
					});
				}

				*/
			})();
	}

})();


(function () {
	angular.module('sortTable')
	.directive('uiSortTable',uiSortTable);

	uiSortTable.$inject = ['componentService'];
	function uiSortTable(componentService){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/sortTable/sortTable.directive.html',
			controller : 'SortTableController',
			compile : compileFn
		};

		return directive;

		function compileFn(tElement, tAttrs) {
			var component = componentService[tAttrs.componentIdentifier];
			var searchModelFilter = "";
			var currentPageFilter = "";
			if(component.searchModel.length)
				searchModelFilter = " | filter:data." + component.searchModel;
			if(component.paginationModel.length && component.perPageModel.length)
				currentPageFilter = " | limitTo:data." + component.paginationModel + ".currentPage*data." + component.perPageModel + ' | limitTo:-data.' + component.perPageModel;
			var ngRepeatStr = ' in ' + component.model + ' | orderBy:predicate:reverse' + searchModelFilter + currentPageFilter;
			tElement.find("[sort-table-repeat]").each(function() {
				var ngRepeatVar = $(this).attr('ng-repeat');
				$(this).attr("ng-repeat", ngRepeatVar + ngRepeatStr);
			});
		delete componentService[tAttrs.componentIdentifier];
		}
	}
})(); 

(function () {
	angular.module('subView')
	.controller('SubViewController',SubViewController);

	SubViewController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$q'];
	function SubViewController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$q){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var subViewComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});
		})(); 
	}

})(); 

(function () {
	angular.module('subView')
	.directive('uiSubView',uiSubView);

	function uiSubView(){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/components/subView/subView.directive.html',
			controller : 'SubViewController'
		};

		return directive;
	}
})(); 

(function() {
	angular.module('table')
		.controller('TableController', TableController);

	TableController.$inject = ['$scope', '$element', '$attrs', '$state', '$compile', 'dataService', 'scaffoldService', 'componentFactory', '$q'];

	function TableController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory, $q) {
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope, $element, $attrs);

		var allowedVariables = {
			'shown': 'String'
		};

		(function() {
			try {
				pageTitle = $state.current.data.title;
			} catch (err) {
				return;
			}

			var tableComponent = componentFactory.controller.config.componentToScaffoldService($scope, {
				pageTitle: pageTitle,
				resolveReadyIfPresent: false,
				bindGetAndSet: true,
				allowedVariables: allowedVariables
			});

			var hasDeferred = tableComponent.readyDeferred ? true : false;

			var promiseArr = [];
			for (var i = 0; i < $scope.component.tableHeaders.length; i++) {
				//create subcomponent for the text/plaintext
				var tableHeader = $scope.component.tableHeaders[i].contents;
				var tableHeaderIdentifier = tableHeader.identifier;
				var tableHeaderType = tableHeader.type;

				var tableHeaderSubcomponent = componentFactory.controller.config.createSubcomponent({
					pageTitle: pageTitle,
					identifier: tableHeaderIdentifier,
					componentType: tableHeaderType,
					createDeferred: hasDeferred,
					assignSubcomponent: true,
					component: tableComponent
				});

				if (hasDeferred)
					promiseArr.push(tableHeaderSubcomponent.ready);

			}

			for (var i = 0; i < $scope.component.tableRows.length; i++) {
				for (var j = 0; j < $scope.component.tableRows[i].length; j++) {
					//create subcomponent for the text/plaintext
					var tableColumn = $scope.component.tableRows[i][j].contents;
					var tableColumnIdentifier = tableColumn.identifier;
					var tableColumnType = tableColumn.type;

					var tableColumnSubcomponent = componentFactory.controller.config.createSubcomponent({
						pageTitle: pageTitle,
						identifier: tableColumnIdentifier,
						componentType: tableColumnType,
						createDeferred: hasDeferred,
						assignSubcomponent: true,
						component: tableComponent
					});

					if (hasDeferred)
						promiseArr.push(tableColumnSubcomponent.ready);

				}

				if (hasDeferred) {
					$q.all(promiseArr).then(function() {
						tableComponent.readyDeferred.resolve();
					});
				}
			}
		})();
	}

})();


(function () {
	angular.module('table')
	.directive('uiTable',uiTable);

	function uiTable(){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/table/table.directive.html',
			controller : 'TableController'
		};

		return directive;
	}
})(); 

(function () {
	angular.module('textAtom')
	.controller('TextAtomController',TextAtomController);

	TextAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$timeout'];

	function TextAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$timeout){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		/*
		if($scope.component.style != 'custom class'){
			var styleElement = '';
			switch($scope.component.style){
				case 'bold':
				styleElement = 'b';
				break;
				case 'italics':
				styleElement = 'em';
				break;
				case 'underline':
				styleElement = 'u';
				break;
				case 'strikethrough':
				styleElement = 's';
				break;	
				case 'small':
				styleElement = 'small';
				break;														
			}
			$element.wrapInner('<' + styleElement + '/>');
		}
		
		*/

		var allowedVariables = {
			'content' : 'String',
			'shown' : 'String'
		};

		if($scope.component.compile)
			{
				$timeout(function(){
					$compile($element.contents())($scope);
				},0);
			}

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			if($scope.component.textType == 'link')
			{
				componentFactory.controller.config.click($scope,{
					pageTitle : pageTitle,
					clickAction : $scope.component.clickAction,
					clickFnScopePath : 'clickFn',
					clickFnScaffoldName : 'clickFn',
					href : $scope.component.href,
					validateForm : $scope.component.validateForm
				});
			}

			var textAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			textAtomComponent.recompile = function(){
				$compile($element.contents())($scope);
			}
		})(); 
	}
})(); 

(function() {
	angular.module('textAtom')
	.directive('uiTextAtom', uiTextAtom);

	uiTextAtom.$inject = ['$compile','componentService'];

	function uiTextAtom($compile,componentService) {
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/textAtom/textAtom.directive.html',
			controller : 'TextAtomController',
			link : linker
		};

		return directive;

		function linker(scope,element,attrs){
		if(scope.component.style != 'custom class' && scope.component.style != 'default'){
			var styleElement = '';
			switch(scope.component.style){
				case 'bold':
				styleElement = 'b';
				break;
				case 'italics':
				styleElement = 'em';
				break;
				case 'underline':
				styleElement = 'u';
				break;
				case 'strikethrough':
				styleElement = 's';
				break;	
				case 'small':
				styleElement = 'small';
				break;														
			}
			element.wrapInner('<' + styleElement + '/>');
		}
		}
	}
})();


(function () {
	angular.module('textareaAtom')
	.controller('TextareaAtomController',TextareaAtomController);

	TextareaAtomController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory'];

	function TextareaAtomController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory){
		$scope.data = dataService.data;
		$scope.form = dataService.form;

		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'readonly' : 'Boolean',
			'disabled' : 'Boolean',
			'placeholder' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var textareaAtomComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : true,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

		})(); 
	}
})(); 

(function() {
	angular.module('textareaAtom')
		.directive('uiTextareaAtom', uiTextareaAtom);

	uiTextareaAtom.$inject = ['$compile', 'dataService', '$timeout','componentService','componentFactory'];

	function uiTextareaAtom($compile, dataService, $timeout, componentService, componentFactory) {
		var directive = {
			restrict: 'E',
			scope: {
				componentCopy: '=component',
				identifier: '=',
				type : '='
			},
			templateUrl: '../shared/components/textareaAtom/textareaAtom.directive.html',
			controller: 'TextareaAtomController',
			compile: compileFn,
			replace: true
		};
		return directive;

		function compileFn(tElement, tAttrs) {
			var component = componentService[tAttrs.componentIdentifier];

			var textareaElement = tElement.find('textarea');
			
			if(component.hasMask.hasMask){
				textareaElement.attr('ui-mask',component.hasMask.mask);
				textareaElement.attr('model-view-value',component.hasMask.maskModel);
				if(component.hasMask.maskPlaceholder.length)
					textareaElement.attr('ui-mask-placeholder',component.hasMask.maskPlaceholder);
			}
			
			if(component.model)
				textareaElement.attr('ng-model',component.model);
			textareaElement.attr('name', component.name);
			textareaElement.attr('id', component.id);

			if (component.utilities) {
				var utilitiesArr = component.utilities;
				for (var i = 0; i < utilitiesArr.length; i++) {
					if (utilitiesArr[i].utility == 'maxlength')
						textareaElement.attr('maxlength', utilitiesArr[i].parameters);
					else {
						var deCameled = utilitiesArr[i].utility.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
						textareaElement.attr("util-" + deCameled, utilitiesArr[i].parameters);
					}
				}
			}

			componentFactory.compiler.config.attachValidators(textareaElement, {
				validators : component.validators,
				componentType : 'textareaAtom',
				aliasedValidators : {
					required : 'required',
					pattern : 'ng-pattern',
					minlength : 'ng-minlength',
					maxlength : 'ng-maxlength'

				}
			});
		
		delete componentService[tAttrs.componentIdentifier];
		};
	}
})();


(function () {
	angular.module('tooltip')
	.controller('TooltipController',TooltipController);

	TooltipController.$inject = ['$scope','$element','$attrs','$state','$compile','dataService','scaffoldService','componentFactory','$q'];
	function TooltipController($scope, $element, $attrs, $state, $compile, dataService, scaffoldService, componentFactory,$q){
		$scope.data = dataService.data;
		componentFactory.controller.config.linked($scope,$element,$attrs);

		var allowedVariables = {
			'shown' : 'String',
			'tooltipContent' : 'String'
		};

		(function () {
			try { pageTitle = $state.current.data.title; }
			catch (err) { return; }

			var tooltipComponent = componentFactory.controller.config.componentToScaffoldService($scope,{
				pageTitle : pageTitle,
				resolveReadyIfPresent : false,
				bindGetAndSet : true,
				allowedVariables : allowedVariables
			});

			var hasDeferred = tooltipComponent.readyDeferred ? true : false;

			var promiseArr = [];

				var subcomponentIdentifier = $scope.component.contents.identifier;
				var subcomponentType = $scope.component.contents.type;

				var subcomponent = componentFactory.controller.config.createSubcomponent({
					pageTitle : pageTitle,
					identifier : subcomponentIdentifier,
					componentType : subcomponentType,
					createDeferred : hasDeferred,
					assignSubcomponent : true,
					component : tooltipComponent
				});

				if(hasDeferred)
					promiseArr.push(subcomponent.ready);

			if(hasDeferred){
				$q.all(promiseArr).then(function(){
					tooltipComponent.readyDeferred.resolve();
				});
			}
		})(); 
	}

})(); 

(function () {
	angular.module('tooltip')
	.directive('uiTooltip',uiTooltip);

	function uiTooltip(){
		var directive = {
			restrict : 'E',
			scope : {
				componentCopy : '=component',
				identifier : '=',
				type : '='
			},
			replace : true,
			templateUrl : '../shared/components/tooltip/tooltip.directive.html',
			controller : 'TooltipController'
		};

		return directive;
	}
})(); 

(function() {
	angular.module('utilities')
		.directive('utilAlphanumericOnly', utilAlphanumericOnly);

	function utilAlphanumericOnly() {
		var directive = {
			require: 'ngModel',
			restrict: 'A',
			link: linker
		};

		return directive;

		function linker(scope, element, attrs, ngModelController) {
			ngModelController.$parsers.push(function(inputValue) {
				// this next if is necessary for when using ng-required on your input. 
				// In such cases, when a letter is typed first, this parser will be called
				// again, and the 2nd time, the value will be undefined
				if (inputValue == undefined) return ''
				var transformedInput = inputValue.replace(/[^A-Za-z0-9]/g, '');
				if (transformedInput != inputValue) {
					ngModelController.$setViewValue(transformedInput);
					ngModelController.$render();
				}


				return transformedInput;
			});
		}
	}
})();


(function() {
	angular.module('utilities')
		.directive('utilAutoTab', utilAutoTab);
	//to be put on the input which require auto tabbing to immediate next input in the DOM

	function utilAutoTab() {
		var directive = {
			require: 'ngModel',
			restrict: 'A',
			link: linker
		};

		return directive;

		function linker(scope, element, attrs, ngModelController) {
			element.on('keyup', function(e) {
				var nextEl;
				for (nextEl = $(this).next(); nextEl.length != 0; nextEl = nextEl.next()) {
					if (nextEl.is('input')) break;
				}
				var maxlength = (element.attr('maxlength') || element.attr('util-auto-tab'));
				if (element.val().length == maxlength) {
					var attr = element.attr('util-numbers-only');
					if (typeof attr !== typeof undefined && attr !== false) {
						if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105))
							nextEl.focus();
					}
				}
			});
		}
	}
})();


(function() {
	angular.module('utilities')
		.directive('utilCommas', utilCommas);

	function utilCommas() {
		var directive = {
			require: 'ngModel',
			restrict: 'A',
			link: linker
		};

		return directive;

		function linker(scope, element, attrs, ngModelController) {
			element.on('keyup', function(e) {
				if (!((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)))
					return;
				val = ($(this).val() || '').replace(/,/g, '');
				var commaVal = val.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				if (commaVal != val)
					$(this).val(commaVal);
			});
			ngModelController.$parsers.push(function(inputValue) {
				return inputValue.replace(/,/g, '');
			});
		}
	}
})();


(function() {
	angular.module('utilities')
		.factory('utilitiesFactory', utilitiesFactory);
	utilitiesFactory.$inject = ['dataService'];

	function utilitiesFactory(dataService) {
		var factory = {
			getNestedProperty: getNestedProperty,
			setNestedProperty: setNestedProperty,
			dynamicSetNestedProperty: dynamicSetNestedProperty,
			nestedArraySplice: nestedArraySplice,
			nestedArrayPush: nestedArrayPush,
			findFirstProperty : findFirstProperty,
			iterateThroughObject : iterateThroughObject
		};
		return factory;

		function getNestedProperty(property,obj) {
			var schemaObj = obj || dataService.data;
			var splitProp = property.replace(/\]/g, '').split(/\.|\[/);
			if (splitProp.length === 1) {
				return dataService.data[property];
			};
			var currentProp = dataService.data[splitProp[0]];
			for (var i = 1; i < splitProp.length; i++) {
				currentProp = currentProp[splitProp[i]];
			}
			return currentProp;
		}

		//assume that the path has been defined, otherwise return false
		function setNestedProperty(path, value, obj) {
			var schema = obj || dataService.data;
			var pList = path.replace(/\]/g, '').split(/\.|\[/);
			var len = pList.length;
			for (var i = 0; i < len - 1; i++) {
				var elem = pList[i];
				if (!schema[elem])
					return false;
				schema = schema[elem];
			}
			schema[pList[len - 1]] = value;
		}

		//if path isn't defined, set nested path
		function dynamicSetNestedProperty(path, value, obj) {
			var schema = obj || dataService.data;
			var pList = path.replace(/\]/g, '').split(/\.|\[/);
			var len = pList.length;
			for (var i = 0; i < len - 1; i++) {
				var elem = pList[i];
				if (!schema[elem]) schema[elem] = {}
				schema = schema[elem];
			}
			schema[pList[len - 1]] = value;
		}

		//assume that the path has been defined, otherwise return false
		function nestedArraySplice(path, index, deleteCount, arr) {
			var schema = arr || dataService.data;
			var pList = path.replace(/\[/g, '').split(/\.|\[/);
			var len = pList.length;
			for (var i = 0; i < len - 1; i++) {
				var elem = pList[i];
				if (!schema[elem])
					return false;
				schema = schema[elem];
			}
			schema[pList[len - 1]].splice(index, deleteCount);
		}

		//assume that the path has been defined, otherwise return false
		function nestedArrayPush(path, value, arr) {
			var schema = arr || dataService.data;
			var pList = path.replace(/\[/g, '').split(/\.|\[/);
			var len = pList.length;
			for (var i = 0; i < len - 1; i++) {
				var elem = pList[i];
				if (!schema[elem])
					return false;
				schema = schema[elem];
			}
			schema[pList[len - 1]].push(value);
		}

		//returns the parent object to where the property was found
		function findFirstProperty(property, object){
			if(!angular.isObject(object) || $.isEmptyObject(object))
				return;
			else{
				for(var propertyIterated in object){
					if(propertyIterated == property){
						return object;
					}
					else{
						var foundPropertyParent = findFirstProperty(property,object[propertyIterated]);
						if(foundPropertyParent)
							return foundPropertyParent;
					}
				}
			}
		}

		function iterateThroughObject(obj,fn){
			for (var property in obj) {
		        if (obj.hasOwnProperty(property)) {
			            if (typeof obj[property] == "object")
			                iterateThroughObject(obj[property],fn);
			            else
			                fn(obj,property);
			        }
	    	}	
		}
	}
})();


(function(){
	angular.module('utilities')
	.directive('utilLettersOnly',utilLettersOnly);

	function utilLettersOnly(){
		var directive = {
			require : 'ngModel',
			restrict : 'A',
			link : linker
		};

		return directive;

		function linker(scope, element, attrs, ngModelController) {
		    ngModelController.$parsers.push(function (inputValue) {
		        // this next if is necessary for when using ng-required on your input. 
		        // In such cases, when a letter is typed first, this parser will be called
		        // again, and the 2nd time, the value will be undefined
		        if (inputValue == undefined) return ''
		        var transformedInput = inputValue.replace(/[^A-Za-z]/g, '');
		        if (transformedInput != inputValue) {
		            ngModelController.$setViewValue(transformedInput);
		            ngModelController.$render();
		        }


		        return transformedInput;
		    });
		}
	}
})();

(function() {
	angular.module('utilities')
		.directive('utilNumbersOnly', utilNumbersOnly);

	function utilNumbersOnly() {
		var directive = {
			require: 'ngModel',
			restrict: 'A',
			link: linker
		};

		return directive;

		function linker(scope, element, attrs, ngModelController) {
			ngModelController.$parsers.push(function(inputValue) {
				// this next if is necessary for when using ng-required on your input. 
				// In such cases, when a letter is typed first, this parser will be called
				// again, and the 2nd time, the value will be undefined
				if (inputValue == undefined) return ''
				var transformedInput = inputValue.replace(/[^0-9]/g, '');
				if (transformedInput != inputValue) {
					ngModelController.$setViewValue(transformedInput);
					ngModelController.$render();
				}


				return transformedInput;
			});
		}
	}
})();


(function() {
	angular.module('utilities')
		.directive('utilRegExpOnly', utilRegExpOnly);

	function utilRegExpOnly() {
		var directive = {
			require: 'ngModel',
			restrict: 'A',
			link: linker
		};

		return directive;

		function linker(scope, element, attrs, ngModelController) {
			var reg_exp = new RegExp(attrs.utilRegExpOnly, "g");
			ngModelController.$parsers.push(function(inputValue) {
				// this next if is necessary for when using ng-required on your input. 
				// In such cases, when a letter is typed first, this parser will be called
				// again, and the 2nd time, the value will be undefined
				if (inputValue == undefined) return ''
				var transformedInput = inputValue.replace(reg_exp, '');
				if (transformedInput != inputValue) {
					ngModelController.$setViewValue(transformedInput);
					ngModelController.$render();
				}


				return transformedInput;
			});
		}
	}
})();


(function() {
	angular.module('validator')
		.directive('uiValidator', uiValidator);

	uiValidator.$inject = ['scaffoldService', 'validatorService', '$q'];

	function uiValidator(scaffoldService, validatorService, $q) {
		var directive = {
			restrict: 'A',
			require: 'ngModel',
			link: linker
		};
		return directive;

		function linker(scope, element, attrs, controller) {

			//which component
			//var componentType = scope.type;

			var validators = attrs['uiValidator'].split('&');

			for (var i = 0; i < validators.length; i++) {
				(function() {
					var splitValidator = validators[i].split('%');
					var sync = (splitValidator[0] == 'sync');
					var condition = splitValidator[1];
					var validatorParameter = splitValidator[2];

					controller.$validators[condition] = function(value) {
						var param = validatorParameter;
						var validatorFn = validatorService.getValidator(sync,condition); 
						return validatorFn(param, value);
					}
				})();
			}


		}
	}
})();


(function() {

	var DIRECTORY = $('script[mendo-ui]').attr('directory');

	angular.module('app').constant('DIRECTORY', DIRECTORY);

	fetchData().then(bootstrapApplication);

	function fetchData() {
		var initInjector = angular.injector(["ng"]);
		var $http = initInjector.get("$http");
		return $http.get(DIRECTORY + "config.json").then(function(response) {
			angular.module('app').constant('CONFIG', response.data);
		}, function(errorResponse) {
			// Handle error case
		});
	}

	function bootstrapApplication() {
		angular.element(document).ready(function() {
			angular.bootstrap("#mendoApp", ["app"]);
		});
	}
}());
