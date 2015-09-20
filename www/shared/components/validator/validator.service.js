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