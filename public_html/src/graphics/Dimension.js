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
 * Creates a new object representing the dimensions of a shape in 2D space.
 * Instances of this class are immutable.
 * 
 * @constructor 
 * @classdesc The dimensions of a shape in 2D space.  Instances are immutable.
 * @param {!number} w  the width.
 * @param {!number} h  the height.
 * @returns {jsfc.Dimension} The new instance.
 */
jsfc.Dimension = function(w, h) {
    if (!(this instanceof jsfc.Dimension)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.Args.requireNumber(w, "w");
    jsfc.Args.requireNumber(h, "h");
    this._width = w;
    this._height = h;
    Object.freeze(this);
};
    
/**
 * Returns the width that was set in the constructor.
 * 
 * @returns {!number} The width.
 */
jsfc.Dimension.prototype.width = function() {
    return this._width;
};
    
/**
 * Returns the height that was set in the constructor.
 * 
 * @returns {!number} The height.
 */
jsfc.Dimension.prototype.height = function() {
    return this._height;
};

/**
 * Returns a string representation of this object, primarily for debugging 
 * purposes.
 * 
 * @returns {String}
 */
jsfc.Dimension.prototype.toString = function() {
    return "[Dimension(" + this._width + ", " + this._height + ")]";  
};
