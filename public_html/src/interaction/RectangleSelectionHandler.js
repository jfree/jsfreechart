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
 * A mouse handler that handles selection by drawing a rectangle with the 
 * mouse.
 * @constructor
 * @implements {jsfc.MouseHandler}
 * @param {!jsfc.ChartManager} manager  the ChartManager (provides access to 
 *         the chart and dataset).
 * @param {jsfc.Modifier} [modifier]  the modifier keys to select this handler.
 */
jsfc.RectangleSelectionHandler = function(manager, modifier) {
    if (!(this instanceof jsfc.RectangleSelectionHandler)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.BaseMouseHandler.init(manager, modifier, this);
    this._extendModifier = new jsfc.Modifier(false, false, false, true);
    this._rectangle = null;
    this._fillColor = new jsfc.Color(255, 255, 100, 100);
    this._lineStroke = new jsfc.Stroke(0.5);
    this._lineStroke.setLineDash([3, 3]);
    this._lineColor = jsfc.Colors.RED;
};

// extend BaseMouseHandler (see also the init call in the constructor)
jsfc.RectangleSelectionHandler.prototype = new jsfc.BaseMouseHandler();

/**
 * Handles a mouse down event - this handler creates a new rectangle instance
 * and initialises it with the starting point.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.RectangleSelectionHandler.prototype.mouseDown = function(e) {
    var element = this._manager.getElement();
    var r = element.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    var dataArea = this._manager.getChart().getPlot().dataArea();
    var pt = dataArea.constrainedPoint(x, y);
    this._rectangle = new jsfc.Rectangle(pt.x(), pt.y(), 0, 0);
};

/**
 * Handles a mouse move event.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.RectangleSelectionHandler.prototype.mouseMove = function(e) {
    if (this._rectangle === null) {
        return; 
    }
    var r = this._manager.getElement().getBoundingClientRect();
    var currX = e.clientX - r.left;
    var currY = e.clientY - r.top;
    var dataArea = this._manager.getChart().getPlot().dataArea();
    var currPt = dataArea.constrainedPoint(currX, currY);
    var x = this._rectangle.x();
    var y = this._rectangle.y();
    var w = Math.max(0, currPt.x() - x);
    var h = Math.max(0, currPt.y() - y);
    this._rectangle.set(x, y, w, h);

    var ctx = this._manager.getContext();
    ctx.setHint("layer", "rectangle");
    ctx.clear();
    ctx.setFillColor(this._fillColor);
    ctx.setLineColor(this._lineColor);
    ctx.setLineStroke(this._lineStroke);
    ctx.drawRect(x, y, w, h);
    ctx.setHint("layer", "default");
};

/**
 * Handles a mouse up event.  If the event location is close to the original
 * mouse down (so this is a click rather than a drag) then the handler looks
 * for a data reference in the target element...if it finds one, then it sets
 * that item to selected.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.RectangleSelectionHandler.prototype.mouseUp = function(e) {
    var element = this._manager.getElement();
    var r = element.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;

    var plot = this._manager.getChart().getPlot();
    plot.setNotify(false);
    var dataset = plot.getDataset();

    // if this is not extending a selection, then clear the existing selection
    if (!this._extendModifier.matchEvent(e)) {
        dataset.clearSelection("selection");
    }
    
    // iterate over all data items and
    var xAxis = plot.getXAxis();
    var yAxis = plot.getYAxis();
    var dataArea = plot.dataArea();
    for (var s = 0; s < dataset.seriesCount(); s++) {
        var seriesKey = dataset.seriesKey(s);
        for (var i = 0; i < dataset.itemCount(s); i++) {
            var item = dataset.item(s, i);
            var xx = xAxis.valueToCoordinate(item.x, dataArea.minX(), 
                    dataArea.maxX());
            var yy = yAxis.valueToCoordinate(item.y, dataArea.maxY(), 
                    dataArea.minY());
            
            if (this._rectangle.contains(xx, yy)) {   
                dataset.select("selection", seriesKey, dataset.itemKey(s, i));
            }
        }
    }   
    plot.setNotify(true);
    var ctx = this._manager.getContext();
    ctx.setHint("layer", "rectangle");
    ctx.clear();
    ctx.setHint("layer", "default");

    // finally we should remove this handler as the current live handler
    this._rectangle = null;
    this._manager._liveMouseHandler = null;
};