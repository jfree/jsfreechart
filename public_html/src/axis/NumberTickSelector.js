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
 * Creates a new NumberTickSelector instance.
 * @returns {jsfc.NumberTickSelector}
 * @constructor
 * @classdesc 
 */
jsfc.NumberTickSelector = function(percentage) {
    if (!(this instanceof jsfc.NumberTickSelector)) {
        throw new Error("Use 'new' for constructor.");
    }
    this._power = 0;
    this._factor = 1;
    this._percentage = percentage;
    this._f0 = new jsfc.NumberFormat(0);
    this._f1 = new jsfc.NumberFormat(1);
    this._f2 = new jsfc.NumberFormat(2);
    this._f3 = new jsfc.NumberFormat(3);
    this._f4 = new jsfc.NumberFormat(4);
};

/**
 * Selects and returns a standard tick size that is greater than or equal to 
 * the specified reference value and, ideally, as close to it as possible 
 * (to minimise the number of iterations used by axes to determine the tick
 * size to use).
 * 
 * @param {number} reference  the reference value.
 * @returns {number} The selected value.
 */
jsfc.NumberTickSelector.prototype.select = function(reference) {
    this._power = Math.ceil(Math.LOG10E * Math.log(reference));
    this._factor = 1;
    return this.currentTickSize();    
};

/**
 * Returns the current tick size.
 * 
 * @returns {number} The current tick size.
 */
jsfc.NumberTickSelector.prototype.currentTickSize = function() {
    return this._factor * Math.pow(10.0, this._power);
};

/**
 * Returns a formatter that is appropriate for the current tick size.
 * 
 * @returns {jsfc.NumberFormat}
 */
jsfc.NumberTickSelector.prototype.currentTickFormat = function() {
    if (this._power === -4) {
        return this._f4;
    }
    if (this._power === -3) {
        return this._f3;
    }
    if (this._power === -2) {
        return this._f2;
    }
    if (this._power === -1) {
        return this._f1;
    }
    if (this._power < -4) {
        return new jsfc.NumberFormat(Number.POSITIVE_INFINITY);
    }
    if (this._power > 6) {
        return new jsfc.NumberFormat(1, true);
    }
    return this._f0;
};

/**
 * Moves the pointer to the next available (larger) standard tick size and
 * returns true (the contract for this method says to return false if there 
 * is no larger tick size).
 * 
 * @returns {boolean}
 */
jsfc.NumberTickSelector.prototype.next = function() {
    if (this._power === 300 && this._factor === 5) {
        return false;
    }
    if (this._factor === 1) {
        this._factor = 2;
        return true;
    } 
    if (this._factor === 2) {
        this._factor = 5;
        return true;  
    } 
    if (this._factor === 5) {
        this._power++;
        this._factor = 1;
        return true;
    } 
    // it should not be possible to get a factor that is not equal to 1, 2 or 5
    throw new Error("Factor should be 1, 2 or 5: " + this._factor);
};

/**
 * Moves the pointer to the previous available (smaller) standard tick size and
 * returns true (the contract for this method says to return false if there 
 * is no larger tick size).
 * 
 * @returns {boolean}
 */
jsfc.NumberTickSelector.prototype.previous = function() {
    if (this._power === -300 && this._factor === 1) {
        return false;
    }
    if (this._factor === 1) {
        this._factor = 5;
        this._power--;
        return true;
    } 
    if (this._factor === 2) {
        this._factor = 1;
        return true;  
    } 
    if (this._factor === 5) {
        this._factor = 2;
        return true;
    } 
    // it should not be possible to get a factor that is not equal to 1, 2 or 5
    throw new Error("Factor should be 1, 2 or 5: " + this._factor);
};

