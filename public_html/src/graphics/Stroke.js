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
 * Creates a new stroke instance with default attributes.
 * 
 * @classdesc A stroke represents the style used to draw a line or path.
 * 
 * @constructor 
 * @param {number} [lineWidth]  the line width (defaults to 1.0).
 * @returns {jsfc.Stroke} The new instance.
 */
jsfc.Stroke = function(lineWidth) {
    if (!(this instanceof jsfc.Stroke)) {
        throw new Error("Use 'new' for constructors.");
    }
    this.lineWidth = lineWidth || 1.0;
    this.lineCap = jsfc.LineCap.ROUND;
    this.lineJoin = jsfc.LineJoin.ROUND;
    this.miterLimit = 1.0;
    this.lineDash = [1.0];
    this.lineDashOffset = 0.0; 
};

jsfc.Stroke.prototype.setLineDash = function(dash) {
    this.lineDash = dash;
};

/**
 * Returns a string containing the SVG style string representing this stroke.
 * 
 * @returns {!string} The SVG style string.
 */
jsfc.Stroke.prototype.getStyleStr = function() {
    var s = "stroke-width: " + this.lineWidth + "; ";
    if (this.lineCap !== "butt") {
        s = s + "stroke-linecap: " + this.lineCap + "; ";
    }
    s = s + "stroke-linejoin: " + this.lineJoin + "; ";
    if (this.lineDash.length > 1) {
        s = s + "stroke-dasharray: " + "3, 3" + "; ";
    }
    return s;
};