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
 * @constructor
 * @implements {jsfc.Format}
 * @param {base} base  the log base.
 * @param {string} [baseStr]  a string to show in place of the base value.
 * @returns {!jsfc.LogFormat}
 */
jsfc.LogFormat = function(base, baseStr) {
    if (!(this instanceof jsfc.LogFormat)) {
        throw new Error("Use 'new' for construction.");
    }    
    this._base = base;
    this._baseStr = baseStr || base + "";
};

/**
 * Returns a formatted version of the supplied number based on the current
 * configuration of this instance.
 * 
 * @param {number} n  the number to format.
 * @returns {!string} A string containing the formatted number.
 */
jsfc.LogFormat.prototype.format = function(n) {
    jsfc.Args.requireNumber(n, "n");
    var log = Math.log(n) / Math.log(this._base);
    return this._baseStr + "^" + log.toFixed(2);
};
