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
 * Creates a new label generator with a default template string "{S}, {R}, {C} = {V}".
 * @constructor
 * @classdesc A label generator that creates a label for an item in a KeyedValues3DDataset.
 */
jsfc.KeyedValue3DLabels = function() {
    if (!(this instanceof jsfc.KeyedValue3DLabels)) {
        return new jsfc.KeyedValue3DLabels();
    }
    this.format = "{S}, {R}, {C} = {V}";
    this.valueDP = 2;
};

/**
 * Creates a label for an item in the specified dataset.
 * 
 * @param {jsfc.KeyedValues3DDataset} keyedValues3D  the dataset.
 * @param {number} seriesIndex  the series index.
 * @param {number} rowIndex  the row index.
 * @param {number} columnIndex  the column index.
 * @returns {string}  The item label.
 */
jsfc.KeyedValue3DLabels.prototype.itemLabel = function(keyedValues3D, 
      seriesIndex, rowIndex, columnIndex) {
    var labelStr = new String(this.format);
    var seriesKeyStr = keyedValues3D.seriesKey(seriesIndex);
    var rowKeyStr = keyedValues3D.rowKey(rowIndex);
    var columnKeyStr = keyedValues3D.columnKey(columnIndex);
    var value = keyedValues3D.valueByIndex(seriesIndex, rowIndex, columnIndex);
    var valueStr = value.toFixed(this.valueDP);
    labelStr = labelStr.replace(/{S}/g, seriesKeyStr);
    labelStr = labelStr.replace(/{R}/g, rowKeyStr);
    labelStr = labelStr.replace(/{C}/g, columnKeyStr);
    labelStr = labelStr.replace(/{V}/g, valueStr);
    return labelStr;
};