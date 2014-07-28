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
 * Constructor for a new bin for use in a HistogramDataset.
 * 
 * @param {number} xmin  the lower bound for the bin.
 * @param {number} xmax  the upper bound for the bin.
 * @param {boolean} [incmin]  is the bin range inclusive of the minimum value 
 *     (optional, defaults to true).
 * @param {boolean} [incmax]  is the bin range inclusive of the maximum value 
 *     (optional, defaults to true).
 * @constructor
 * @classdesc A bin for a HistogramDataset.
 */
jsfc.Bin = function(xmin, xmax, incmin, incmax) {
    this.xmin = xmin;
    this.xmax = xmax;
    this.incMin = (incmin !== false);
    this.incMax = (incmax !== false);
    this.count = 0.0;
};

/**
 * Returns true if the value falls within the bin range, and false otherwise.
 * 
 * @param {!number} value  the value.
 * 
 * @returns {boolean} A boolean.
 */
jsfc.Bin.prototype.includes = function(value) {
    if (value < this.xmin) {
        return false;
    }
    if (value === this.xmin) {
        return this.incMin;
    }
    if (value > this.xmax) {
        return false;
    }
    if (value === this.xmax) {
        return this.incMax;
    }
    return true;
};

/**
 * Returns true if this bin overlaps the specified bin, and false otherwise.
 * 
 * @param {jsfc.Bin} bin  the bin to check.
 * 
 * @returns {boolean} A boolean.
 */
jsfc.Bin.prototype.overlaps = function(bin) {
    if (this.xmax < bin.xmin) {
        return false;
    }
    if (this.xmin > bin.xmax) {
        return false;
    }
    if (this.xmax === bin.xmin) {
        if (!(this.incMax && bin.incMin)) {
            return false;
        }
    }
    if (this.xmin === bin.xmax) {
        if (!(this.incMin && bin.incMax)) {
            return false;
        }
    }
    return true;
};
