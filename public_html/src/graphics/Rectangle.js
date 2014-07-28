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
 * @class Represents a rectangle in 2D space.
 * 
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @param {!number} width  the width.
 * @param {!number} height  the height.
 * @constructor
 */
jsfc.Rectangle = function(x, y, width, height) {
    if (!(this instanceof jsfc.Rectangle)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.Args.requireNumber(x, "x");
    jsfc.Args.requireNumber(y, "y");
    jsfc.Args.requireNumber(width, "width");
    jsfc.Args.requireNumber(height, "height");
    
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
};

/**
 * Creates a new rectangle with the same coordinates and dimensions as the 
 * specified rectangle.
 * 
 * @param {jsfc.Rectangle} rect  the rectangle to copy.
 * 
 * @returns {!jsfc.Rectangle} The new rectangle.
 */
jsfc.Rectangle.copy = function(rect) {
    return new jsfc.Rectangle(rect.x(), rect.y(), rect.width(), 
            rect.height());
};

/**
 * Returns the x-coordinate.
 *
 * @returns {number}
 */
jsfc.Rectangle.prototype.x = function() {
    return this._x;
};
    
/**
 * Returns the y-coordinate.
 *
 * @returns {number}
 */
jsfc.Rectangle.prototype.y = function() {
    return this._y;
};
    
/**
 * Returns the width.
 *
 * @returns {number}
 */
jsfc.Rectangle.prototype.width = function() {
    return this._width;
};
    
/**
 * Returns the height.
 * 
 * @returns {number}
 */
jsfc.Rectangle.prototype.height = function() {
    return this._height;
};

/**
 * Returns the length of one side of the rectangle.
 * 
 * @param {!string} edge  the edge ("TOP", "LEFT", "BOTTOM" or "RIGHT").
 * 
 * @returns {number}
 */
jsfc.Rectangle.prototype.length = function(edge) {
    if (edge === jsfc.RectangleEdge.TOP 
            || edge === jsfc.RectangleEdge.BOTTOM) {
        return this._width;
    } else if (edge === jsfc.RectangleEdge.LEFT 
            || edge === jsfc.RectangleEdge.RIGHT) {
        return this._height;
    }
    throw new Error("Unrecognised 'edge' value: " + edge);
};
    
/**
 * Returns the x-coordinate for the center point of the rectangle.
 * 
 * @returns {number} The central x-coordinate.
 */
jsfc.Rectangle.prototype.centerX = function() {
    return this._x + (this._width / 2);
};

/**
 * Returns the minimum x-value for the rectangle.
 * 
 * @returns {number} The minimum x-value.
 */
jsfc.Rectangle.prototype.minX = function() {
    return Math.min(this._x, this._x + this._width);    
};
    
jsfc.Rectangle.prototype.maxX = function() {
    return Math.max(this._x, this._x + this._width);
};

/**
 * Returns the y-coordinate for the center point of the rectangle.
 * 
 * @returns {number} The central y-coordinate.
 */
jsfc.Rectangle.prototype.centerY = function() {
    return this._y + (this._height / 2);
};
    
jsfc.Rectangle.prototype.minY = function() {
    return Math.min(this._y, this._y + this._height);
};
    
jsfc.Rectangle.prototype.maxY = function() {
    return Math.max(this._y, this._y + this._height);
};
    
/**
 * Returns the bounds for this shape.
 * 
 * @returns {jsfc.Rectangle} The bounds.
 */
jsfc.Rectangle.prototype.bounds = function() {
    return new jsfc.Rectangle(this._x, this._y, this._width, this._height);
};

jsfc.Rectangle.prototype.set = function(x, y, w, h) {
    this._x = x;
    this._y = y;
    this._width = w;
    this._height = h;
    return this;
};
    
/**
 * Returns the closest point on or inside the rectangle to the specified 
 * point (x, y).
 * 
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @returns {!jsfc.Point2D} A new point.
 */
jsfc.Rectangle.prototype.constrainedPoint = function(x, y) {
    jsfc.Args.requireNumber(x, "x");
    jsfc.Args.requireNumber(y, "y");
    var xx = Math.max(this.minX(), Math.min(x, this.maxX()));
    var yy = Math.max(this.minY(), Math.min(y, this.maxY()));
    return new jsfc.Point2D(xx, yy);  
};

/**
 * Returns true if the specified point falls on or inside the rectangle,
 * and false otherwise.
 * 
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @returns {!boolean} A boolean.
 */
jsfc.Rectangle.prototype.contains = function(x, y) {
    return x >= this._x && x <= this._x + this._width 
            && y >= this._y && y <= this._y + this._height;
};

/**
 * Returns true if the specified rectangle 'r' is contained within the bounds 
 * of this rectangle.
 * 
 * @param {!jsfc.Rectangle} r  the rectangle.
 * @returns {!boolean} A boolean.
 */
jsfc.Rectangle.prototype.containsRect = function(r) {
    return this.contains(r.minX(), r.minY()) 
            && this.contains(r.maxX(), r.maxY());  
};