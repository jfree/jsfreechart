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
 * Creates a new object representing the insets for a rectangular shape.
 * 
 * @constructor 
 * @classdesc A record of the space reserved around a data area for drawing
 *     axes.  THis object has the same methods as jsfc.Insets but is mutable.
 *     
 * @param {number} top  the insets for the top edge.
 * @param {number} left  the insets for the left edge.
 * @param {number} bottom  the insets for the bottom edge.
 * @param {number} right  the insets for the right edge.
 * @returns {jsfc.Insets} The new instance.
 */
jsfc.AxisSpace = function(top, left, bottom, right) {
    if (!(this instanceof jsfc.AxisSpace)) {
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
};

/**
 * Returns the insets for the top edge.
 * @returns {number} The top insets.
 */
jsfc.AxisSpace.prototype.top = function() {
    return this._top;
};

/**
 * Returns the insets for the left edge.
 * @returns {number} The left insets.
 */
jsfc.AxisSpace.prototype.left = function() {
    return this._left;
};

/**
 * Returns the insets for the bottom edge.
 * @returns {number} The bottom insets.
 */
jsfc.AxisSpace.prototype.bottom = function() {
    return this._bottom;
};

/**
 * Returns the insets for the right edge.
 * @returns {number} The right insets.
 */
jsfc.AxisSpace.prototype.right = function() {
    return this._right;
};

/**
 * Extends the amount of space on the specified edge.
 * 
 * @param {!number} space  the amount of space to add.
 * @param {!string} edge  the edge to add to.
 * @returns {jsfc.AxisSpace} This object (for chaining method calls).
 */
jsfc.AxisSpace.prototype.extend = function(space, edge) {
    jsfc.Args.requireNumber(space, "space");
    if (edge === jsfc.RectangleEdge.TOP) {
        this._top += space;
    } else if (edge === jsfc.RectangleEdge.BOTTOM) {
        this._bottom += space;
    } else if (edge === jsfc.RectangleEdge.LEFT) {
        this._left += space;
    } else if (edge === jsfc.RectangleEdge.RIGHT) {
        this._right += space;
    } else {
        throw new Error("Unrecognised 'edge' code: " + edge);
    }
    return this;
};

/**
 * Returns a new rectangle computed from the 'source' rectangle by subtracting 
 * the reserved space from this object.
 * @param {!jsfc.Rectangle} source  the source rectangle.
 * @returns {!jsfc.Rectangle}
 */
jsfc.AxisSpace.prototype.innerRect = function(source) {
    var x = source.x() + this._left;
    var y = source.y() + this._top;
    var w = source.width() - this._left - this._right;
    var h = source.height() - this._top - this._bottom;
    return new jsfc.Rectangle(x, y, w, h);
};

