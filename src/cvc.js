'use strict'

var cvc = require('creditcards').cvc
var bind = require('function-bind')
var baseMaxLength = 4

module.exports = factory

factory.$inject = ['$parse', 'ccType']
function factory ($parse, ccType) {
  return {
    restrict: 'A',
    require: 'ngModel',
    compile: function (element, attributes) {
      attributes.$set('maxlength', baseMaxLength)
      attributes.$set('pattern', '[0-9]*')
      attributes.$set('xAutocompletetype', 'cc-csc')

      return function (scope, element, attributes, ngModel) {
        ngModel.$validators.ccCvc = function (value) {
          return ngModel.$isEmpty(ngModel.$viewValue) || cvc.isValid(value, $parse(attributes.ccType)(scope))
        }

        if (attributes.ccType) {
          scope.$watch(attributes.ccType, function () {
            var newType = $parse(attributes.ccType)(scope)
            var cvcLength = ccType.getCvcLength(newType) || baseMaxLength
            attributes.$set('maxlength', cvcLength)
            bind.call(ngModel.$validate, ngModel)()
          })
        }
      }
    }
  }
}
