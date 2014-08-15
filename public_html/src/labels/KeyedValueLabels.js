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
 * Creates a new label generator.
 * @constructor
 * @classdesc A label generator that creates a label for an item in a 
 *     KeyedValuesDataset.
 */
jsfc.KeyedValueLabels = function() {
    if (!(this instanceof jsfc.KeyedValueLabels)) {
        throw new Error("Use 'new' for construction.");
    }
    this.format = "{K} = {V}";
    this.valueDP = 2;
    this.percentDP = 2;
};

/**
 * Creates a label for one item in a KeyedValuesDataset.  The label will be
 * generated using a template string (the 'format' attribute) by replacing
 * certain tokens with the corresponding values from the dataset.  The tokens 
 * are: {K} the key, {V} the value and {P} the value as a percentage of the 
 * total.
 * 
 * @param {jsfc.KeyedValuesDataset} keyedValues  the dataset.
 * @param {number} itemIndex  the item index.
 * @returns {string} A string.
 */
jsfc.KeyedValueLabels.prototype.itemLabel = function(keyedValues, itemIndex) {
    var labelStr = new String(this.format);
    var keyStr = keyedValues.key(itemIndex);
    var value = keyedValues.valueByIndex(itemIndex);
    var valueStr = value.toFixed(this.valueDP);
    var total = keyedValues.total();
    var percentStr = (value / total * 100).toFixed(this.percentDP);
    labelStr = labelStr.replace(/{K}/g, keyStr);
    labelStr = labelStr.replace(/{V}/g, valueStr);
    labelStr = labelStr.replace(/{P}/g, percentStr);
    return labelStr;
};
