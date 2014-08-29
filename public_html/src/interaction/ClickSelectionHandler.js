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
 * A mouse handler that handles selection by mouse click.
 * 
 * @constructor
 * @implements {jsfc.MouseHandler}
 * @param {!jsfc.ChartManager} manager  the ChartManager (provides access to 
 *         the chart and dataset).
 * @param {jsfc.Modifier} [modifier]  the modifier keys (determines when this
 *         handler will become "live").
 */
jsfc.ClickSelectionHandler = function(manager, modifier) {
    if (!(this instanceof jsfc.ClickSelectionHandler)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.BaseMouseHandler.init(manager, modifier, this);
    this._extendModifier = new jsfc.Modifier(false, false, false, true);
    this._startPoint = null;
};

// extend BaseMouseHandler (see also the init call in the constructor)
jsfc.ClickSelectionHandler.prototype = new jsfc.BaseMouseHandler();

/**
 * Handles a mouse down event - this handler simply records the location of
 * the mouse down event so that later, on mouse up, it can determine if the
 * event is a click or a drag (selection will only be applied for a click).
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.ClickSelectionHandler.prototype.mouseDown = function(e) {
    var element = this._manager.getElement();
    var r = element.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    this._startPoint = new jsfc.Point2D(x, y);
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
jsfc.ClickSelectionHandler.prototype.mouseUp = function(e) {
    if (this._startPoint == null) {
        return;
    }
    var element = this._manager.getElement();
    var r = element.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    var dist = this._startPoint.distance(x, y);
    if (dist <= 2) {
        var dataset = this._manager.getChart().getPlot().getDataset();
        var t = e.target;
        if (t) {
            var ref = t.getAttribute("jfree:ref");
            if (ref) {
                var refObj = JSON.parse(ref);
                var seriesKey = refObj[0];
                var itemKey = refObj[1];
                var selected = dataset.isSelected("selection", seriesKey, 
                        itemKey);
                if (!this._extendModifier.matchEvent(e)) {
                    dataset.clearSelection("selection");
                }
                if (selected) {
                    dataset.unselect("selection", seriesKey, itemKey);
                } else {
                    dataset.select("selection", seriesKey, itemKey);
                }
            } else {
                if (!this._extendModifier.matchEvent(e)) {
                    dataset.clearSelection("selection");
                }           
            }
        }
    }
    
    // final cleanup - this handler can be used as a live handler
    // or as an auxiliary, hence the check before resetting
    this._startPoint = null;
    if (this.isLiveHandler()) {
        this._manager.resetLiveHandler();
    }
};