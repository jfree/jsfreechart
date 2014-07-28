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
 * Creates a new object representing an offset in 2D space. Instances are 
 * immutable.
 * 
 * @constructor 
 * @classdesc An offset in 2D space.  Instances are immutable.
 * @param {number} dx  the x-offset.
 * @param {number} dy  the y-offset.
 * @returns {jsfc.Offset2D} The new instance.
 */
jsfc.Offset2D = function(dx, dy) {
    if (!(this instanceof jsfc.Offset2D)) {
        throw new Error("Use 'new' for constructors.");
    }
    jsfc.Args.requireNumber(dx, "dx");
    jsfc.Args.requireNumber(dy, "dy");
    this._dx = dx;
    this._dy = dy;
    Object.freeze(this);
};
    
/**
 * Returns the x-offset that was set in the constructor.
 * 
 * @returns {number} The width.
 */
jsfc.Offset2D.prototype.dx = function() {
    return this._dx;
};
    
/**
 * Returns the y-offset that was set in the constructor.
 * 
 * @returns {number} The y-offset.
 */
jsfc.Offset2D.prototype.dy = function() {
    return this._dy;
};
