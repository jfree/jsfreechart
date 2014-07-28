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
 * Creates a new font instance.
 * 
 * @classdesc A font represents the font style used to draw text.
 * 
 * @constructor
 * @param {!string} family  the font family.
 * @param {!number} size  the size.
 * @param {boolean} [bold]  bold?
 * @param {boolean} [italic]  italic?
 * @returns {jsfc.Font} The new instance.
 */
jsfc.Font = function(family, size, bold, italic) {
    if (!(this instanceof jsfc.Font)) {
        throw new Error("Use 'new' for constructors.");
    }
    this.family = family;
    this.size = size;
    this.bold = bold || false;
    this.italic = italic || false;
};

/**
 * Returns a font style string derived from this font's settings.
 * 
 * @returns {string} The style string.
 */
jsfc.Font.prototype.styleStr = function() {
    var s = "font-family: " + this.family + "; ";
    s += "font-weight: " + (this.bold ? "bold" : "normal") + "; ";
    s += "font-style: " + (this.italic ? "italic" : "normal") + "; ";
    s += "font-size: " + this.size + "px";
    return s;
};

/**
 * Returns a font style string for use with an HTML5 Canvas context.
 * 
 * @returns {!string} The style string.
 */
jsfc.Font.prototype.canvasFontStr = function() {
    return this.size + "px " + this.family;
};