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
 * Creates and returns a new color source.
 * 
 * @param {jsfc.Color[]} colors An array of colors.
 * 
 * @returns {jsfc.ColorSource}
 * 
 * @constructor
 */
jsfc.ColorSource = function(colors) {
    if (!(this instanceof jsfc.ColorSource)) {
        throw new Error("Use 'new' for constructor.");
    }
    this._colors = colors;
};

/**
 * Returns a color.
 * 
 * @param {number} series  the series index.
 * @param {number} item  the item index.
 * 
 * @returns {jsfc.Color} A color.
 */
jsfc.ColorSource.prototype.getColor = function(series, item) {
    return this._colors[series % this._colors.length];
};

/**
 * Returns a color to represent the specified series in the legend.
 * @param {number} series  the series index.
 * @returns {jsfc.Color} A color to represent the series.
 */
jsfc.ColorSource.prototype.getLegendColor = function(series) {
    return this._colors[series % this._colors.length];
};