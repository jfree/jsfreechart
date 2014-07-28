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
 * Creates a new FixedLegendBuilder instance.
 * 
 * @classdesc An object that constructs a legend (a table element) to represent
 *         the items in a plot's dataset.
 * 
 * @constructor 
 * @implements jsfc.LegendBuilder
 * @returns {jsfc.FixedLegendBuilder} The new instance.
 */
jsfc.FixedLegendBuilder = function() {
    if (!(this instanceof jsfc.FixedLegendBuilder)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.StandardLegendBuilder.init(this);
    this._info = []; // equivalent to the info returned by a plot
};

jsfc.FixedLegendBuilder.prototype = new jsfc.StandardLegendBuilder();

/**
 * Adds an item to be incorporated in the legend.
 * 
 * @param {string} key  the key.
 * @param {jsfc.Color} color  the color.
 * @returns {undefined}
 */
jsfc.FixedLegendBuilder.prototype.add = function(key, color) {
    this._info.push(new jsfc.LegendItemInfo(key, color));
};

/**
 * Clears the list of items that will be included in the legend.
 * 
 * @returns {undefined}
 */
jsfc.FixedLegendBuilder.prototype.clear = function() {
    this._info = [];
};

/**
 * Creates a legend containing items representing the content of the specified
 * plot.
 * 
 * @param {jsfc.XYPlot|jsfc.CategoryPlot} plot  the plot.
 * @param {jsfc.Anchor2D} anchor  the legend anchor (used to determine 
 *     default item alignment).
 * @param {string} orientation  the orientation ("horizontal" or "vertical").
 * @param {Object} style  the style (currently ignored).
 * @returns {jsfc.TableElement} The legend (a table element).
 */
jsfc.FixedLegendBuilder.prototype.createLegend = function(plot, anchor, 
        orientation, style) {
    var info = this._info;
    var result = new jsfc.FlowElement();
    var legendBuilder = this;
    info.forEach(function(info) {
        var shape = new jsfc.RectangleElement(8, 5)
                .setFillColor(info.color);
        var text = new jsfc.TextElement(info.label)
                .setFont(legendBuilder.getFont());
        var item = new jsfc.GridElement();
        item.add(shape, "R1", "C1");
        item.add(text, "R1", "C2");
        result.add(item);
    });
    return result;
};