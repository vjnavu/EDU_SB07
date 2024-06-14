Number.isInteger = Number.isInteger || function(value) {
	return typeof value === 'number' &&
		isFinite(value) &&
		Math.floor(value) === value;
};

if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = Array.prototype.forEach;
}

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
	Object.defineProperty(Array.prototype, 'find', {
		value: function(predicate) {
			// 1. Let O be ? ToObject(this value).
			if (this == null) {
				throw new TypeError('"this" is null or not defined');
			}

			var o = Object(this);

			// 2. Let len be ? ToLength(? Get(O, "length")).
			var len = o.length >>> 0;

			// 3. If IsCallable(predicate) is false, throw a TypeError exception.
			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}

			// 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
			var thisArg = arguments[1];

			// 5. Let k be 0.
			var k = 0;

			// 6. Repeat, while k < len
			while (k < len) {
				// a. Let Pk be ! ToString(k).
				// b. Let kValue be ? Get(O, Pk).
				// c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
				// d. If testResult is true, return kValue.
				var kValue = o[k];
				if (predicate.call(thisArg, kValue, k, o)) {
					return kValue;
				}
				// e. Increase k by 1.
				k++;
			}

			// 7. Return undefined.
			return undefined;
		},
		configurable: true,
		writable: true
	});
}

if (!Array.prototype.map) {

	Array.prototype.map = function(callback, thisArg) {

		var T, A, k;

		if (this == null) {
			throw new TypeError(' this is null or not defined');
		}
		var O = Object(this);
		var len = O.length >>> 0;
		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}
		if (arguments.length > 1) {
			T = thisArg;
		}
		A = new Array(len);

		k = 0;

		while (k < len) {

			var kValue, mappedValue;
			if (k in O) {
				kValue = O[k];
				mappedValue = callback.call(T, kValue, k, O);
				A[k] = mappedValue;
			}
			k++;
		}

		return A;
	};
}


if (!Array.prototype.reduce) {
	Object.defineProperty(Array.prototype, 'reduce', {
		value: function(callback /*, initialValue*/) {
			if (this === null) {
				throw new TypeError( 'Array.prototype.reduce ' +
					'called on null or undefined' );
			}
			if (typeof callback !== 'function') {
				throw new TypeError( callback +
					' is not a function');
			}
			var o = Object(this);
			var len = o.length >>> 0;
			var k = 0;
			var value;

			if (arguments.length >= 2) {
				value = arguments[1];
			} else {
				while (k < len && !(k in o)) {
					k++;
				}
				if (k >= len) {
					throw new TypeError( 'Reduce of empty array ' +
						'with no initial value' );
				}
				value = o[k++];
			}
			while (k < len) {
				if (k in o) {
					value = callback(value, o[k], k, o);
				}
				k++;
			}
			return value;
		}
	});
}

if (!Array.prototype.filter){
	Array.prototype.filter = function(func, thisArg) {
		'use strict';
		if ( ! ((typeof func === 'Function' || typeof func === 'function') && this) )
			throw new TypeError();

		var len = this.length >>> 0,
			res = new Array(len), // preallocate array
			t = this, c = 0, i = -1;
		if (thisArg === undefined){
			while (++i !== len){
				// checks to see if the key was set
				if (i in this){
					if (func(t[i], i, t)){
						res[c++] = t[i];
					}
				}
			}
		}
		else{
			while (++i !== len){
				// checks to see if the key was set
				if (i in this){
					if (func.call(thisArg, t[i], i, t)){
						res[c++] = t[i];
					}
				}
			}
		}

		res.length = c; // shrink down array to proper size
		return res;
	};
}

if (!Array.prototype.every) {
	Array.prototype.every = function(callbackfn, thisArg) {
		'use strict';
		var T, k;

		if (this == null) {
			throw new TypeError('this is null or not defined');
		}
		var O = Object(this);
		var len = O.length >>> 0;
		if (typeof callbackfn !== 'function') {
			throw new TypeError();
		}
		if (arguments.length > 1) {
			T = thisArg;
		}
		k = 0;
		while (k < len) {

			var kValue;
			if (k in O) {
				kValue = O[k];
				var testResult = callbackfn.call(T, kValue, k, O);
				if (!testResult) {
					return false;
				}
			}
			k++;
		}
		return true;
	};
}