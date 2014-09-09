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
 * Creates a new color.
 * @class Represents a color with red, green, blue and alpha components.
 * Color instances are intended to be immutable so that they can be shared
 * (for example, the jsfc.Colors class contains some predefined colors) - do 
 * not modify existing instances.
 * 
 * @constructor
 * @param {number} red  the red component (0-255).
 * @param {number} green  the green component (0-255).
 * @param {number} blue  the blue component (0-255).
 * @param {number} [alpha]  the alpha component (0-255), defaults to 255.
 * 
 * @returns {undefined}
 */
jsfc.Color = function(red, green, blue, alpha) {
    if (!(this instanceof jsfc.Color)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.Args.requireInRange(red, "red", 0, 255);
    this._red = red;
    this._green = green;
    this._blue = blue;
    this._alpha = alpha === 0 ? 0 : alpha || 255;
};

/**
 * Returns the red component for the color.
 * @returns {number} The red component (in the range 0 to 255). 
 */
jsfc.Color.prototype.getRed = function() {
    return this._red;
};

/**
 * Returns the green component for the color.
 * @returns {number} The green component (in the range 0 to 255).
 */
jsfc.Color.prototype.getGreen = function() {
    return this._green;
};

/**
 * Returns the blue component for the color.
 * @returns {number} The blue component (in the range 0 to 255).
 */
jsfc.Color.prototype.getBlue = function() {
    return this._blue;
};

/**
 * Returns the alpha (transparency) component for the color.
 * @returns {number} The alpha component (in the range 0 to 255).
 */
jsfc.Color.prototype.getAlpha = function() {
    return this._alpha;
};

/**
 * Creates a new color instance from a string.
 * @param {!string} s  the string.
 * @returns {jsfc.Color|undefined}
 */
jsfc.Color.fromStr = function(s) {
    if (s.length === 4) {
        // #RGB
        var rr = s[1] + s[1];
        var gg = s[2] + s[2];
        var bb = s[3] + s[3];
        var r = parseInt(rr, 16);
        var g = parseInt(gg, 16);
        var b = parseInt(bb, 16);
        return new jsfc.Color(r, g, b);
    } 
    if (s.length === 7) {
        // #RRGGBB 
        var rr = s[1] + s[2];
        var gg = s[3] + s[4];
        var bb = s[5] + s[6];
        var r = parseInt(rr, 16);
        var g = parseInt(gg, 16);
        var b = parseInt(bb, 16);
        return new jsfc.Color(r, g, b);
    }
    return undefined;
};

/**
 * Returns a string in the form 'rgba(RGBA)' that represents this color.
 * 
 * @returns {!string}
 */
jsfc.Color.prototype.rgbaStr = function() {
    var alphaPercent = this._alpha / 255;
    return "rgba(" + this._red + "," + this._green + "," + this._blue
        + "," + alphaPercent.toFixed(2) + ")";    
};

/**
 * Returns a string in the form 'rgba(RGBA)' that represents this color.
 * 
 * @returns {!string}
 */
jsfc.Color.prototype.rgbStr = function() {
    return "rgb(" + this._red + "," + this._green + "," + this._blue + ")";    
};
