'use strict';

team1
.directive('jqdatepicker', function ($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            
            element.datepicker({
                dateFormat: 'dd/mm/yy',
                onSelect: function (date) {
                    var ar = date.split("/");
                    date = new Date(ar[2] + "-" + ar[1] + "-" + ar[0]);
                    ngModelCtrl.$setViewValue(date.getTime());
                    scope.$apply();
                }
            });
            ngModelCtrl.$formatters.unshift(function (v) {
                return $filter('date')(v, 'dd/MM/yyyy');
            });

        }
    };
})
.directive('castToInteger', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.unshift(function(value) {
                return parseInt(value, 10);
            });
        }
    };
})
.directive('onlyDigits', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return '';
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
})
.directive('phoneNumbers', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return '';
                var includePlus = false;
                //if (inputValue[0] == '+') {
                //    includePlus = true;
                    
                //    inputValue = inputValue.split('+').join('');
                //    
                //    //inputValue = inputValue.replace(/\+/g, '');
                //    //inputValue = inputValue.substring(1, inputValue.length);
                //}

                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return  transformedInput;
            });
        }
    };
});



