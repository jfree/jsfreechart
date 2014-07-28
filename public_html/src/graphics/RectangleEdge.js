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

/**
 * An enumeration of the four edges of a rectangle (TOP, BOTTOM, LEFT and 
 * RIGHT).
 */
jsfc.RectangleEdge = {
    
    TOP: "TOP",
    
    BOTTOM: "BOTTOM",
    
    LEFT: "LEFT",
    
    RIGHT: "RIGHT"

};

/**
 * Returns true if the specified edge is TOP or BOTTOM, and false otherwise.
 * 
 * @param {!string} edge  the edge.
 * @returns {!boolean} A boolean.
 */
jsfc.RectangleEdge.isTopOrBottom = function(edge) {
    jsfc.Args.requireString(edge, "edge");
    if (edge === jsfc.RectangleEdge.TOP 
            || edge === jsfc.RectangleEdge.BOTTOM) {
        return true;
    }
    return false;
};

/**
 * Returns true if the specified edge is "LEFT" or "RIGHT", and false otherwise.
 * 
 * @param {!string} edge  the edge code.
 * @returns {!boolean} A boolean.
 */
jsfc.RectangleEdge.isLeftOrRight = function(edge) {
    jsfc.Args.requireString(edge, "edge");
    if (edge === jsfc.RectangleEdge.LEFT || edge === jsfc.RectangleEdge.RIGHT) {
        return true;
    }
    return false;
};

if (Object.freeze) {
    Object.freeze(jsfc.RectangleEdge);
}