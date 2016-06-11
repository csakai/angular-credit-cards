'use strict'

var get = require('lodash/object/get')
var types = require('creditcards').card.types
var Type = types.Type

module.exports = provider

function Service () {
  this.getCvcLength = function getCvcLength (type) {
    type = type || ''
    var cardType = types.get(type)
    return get(cardType, 'cvcLength')
  }
}

function provider () {
  this.setType = function setType (name, config) {
    return new Type(name, config)
  }

  this.$get = function () {
    return new Service()
  }
}
