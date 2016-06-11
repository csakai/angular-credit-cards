'use strict'

var types = require('creditcards').card.types
var Type = types.Type

module.exports = provider

function provider() {
    this.setType = function setType(name, config) {
        return new Type(name, config);
    };

    this.$get = function() {
        return new service
    }
}

function service() {
    this.getCvcLength = function getCvcLength(type) {
        return types[type].cvcLength
    }
}
