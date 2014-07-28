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
 * Creates a new table element that displays a shape (for example,
 *     a rectangle).
 *     
 * @class A shape element.
 * 
 * @constructor 
 * @param {jsfc.Shape} shape
 * @param {jsfc.Color} color  a color.
 * @returns {undefined}
 */
jsfc.ShapeElement = function(shape, color) {
    jsfc.BaseElement.init(this); // inherit attributes from BaseElement
    this.shape = shape;
    this.color = color;
};

jsfc.ShapeElement.prototype = new jsfc.BaseElement();

/**
 * Returns the preferred size of this element.
 * 
 * @param {jsfc.SVGContext2D} ctx  the graphics target.
 * @param {jsfc.Rectangle} bounds  the bounds.
 * @param {Object} [constraints]  the layout constraints if any (can be null).
 * 
 * @returns {jsfc.Dimension} The preferred size for this element.
 */
jsfc.ShapeElement.prototype.preferredSize = function(ctx, bounds, constraints) {
    var shapeBounds = this.shape.bounds();
    var insets = this.getInsets();
    var w = Math.min(bounds.width, shapeBounds.width + insets.left + insets.right);
    var h = Math.min(bounds.height, shapeBounds.height + insets.top + insets.bottom);
    return new jsfc.Dimension(w, h);   
};

/**
 * Performs a layout and returns a list of bounding rectangles for the 
 * element and its children (this object has no children, so the returned 
 * array contains one element only).
 * 
 * @param {jsfc.SVGContext2D} ctx  the graphics target.
 * @param {jsfc.Rectangle} bounds  the drawing bounds.
 * @param {Object} [constraints]  optional constraints.
 * 
 * @returns {Array} An array containing the bounds for the shape (one element).
 */
jsfc.ShapeElement.prototype.layoutElements = function(ctx, bounds, constraints) {
    var dim = this.preferredSize(ctx, bounds, constraints);
    var pos = new jsfc.Rectangle(bounds.centerX() - dim.width() / 2.0,
                bounds.centerY() - dim.height() / 2.0, dim.width(), 
                dim.height());
    return [pos];
};

jsfc.ShapeElement.prototype.draw = function(ctx, bounds) {
    // fill the background
    // fill the shape
};