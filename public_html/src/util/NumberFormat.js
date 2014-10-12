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
 * Creates a new number formatter.  By default, a comma is used for the
 * decimal separator.
 * 
 * @constructor
 * @implements {jsfc.Format}
 * @param {!number} dp  the number of decimal places.
 * @param {boolean} [exponential]  show in exponential format (defaults to 
 *         false).
 * @returns {!jsfc.NumberFormat}
 */
jsfc.NumberFormat = function(dp, exponential) {
    if (!(this instanceof jsfc.NumberFormat)) {
        throw new Error("Use 'new' for construction.");
    }    
    this._dp = dp;
    this.separator = ",";
    this._exponential = exponential || false;
};

/**
 * Returns a formatted version of the supplied number based on the current
 * configuration of this instance.
 * 
 * @param {!number} n  the number to format.
 * @returns {!string} A string representing the formatted number.
 */
jsfc.NumberFormat.prototype.format = function(n) {
    jsfc.Args.requireNumber(n, "n");
    if (this._exponential) {
        return n.toExponential(this._dp);
    }
    var str;
    if (this._dp === Number.POSITIVE_INFINITY) {
        str = n.toString();
    } else {
        str = n.toFixed(this._dp); 
    }
    // http://blog.tompawlak.org/number-currency-formatting-javascript
    if (this.separator) {
        str = str.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1" + this.separator);
    }
    return str;
};
