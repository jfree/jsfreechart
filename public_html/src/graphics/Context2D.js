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
 * @interface
 */
jsfc.Context2D = function() {
};

/**
 * Returns the value of the rendering hint with the specified key.
 * @param {!string} key  the hint key.
 * @returns {*} The hint value.
 */
jsfc.Context2D.prototype.getHint = function(key) {
};

/**
 * Sets a rendering hint.
 * 
 * @param {!string} key  the hint key.
 * @param {*} value  the hint value.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.setHint = function(key, value) {    
};

/**
 * Clears all rendering hints.
 * 
 * @returns {undefined}
 */
jsfc.Context2D.prototype.clearHints = function() {
};

/**
 * Sets the line stroke.
 * 
 * @param {!jsfc.Stroke} stroke  the line stroke.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.setLineStroke = function(stroke) {
};

/**
 * Sets the line color.
 * 
 * @param {!jsfc.Color} color  the color.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.setLineColor = function(color) {
};

/**
 * Sets the fill color.
 * 
 * @param {!jsfc.Color} color  the fill color (null not permitted).
 * @returns {undefined}
 */
jsfc.Context2D.prototype.setFillColor = function(color) {
};

/**
 * Draws a line from (x0, y0) to (x1, y1) using the current line stroke and
 * color.
 * 
 * @param {!number} x0  the x-coordinate for the start point.
 * @param {!number} y0  the y-coordinate for the start point.
 * @param {!number} x1  the x-coordinate for the end point.
 * @param {!number} y1  the y-coordinate for the end point.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.drawLine = function(x0, y0, x1, y1) {
};

/**
 * Draws a rectangle with the current line stroke.
 * 
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @param {!number} w  the width.
 * @param {!number} h  the height.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.drawRect = function(x, y, w, h) {
};

/**
 * Fills a rectangle with the current color.
 * 
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @param {!number} width  the width.
 * @param {!number} height  the height.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.fillRect = function(x, y, width, height) {
};

/**
 * Draws a circle.
 * 
 * @param {!number} cx  the x-coordinate for the center point.
 * @param {!number} cy  the y-coordinate for the center point.
 * @param {!number} r  the radius.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.drawCircle = function(cx, cy, r) {
};

/**
 * Begins a new path.  The path can be defined using moveTo(), lineTo(), arc(),
 * arcTo() and closePath().  A defined path can be filled (see the fill()
 * method) or stroked (see the stroke() method).
 * 
 * @returns {undefined}
 */
jsfc.Context2D.prototype.beginPath = function() {
};

/**
 * Closes the current path.
 * 
 * @returns {undefined}
 */
jsfc.Context2D.prototype.closePath = function() {
};

/**
 * Moves to the point (x, y).
 * 
 * @param {!number} x  the x-coordinate of the destination point.
 * @param {!number} y  the y-coordinate of the destination point.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.moveTo = function(x, y) {
};

/**
 * Adds a line to the current path connecting the most recent point in the 
 * path to the destination point (x, y).
 * 
 * @param {!number} x  the x-coordinate of the destination point.
 * @param {!number} y  the y-coordinate of the destination point.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.lineTo = function(x, y) {
};

// FIXME: arc methods

/**
 * Fills the current path with the current fill color.
 * 
 * @returns {undefined}
 */
jsfc.Context2D.prototype.fill = function() {
};

/**
 * Draws an outline of the current path.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.stroke = function() {
};

/**
 * Returns the font.  The default value is jsfc.Font("serif", 12).
 *
 * @returns {jsfc.Font|!jsfc.Font}
 */
jsfc.Context2D.prototype.getFont = function() { 
};

/**
 * Sets the font used for text rendering.
 * 
 * @param {!jsfc.Font} font  the font.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.setFont = function(font) {
};

/**
 * Returns the dimensions of the specified text in the current font.
 * 
 * @param {!string} text  the text.
 * @returns {!jsfc.Dimension} The dimensions of the bounding rectangle for the 
 *     text.
 */
jsfc.Context2D.prototype.textDim = function(text) {  
};

/**
 * Draws a string in the current font with the left baseline aligned with the 
 * point (x, y).  The color of the text is determined by the current fill color.
 * 
 * @param {!string} text  the string.
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.drawString = function(text, x, y) {
};

/**
 * Draws a string anchored to a point (x, y).
 * 
 * @param {!string} text  the text.
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @param {!number} anchor  the anchor point (see jsfc.TextAnchor).
 * @returns {jsfc.Dimension} The dimensions of the string.
 */
jsfc.Context2D.prototype.drawAlignedString = function(text, x, y, anchor) {
};

/**
 * Draws the text.
 * 
 * @param {!string} text  the text.
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @param {number} [maxWidth] ignored for now.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.fillText = function(text, x, y, maxWidth) {
};

/**
 * Applies a translation.
 * 
 * @param {!number} dx  the translation along the x-axis.
 * @param {!number} dy  the translation along the y-axis.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.translate = function(dx, dy) {
};

/**
 * Applies a rotation about (0, 0).
 * @param {!number} radians  the rotation angle in radians.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.rotate = function(radians) {
};

/**
 * Begins a group with the specified class and (optional) clipping rectangle.
 * The caller is responsible for closing the group with a subsequent call to
 * endGroup().
 * 
 * @param {string} classStr  the class.
 *
 * @returns {undefined}
 */
jsfc.Context2D.prototype.beginGroup = function(classStr) {
};

/**
 * Ends a group that was previously started with a call to beginGroup().
 * @returns {undefined}
 */
jsfc.Context2D.prototype.endGroup = function() {
};

/**
 * Sets the clip.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.setClip = function(rect) {  
};

jsfc.Context2D.prototype.save = function() {  
};

jsfc.Context2D.prototype.restore = function() {
};
