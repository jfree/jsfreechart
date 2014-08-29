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
 * Creates a new base mouse handler.
 * 
 * @class A base class that can used for creating mouse handlers.
 * @constructor
 * @implements {jsfc.MouseHandler}
 * @param {!jsfc.ChartManager} manager  the ChartManager (provides access to 
 *         the chart and dataset).
 * @param {jsfc.Modifier} [modifier] The modifier
 * @param {jsfc.BaseMouseHandler} [instance] The instance.
 * */
jsfc.BaseMouseHandler = function(manager, modifier, instance) {
    if (!(this instanceof jsfc.BaseMouseHandler)) {
        throw new Error("Use 'new' for constructor.");
    }
    if (!instance) {
        instance = this;
    }
    jsfc.BaseMouseHandler.init(manager, modifier, instance);
};

/**
 * Initialises an object (instance) to have the attributes provided by this 
 * base handler.  The chart manager is the link used to access the chart and
 * its dataset if required.  The modifier is a combination of modifier keys 
 * that is used to invoke the mouse handler (when there are multiple handlers
 * to choose from).
 * 
 * @param {!jsfc.ChartManager} manager  the chart manager.
 * @param {jsfc.Modifier} [modifier]  the modifier (if undefined, a default will 
 *     be created).
 * @param {!jsfc.BaseMouseHandler} [instance]  the instance.
 * @returns {undefined}
 */
jsfc.BaseMouseHandler.init = function(manager, modifier, instance) {
    instance._manager = manager;
    instance._modifier = modifier || new jsfc.Modifier();
};

/**
 * Returns the modifier object that was set in the constructor.
 * 
 * @returns {jsfc.Modifier} The modifier.
 */
jsfc.BaseMouseHandler.prototype.getModifier = function() {
    return this._modifier;
};

/**
 * Returns true if this handler is installed as the current live handler,
 * and false otherwise.
 * 
 * @returns {!boolean}
 */
jsfc.BaseMouseHandler.prototype.isLiveHandler = function() {
    return this === this._manager.getLiveHandler();
};

/**
 * Handles a mouse down event.  This default implementation does nothing, 
 * objects that extend this one can provide their own implementation.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.BaseMouseHandler.prototype.mouseDown = function(e) {
};

/**
 * Handles a mouse move event.  This default implementation does nothing, 
 * objects that extend this one can provide their own implementation.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.BaseMouseHandler.prototype.mouseMove = function(e) {
};

/**
 * Handles a mouse up event.  This default implementation does nothing, 
 * objects that extend this one can provide their own implementation.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.BaseMouseHandler.prototype.mouseUp = function(e) {
};

/**
 * Handles a mouse over event.  This default implementation does nothing, 
 * objects that extend this one can provide their own implementation.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.BaseMouseHandler.prototype.mouseOver = function(e) {
};

/**
 * Handles a mouse out event.  This default implementation does nothing, 
 * objects that extend this one can provide their own implementation.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.BaseMouseHandler.prototype.mouseOut = function(e) {
};

/**
 * Handles a mouse wheel event.  This default implementation does nothing, 
 * objects that extend this one can provide their own implementation.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.BaseMouseHandler.prototype.mouseWheel = function(e) {
};

/**
 * Perform any cleanup required before the handler is removed.
 * 
 * @returns {undefined}
 */
jsfc.BaseMouseHandler.prototype.cleanUp = function() {
};
