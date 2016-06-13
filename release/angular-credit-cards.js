(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.angularCreditCards = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
exports = module.exports = ap;
function ap (args, fn) {
    return function () {
        var rest = [].slice.call(arguments)
            , first = args.slice()
        first.push.apply(first, rest)
        return fn.apply(this, first);
    };
}

exports.pa = pa;
function pa (args, fn) {
    return function () {
        var rest = [].slice.call(arguments)
        rest.push.apply(rest, args)
        return fn.apply(this, rest);
    };
}

exports.apa = apa;
function apa (left, right, fn) {
    return function () {
        return fn.apply(this,
            left.concat.apply(left, arguments).concat(right)
        );
    };
}

exports.partial = partial;
function partial (fn) {
    var args = [].slice.call(arguments, 1);
    return ap(args, fn);
}

exports.partialRight = partialRight;
function partialRight (fn) {
    var args = [].slice.call(arguments, 1);
    return pa(args, fn);
}

exports.curry = curry;
function curry (fn) {
    return partial(partial, fn);
}

exports.curryRight = function curryRight (fn) {
    return partial(partialRight, fn);
}

},{}],2:[function(_dereq_,module,exports){
'use strict'

var isArray = _dereq_('isarray')

module.exports = function castArray (value) {
  return isArray(value) ? value : [value]
}

},{"isarray":16}],3:[function(_dereq_,module,exports){
'use strict'

var types = exports.types = _dereq_('./src/types')
exports.Type = _dereq_('./src/type')

exports.find = function findCardType (callback) {
  for (var typeName in types) {
    var type = types[typeName]
    var result = callback(type)
    if (result) return type
  }
}

},{"./src/type":4,"./src/types":5}],4:[function(_dereq_,module,exports){
'use strict'

var extend = _dereq_('xtend/mutable')

module.exports = CardType

function CardType (name, config) {
  extend(this, {name: name}, config)
}

CardType.prototype.cvcLength = 3
CardType.prototype.luhn = true
CardType.prototype.groupPattern = /(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?/

CardType.prototype.group = function (number) {
  return (number.match(this.groupPattern) || [])
    .slice(1)
    .filter(Boolean)
}

CardType.prototype.test = function (number, eager) {
  return this[eager ? 'eagerPattern' : 'pattern'].test(number)
}

},{"xtend/mutable":52}],5:[function(_dereq_,module,exports){
'use strict'

var Type = _dereq_('./type')

var group19 = /(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?(\d{1,3})?/

exports.visa = new Type('Visa', {
  pattern: /^4\d{12}(\d{3}|\d{6})?$/,
  eagerPattern: /^4/,
  groupPattern: group19
})

exports.maestro = new Type('Maestro', {
  pattern: /^(?:5[06789]\d\d|(?!6011[0234])(?!60117[4789])(?!60118[6789])(?!60119)(?!64[456789])(?!65)6\d{3})\d{8,15}$/,
  eagerPattern: /^(5(018|0[23]|[68])|6[37]|60111|60115|60117([56]|7[56])|60118[0-5]|64[0-3]|66)/,
  groupPattern: group19
})

exports.forbrugsforeningen = new Type('Forbrugsforeningen', {
  pattern: /^600722\d{10}$/,
  eagerPattern: /^600/
})

exports.dankort = new Type('Dankort', {
  pattern: /^5019\d{12}$/,
  eagerPattern: /^5019/
})

exports.masterCard = new Type('MasterCard', {
  pattern: /^(5[1-5]|2[2-7])\d{14}$/,
  eagerPattern: /^(2|5[1-5])/
})

exports.americanExpress = new Type('American Express', {
  pattern: /^3[47]\d{13}$/,
  eagerPattern: /^3[47]/,
  groupPattern: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
  cvcLength: 4
})

exports.dinersClub = new Type('Diners Club', {
  pattern: /^3(0[0-5]|[68]\d)\d{11}$/,
  eagerPattern: /^3(0|[68])/,
  groupPattern: /(\d{1,4})?(\d{1,6})?(\d{1,4})?/
})

exports.discover = new Type('Discover', {
  pattern: /^6(011(0[0-9]|[2-4]\d|74|7[7-9]|8[6-9]|9[0-9])|4[4-9]\d{3}|5\d{4})\d{10}$/,
  eagerPattern: /^6(011(0[0-9]|[2-4]|74|7[7-9]|8[6-9]|9[0-9])|4[4-9]|5)/
})

exports.jcb = new Type('JCB', {
  pattern: /^35\d{14}$/,
  eagerPattern: /^35/
})

exports.unionPay = new Type('UnionPay', {
  pattern: /^62[0-5]\d{13,16}$/,
  eagerPattern: /^62/,
  groupPattern: group19,
  luhn: false
})

},{"./type":4}],6:[function(_dereq_,module,exports){
'use strict'

exports.card = _dereq_('./src/card')
exports.cvc = _dereq_('./src/cvc')
exports.expiration = _dereq_('./src/expiration')

},{"./src/card":7,"./src/cvc":8,"./src/expiration":9}],7:[function(_dereq_,module,exports){
'use strict'

var luhn = _dereq_('fast-luhn')
var types = _dereq_('./types')

module.exports = {
  types: types,
  parse: parseCard,
  format: formatCard,
  type: cardType,
  luhn: luhn,
  isValid: isCardValid
}

function parseCard (number) {
  if (typeof number !== 'string') return ''
  return number.replace(/[^\d]/g, '')
}

function formatCard (number, separator) {
  var type = getType(number, true)
  if (!type) return number
  return type.group(number).join(separator || ' ')
}

function cardType (number, eager) {
  var type = getType(number, eager)
  return type ? type.name : undefined
}

function isCardValid (number, type) {
  if (type) {
    type = types.get(type)
  } else {
    type = getType(number)
  }
  if (!type) return false
  return (!type.luhn || luhn(number)) && type.test(number)
}

function getType (number, eager) {
  return types.find(function (type) {
    return type.test(number, eager)
  })
}

},{"./types":10,"fast-luhn":12}],8:[function(_dereq_,module,exports){
'use strict'

var types = _dereq_('./types')
var cvcRegex = /^\d{3,4}$/

module.exports = {
  isValid: cvcIsValid
}

function cvcIsValid (cvc, type) {
  if (typeof cvc !== 'string') return false
  if (!cvcRegex.test(cvc)) return false
  if (!type) return true
  return types.get(type).cvcLength === cvc.length
}

},{"./types":10}],9:[function(_dereq_,module,exports){
'use strict'

var isValidMonth = _dereq_('is-valid-month')
var parseIntStrict = _dereq_('parse-int')
var parseYear = _dereq_('parse-year')

module.exports = {
  isPast: isPast,
  month: {
    parse: parseMonth,
    isValid: isValidMonth
  },
  year: {
    parse: parseYear,
    format: formatExpYear,
    isValid: isExpYearValid,
    isPast: isExpYearPast
  }
}

function isPast (month, year) {
  return Date.now() >= new Date(year, month)
}

function parseMonth (month) {
  return parseIntStrict(month)
}

function formatExpYear (year, strip) {
  year = year.toString()
  return strip ? year.substr(2, 4) : year
}

function isExpYearValid (year) {
  if (typeof year !== 'number') return false
  year = parseIntStrict(year)
  return year > 0
}

function isExpYearPast (year) {
  return new Date().getFullYear() > year
}

},{"is-valid-month":15,"parse-int":46,"parse-year":47}],10:[function(_dereq_,module,exports){
'use strict'

var ccTypes = _dereq_('creditcards-types')
var camel = _dereq_('to-camel-case')
var extend = _dereq_('xtend')

module.exports = extend(ccTypes, {
  get: function getTypeByName (name) {
    return ccTypes.types[camel(name)]
  }
})

},{"creditcards-types":3,"to-camel-case":48,"xtend":51}],11:[function(_dereq_,module,exports){
'use strict'

var zeroFill = _dereq_('zero-fill')
var parseIntStrict = _dereq_('parse-int')

var pad = zeroFill(2)

module.exports = function expandYear (year, now) {
  now = now || new Date()
  var base = now.getFullYear().toString().substr(0, 2)
  year = parseIntStrict(year)
  return parseIntStrict(base + pad(year))
}

},{"parse-int":46,"zero-fill":53}],12:[function(_dereq_,module,exports){
'use strict'

module.exports = (function (array) {
  return function luhn (number) {
    if (typeof number !== 'string') throw new TypeError('Expected string input')
    if (!number) return false
    var length = number.length
    var bit = 1
    var sum = 0
    var value

    while (length) {
      value = parseInt(number.charAt(--length), 10)
      sum += (bit ^= 1) ? array[value] : value
    }

    return !!sum && sum % 10 === 0
  }
}([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]))

},{}],13:[function(_dereq_,module,exports){
'use strict';
var numberIsNan = _dereq_('number-is-nan');

module.exports = Number.isFinite || function (val) {
	return !(typeof val !== 'number' || numberIsNan(val) || val === Infinity || val === -Infinity);
};

},{"number-is-nan":45}],14:[function(_dereq_,module,exports){
// https://github.com/paulmillr/es6-shim
// http://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.isinteger
var isFinite = _dereq_("is-finite");
module.exports = Number.isInteger || function(val) {
  return typeof val === "number" &&
    isFinite(val) &&
    Math.floor(val) === val;
};

},{"is-finite":13}],15:[function(_dereq_,module,exports){
'use strict'

var isInteger = _dereq_('is-integer')

module.exports = function isValidMonth (month) {
  if (typeof month !== 'number' || !isInteger(month)) return false
  return month >= 1 && month <= 12
}

},{"is-integer":14}],16:[function(_dereq_,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],17:[function(_dereq_,module,exports){
/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
}

module.exports = last;

},{}],18:[function(_dereq_,module,exports){
var toObject = _dereq_('./toObject');

/**
 * The base implementation of `get` without support for string paths
 * and default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path of the property to get.
 * @param {string} [pathKey] The key representation of path.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path, pathKey) {
  if (object == null) {
    return;
  }
  if (pathKey !== undefined && pathKey in toObject(object)) {
    path = [pathKey];
  }
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[path[index++]];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./toObject":32}],19:[function(_dereq_,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],20:[function(_dereq_,module,exports){
/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  start = start == null ? 0 : (+start || 0);
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = (end === undefined || end > length) ? length : (+end || 0);
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],21:[function(_dereq_,module,exports){
/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}],22:[function(_dereq_,module,exports){
var deburr = _dereq_('../string/deburr'),
    words = _dereq_('../string/words');

/**
 * Creates a function that produces compound words out of the words in a
 * given string.
 *
 * @private
 * @param {Function} callback The function to combine each word.
 * @returns {Function} Returns the new compounder function.
 */
function createCompounder(callback) {
  return function(string) {
    var index = -1,
        array = words(deburr(string)),
        length = array.length,
        result = '';

    while (++index < length) {
      result = callback(result, array[index], index);
    }
    return result;
  };
}

module.exports = createCompounder;

},{"../string/deburr":43,"../string/words":44}],23:[function(_dereq_,module,exports){
/** Used to map latin-1 supplementary letters to basic latin letters. */
var deburredLetters = {
  '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
  '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
  '\xc7': 'C',  '\xe7': 'c',
  '\xd0': 'D',  '\xf0': 'd',
  '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
  '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
  '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
  '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
  '\xd1': 'N',  '\xf1': 'n',
  '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
  '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
  '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
  '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
  '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
  '\xc6': 'Ae', '\xe6': 'ae',
  '\xde': 'Th', '\xfe': 'th',
  '\xdf': 'ss'
};

/**
 * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
 *
 * @private
 * @param {string} letter The matched letter to deburr.
 * @returns {string} Returns the deburred letter.
 */
function deburrLetter(letter) {
  return deburredLetters[letter];
}

module.exports = deburrLetter;

},{}],24:[function(_dereq_,module,exports){
var baseProperty = _dereq_('./baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./baseProperty":19}],25:[function(_dereq_,module,exports){
var isNative = _dereq_('../lang/isNative');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

module.exports = getNative;

},{"../lang/isNative":37}],26:[function(_dereq_,module,exports){
var getLength = _dereq_('./getLength'),
    isLength = _dereq_('./isLength');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

module.exports = isArrayLike;

},{"./getLength":24,"./isLength":30}],27:[function(_dereq_,module,exports){
/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

},{}],28:[function(_dereq_,module,exports){
var isArrayLike = _dereq_('./isArrayLike'),
    isIndex = _dereq_('./isIndex'),
    isObject = _dereq_('../lang/isObject');

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
      ? (isArrayLike(object) && isIndex(index, object.length))
      : (type == 'string' && index in object)) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

module.exports = isIterateeCall;

},{"../lang/isObject":38,"./isArrayLike":26,"./isIndex":27}],29:[function(_dereq_,module,exports){
var isArray = _dereq_('../lang/isArray'),
    toObject = _dereq_('./toObject');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  var type = typeof value;
  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
    return true;
  }
  if (isArray(value)) {
    return false;
  }
  var result = !reIsDeepProp.test(value);
  return result || (object != null && value in toObject(object));
}

module.exports = isKey;

},{"../lang/isArray":35,"./toObject":32}],30:[function(_dereq_,module,exports){
/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],31:[function(_dereq_,module,exports){
/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],32:[function(_dereq_,module,exports){
var isObject = _dereq_('../lang/isObject');

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

module.exports = toObject;

},{"../lang/isObject":38}],33:[function(_dereq_,module,exports){
var baseToString = _dereq_('./baseToString'),
    isArray = _dereq_('../lang/isArray');

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `value` to property path array if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Array} Returns the property path array.
 */
function toPath(value) {
  if (isArray(value)) {
    return value;
  }
  var result = [];
  baseToString(value).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
}

module.exports = toPath;

},{"../lang/isArray":35,"./baseToString":21}],34:[function(_dereq_,module,exports){
var isArrayLike = _dereq_('../internal/isArrayLike'),
    isObjectLike = _dereq_('../internal/isObjectLike');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && isArrayLike(value) &&
    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
}

module.exports = isArguments;

},{"../internal/isArrayLike":26,"../internal/isObjectLike":31}],35:[function(_dereq_,module,exports){
var getNative = _dereq_('../internal/getNative'),
    isLength = _dereq_('../internal/isLength'),
    isObjectLike = _dereq_('../internal/isObjectLike');

/** `Object#toString` result references. */
var arrayTag = '[object Array]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

module.exports = isArray;

},{"../internal/getNative":25,"../internal/isLength":30,"../internal/isObjectLike":31}],36:[function(_dereq_,module,exports){
var isObject = _dereq_('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 which returns 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

module.exports = isFunction;

},{"./isObject":38}],37:[function(_dereq_,module,exports){
var isFunction = _dereq_('./isFunction'),
    isObjectLike = _dereq_('../internal/isObjectLike');

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isNative;

},{"../internal/isObjectLike":31,"./isFunction":36}],38:[function(_dereq_,module,exports){
/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],39:[function(_dereq_,module,exports){
var baseGet = _dereq_('../internal/baseGet'),
    baseSlice = _dereq_('../internal/baseSlice'),
    isArguments = _dereq_('../lang/isArguments'),
    isArray = _dereq_('../lang/isArray'),
    isIndex = _dereq_('../internal/isIndex'),
    isKey = _dereq_('../internal/isKey'),
    isLength = _dereq_('../internal/isLength'),
    last = _dereq_('../array/last'),
    toPath = _dereq_('../internal/toPath');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if `path` is a direct property.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` is a direct property, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': { 'c': 3 } } };
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b.c');
 * // => true
 *
 * _.has(object, ['a', 'b', 'c']);
 * // => true
 */
function has(object, path) {
  if (object == null) {
    return false;
  }
  var result = hasOwnProperty.call(object, path);
  if (!result && !isKey(path)) {
    path = toPath(path);
    object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
    if (object == null) {
      return false;
    }
    path = last(path);
    result = hasOwnProperty.call(object, path);
  }
  return result || (isLength(object.length) && isIndex(path, object.length) &&
    (isArray(object) || isArguments(object)));
}

module.exports = has;

},{"../array/last":17,"../internal/baseGet":18,"../internal/baseSlice":20,"../internal/isIndex":27,"../internal/isKey":29,"../internal/isLength":30,"../internal/toPath":33,"../lang/isArguments":34,"../lang/isArray":35}],40:[function(_dereq_,module,exports){
var isArguments = _dereq_('../lang/isArguments'),
    isArray = _dereq_('../lang/isArray'),
    isIndex = _dereq_('../internal/isIndex'),
    isLength = _dereq_('../internal/isLength'),
    isObject = _dereq_('../lang/isObject');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || isArguments(object)) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"../internal/isIndex":27,"../internal/isLength":30,"../lang/isArguments":34,"../lang/isArray":35,"../lang/isObject":38}],41:[function(_dereq_,module,exports){
var isIndex = _dereq_('../internal/isIndex'),
    isKey = _dereq_('../internal/isKey'),
    isObject = _dereq_('../lang/isObject'),
    toPath = _dereq_('../internal/toPath');

/**
 * Sets the property value of `path` on `object`. If a portion of `path`
 * does not exist it's created.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to augment.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, 'x[0].y.z', 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  if (object == null) {
    return object;
  }
  var pathKey = (path + '');
  path = (object[pathKey] != null || isKey(path, object)) ? [pathKey] : toPath(path);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = path[index];
    if (isObject(nested)) {
      if (index == lastIndex) {
        nested[key] = value;
      } else if (nested[key] == null) {
        nested[key] = isIndex(path[index + 1]) ? [] : {};
      }
    }
    nested = nested[key];
  }
  return object;
}

module.exports = set;

},{"../internal/isIndex":27,"../internal/isKey":29,"../internal/toPath":33,"../lang/isObject":38}],42:[function(_dereq_,module,exports){
var createCompounder = _dereq_('../internal/createCompounder');

/**
 * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the camel cased string.
 * @example
 *
 * _.camelCase('Foo Bar');
 * // => 'fooBar'
 *
 * _.camelCase('--foo-bar');
 * // => 'fooBar'
 *
 * _.camelCase('__foo_bar__');
 * // => 'fooBar'
 */
var camelCase = createCompounder(function(result, word, index) {
  word = word.toLowerCase();
  return result + (index ? (word.charAt(0).toUpperCase() + word.slice(1)) : word);
});

module.exports = camelCase;

},{"../internal/createCompounder":22}],43:[function(_dereq_,module,exports){
var baseToString = _dereq_('../internal/baseToString'),
    deburrLetter = _dereq_('../internal/deburrLetter');

/** Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks). */
var reComboMark = /[\u0300-\u036f\ufe20-\ufe23]/g;

/** Used to match latin-1 supplementary letters (excluding mathematical operators). */
var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;

/**
 * Deburrs `string` by converting [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * to basic latin letters and removing [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to deburr.
 * @returns {string} Returns the deburred string.
 * @example
 *
 * _.deburr('déjà vu');
 * // => 'deja vu'
 */
function deburr(string) {
  string = baseToString(string);
  return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
}

module.exports = deburr;

},{"../internal/baseToString":21,"../internal/deburrLetter":23}],44:[function(_dereq_,module,exports){
var baseToString = _dereq_('../internal/baseToString'),
    isIterateeCall = _dereq_('../internal/isIterateeCall');

/** Used to match words to create compound words. */
var reWords = (function() {
  var upper = '[A-Z\\xc0-\\xd6\\xd8-\\xde]',
      lower = '[a-z\\xdf-\\xf6\\xf8-\\xff]+';

  return RegExp(upper + '+(?=' + upper + lower + ')|' + upper + '?' + lower + '|' + upper + '+|[0-9]+', 'g');
}());

/**
 * Splits `string` into an array of its words.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {RegExp|string} [pattern] The pattern to match words.
 * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
 * @returns {Array} Returns the words of `string`.
 * @example
 *
 * _.words('fred, barney, & pebbles');
 * // => ['fred', 'barney', 'pebbles']
 *
 * _.words('fred, barney, & pebbles', /[^, ]+/g);
 * // => ['fred', 'barney', '&', 'pebbles']
 */
function words(string, pattern, guard) {
  if (guard && isIterateeCall(string, pattern, guard)) {
    pattern = undefined;
  }
  string = baseToString(string);
  return string.match(pattern || reWords) || [];
}

module.exports = words;

},{"../internal/baseToString":21,"../internal/isIterateeCall":28}],45:[function(_dereq_,module,exports){
'use strict';
module.exports = Number.isNaN || function (x) {
	return x !== x;
};

},{}],46:[function(_dereq_,module,exports){
'use strict'

var isInteger = _dereq_('is-integer')

module.exports = function parseIntStrict (integer) {
  if (typeof integer === 'number') {
    return isInteger(integer) ? integer : undefined
  }
  if (typeof integer === 'string') {
    return /^\d+$/.test(integer) ? parseInt(integer, 10) : undefined
  }
}

},{"is-integer":14}],47:[function(_dereq_,module,exports){
'use strict'

var parseIntStrict = _dereq_('parse-int')
var expandYear = _dereq_('expand-year')

module.exports = function parseYear (year, expand, now) {
  year = parseIntStrict(year)
  if (year == null) return
  if (!expand) return year
  return expandYear(year, now)
}

},{"expand-year":11,"parse-int":46}],48:[function(_dereq_,module,exports){

var space = _dereq_('to-space-case')

/**
 * Export.
 */

module.exports = toCamelCase

/**
 * Convert a `string` to camel case.
 *
 * @param {String} string
 * @return {String}
 */

function toCamelCase(string) {
  return space(string).replace(/\s(\w)/g, function (matches, letter) {
    return letter.toUpperCase()
  })
}

},{"to-space-case":50}],49:[function(_dereq_,module,exports){

/**
 * Export.
 */

module.exports = toNoCase

/**
 * Test whether a string is camel-case.
 */

var hasSpace = /\s/
var hasSeparator = /[\W_]/
var hasCamel = /([a-z][A-Z]|[A-Z][a-z])/

/**
 * Remove any starting case from a `string`, like camel or snake, but keep
 * spaces and punctuation that may be important otherwise.
 *
 * @param {String} string
 * @return {String}
 */

function toNoCase(string) {
  if (hasSpace.test(string)) return string.toLowerCase()
  if (hasSeparator.test(string)) return (unseparate(string) || string).toLowerCase()
  if (hasCamel.test(string)) return uncamelize(string).toLowerCase()
  return string.toLowerCase()
}

/**
 * Separator splitter.
 */

var separatorSplitter = /[\W_]+(.|$)/g

/**
 * Un-separate a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function unseparate(string) {
  return string.replace(separatorSplitter, function (m, next) {
    return next ? ' ' + next : ''
  })
}

/**
 * Camelcase splitter.
 */

var camelSplitter = /(.)([A-Z]+)/g

/**
 * Un-camelcase a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function uncamelize(string) {
  return string.replace(camelSplitter, function (m, previous, uppers) {
    return previous + ' ' + uppers.toLowerCase().split('').join(' ')
  })
}

},{}],50:[function(_dereq_,module,exports){

var clean = _dereq_('to-no-case')

/**
 * Export.
 */

module.exports = toSpaceCase

/**
 * Convert a `string` to space case.
 *
 * @param {String} string
 * @return {String}
 */

function toSpaceCase(string) {
  return clean(string).replace(/[\W_]+(.|$)/g, function (matches, match) {
    return match ? ' ' + match : ''
  }).trim()
}

},{"to-no-case":49}],51:[function(_dereq_,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],52:[function(_dereq_,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],53:[function(_dereq_,module,exports){
/**
 * Given a number, return a zero-filled string.
 * From http://stackoverflow.com/questions/1267283/
 * @param  {number} width
 * @param  {number} number
 * @return {string}
 */
module.exports = function zeroFill (width, number, pad) {
  if (number === undefined) {
    return function (number, pad) {
      return zeroFill(width, number, pad)
    }
  }
  if (pad === undefined) pad = '0'
  width -= number.toString().length
  if (width > 0) return new Array(width + (/\./.test(number) ? 2 : 1)).join(pad) + number
  return number + ''
}

},{}],54:[function(_dereq_,module,exports){
'use strict'

var cvc = _dereq_('creditcards').cvc
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
          ccType.initializeCvcInput(ngModel)
          scope.$watch(attributes.ccType, function () {
            var newType = $parse(attributes.ccType)(scope)
            var cvcLength = ccType.getCvcLength(newType) || baseMaxLength
            attributes.$set('maxlength', cvcLength)
            ccType.truncateCvc(ngModel, cvcLength)
            ngModel.$validate()
          })
        }
      }
    }
  }
}

},{"creditcards":6}],55:[function(_dereq_,module,exports){
'use strict'

var expiration = _dereq_('creditcards').expiration
var month = expiration.month
var year = expiration.year
var ap = _dereq_('ap')

exports = module.exports = function ccExp () {
  return {
    restrict: 'AE',
    require: 'ccExp',
    controller: CcExpController,
    link: function (scope, element, attributes, ccExp) {
      ccExp.$watch()
    }
  }
}

CcExpController.$inject = ['$scope', '$element']
function CcExpController ($scope, $element) {
  var nullFormCtrl = {
    $setValidity: noop
  }
  var parentForm = $element.inheritedData('$formController') || nullFormCtrl
  var ngModel = {
    year: {},
    month: {}
  }

  this.setMonth = function (monthCtrl) {
    ngModel.month = monthCtrl
  }
  this.setYear = function (yearCtrl) {
    ngModel.year = yearCtrl
  }

  function setValidity (exp) {
    var expMonth = exp.month
    var expYear = exp.year
    var valid = (expMonth == null && expYear == null) || !!expMonth && !!expYear && !expiration.isPast(expMonth, expYear)
    parentForm.$setValidity('ccExp', valid, $element)
  }

  this.$watch = function $watchExp () {
    $scope.$watch(function watchExp () {
      return {
        month: ngModel.month.$modelValue,
        year: ngModel.year.$modelValue
      }
    }, setValidity, true)
  }
}

var nullCcExp = {
  setMonth: noop,
  setYear: noop
}

exports.month = function ccExpMonth () {
  return {
    restrict: 'A',
    require: ['ngModel', '^?ccExp'],
    compile: function (element, attributes) {
      attributes.$set('maxlength', 2)
      attributes.$set('pattern', '[0-9]*')
      attributes.$set('xAutocompletetype', 'cc-exp-month')

      return function (scope, element, attributes, controllers) {
        var ngModel = controllers[0]
        var ccExp = controllers[1] || nullCcExp

        ccExp.setMonth(ngModel)
        ngModel.$parsers.unshift(month.parse)
        ngModel.$validators.ccExpMonth = function validateExpMonth (value) {
          return ngModel.$isEmpty(ngModel.$viewValue) || month.isValid(value)
        }
      }
    }
  }
}

exports.year = function ccExpYear () {
  return {
    restrict: 'A',
    require: ['ngModel', '^?ccExp'],
    compile: function (element, attributes) {
      var fullYear = attributes.fullYear !== undefined

      attributes.$set('maxlength', fullYear ? 4 : 2)
      attributes.$set('pattern', '[0-9]*')
      attributes.$set('xAutocompletetype', 'cc-exp-year')

      return function (scope, element, attributes, controllers) {
        var ngModel = controllers[0]
        var ccExp = controllers[1] || nullCcExp

        ccExp.setYear(ngModel)

        ngModel.$parsers.unshift(ap.partialRight(year.parse, !fullYear))

        ngModel.$formatters.unshift(function formatExpYear (value) {
          return value ? year.format(value, !fullYear) : ''
        })

        ngModel.$validators.ccExpYear = function validateExpYear (value) {
          return ngModel.$isEmpty(ngModel.$viewValue) || (year.isValid(value) && !year.isPast(value))
        }
      }
    }
  }
}

function noop () {}

},{"ap":1,"creditcards":6}],56:[function(_dereq_,module,exports){
'use strict'

var card = _dereq_('creditcards').card
var array = _dereq_('cast-array')
var partial = _dereq_('ap').partial

module.exports = factory

factory.$inject = ['$parse']
function factory ($parse) {
  return {
    restrict: 'A',
    require: ['ngModel', 'ccNumber'],
    controller: function () {
      this.type = null
      this.eagerType = null
    },
    compile: function ($element, $attributes) {
      $attributes.$set('pattern', '[0-9]*')
      $attributes.$set('xAutocompletetype', 'cc-number')

      return function ($scope, $element, $attributes, controllers) {
        var ngModel = controllers[0]
        var ccNumber = controllers[1]

        $scope.$watch($attributes.ngModel, function (number) {
          ngModel.$ccType = ccNumber.type = card.type(number)
        })

        function $viewValue () {
          return ngModel.$viewValue
        }

        function setCursorPostion (element, position) {
          if (element.setSelectionRange) {
            element.setSelectionRange(position, position)
          } else if (element.createTextRange) {
            var range = element.createTextRange()
            range.move('character', position)
            range.select()
          }
        }

        if ($attributes.ccEagerType != null) {
          $scope.$watch($viewValue, function eagerTypeCheck (number) {
            number = card.parse(number)
            ngModel.$ccEagerType = ccNumber.eagerType = card.type(number, true)
          })
        }

        if ($attributes.ccType) {
          $scope.$watch($attributes.ccType, function () {
            ngModel.$validate()
          })
        }

        if ($attributes.ccFormat != null) {
          ngModel.$formatters.unshift(card.format)
          $element.on('input', function formatInput () {
            var input = $element.val()
            var previous = $viewValue()
            if (!input) return
            var element = $element[0]
            var formatted = card.format(card.parse(input))

            var selectionEnd = element.selectionEnd
            ngModel.$setViewValue(formatted)
            ngModel.$render()

            if (previous && previous.length < formatted.length) {
              selectionEnd = formatted.length
            }
            setCursorPostion(element, selectionEnd)

          })
        }

        ngModel.$parsers.unshift(card.parse)

        ngModel.$validators.ccNumber = function validateCcNumber (number) {
          return ngModel.$isEmpty(ngModel.$viewValue) || card.isValid(number)
        }

        ngModel.$validators.ccNumberType = function validateCcNumberType (number) {
          if (ngModel.$isEmpty(ngModel.$viewValue)) return true
          var type = $parse($attributes.ccType)($scope)
          if (!type) card.isValid(number)
          return array(type).some(partial(card.isValid, number))
        }
      }
    }
  }
}

},{"ap":1,"cast-array":2,"creditcards":6}],57:[function(_dereq_,module,exports){
'use strict'

var has = _dereq_('lodash/object/has')
var keysIn = _dereq_('lodash/object/keysIn')
var set = _dereq_('lodash/object/set')
var camel = _dereq_('lodash/string/camelCase')
var types = _dereq_('creditcards').card.types
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

},{"creditcards":6,"lodash/object/has":39,"lodash/object/keysIn":40,"lodash/object/set":41,"lodash/string/camelCase":42}],58:[function(_dereq_,module,exports){
(function (global){
'use strict'

var angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null)
var creditcards = _dereq_('creditcards')
var number = _dereq_('./number')
var cvc = _dereq_('./cvc')
var expiration = _dereq_('./expiration')
var type = _dereq_('./type')

module.exports = angular
  .module('credit-cards', [])
  .value('creditcards', creditcards)
  .directive('ccNumber', number)
  .directive('ccExp', expiration)
  .directive('ccExpMonth', expiration.month)
  .directive('ccExpYear', expiration.year)
  .directive('ccCvc', cvc)
  .provider('ccType', type)
  .name

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./cvc":54,"./expiration":55,"./number":56,"./type":57,"creditcards":6}]},{},[58])(58)
});