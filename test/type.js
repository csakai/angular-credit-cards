'use strict'

/*global global, describe, context, beforeEach, it*/

// var cloneDeep = require('lodash/lang/cloneDeep')
var every = require('lodash/collection/every')
var expect = require('chai').expect
var angular = require('angular')
var ccApp = require('../')
var mockModule, inject
var types
var Type
if (!global.sandbox) {
  global.sandbox = require('sinon').sandbox.create()
}
// var typesGetSpy

require('angular-mocks/ngMock')
mockModule = angular.mock.module
inject = angular.mock.inject

function constructDeepEqual (obj2) {
  return function deepEqual (obj1) {
    return every(obj1, function (val, key) {
      return obj2[key] === val
    })
  }
}

function constructTestModule (configurationFn) {
  return angular.module('testApp', [])
    .config(configurationFn)
    .name
}

function testSetType (name, config) {
  var testApp = constructTestModule(function (ccTypeProvider) {
    ccTypeProvider.setType(name, config)
  })
  mockModule(ccApp, testApp)
  inject()
}

describe.only('cc-type', function () {
  beforeEach(function () {
    types = require('creditcards').card.types
    Type = types.Type
  })
  // beforeEach(function () {
  //   typesGetSpy = global.sandbox.spy(types, 'get')
  // })

  context.only('Provider : setType', function () {

    it('adds a new cardType to the types object if a new name is provided', function () {
      var name = 'Fake Card'
      var config = {
        cvcLength: 6
      }
      var newCardType
      testSetType(name, config)
      newCardType = types.get(name)
      expect(newCardType).to.be.an.instanceof(Type)
      expect(config).to.satisfy(constructDeepEqual(newCardType))
    })

    it('updates the matching cardType in the types object with the provided config', function () {
      var name = 'American Express'
      var config = {
        cvcLength: 2
      }
      var oldCardType = types.get(name)
      var updatedCardType
      expect(oldCardType).to.be.an.instanceof(Type)
      expect(config).to.not.satisfy(constructDeepEqual(oldCardType))

      testSetType(name, config)
      updatedCardType = types.get(name)

      expect(updatedCardType).to.be.an.instanceof(Type)
      expect(config).to.satisfy(constructDeepEqual(updatedCardType))
    })
  })

  context.skip('cvcTruncateMode', function () {
    beforeEach(function () {
      constructTestModule(function (ccTypeProvider) {
        ccTypeProvider.cvcTruncateMode(false)
      })
    })
  })
  // beforeEach(function () {
  //   angular.mock.module(require('../'), function() {})
  //     .config()
  // })

})
