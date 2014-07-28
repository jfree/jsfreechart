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
 * @class A mouse handler that will pan charts.
 * 
 * @constructor
 * @param {!jsfc.ChartManager} manager  the ChartManager (provides access to 
 *         the chart).
 * @param {jsfc.Modifier} [modifier]  the modifier keys (determines when this
 *         handler will become "live").
 * @returns {undefined}
 */
jsfc.PanHandler = function(manager, modifier) {
    if (!(this instanceof jsfc.PanHandler)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.BaseMouseHandler.init(manager, modifier, this);
    this._lastPoint = null;
};

jsfc.PanHandler.prototype = new jsfc.BaseMouseHandler();

/**
 * Handles a mouse down event.  Here we record the initial coordinate that
 * will define the zoom rectangle.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.PanHandler.prototype.mouseDown = function(e) {
    var svg = this._manager.getElement();
    var r = svg.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    var dataArea = this._manager.getChart().plotArea();  // we actually need the data area
    this._lastPoint = dataArea.constrainedPoint(x, y);
};

// mouseMove
jsfc.PanHandler.prototype.mouseMove = function(e) {
    if (this._lastPoint === null) {
        return; 
    }
    var svg = this._manager.getElement();
    var r = svg.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    // compute the x-delta and y-delta
    var dx = x - this._lastPoint.x();
    var dy = y - this._lastPoint.y();
    
    if (dx !== 0 || dy !== 0) {
        this._lastPoint = new jsfc.Point2D(x, y);
        // then apply these changes to the axes
        var plot = this._manager.getChart().getPlot();
        var dataArea = plot.dataArea();
        var wpercent = -dx / dataArea.width();
        var hpercent = dy / dataArea.height();
        plot.panX(wpercent, false);
        plot.panY(hpercent);
    }
};
 
// mouseUp
jsfc.PanHandler.prototype.mouseUp = function(e) {
    this._lastPoint = null;
    this._manager._liveMouseHandler = null;
};

