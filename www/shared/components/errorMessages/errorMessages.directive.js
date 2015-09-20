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
			templateUrl : '<%=componentsPath%>errorMessages/errorMessages.directive.html',
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