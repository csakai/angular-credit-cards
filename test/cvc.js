'use strict'

/*global global, describe, beforeEach, afterEach, it*/

var expect = require('chai').expect
var angular = require('angular')
var every = require('lodash/collection/every')
require('angular-mocks/ngMock')
if (!global.sandbox) {
  global.sandbox = require('sinon').sandbox.create()
}

function match (obj1, obj2) {
  if (Object.keys(obj1).length > Object.keys(obj2).length) {
    return match(obj2, obj1)
  }
  return every(obj1, function (val, key) {
    return obj2[key] === val
  })
}
describe('cc-cvc', function () {
  beforeEach(angular.mock.module(require('../')))
  beforeEach(angular.mock.module(require('../mock/type.mock')))

  afterEach(function () {
    global.sandbox.restore()
  })

  var $compile, scope, controller, element, ccType
  beforeEach(angular.mock.inject(function ($injector) {
    ccType = $injector.get('ccType')
    $compile = $injector.get('$compile')
    scope = $injector.get('$rootScope').$new()
    scope.card = {}
    element = angular.element('<input ng-model="card.cvc" cc-cvc />')
    controller = $compile(element)(scope).controller('ngModel')
  }))

  it('sets maxlength to 4', function () {
    expect(element.attr('maxlength')).to.equal('4')
  })

  it('adds a numeric pattern', function () {
    expect(element.attr('pattern')).to.equal('[0-9]*')
  })

  it('adds an autocomplete attribute', function () {
    expect(element.attr('x-autocompletetype')).to.equal('cc-csc')
  })

  it('accepts a 3 digit numeric', function () {
    controller.$setViewValue('123')
    scope.$digest()
    expect(controller.$valid).to.be.true
    expect(scope.card.cvc).to.equal('123')
  })

  it('accepts a 4 digit numeric', function () {
    controller.$setViewValue('1234')
    scope.$digest()
    expect(controller.$valid).to.be.true
    expect(scope.card.cvc).to.equal('1234')
  })

  it('does not accept numbers', function () {
    controller.$setViewValue(123)
    scope.$digest()
    expect(controller.$valid).to.be.false
  })

  it('accepts an empty cvc', function () {
    controller.$setViewValue('')
    scope.$digest()
    expect(controller.$valid).to.be.true
  })

  it('unsets the model value when invalid', function () {
    controller.$setViewValue('abc')
    scope.$digest()
    expect(scope.card.cvc).to.be.undefined
  })

  it('does not call ccType.initializeCvcInput when there is no ccType attribute', function () {
    scope.$digest()
    expect(ccType.initializeCvcInput).to.not.have.been.called
  })

  describe('ccType', function () {
    beforeEach(function () {
      element.attr('cc-type', 'cardType')
      controller = $compile(element)(scope).controller('ngModel')
    })

    it('calls ccType.initializeCvcInput with ngModel', function () {
      var arg0
      scope.$digest()
      expect(ccType.initializeCvcInput).to.have.been.calledOnce
      arg0 = ccType.initializeCvcInput.getCall(0).args[0]
      expect(match(controller, arg0)).to.be.true
    })

    it('validates against the card type', function () {
      scope.cardType = 'visa'
      scope.card.cvc = '1234'
      scope.$digest()
      expect(controller.$valid).to.be.false
      scope.cardType = 'americanExpress'
      scope.$digest()
      expect(controller.$valid).to.be.true
    })

    it('calls ccType.getCvcLength with new type', function () {
      var newType = 'visa'
      scope.cardType = newType
      scope.$digest()
      expect(ccType.getCvcLength).to.have.been.calledOnce
        .and.calledWithExactly(newType)
    })

    it('sets the maxlength attribute with the new cvc length', function () {
      var newLength = '3'
      var attrMaxLength
      ccType.mock.initGetCvcLength(newLength)
      scope.cardType = 'visa'
      scope.$digest()
      attrMaxLength = element.attr('maxlength')
      expect(ccType.getCvcLength).to.have.been.calledOnce
        .and.returned(newLength)
      expect(attrMaxLength).to.eql(newLength)
    })

    it('calls ccType.truncateCvc with ngModel and newLength', function () {
      var newLength = '3'
      var arg0
      ccType.mock.initGetCvcLength(newLength)
      newLength = parseInt(newLength, 10)
      scope.cardType = 'visa'
      scope.$digest()
      arg0 = ccType.truncateCvc.getCall(0).args[0]
      expect(ccType.truncateCvc).to.have.been.calledOnce
      expect(match(controller, arg0)).to.be.true
    })

  })
})
