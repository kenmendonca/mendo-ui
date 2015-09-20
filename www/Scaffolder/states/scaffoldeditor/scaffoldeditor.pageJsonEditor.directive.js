(function() {
     angular.module('scaffoldeditor')
          .directive('scaffoldeditorPageJsonEditor', scaffoldeditorPageJsonEditor);

     scaffoldeditorPageJsonEditor.$inject = ['$rootScope', '$timeout']

     function scaffoldeditorPageJsonEditor($rootScope, $timeout) {
          var directive = {
               restrict: 'A',
               link: linker,
               require: 'ngModel'
          };

          return directive;

          function linker(scope, element, attrs, controller) {

               controller.$parsers.push(function(input) {
                    if (!input)
                         return input;
                    try {
                         var inputObj = angular.fromJson(input);
                    } catch (e) {
                         return controller.$modelValue;
                    }
                    $rootScope.refreshRender = false;
                    $timeout(function() {
                         $rootScope.refreshRender = true;
                    }, 10);
                    return inputObj;
               });

               controller.$formatters.push(function(data) {
                    var text = angular.toJson(data, true);
                    element.val(text);
                    return text;
               });
          }
     }
})();
