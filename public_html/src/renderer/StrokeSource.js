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
 * Creates and returns a new stroke source.
 * 
 * @param {jsfc.Stroke[]} strokes An array of strokes.
 * 
 * @returns {jsfc.StrokeSource}
 * 
 * @constructor
 */
jsfc.StrokeSource = function(strokes) {
    if (!(this instanceof jsfc.StrokeSource)) {
        throw new Error("Use 'new' for constructor.");
    }
    this._strokes = strokes;
};

/**
 * Returns a stroke for the specified item.
 * 
 * @param {number} series  the series index.
 * @param {number} item  the item index.
 * 
 * @returns {jsfc.Stroke} A stroke.
 */
jsfc.StrokeSource.prototype.getStroke = function(series, item) {
    return this._strokes[series % this._strokes.length];
};