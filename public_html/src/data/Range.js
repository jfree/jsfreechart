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

"use strict";

/**
 * Creates a new Range instance.
 * @constructor
 * @param {!number} lowerBound  the lower bound for the range.
 * @param {!number} upperBound  the upper bound for the range.
 * @classdesc Represents a range of values.
 */
jsfc.Range = function(lowerBound, upperBound) {
    if (lowerBound >= upperBound) {
        throw new Error("Requires lowerBound to be less than upperBound: " + lowerBound + ", " + upperBound);
    }
    this._lowerBound = lowerBound;
    this._upperBound = upperBound;
};

/**
 * Returns the lower bound for the range.
 * 
 * @returns {!number} The lower bound.
 */
jsfc.Range.prototype.lowerBound = function() {
    return this._lowerBound;
};

/**
 * Returns the upper bound for the range.
 * 
 * @returns {!number} The upper bound.
 */
jsfc.Range.prototype.upperBound = function() {
    return this._upperBound;
};

/**
 * Returns the length of the range.
 * 
 * @returns {number}
 */
jsfc.Range.prototype.length = function() {
    return this._upperBound - this._lowerBound;
};

/**
 * Returns a percentage value reflecting the position of the value within the
 * range.
 * 
 * @param {number} value
 * @returns {number} The percentage.
 */
jsfc.Range.prototype.percent = function(value) {
    return (value - this._lowerBound) / this.length();
};

/**
 * Returns the value in the range corresponding to the specified percentage
 * value.
 * 
 * @param {!number} percent  the percentage (for example, 0.20 is twenty 
 *     percent).
 * @returns {number} The value.
 */
jsfc.Range.prototype.value = function(percent) {
    return this._lowerBound + percent * this.length();
};

/**
 * Returns true if the range contains the specified value, and false otherwise.
 * @param {!number} n  the value.
 * @returns {!boolean} A boolean.
 */
jsfc.Range.prototype.contains = function(n) {
    return n >= this._lowerBound && n <= this._upperBound;
};

jsfc.Range.prototype.toString = function() {
    return "[Range: " + this._lowerBound + ", " + this._upperBound + "]";
};