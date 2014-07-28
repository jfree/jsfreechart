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
 * @class A mouse handler that uses a mouse click and drag to define a 
 * zooming rectangle for a chart.

 * @constructor 
 * @param {!jsfc.ChartManager} manager  the ChartManager (provides access to 
 *         the chart).
 * @param {jsfc.Modifier} [modifier]  the modifier keys (determines when this
 *         handler will become "live").
 * @returns {undefined}
 */
jsfc.ZoomHandler = function(manager, modifier) {
    if (!(this instanceof jsfc.ZoomHandler)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.BaseMouseHandler.init(manager, modifier || null, this);
    this.zoomPoint = null;
    this.zoomRectangle = null;
    this._fillColor = new jsfc.Color(255, 0, 0, 50);
};

// extends the BaseMouseHandler
jsfc.ZoomHandler.prototype = new jsfc.BaseMouseHandler();

/**
 * Handles a mouse down event.  Here we record the initial coordinate that
 * will define the zoom rectangle.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.ZoomHandler.prototype.mouseDown = function(e) {
    // update zoomPoint
    var r = this._manager.getElement().getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    var dataArea = this._manager.getChart().getPlot().dataArea();
    this.zoomPoint = dataArea.constrainedPoint(x, y);
};

// mouseMove
jsfc.ZoomHandler.prototype.mouseMove = function(e) {
    if (this.zoomPoint === null) {
        return; 
    }
    var r = this._manager.getElement().getBoundingClientRect();
    var ex = e.clientX - r.left;
    var ey = e.clientY - r.top;
    var dataArea = this._manager.getChart().getPlot().dataArea();
    var endPoint = dataArea.constrainedPoint(ex, ey);
    // compute the zoom rectangle and draw it
    var ctx = this._manager.getContext();
    ctx.setHint("layer", "zoom");
    ctx.clear();
    var x = this.zoomPoint.x();
    var y = this.zoomPoint.y();
    var width = endPoint.x() - x;
    var height = endPoint.y() - y;
    if (width > 0 && height > 0) {
        ctx.setFillColor(this._fillColor);
        ctx.setLineStroke(new jsfc.Stroke(0.1));
        ctx.drawRect(x, y, width, height);
    }
    ctx.setHint("layer", "default");
    // with SVG we could overlay one rectangle and modify it
    // with Canvas we could redraw everything, or use the buffer approach
    // and just redraw the buffer then the zoom rectangle above it
};
 
/**
 * On a mouse up we can check if a valid zoom rectangle has been created and,
 * if it has, change the ranges on the chart's axes.
 * 
 * @param {MouseEvent} e
 * @returns {undefined}
 */
jsfc.ZoomHandler.prototype.mouseUp = function(e) {
    
    // if we don't have a starting point, there's nothing to do...
    if (this.zoomPoint === null) {
        return;
    }
    
    // calculate the end point (constraining it to be within the data area
    var r = this._manager.getElement().getBoundingClientRect();
    var ex = e.clientX - r.left;
    var ey = e.clientY - r.top;
    var plot = this._manager.getChart().getPlot();
    var dataArea = plot.dataArea();
    var endPoint = dataArea.constrainedPoint(ex, ey);
    
    var x = this.zoomPoint.x();
    var y = this.zoomPoint.y();
    var width = endPoint.x() - x;
    var height = endPoint.y() - y;
    if (width > 0 && height > 0) {
        var xAxis = plot.getXAxis();
        var yAxis = plot.getYAxis();
        var p0 = (x - dataArea.minX()) / dataArea.width();
        var p1 = (x + width - dataArea.minX()) / dataArea.width();
        var p3 = (dataArea.maxY() - y) / dataArea.height();
        var p2 = (dataArea.maxY() - y - height) / dataArea.height();
        xAxis.setBoundsByPercent(p0, p1, false);
        yAxis.setBoundsByPercent(p2, p3);
    } else if (width < -2 && height < -2) {
        plot.getXAxis().setAutoRange(true);
        plot.getYAxis().setAutoRange(true);
    }
    
    this.zoomPoint = null;
    var ctx = this._manager.getContext();
    ctx.setHint("layer", "zoom");
    ctx.clear();
    ctx.setHint("layer", "default");
    // if there is a valid zoom rectangle, we can zoom
    // finally we should remove this handler as the current live handler
    this._manager._liveMouseHandler = null;
};

