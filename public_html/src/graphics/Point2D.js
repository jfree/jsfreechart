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
 * @class Represents a point in two dimensional space.  Instances are immutable.
 * 
 * @constructor
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @returns {jsfc.Point2D}
 */
jsfc.Point2D = function(x, y) {
    if (!(this instanceof jsfc.Point2D)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.Args.requireNumber(x, "x");
    jsfc.Args.requireNumber(y, "y");
    this._x = x;
    this._y = y;
    Object.freeze(this);
};
    
/**
 * Returns the x-coordinate for this point.
 * 
 * @returns {number} The x-coordinate.
 */
jsfc.Point2D.prototype.x = function() {
    return this._x;
};
    
/**
 * Returns the y-coordinate for this point.
 * 
 * @returns {number} The y-coordinate.
 */
jsfc.Point2D.prototype.y = function() {
    return this._y;
};

/**
 * Returns the distance between this point and the point (x, y).
 * 
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @returns {!number} The distance.
 */
jsfc.Point2D.prototype.distance = function(x, y) {
    var dx = x - this._x;
    var dy = y - this._y;
    return Math.sqrt(dx * dx + dy * dy);
};
