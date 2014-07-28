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
 * Utility functions for 2D graphics.
 * 
 * @namespace
 */
jsfc.Utils2D = {};

/**
 * Returns the area of a triangle designated by the points a, b and c, 
 * multiplied by 2 if a, b and c appear in clockwise order, and -2 if they
 * appear in anticlockwise order.
 * 
 * @param {!jsfc.Point2D} a  point A.
 * @param {!jsfc.Point2D} b  point B.
 * @param {!jsfc.Point2D} c  point C.
 * @returns {!number}
 */
jsfc.Utils2D.area2 = function(a, b, c) {
    return (a.x() - c.x()) * (b.y() - c.y()) 
            - (a.y() - c.y()) * (b.x() - c.x());
};
