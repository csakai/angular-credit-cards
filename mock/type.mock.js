'use strict'

/*global global*/

var angular = require('angular')
var doNothing = angular.noop
var reduce = require('lodash/collection/reduce')
if (!global.sandbox) {
  global.sandbox = require('sinon').sandbox.create()
}
module.exports = angular
  .module('credit-cards.mock', [])
  .provider('ccType', provider)
  .name
function provider () {
  var _cvcLength = 0
  var mockConfigFns = {
    initGetCvcLength: function (length) {
      _cvcLength = length
    }
  }

  function Service () {
    var self = this
    this.initializeCvcInput = global.sandbox.spy(doNothing)
    this.getCvcLength = global.sandbox.spy(function () {
      return _cvcLength
    })
    this.truncateCvc = global.sandbox.spy(doNothing)

    this.mock = reduce(mockConfigFns, function (acc, fn, key) {
      acc[key] = fn.bind(self)
      return acc
    }, {})
  }

  this.$get = function () {
    return new Service()
  }
}
