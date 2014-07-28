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
 * @classdesc A base class for graphics context implementations.
 * @constructor
 * @param {jsfc.BaseContext2D} [instance] The instance object (optional).
 */
jsfc.BaseContext2D = function(instance) {
    if (!(this instanceof jsfc.BaseContext2D)) {
        throw new Error("Use 'new' for construction.");
    }
    if (!instance) {
        instance = this;
    }
    jsfc.BaseContext2D.init(instance);
};

/**
 * Initialises the attributes for an instance.
 * 
 * @param {!jsfc.BaseContext2D} instance  the instance.
 * @returns {undefined}
 */
jsfc.BaseContext2D.init = function(instance) {
    instance._hints = {};
    instance._lineColor = new jsfc.Color(255, 255, 255);
    instance._fillColor = new jsfc.Color(255, 0, 0);
    instance._font = new jsfc.Font("serif", 12);
};

/**
 * Returns the value of the rendering hint with the specified key.
 * @param {!string} key  the hint key.
 * @returns {*} The hint value.
 */
jsfc.BaseContext2D.prototype.getHint = function(key) {
    return this._hints[key];
};

/**
 * Sets a rendering hint.
 * 
 * @param {!string} key  the hint key.
 * @param {*} value  the hint value.
 * @returns {undefined}
 */
jsfc.BaseContext2D.prototype.setHint = function(key, value) {
    this._hints[key] = value;  
};

/**
 * Clears the rendering hints.
 * 
 * @returns {undefined}
 */
jsfc.BaseContext2D.prototype.clearHints = function() {
    this._hints = {};
};

/**
 * Sets the line stroke.
 * 
 * @param {!jsfc.Stroke} stroke  the line stroke.
 * @returns {undefined}
 */
jsfc.BaseContext2D.prototype.setLineStroke = function(stroke) {
    jsfc.Args.require(stroke, "stroke");
    this._stroke = stroke;  
};

/**
 * Sets the line color.
 * 
 * @param {!jsfc.Color} color  the color.
 * @returns {undefined}
 */
jsfc.BaseContext2D.prototype.setLineColor = function(color) {
    jsfc.Args.require(color, "color");
    this._lineColor = color;
};

/**
 * Sets the fill color.
 * 
 * @param {!jsfc.Color} color  the fill color (null not permitted).
 * @returns {undefined}
 */
jsfc.BaseContext2D.prototype.setFillColor = function(color) {
    jsfc.Args.require(color, "color");
    this._fillColor = color;
};

/**
 * Returns the font.  The default value is jsfc.Font("serif", 12).

 * @returns {jsfc.Font|!jsfc.Font}
 */
jsfc.BaseContext2D.prototype.getFont = function() {
    return this._font;    
};

/**
 * Sets the font used for text rendering.
 * 
 * @param {!jsfc.Font} font  the font.
 * @returns {undefined}
 */
jsfc.BaseContext2D.prototype.setFont = function(font) {
    this._font = font;
};

/**
 * Sets the clip.
 * @returns {undefined}
 */
jsfc.BaseContext2D.prototype.setClip = function(rect) {  
    // not currently supported
};

jsfc.BaseContext2D.prototype.save = function() {  
    // not currently supported
};

jsfc.BaseContext2D.prototype.restore = function() {  
    // not currently supported
};

