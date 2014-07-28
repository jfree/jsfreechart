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
 * Creates a new StandardLegendBuilder instance.
 * 
 * @constructor
 * @implements {jsfc.LegendBuilder}
 * @classdesc An object that constructs a legend (a table element) to represent
 *         the items in a plot's dataset.
 * @param {jsfc.LegendBuilder} [instance]
 * @returns {jsfc.LegendBuilder} The new instance.
 */
jsfc.StandardLegendBuilder = function(instance) {
    if (!(this instanceof jsfc.StandardLegendBuilder)) {
        throw new Error("Use 'new' for constructor.");
    }
    if (!instance) {
        instance = this;
    }
    jsfc.StandardLegendBuilder.init(instance);
};

jsfc.StandardLegendBuilder.init = function(instance) {
    instance._font = new jsfc.Font("Palatino, serif", 12);
};

/**
 * Returns the font for the legend items.
 * 
 * @returns {jsfc.Font} The font.
 */
jsfc.StandardLegendBuilder.prototype.getFont = function() {
    return this._font; 
};

/**
 * Sets the font for the legend items.  There is no change notification.
 * @param {jsfc.Font} font  the new font (null not permitted).
 * @returns {undefined}
 */
jsfc.StandardLegendBuilder.prototype.setFont = function(font) {
    this._font = font;
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
jsfc.StandardLegendBuilder.prototype.createLegend = function(plot, anchor, 
        orientation, style) {
    var info = plot.legendInfo();
    var result = new jsfc.FlowElement();
    var me = this;
    info.forEach(function(info) {
        var shape = new jsfc.RectangleElement(8, 5)
                .setFillColor(info.color);
        var text = new jsfc.TextElement(info.label).setFont(me._font);
        var item = new jsfc.GridElement();
        item.add(shape, "R1", "C1");
        item.add(text, "R1", "C2");
        result.add(item);
    });
    return result;
};