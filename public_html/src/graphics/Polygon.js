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
 * Creates a new instance, initially with no vertices.
 * @class Represents a polygon in two dimensional space.  Note that this
 * object doesn't actually represent a polygon until at least three points
 * have been added.
 * 
 * @constructor
 * @returns {jsfc.Polygon}
 */
jsfc.Polygon = function() {
    if (!(this instanceof jsfc.Polygon)) {
        throw new Error("Use 'new' for constructor.");
    }
    this._vertices = [];
};

/**
 * Adds a vertex to the polygon.
 * @param {!jsfc.Point2D} pt  the new point.
 * @returns This polygon for method call chaining.
 */
jsfc.Polygon.prototype.add = function(pt) {
    this._vertices.push(pt);
    return this;
};

/**
 * Returns the number of vertices that have been added to the polygon.
 * 
 * @returns {!number} The vertex count.
 */
jsfc.Polygon.prototype.getVertexCount = function() {
    return this._vertices.length;
};

/**
 * Returns the vertex with the specified index. 
 * 
 * @param {!number} index  the index.
 * @returns {jsfc.Point2D} The vertex.
 */
jsfc.Polygon.prototype.getVertex = function(index) {
    return this._vertices[index];
};

/**
 * Returns the first vertex for the polygon (this is a convenience method).
 * 
 * @returns {jsfc.Point2D}
 */
jsfc.Polygon.prototype.getFirstVertex = function() {
    if (this._vertices.length > 0) {
        return this._vertices[0];
    }
    return null;
};

/**
 * Returns the last vertex for the polygon (this is a convenience method).
 * 
 * @returns {jsfc.Point2D}
 */
jsfc.Polygon.prototype.getLastVertex = function() {
    var c = this._vertices.length;
    if (c > 0) {
        return this._vertices[c - 1];
    }
    return null;
};

/**
 * Returns true if the polygon contains the specified point, and false
 * otherwise.
 * 
 * @param {!jsfc.Point2D} p  the point.
 * @returns {!boolean} A boolean.
 */
jsfc.Polygon.prototype.contains = function(p) {
    var n = this.getVertexCount();
    var j = n - 1;
    var y = p.y();
    var result = false;
    for (var i = 0; i < n; i++) {
        var pi = this._vertices[i];
        var pj = this._vertices[j];
        if ((pj.y() <= y && y < pi.y() && jsfc.Utils2D.area2(pj, pi, p) > 0)
                || (pi.y() <= y && y < pj.y() && jsfc.Utils2D.area2(pi, pj, p) > 0)) {
            result = !result;
        };
        j = i;
    }
    return result;
};