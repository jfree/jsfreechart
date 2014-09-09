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
 * Creates a new instance.
 * @class A formatter that converts a number into a string that shows the
 * date/time, based on the assumption that the numerical value is a count of 
 * the milliseconds elapsed since 1-Jan-1970.  The current implementation is
 * "quick and dirty". 
 * 
 * @constructor
 * @implements {jsfc.Format}
 * @param {string} [style] the format style (optional, defaults to 
 *     'd-mmm-yyyy').
 * @returns {jsfc.DateFormat} The new formatter.
 */
jsfc.DateFormat = function(style) {
    this._date = new Date();
    this._style = style || "d-mmm-yyyy";
    this._months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", 
            "Sep", "Oct", "Nov", "Dec"];
};

/**
 * Returns a formatted version of the supplied number based on the current
 * configuration of this instance.
 * 
 * @param {number} n  the number to format.
 * @returns {!string} A string containing the formatted number.
 */
jsfc.DateFormat.prototype.format = function(n) {
    jsfc.Args.requireNumber(n, "n");
    this._date.setTime(n);
    if (this._style === "yyyy") {
        return this._dateToYYYY(this._date);
    }
    if (this._style === "mmm-yyyy") {
        return this._dateToMMMYYYY(this._date);
    }
    return this._date.toDateString();  
};

/**
 * Returns the full year for the specified date.
 * 
 * @param {!Date} date  the date (null not permitted).
 * @returns {!string}
 */
jsfc.DateFormat.prototype._dateToYYYY = function(date) {
    var y = date.getFullYear();
    return y + "";
};

/**
 * Returns a mmm-YYYY string for the specified date.
 * 
 * @param {!Date} date  the date (null not permitted).
 * @returns {!string}
 */
jsfc.DateFormat.prototype._dateToMMMYYYY = function(date) {
    var m = date.getMonth();
    var y = date.getFullYear();
    return this._months[m] + "-" + y;
};