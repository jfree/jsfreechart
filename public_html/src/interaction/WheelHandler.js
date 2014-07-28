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
 * @constructor
 * @implements {jsfc.MouseHandler}
 * @param {!jsfc.ChartManager} manager  the ChartManager (provides access to 
 *         the chart).
 * @param {jsfc.Modifier} [modifier]  the modifier keys (determines when this
 *         handler will become "live").
 * @returns {undefined}
 * 
 * @class A mouse wheel handler that will zoom in and out on charts.
 */
jsfc.WheelHandler = function(manager, modifier) {
    if (!(this instanceof jsfc.WheelHandler)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.BaseMouseHandler.init(manager, modifier, this);
    this.manager = manager;
    this.modifier = modifier || new jsfc.Modifier(false, false, false, false);
};

// extend the BaseMouseHandler
jsfc.WheelHandler.prototype = new jsfc.BaseMouseHandler();

/**
 * Handles a mouse wheel event.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.WheelHandler.prototype.mouseWheel = function(e) {
    var delta;
    if (e.wheelDelta) {
        delta = (e.wheelDelta / 720) * -0.2 + 1;
    } else { // special case for FireFox
        delta = e.detail * 0.05 + 1;
    }
    var plot = this.manager.getChart().getPlot();
    // for a pie chart we should rotate the pie
    
    var zoomX = plot.isXZoomable();
    var zoomY = plot.isYZoomable();
    var svg = this.manager.getElement();
    if (zoomX) {
        plot.zoomXAboutAnchor(delta, 
                e.clientX - svg.getBoundingClientRect().left, !zoomY);
    }
    if (zoomY) {
        plot.zoomYAboutAnchor(delta, 
                e.clientY - svg.getBoundingClientRect().top);
    }
    if (zoomX || zoomY) {
        e.preventDefault();  
    }
};
