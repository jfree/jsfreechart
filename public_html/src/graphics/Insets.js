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
 * Creates a new object representing the insets for a rectangular 
 *         shape.
 *         
 * @classdesc The insets for a rectangular shape in 2D space.  Instances are
 *         immutable.
 * 
 * @constructor 
 * @param {!number} top  the insets for the top edge.
 * @param {!number} left  the insets for the left edge.
 * @param {!number} bottom  the insets for the bottom edge.
 * @param {!number} right  the insets for the right edge.
 * @returns {jsfc.Insets} The new instance.
 */
jsfc.Insets = function(top, left, bottom, right) {
    if (!(this instanceof jsfc.Insets)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.Args.requireNumber(top, "top");
    jsfc.Args.requireNumber(left, "left");
    jsfc.Args.requireNumber(bottom, "bottom");
    jsfc.Args.requireNumber(right, "right");
    this._top = top;
    this._left = left;
    this._bottom = bottom;
    this._right = right;
    Object.freeze(this);
};

/**
 * Returns the insets for the top edge.
 * @returns {!number} The top insets.
 */
jsfc.Insets.prototype.top = function() {
    return this._top;
};

/**
 * Returns the insets for the left edge.
 * @returns {!number} The left insets.
 */
jsfc.Insets.prototype.left = function() {
    return this._left;
};

/**
 * Returns the insets for the bottom edge.
 * @returns {!number} The bottom insets.
 */
jsfc.Insets.prototype.bottom = function() {
    return this._bottom;
};

/**
 * Returns the insets for the right edge.
 * @returns {!number} The right insets.
 */
jsfc.Insets.prototype.right = function() {
    return this._right;
};

/**
 * Returns the insets value for the specified edge (specified using the 
 * constants defined in jsfc.RectangleEdge).
 * 
 * @param {String} edge
 * @returns {!number} The insets value.
 */
jsfc.Insets.prototype.value = function(edge) {
    if (edge === jsfc.RectangleEdge.TOP) {
        return this._top;
    }
    if (edge === jsfc.RectangleEdge.BOTTOM) {
        return this._bottom;
    }
    if (edge === jsfc.RectangleEdge.LEFT) {
        return this._left;
    }
    if (edge === jsfc.RectangleEdge.RIGHT) {
        return this._right;
    }
    throw new Error("Unrecognised edge code: " + edge);
};
