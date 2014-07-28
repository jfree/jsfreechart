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
 * Creates a new instance. 
 * 
 * @class A mouse handler that draws cross-hairs as the mouse pointer moves
 *     over a chart.  This handler is intended for use as an auxiliary
 *     handler, for XY charts only.

 * @constructor
 * @implements {jsfc.MouseHandler}
 * @param {!jsfc.ChartManager} manager  the ChartManager (provides access to 
 *         the chart).
 * @returns {undefined}
 */
jsfc.XYCrosshairHandler = function(manager) {
    if (!(this instanceof jsfc.XYCrosshairHandler)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.BaseMouseHandler.init(manager, null, this);
    this._manager = manager;
    this._layerID = "XYCrosshair";
    this._xCrosshair = new jsfc.Crosshair(Number.NaN);
    this._xLabelGenerator = new jsfc.StandardXYLabelGenerator("{X}", 4, 4);
    this._xFormatter = new jsfc.NumberFormat(4);
    this._yCrosshair = new jsfc.Crosshair(Number.NaN);
    this._yLabelGenerator = new jsfc.StandardXYLabelGenerator("{Y}", 4, 4);
    this._yFormatter = new jsfc.NumberFormat(4);
    this._snapToItem = true;
};

// extend the BaseMouseHandler
jsfc.XYCrosshairHandler.prototype = new jsfc.BaseMouseHandler();

/**
 * Returns the crosshair object for the x-axis.  This provides the ability
 * to customise the visual properties of the crosshair.
 * 
 * @returns {!jsfc.Crosshair}
 */
jsfc.XYCrosshairHandler.prototype.getXCrosshair = function() {
    return this._xCrosshair;
};

/**
 * Returns the generator that creates the labels for the x-crosshair when 
 * the 'snapToItem' flag is set to true.
 * 
 * @returns {jsfc.XYLabelGenerator}
 */
jsfc.XYCrosshairHandler.prototype.getXLabelGenerator = function() {
    return this._xLabelGenerator;
};

/**
 * Sets the label generator for the label on the x-crosshair.
 * @param {jsfc.XYLabelGenerator} generator
 * @returns {undefined}
 */
jsfc.XYCrosshairHandler.prototype.setXLabelGenerator = function(generator) {
    this._xLabelGenerator = generator;
};

/**
 * Returns the crosshair object for the y-axis.  This provides the ability
 * to customise the visual properties of the crosshair.
 * 
 * @returns {!jsfc.Crosshair}
 */
jsfc.XYCrosshairHandler.prototype.getYCrosshair = function() {
    return this._yCrosshair;
};

/**
 * Returns the generator that creates the labels for the y-crosshair when 
 * the 'snapToItem' flag is set to true.
 * 
 * @returns {jsfc.XYLabelGenerator}
 */
jsfc.XYCrosshairHandler.prototype.getYLabelGenerator = function() {
    return this._yLabelGenerator;
};

/**
 * Sets the label generator for the label on the y-crosshair.
 * @param {jsfc.XYLabelGenerator} generator
 * @returns {undefined}
 */
jsfc.XYCrosshairHandler.prototype.setYLabelGenerator = function(generator) {
    this._yLabelGenerator = generator;
};

/**
 * Returns the flag that controls whether the crosshairs "snap" to the nearest
 * visible data value.  The default value is true.
 * 
 * @returns {!boolean}
 */
jsfc.XYCrosshairHandler.prototype.getSnapToItem = function() {
    return this._snapToItem;
};

/**
 * Sets the flag that controls whether or not the crosshairs "snap" to the 
 * nearest visible data item.
 * 
 * @param {!boolean} snap  the new flag value.
 * @returns {undefined}
 */
jsfc.XYCrosshairHandler.prototype.setSnapToItem = function(snap) {
    this._snapToItem = snap;
};

/**
 * Handles a mouse move event.
 * 
 * @param {MouseEvent} e  the event.
 * @returns {undefined}
 */
jsfc.XYCrosshairHandler.prototype.mouseMove = function(e) {
    var r = this._manager.getElement().getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    var plot = this._manager.getChart().getPlot();
    var dataArea = plot.dataArea();
    var minX = dataArea.minX();
    var minY = dataArea.minY();
    var maxX = dataArea.maxX();
    var maxY = dataArea.maxY();
    var ctx = this._manager.getContext();
    if (dataArea.contains(x, y)) {
        ctx.setHint("layer", this._layerID);
        ctx.clear();
        var dataset = plot.getDataset();
        var xaxis = plot.getXAxis();
        var xx = xaxis.coordinateToValue(x, minX, maxX);
        var yaxis = plot.getYAxis();
        var yy = yaxis.coordinateToValue(y, maxY, minY);
        var xlabel, ylabel;
        if (this._snapToItem) {
            // find the nearest visible data point
            var xlen = xaxis.length();
            var xscale = xlen / dataArea.width();
            var ylen = yaxis.length();
            var yscale = ylen / dataArea.height();
            var item = plot.findNearestDataItem(xx, yy, xscale, yscale);
            var s = dataset.seriesIndex(item.seriesKey);
            var i = dataset.itemIndex(item.seriesKey, item.itemKey);
            var ix = dataset.x(s, i);
            x = xaxis.valueToCoordinate(ix, minX, maxX);
            xlabel = this._xLabelGenerator.itemLabel(dataset, 
                    item.seriesKey, item.itemKey);
            var iy = plot.getDataset().y(s, i);
            y = yaxis.valueToCoordinate(iy, maxY, minY);
            ylabel = this._yLabelGenerator.itemLabel(dataset, 
                    item.seriesKey, item.itemKey);
        } 
        xlabel = xlabel || this._xFormatter.format(xx);
        ylabel = ylabel || this._yFormatter.format(yy);
        if (this._xCrosshair) {
            this._xCrosshair.setLabel(xlabel);
            this._xCrosshair.drawVertical(ctx, x, dataArea);
        }
        if (this._yCrosshair) {
            this._yCrosshair.setLabel(ylabel);
            this._yCrosshair.drawHorizontal(ctx, y, dataArea);
        }
        ctx.setHint("layer", "default");
    } else {
        ctx.setHint("layer", this._layerID);
        ctx.clear();        
        ctx.setHint("layer", "default");
    }
};

/**
 * Perform any cleanup required before the handler is removed.
 * 
 * @returns {undefined}
 */
jsfc.XYCrosshairHandler.prototype.cleanUp = function() {
    var ctx = this._manager.getContext();
    ctx.setHint("layer", this._layerID);
    ctx.clear();        
    ctx.setHint("layer", "default");    
};
