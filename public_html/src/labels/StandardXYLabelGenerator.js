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
 * Creates a new label generator with the default template string 
 * "{X}, {Y} / {S}".
 * 
 * @constructor
 * @implements {jsfc.XYLabelGenerator}
 * @classdesc A label generator that creates a label for an item in a XYDataset. 
 * The labels are generated from a template string that can contain the 
 * following tokens (each occurrence of the token will be replaced by the 
 * actual data value): {X} the x-value, {Y} the y-value and {S} the series key.
 */
jsfc.StandardXYLabelGenerator = function(format, xdp, ydp) {
    if (!(this instanceof jsfc.StandardXYLabelGenerator)) {
        throw new Error("Use 'new' with constructor.");
    }
    this._format = format || "{X}, {Y} / {S}";
    this._xDP = xdp || 2;
    this._yDP = ydp || 2;
};

/**
 * Creates a label for an item in the specified dataset.
 * 
 * @param {jsfc.XYDataset} dataset  the dataset.
 * @param {string} seriesKey  the series key.
 * @param {string|number} itemKey  the item index.
 * @returns {string} The item label.
 */
jsfc.StandardXYLabelGenerator.prototype.itemLabel = function(dataset, 
        seriesKey, itemKey) {
    var labelStr = new String(this._format);
    var seriesKeyStr = seriesKey;
    var item = dataset.itemByKey(seriesKey, itemKey);
    var xStr = item.x.toFixed(this._xDP);
    var yStr = item.y.toFixed(this._yDP);
    labelStr = labelStr.replace(/{X}/g, xStr);
    labelStr = labelStr.replace(/{Y}/g, yStr);
    labelStr = labelStr.replace(/{S}/g, seriesKeyStr);
    return labelStr;
};
