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
 * Creates a new label generator with a default template string "{R}, {C} = {V}".
 * @constructor
 * @classdesc A label generator that creates a label for an item in a KeyedValues2DDataset.
 *
 */
jsfc.KeyedValue2DLabels = function() {
    if (!(this instanceof jsfc.KeyedValue2DLabels)) {
        return new jsfc.KeyedValue2DLabels();
    }
    this.format = "{R}, {C} = {V}";
    this.valueDP = 2;
};

/**
 * Creates a label for an item in the specified dataset.  The label format is
 * controlled by the 'format' attribute, where occurrences of certain tokens
 * are replaced by actual data values.  The recognised tokens are: {R} the row
 * key, {C} the column key and {V} the data value.
 * 
 * @param {jsfc.KeyedValues2DDataset} keyedValues2D  the dataset.
 * @param {number} rowIndex  the row index.
 * @param {number} columnIndex  the column index.
 * @returns {string} The item label.
 */
jsfc.KeyedValue2DLabels.prototype.itemLabel = function(keyedValues2D, rowIndex, 
        columnIndex) {
    var labelStr = new String(this.format);
    var rowKeyStr = keyedValues2D.rowKey(rowIndex);
    var columnKeyStr = keyedValues2D.columnKey(columnIndex);
    var value = keyedValues2D.valueByIndex(rowIndex, columnIndex);
    var valueStr = value.toFixed(this.valueDP);
    labelStr = labelStr.replace(/{R}/g, rowKeyStr);
    labelStr = labelStr.replace(/{C}/g, columnKeyStr);
    labelStr = labelStr.replace(/{V}/g, valueStr);
    return labelStr;
};
