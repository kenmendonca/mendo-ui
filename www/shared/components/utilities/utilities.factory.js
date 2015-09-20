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
