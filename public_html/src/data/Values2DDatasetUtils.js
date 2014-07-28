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
 * A collection of utility functions for working with datasets.
 * @namespace
 */
jsfc.Values2DDatasetUtils = {};

/**
 * Returns [ymin, ymax] where ymin is the smallest value appearing in the 
 * dataset and ymax is the largest value.
 * 
 * @param {jsfc.Values2DDataset} dataset  the source dataset.
 * @param {number} [baseline]  the baseline value.
 * 
 * @returns {Array} The y-value range.
 */
jsfc.Values2DDatasetUtils.ybounds = function(dataset, baseline) {
    var ymin = baseline ? baseline : Number.POSITIVE_INFINITY;
    var ymax = baseline ? baseline : Number.NEGATIVE_INFINITY;
    for (var r = 0; r < dataset.rowCount(); r++) {
        for (var c = 0; c < dataset.columnCount(); c++) {
            var y = dataset.valueByIndex(r, c);
            if (y) {
                ymin = Math.min(ymin, y);
                ymax = Math.max(ymax, y);
            }
        }
    }
    return [ymin, ymax];    
};

/**
 * Returns the stack base value for the specified item in the dataset.
 * 
 * @param {!jsfc.Values2DDataset} dataset  the dataset.
 * @param {!number} r  the row index.
 * @param {!number} c  the column index.
 * @param {number} [baseline]  the initial baseline (defaults to 0.0).
 * 
 * @returns {!number} The base value.
 */
jsfc.Values2DDatasetUtils.stackBaseY = function(dataset, r, c, baseline) {
    var y = dataset.valueByIndex(r, c);
    var result = baseline || 0.0;
    if (y > 0) {
        for (var rr = 0; rr < r; rr++) {
            y = dataset.valueByIndex(rr, c);
            if (y > 0) {
                result += y;
            }
        }
        return result;
    } else if (y < 0) {
        for (var rr = 0; rr < r; rr++) {
            y = dataset.valueByIndex(rr, c);
            if (y < 0) {
                result += y; // y is negative!
            }
        }
        return result;        
    }
    return result;
};

/**
 * Returns the range of y-values in the dataset assuming that all the values
 * in a given column are stacked on top of one another (as they would be for
 * a stacked bar chart), positive values above the baseline and negative values 
 * below the baseline.
 * 
 * @param {!jsfc.Values2DDataset} dataset  the dataset.
 * @param {number} [baseline]  the baseline (defaults to 0.0).
 * @returns {Array} An array containing [ymin, ymax].
 */
jsfc.Values2DDatasetUtils.stackYBounds = function(dataset, baseline) {
    var ymin = baseline ? baseline : 0;
    var ymax = baseline ? baseline : 0;
    for (var c = 0; c < dataset.columnCount(); c++) {
        var posBase = baseline || 0; 
        var negBase = baseline || 0; 
        for (var r = 0; r < dataset.rowCount(); r++) {
            var y = dataset.valueByIndex(r, c);
            if (y > 0) {
                posBase += y;
            } else if (y < 0) {
                negBase += y;
            }
            ymin = Math.min(ymin, negBase);
            ymax = Math.max(ymax, posBase);
        }
    }
    return [ymin, ymax];        
};
