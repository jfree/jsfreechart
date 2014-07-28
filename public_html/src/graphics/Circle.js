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
 * Creates a new circle.
 * @constructor 
 * @implements {jsfc.Shape}
 * @param {number} x  the x-coordinate.
 * @param {number} y  the y-coordinate.
 * @param {number} radius  the radius.
 * @returns {jsfc.Circle}
 * 
 * @class Represents a circle shape.
 */
jsfc.Circle = function(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
};

/**
 * Returns the bounds for this shape.
 * 
 * @returns {jsfc.Rectangle} The bounds.
 */
jsfc.Circle.prototype.bounds = function() {
    return new jsfc.Rectangle(this.x - this.radius, this.y - this.radius, 
        this.radius * 2, this.radius * 2);
};