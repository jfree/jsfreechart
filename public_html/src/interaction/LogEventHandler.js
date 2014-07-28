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
 * @class A mouse handler that logs events to the console.  This is a 
 * temporary class used during development.
 * @constructor
 * @returns {undefined}
 */
jsfc.LogEventHandler = function() {
    if (!(this instanceof jsfc.LogEventHandler)) {
        throw new Error("Use 'new' for constructor.");
    }
    this.modifier = new jsfc.Modifier();
    this._log = false;
};

jsfc.LogEventHandler.prototype.mouseDown = function(e) {
    if (!this._log) {
        return;
    }
    console.log("DOWN: clientX = " + e.clientX + ", y = " + e.clientY);
    //console.log("mouseDown: " + e);
    //console.log("Current target: " + e.currentTarget + " id = " + e.currentTarget.id);
    //console.log("clientX = " + e.clientX + ", y = " + e.clientY);
    //console.log("target is : " + evt.target + " id = " + evt.target.id);
};

// mouseMove
jsfc.LogEventHandler.prototype.mouseMove = function(e) {
    if (!this._log) {
        return;
    }
    console.log("MOVE: clientX = " + e.clientX + ", y = " + e.clientY);
};

// mouseUp
jsfc.LogEventHandler.prototype.mouseUp = function(e) {
    if (!this._log) {
        return;
    }
    console.log("UP: clientX = " + e.clientX + ", y = " + e.clientY);
};

// mouseOver
jsfc.LogEventHandler.prototype.mouseOver = function(e) {
    if (!this._log) {
        return;
    }
    console.log("OVER: clientX = " + e.clientX + ", y = " + e.clientY);
};

// mouseOut
jsfc.LogEventHandler.prototype.mouseOut = function(e) {
    if (!this._log) {
        return;
    }
    console.log("OUT: clientX = " + e.clientX + ", y = " + e.clientY);
};

jsfc.LogEventHandler.prototype.mouseWheel = function(e) {
    if (!this._log) {
        return false;
    }
    console.log("WHEEL : " + e.wheelDelta);
    return false;
};
