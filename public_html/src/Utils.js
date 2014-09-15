/* 
 * Copyright (C) 2014 Object Refinery Limited and KNIME.com AG
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * General utility functions.
 * @namespace
 */
jsfc.Utils = {};

/**
 * Creates an array of the specified length, with each element in the array
 * initialised to the specified value.
 * 
 * @param {*} value
 * @param {number} length
 * @returns {Array}
 */
jsfc.Utils.makeArrayOf = function(value, length) {
    var arr = [], i = length;
    while (i--) {
        arr[i] = value;
    }
    return arr;
};

/**
 * Returns the index of the first item in array for which the matcher function
 * returns true, or -1 if there is no match.
 * 
 * @param {Array} items  an array
 * @param {function(*, number)} matcher  a matching function (receives the array item and the array index as parameters), should return true or false.

 * @returns {number}  The index of the first item that matches, or -1.
 */
jsfc.Utils.findInArray = function(items, matcher) {
    var length = items.length;
    for (var i = 0; i < length; i++) {
        if (matcher(items[i], i)) {
            return i;
        }
    }
    return -1;
};

/**
 * Returns the index of an item within an array.
 * 
 * @param {*} item  the item.
 * @param {Array} arr  the array.
 * @returns {!number} The index of the item, or -1 if the item is not present
 *     in the array.
 */
jsfc.Utils.findItemInArray = function(item, arr) {
    return jsfc.Utils.findInArray(arr, function(x, i) {
        return x === item; 
    });
};

/**
 * Returns true if running on MacOS and false otherwise.
 * 
 * @returns {boolean} A boolean.
 */
jsfc.Utils.isMacOS = function() {
    return navigator.appVersion.indexOf("Mac") !== -1;
};

