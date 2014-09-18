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
 * An interaction handler that selects one of two sub-handlers depending on
 * whether the user clicks or drags the mouse.
 * 
 * @constructor
 * @implements {jsfc.MouseHandler}
 * @param {!jsfc.ChartManager} manager  the ChartManager (provides access to 
 *         the chart and dataset).
 * @param {jsfc.Modifier} [modifier]  the modifier keys (determines when this
 *         handler will become "live").
 */
jsfc.DualHandler = function(manager, modifier, clickHandler, dragHandler) {
    if (!(this instanceof jsfc.DualHandler)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.BaseMouseHandler.init(manager, modifier, this);
    this._clickHandler = clickHandler;
    this._dragHandler = dragHandler;
    this._startPoint = null;
    this._maxDistance = 0;
};

// extend BaseMouseHandler (see also the init call in the constructor)
jsfc.DualHandler.prototype = new jsfc.BaseMouseHandler();

/**
 * Handles a mouse down event - this handler simply records the location of
 * the mouse down event so that later, on mouse up, it can determine if the
 * event is a click or a drag (selection will only be applied for a click).
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.DualHandler.prototype.mouseDown = function(e) {
    var element = this._manager.getElement();
    var r = element.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    this._startPoint = new jsfc.Point2D(x, y);
    // both the subhandlers need to receive the event so they are initialised
    this._clickHandler.mouseDown(e);
    this._dragHandler.mouseDown(e);
};

/**
 * Handles mouse move events.
 * 
 * @param {type} e
 * @returns {undefined}
 */
jsfc.DualHandler.prototype.mouseMove = function(e) {
    if (this._startPoint === null) {
        return; 
    }
    var r = this._manager.getElement().getBoundingClientRect();
    var ex = e.clientX - r.left;
    var ey = e.clientY - r.top;
    var dist = this._startPoint.distance(ex, ey);
    this._maxDistance = Math.max(this._maxDistance, dist);
    if (this._maxDistance >= 2) {
        this._dragHandler.mouseMove(e);
    }
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
jsfc.DualHandler.prototype.mouseUp = function(e) {
    if (this._startPoint === null) {
        return;
    }
    // we need to determine if the mouse was dragged or just clicked
    // we consider it dragged if _maxDistance > 2 or the current distance
    // is > 2
    var element = this._manager.getElement();
    var r = element.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    var dist = this._startPoint.distance(x, y);
    if (this._maxDistance <= 2 && dist <= 2) {
        this._clickHandler.mouseUp(e);
    } else {
        this._dragHandler.mouseUp(e);
    }
    
    // final cleanup - this handler can be used as a live handler
    // or as an auxiliary, hence the check before resetting
    this._startPoint = null;
    this._maxDistance = 0;
    if (this.isLiveHandler()) {
        this._manager.resetLiveHandler();
    }
};