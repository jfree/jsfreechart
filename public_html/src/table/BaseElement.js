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
 * A base object for a table element.
 * @param {jsfc.BaseElement} [instance]  the object where the element's 
 *         attributes will be stored (defaults to 'this').
 * @constructor 
 * @classdesc A base table element. 
 * @returns {jsfc.BaseElement} The new instance.
 */
jsfc.BaseElement = function(instance) {
    if (!(this instanceof jsfc.BaseElement)) {
        throw new Error("Use 'new' for construction.");
    }
    if (!instance) {
        instance = this;
    }
    jsfc.BaseElement.init(instance);
};

/**
 * Initialises the attributes requires by this base class, in the supplied
 * instance object.
 * 
 * @param {jsfc.BaseElement} instance  the instance.
 * @returns {undefined}
 */
jsfc.BaseElement.init = function(instance) {
    instance._insets = new jsfc.Insets(2, 2, 2, 2);
    instance._refPt = jsfc.RefPt2D.CENTER;
    instance._backgroundPainter = null;    
};

/**
 * Returns the insets.
 * 
 * @returns {jsfc.Insets} The insets.
 */
jsfc.BaseElement.prototype.getInsets = function() {
    return this._insets;
};

/**
 * Sets the insets.
 * 
 * @param {!jsfc.Insets} insets  the new insets.
 * @returns {undefined}
 */
jsfc.BaseElement.prototype.setInsets = function(insets) {
    this._insets = insets;
};

/**
 * Gets/sets the reference point for the element.
 * @param {number} [value]
 * @returns {number|jsfc.BaseElement}
 */
jsfc.BaseElement.prototype.refPt = function(value) {
    if (!arguments.length) {
        return this._refPt;
    }
    this._refPt = value;
    return this;
};

/**
 * Gets/sets the background painter.
 * 
 * @param {Object} [painter] the new painter (optional, if not specified the
 *     function returns the current painter).
 * @returns {Object|jsfc.BaseElement}
 */
jsfc.BaseElement.prototype.backgroundPainter = function(painter) {
    if (!arguments.length) {
        return this._backgroundPainter;
    }
    this._backgroundPainter = painter;
    return this;    
};

/**
 * Receives a visitor.
 * 
 * @param {!Function} visitor  the visitor function.
 * @returns {undefined}
 */
jsfc.BaseElement.prototype.receive = function(visitor) {
    // in the default case, call the visitor function just passing this element
    visitor(this);
};