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
 * @classdesc A table element is a rectangular element that is either a 
 *     container for other table elements, or has some visual representation.
 *     These elements can be composed into table-like structures in a general
 *     way (here they are used primarily to construct chart legends).
 *     
 * @interface
 */
jsfc.TableElement = function() {
};

/**
 * Returns the preferred dimensions for this element.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} bounds  the drawing bounds.
 * 
 * @returns {jsfc.Dimension} The preferred dimensions for the text.
 */
jsfc.TableElement.prototype.preferredSize = function(ctx, bounds) {
};
    
/**
 * Calculates the layout for the element subject to the specified bounds.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} bounds  the available space for the layout.
 * @returns {Array} An array containing a jsfc.Rectangle that is the location
 *     of the text element.
 */
jsfc.TableElement.prototype.layoutElements = function(ctx, bounds) {
};

/**
 * Draws the text element within the specified bounds by creating the 
 * required SVG text element and setting the attributes.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} bounds  the bounds.
 * @returns {undefined}
 */
jsfc.TableElement.prototype.draw = function(ctx, bounds) {
};

/**
 * Receives a table element visitor.
 * 
 * @param {!Function} visitor  the visitor (a function that receives a table 
 *         element as its only argument).
 * @returns {undefined}
 */
jsfc.TableElement.prototype.receive = function(visitor) {
};