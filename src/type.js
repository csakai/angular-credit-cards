'use strict'

var has = require('lodash/object/has')
var keysIn = require('lodash/object/keysIn')
var set = require('lodash/object/set')
var camel = require('lodash/string/camelCase')
var types = require('creditcards').card.types
var Type = types.Type
var cardTypes = types.types

var _cvcTruncateMode = false
var _storingLongValue = false
var CVC_TRUNCATE_MODES = [ false, 'eager', 'conservative' ]

module.exports = provider

function Service () {
  this.getCvcLength = function getCvcLength (type) {
    type = type || ''
    var cardType = types.get(type)
    return cardType.cvcLength
  }

  function _isConservative () {
    return _cvcTruncateMode === 'conservative'
  }

  // function _isEager () {
  //   return _cvcTruncateMode === 'eager'
  // }

  function _isNoTruncate () {
    return !_cvcTruncateMode
  }

  function _truncate (str, length) {
    return str.substr(0, length)
  }

  this.truncateCvc = function truncateCvc (ngModel, cvcLength) {
    var keyOfStrToTruncate
    if (_isNoTruncate() || !ngModel.$viewValue) {
      return
    }
    if (cvcLength < ngModel.$viewValue.length) {
      if (_isConservative()) {
        if (_storingLongValue) {
          _storingLongValue = false
        } else {
          ngModel.$ccLongValue = String(ngModel.$viewValue)
        }
      }
      keyOfStrToTruncate = '$viewValue'
    } else if (_isConservative() && ngModel.$ccLongValue) {
      keyOfStrToTruncate = '$ccLongValue'
    }
    if (!keyOfStrToTruncate) {
      return
    }
    ngModel.$setViewValue(_truncate(ngModel[keyOfStrToTruncate], cvcLength))
    ngModel.$render()
  }

  function _clearLongCvc (ngModel) {
    delete ngModel.$ccLongValue
  }

  this.initializeCvcInput = function initializeCvcInput (ngModel) {
    if (!_isConservative()) {
      return
    }
    ngModel.$parsers.push(function (viewValue) {
      if (ngModel.$ccLongValue) {
        if (!_storingLongValue) {
          _storingLongValue = true
        } else {
          _storingLongValue = false
          if (viewValue !== ngModel.$ccLongValue) {
            _clearLongCvc(ngModel)
          }
        }
      }
      return viewValue
    })
  }
}

function provider () {
  this.setType = function setType (name, config) {
    var key = camel(name)
    var oldType = types.get(name)
    if (oldType) {
      keysIn(oldType).forEach(function (propKey) {
        if (has(config, propKey)) {
          set(oldType, propKey, config[propKey])
        }
      })
    } else {
      set(cardTypes, key, new Type(name, config))
    }
    return this
  }

  // When ccType changes on ccCvc directive,
  // _cvcTruncateMode determines modelValue/viewValue change behavior if the new
  // maxLength is shorter.
  // false -> ngModel.$viewValue && ngModel.$modelValue are unchanged
  // "eager" -> ngModel.$viewValue && ngModel.$modelValue are truncated
  // "conservative" -> ngModel.$viewValue is truncated and will change back to the
  // ngModel.$modelValue if the maxLength is changed back to a greater value
  this.cvcTruncateMode = function cvcTruncateMode (mode) {
    if (CVC_TRUNCATE_MODES.indexOf(mode) > -1) {
      _cvcTruncateMode = mode
    }
    return this
  }

  this.$get = function () {
    return new Service()
  }
}
