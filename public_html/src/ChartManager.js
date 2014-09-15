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
 * Creates a chart manager to handle the interaction on the specified chart.
 * Some standard interaction handlers can be installed by default, you can
 * skip these by passing false for the relevant flags.  You can also register 
 * handlers individually if you want more control over the modifier keys or 
 * want to use more complex handlers (for example, the PolygonSelectionHandler).
 * 
 * @constructor 
 * @param {Element} element
 * @param {!jsfc.Chart} chart
 * @param {boolean} [dragZoomEnabled] enable zooming by mouse-dragging a 
 *     zoom rectangle (no modifier key).
 * @param {boolean} [wheelZoomEnabled]  enable mouse wheel zooming.
 * @param {boolean} [panEnabled]  enable panning by dragging the mouse while
 *     holding down the ALT key.
 * @returns {undefined}
 * 
 * @class A chart manager handles user interaction with a chart that is 
 *     rendered in the browser.
 */
jsfc.ChartManager = function(element, chart, dragZoomEnabled, 
        wheelZoomEnabled, panEnabled) {
    if (!(this instanceof jsfc.ChartManager)) {
        throw new Error("Use 'new' for constructor.");
    }
    this._element = element; // this will be a canvas or SVG element
    this._chart = chart;
    var t = element.constructor.name;
    if (element.nodeName === "CANVAS") {
        this._ctx = new jsfc.CanvasContext2D(element);
    } else {
        this._ctx = new jsfc.SVGContext2D(element);
    }
    var chartListener = function(c) {
        var manager = c;
        return function(chart) {
            manager.refreshDisplay();
        };
    }(this);
    chart.addListener(chartListener);
 
    this._liveMouseHandler = null;
    this._availableLiveMouseHandlers = [];
    if (dragZoomEnabled !== false) {
        var zoomModifier = new jsfc.Modifier(false, false, false, false);
        var zoomHandler = new jsfc.ZoomHandler(this, zoomModifier);
        this._availableLiveMouseHandlers.push(zoomHandler);
    }
    if (panEnabled !== false) {
        var panModifier = new jsfc.Modifier(true, false, false, false);
        var panHandler = new jsfc.PanHandler(this, panModifier);
        this._availableLiveMouseHandlers.push(panHandler);
    }
    this._auxiliaryMouseHandlers = [];
    if (wheelZoomEnabled !== false) {
        this._auxiliaryMouseHandlers.push(new jsfc.WheelHandler(this));
    }
    
    this.installMouseDownHandler(this._element);
    this.installMouseMoveHandler(this._element);
    this.installMouseUpHandler(this._element);
    this.installMouseOverHandler(this._element);
    this.installMouseOutHandler(this._element);
    this.installMouseWheelHandler(this._element);
};

/**
 * Returns the chart that is managed by this chart manager.
 * 
 * @returns {jsfc.Chart} The chart.
 */
jsfc.ChartManager.prototype.getChart = function() {
    return this._chart;
};

/**
 * Returns the element into which the chart will be drawn.
 * 
 * @returns {Element}
 */
jsfc.ChartManager.prototype.getElement = function() {
    return this._element;
};

jsfc.ChartManager.prototype.getContext = function() {
    return this._ctx;
};

/**
 * Returns the current live handler (may be null).
 * 
 * @returns {jsfc.MouseHandler}
 */
jsfc.ChartManager.prototype.getLiveHandler = function() {
    return this._liveMouseHandler;    
}

/**
 * Adds a handler to the list of available live handlers.  Exactly ONE of the
 * live handlers will be selected (on the basis of modifier keys) to handle
 * a user interaction with the chart.
 * 
 * @param {!jsfc.MouseHandler} handler  the handler.
 * @returns {undefined}
 */
jsfc.ChartManager.prototype.addLiveHandler = function(handler) {
    this._availableLiveMouseHandlers.push(handler); 
};

/**
 * Removes a handler from the list of available live handlers.
 * 
 * @param {!jsfc.MouseHandler} handler  the handler.
 * @returns {undefined}
 */
jsfc.ChartManager.prototype.removeLiveHandler = function(handler) {
    var i = jsfc.Utils.findItemInArray(handler, this._availableLiveMouseHandlers);
    if (i !== -1) {
        this._availableLiveMouseHandlers.splice(i, 1);
    }
};

/**
 * Resets the current live handler.  
 * @returns {undefined}
 */
jsfc.ChartManager.prototype.resetLiveHandler = function() {
    this._liveMouseHandler.cleanUp();
    this._liveMouseHandler = null;
}

/**
 * Adds an auxiliary mouse handler.  All auxiliary handlers will receive 
 * interaction events so when you add multiple handlers you need to ensure that
 * their behaviour does not conflict.
 * 
 * @param {jsfc.MouseHandler} handler  the new handler.
 * @returns {undefined}
 */
jsfc.ChartManager.prototype.addAuxiliaryHandler = function(handler) {
    this._auxiliaryMouseHandlers.push(handler);
};

/**
 * Removes an auxiliary handler.
 * 
 * @param {jsfc.MouseHandler} handler  the handler to be removed.
 * @returns {undefined}
 */
jsfc.ChartManager.prototype.removeAuxiliaryHandler = function(handler) {
    // find the handler (ensure it exists)
    var i = jsfc.Utils.findItemInArray(handler, this._auxiliaryMouseHandlers);
    if (i !== -1) {
        handler.cleanUp();
        this._auxiliaryMouseHandlers.splice(i, 1);
    }
};

/**
 * Refreshes the display by redrawing the chart.
 * 
 * @returns {undefined}
 */
jsfc.ChartManager.prototype.refreshDisplay = function() {
    var size = this._chart.getSize();
    var bounds = new jsfc.Rectangle(0, 0, size.width(), size.height());
    this._ctx.setHint("size", size);
    this._ctx.clear();
    this._chart.draw(this._ctx, bounds);
};

/**
 * Returns a handler from the available live handlers list with modifiers 
 * matching those specified.
 * 
 * @param {!boolean} alt  ALT key?
 * @param {!boolean} ctrl  CTRL key?
 * @param {!boolean} meta  META key?
 * @param {!boolean} shift  SHIFT key?
 * @returns {jsfc.MouseHandler}
 */
jsfc.ChartManager.prototype._matchLiveHandler = function(alt, ctrl, meta, 
        shift) {
    var handlers = this._availableLiveMouseHandlers;
    for (var i = 0; i < handlers.length; i++) {
        var h = handlers[i];
        if (h.getModifier().match(alt, ctrl, meta, shift)) {
            return h;
        }
    }
    return null;
};

jsfc.ChartManager.prototype.installMouseDownHandler = function(element) {
    var my = this;
    element.onmousedown = function(event) {
        if (my._liveMouseHandler !== null) {
            my._liveMouseHandler.mouseDown(event);
        } else {
            // choose one of the available mouse handlers to be "live"
            var h = my._matchLiveHandler(event.altKey, event.ctrlKey, event.metaKey, event.shiftKey);
            if (h) {
                my._liveMouseHandler = h;
                my._liveMouseHandler.mouseDown(event);
            }
        }
    
        // pass the event to the auxiliary mouse handlers
        my._auxiliaryMouseHandlers.forEach(function(h) {
            h.mouseDown(event);
        }); 
        event.preventDefault();
    };
};

jsfc.ChartManager.prototype.installMouseMoveHandler = function(element) {
    var my = this;
    element.onmousemove = function(event) {
        if (my._liveMouseHandler !== null) {
            my._liveMouseHandler.mouseMove(event);
        } else {
        
        }
    
        // pass the event to the auxiliary mouse handlers
        my._auxiliaryMouseHandlers.forEach(function(h) {
            h.mouseMove(event);
        });
        event.stopPropagation();
        return false;
    };
};

jsfc.ChartManager.prototype.installMouseUpHandler = function(element) {
    var my = this;
    element.onmouseup = function(event) {
        if (my._liveMouseHandler !== null) {
            my._liveMouseHandler.mouseUp(event);
        } else {
        
        }
    
        // pass the event to the auxiliary mouse handlers
        my._auxiliaryMouseHandlers.forEach(function(h) {
            h.mouseUp(event);
        }); 
    };
};

jsfc.ChartManager.prototype.installMouseOverHandler = function(element) {
    var my = this;
    element.onmouseover = function(event) {
        if (my._liveMouseHandler !== null) {
            my._liveMouseHandler.mouseOver(event);
        } else {
        
        }
    
        // pass the event to the auxiliary mouse handlers
        my._auxiliaryMouseHandlers.forEach(function(h) {
            h.mouseOver(event);
        }); 
    };
};

jsfc.ChartManager.prototype.installMouseOutHandler = function(element) {
    var my = this;
    element.onmouseout = function(event) {
        if (my._liveMouseHandler !== null) {
            my._liveMouseHandler.mouseOut(event);
        } else {
        
        }
    
        // pass the event to the auxiliary mouse handlers
        my._auxiliaryMouseHandlers.forEach(function(h) {
            h.mouseOut(event);
        }); 
    };
};

/**
 * Register to receive mouse wheel events and pass these on to the handlers.
 * 
 * @param {Element} element
 * @returns {undefined}
 */
jsfc.ChartManager.prototype.installMouseWheelHandler = function(element) {
    var my = this;
    var linkFunction = function(event) {
        var propogate = true;
        if (my._liveMouseHandler !== null) {
            propogate = my._liveMouseHandler.mouseWheel(event);
        } else {
        
        }
    
        // pass the event to the auxiliary mouse handlers
        my._auxiliaryMouseHandlers.forEach(function(h) {
            propogate = h.mouseWheel(event) && propogate;
        });
        return propogate;
    };
    var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) 
        ? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
    element.addEventListener(mousewheelevt, linkFunction, false);
};
