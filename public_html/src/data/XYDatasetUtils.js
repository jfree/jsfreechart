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
jsfc.XYDatasetUtils = {};

/**
 * Returns the number of data items in the dataset.
 * 
 * @param {!jsfc.XYDataset} dataset  the dataset.
 * 
 * @returns {!number}
 */
jsfc.XYDatasetUtils.itemCount = function(dataset) {
    var result = 0;
    for (var s = 0; s < dataset.seriesCount(); s++) {
        result += dataset.itemCount(s);
    }
    return result;
};

/**
 * Returns [ymin, ymax] where ymin is the smallest value appearing in the 
 * dataset and ymax is the largest value.
 * 
 * @param {jsfc.XYDataset} dataset  the source dataset.
 * @param {number} [baseline]  the baseline value.
 * 
 * @returns {Array} The y-value range.
 */
jsfc.XYDatasetUtils.ybounds = function(dataset, baseline) {
    var ymin = baseline ? baseline : Number.POSITIVE_INFINITY;
    var ymax = baseline ? baseline : Number.NEGATIVE_INFINITY;
    for (var s = 0; s < dataset.seriesCount(); s++) {
        for (var i = 0; i < dataset.itemCount(s); i++) {
            var y = dataset.y(s, i);
            ymin = Math.min(ymin, y);
            ymax = Math.max(ymax, y);
        }
    }
    return [ymin, ymax];    
};