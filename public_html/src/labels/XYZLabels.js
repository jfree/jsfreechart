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
 * Creates a new label generator with the default template string "{X}, {Y}, {Z} / {S}".
 * @constructor
 * @classdesc A label generator that creates a label for an item in a XYZDataset. 
 *     The labels are generated from a template string that can contain the following
 *     tokens (each occurrence of the token will be replaced by the actual data 
 *     value): {X} the x-value, {Y} the y-value, {Z} the z-value and {S} the series key.
 */
jsfc.XYZLabels = function() {
    if (!(this instanceof jsfc.XYZLabels)) {
        return new jsfc.XYZLabels();
    }
    this.format = "{X}, {Y}, {Z} / {S}";
    this.xDP = 2;
    this.yDP = 2;
    this.zDP = 2;
};

/**
 * Creates a label for an item in the specified dataset.
 * 
 * @param {jsfc.XYZDataset} dataset  the dataset.
 * @param {string} seriesKey  the series key.
 * @param {number} itemIndex  the item index.
 * @returns {string}  The item label.
 */
jsfc.XYZLabels.prototype.itemLabel = function(dataset, seriesKey, itemIndex) {
    var labelStr = new String(this.format);
    var seriesKeyStr = seriesKey;
    var seriesIndex = dataset.seriesIndex(seriesKey);
    var item = dataset.item(seriesIndex, itemIndex);
    var xStr = item.x.toFixed(this.xDP);
    var yStr = item.y.toFixed(this.yDP);
    var zStr = item.z.toFixed(this.zDP);
    labelStr = labelStr.replace(/{X}/g, xStr);
    labelStr = labelStr.replace(/{Y}/g, yStr);
    labelStr = labelStr.replace(/{Z}/g, zStr);
    labelStr = labelStr.replace(/{S}/g, seriesKeyStr);
    return labelStr;
};
