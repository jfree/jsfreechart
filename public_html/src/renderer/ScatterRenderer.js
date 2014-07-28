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
 * Creates a new renderer for generating scatter plots.
 * @constructor
 * @implements {jsfc.XYRenderer}
 * @param {jsfc.XYPlot} plot  the plot that the renderer is assigned to
 * @returns {jsfc.ScatterRenderer}
 */
jsfc.ScatterRenderer = function(plot) {
    if (!(this instanceof jsfc.ScatterRenderer)) {
        throw new Error("Use 'new' for constructors.");
    }
    jsfc.BaseXYRenderer.init(this);
    this._plot = plot;
    this._radius = 3;
};

// extend BaseXYRenderer (see also the init call in the constructor)
jsfc.ScatterRenderer.prototype = new jsfc.BaseXYRenderer();

/**
 * Returns the fill color string for an item.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string} itemKey  the item key.
 * @returns {string} A color string.
 */
jsfc.ScatterRenderer.prototype.itemFillColorStr = function(seriesKey, 
        itemKey) {
    var dataset = this._plot.getDataset();
    var c = dataset.getProperty(seriesKey, itemKey, "color");
    if (c) {
        return c;
    } 
    var color = this.itemFillColor(seriesKey, itemKey);
    return color.rgbaStr();
};
    
/**
 * Returns the item fill color.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string|number} itemKey  the item key.
 * @returns {jsfc.Color}
 */
jsfc.ScatterRenderer.prototype.itemFillColor = function(seriesKey, itemKey) {
    var dataset = this._plot.getDataset();
    var seriesIndex = dataset.seriesIndex(seriesKey);
    var itemIndex = dataset.itemIndex(seriesKey, itemKey);
    return this._lineColorSource.getColor(seriesIndex, itemIndex);
};

jsfc.ScatterRenderer.prototype.itemStrokeColor = function(seriesKey, itemKey) {
    if (this._plot._dataset.isSelected("select", seriesKey, itemKey)) {
        return "red";
    } 
    return "none";
};

/**
 * Draws one item.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} dataArea  the data area.
 * @param {!jsfc.XYPlot} plot  the plot.
 * @param {!jsfc.XYDataset} dataset  the dataset.
 * @param {!number} seriesIndex
 * @param {!number} itemIndex
 * @param {!number} pass
 * @returns {undefined}
 */
jsfc.ScatterRenderer.prototype.drawItem = function(ctx, dataArea, plot, 
        dataset, seriesIndex, itemIndex, pass) {

    var seriesKey = dataset.seriesKey(seriesIndex);
    var itemKey = dataset.getItemKey(seriesIndex, itemIndex);
    
    // fetch the x and y values
    var x = dataset.x(seriesIndex, itemIndex);
    var y = dataset.y(seriesIndex, itemIndex);
    
    // convert these to target coordinates using the plot's axes
    var xx = plot.getXAxis().valueToCoordinate(x, dataArea.minX(), 
            dataArea.maxX());
    var yy = plot.getYAxis().valueToCoordinate(y, dataArea.maxY(), 
            dataArea.minY());

    // fill color - first check if it is defined as a property in the dataset
    var str = dataset.getItemProperty(seriesKey, itemKey, "color");
    var color;
    if (typeof str === "string") {
        color = jsfc.Color.fromStr(str);
    } else {
        color = this.itemFillColor(seriesKey, itemKey);
    }
    var r = this._radius;
    if (dataset.isSelected("selection", seriesKey, itemKey)) {
        r = r * 2;
    }
    ctx.setFillColor(color);
    ctx.setLineStroke(new jsfc.Stroke(0.2));
    ctx.setLineColor(jsfc.Colors.BLACK);
    ctx.setHint("ref", [seriesKey, itemKey]);
    ctx.drawCircle(xx, yy, r);
};
