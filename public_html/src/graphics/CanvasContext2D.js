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
 * Creates a new graphics context that targets the HTML5 canvas element.
 * @constructor
 * @implements {jsfc.Context2D}
 * @param {Element} canvas
 * @returns {jsfc.CanvasContext2D}
 */
jsfc.CanvasContext2D = function(canvas) {
    if (!(this instanceof jsfc.CanvasContext2D)) {
        throw new Error("Use 'new' with constructor.");
    }
    jsfc.BaseContext2D.init(this);
    this._canvas = canvas;
    this._ctx = canvas.getContext("2d");
};

jsfc.CanvasContext2D.prototype = new jsfc.BaseContext2D();

jsfc.CanvasContext2D.prototype.clear = function() {
    var w = this._canvas.width;
    var h = this._canvas.height;
    //this._ctx.fillStyle = "#FFFFFF";
    this._ctx.clearRect(0, 0, w, h);
};

/**
 * Sets the fill color.
 * 
 * @param {!jsfc.Color} color  the fill color (null not permitted).
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.setFillColor = function(color) {
    jsfc.BaseContext2D.prototype.setFillColor.call(this, color);
    this._ctx.fillStyle = color.rgbaStr();
};

/**
 * Sets the line color.
 * 
 * @param {!jsfc.Color} color  the line color.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.setLineColor = function(color) {
    jsfc.BaseContext2D.prototype.setLineColor.call(this, color);
    this._ctx.lineStyle = color.rgbaStr();
};

/**
 * Sets the line stroke.
 * 
 * @param {!jsfc.Stroke} stroke  the line stroke.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.setLineStroke = function(stroke) {
    jsfc.BaseContext2D.prototype.setLineStroke.call(this, stroke);
    this._ctx.lineWidth = stroke.lineWidth;  
    this._ctx.lineCap = stroke.lineCap;
    this._ctx.lineJoin = stroke.lineJoin;
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
jsfc.CanvasContext2D.prototype.drawLine = function(x0, y0, x1, y1) {
    this._ctx.beginPath();
    this._ctx.moveTo(x0, y0);
    this._ctx.lineTo(x1, y1);
    this._ctx.stroke();
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
jsfc.CanvasContext2D.prototype.drawRect = function(x, y, w, h) {
    this._ctx.fillRect(x, y, w, h);
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
jsfc.CanvasContext2D.prototype.fillRect = function(x, y, width, height) {
    this._ctx.fillRect(x, y, width, height);
};

/**
 * Draws a circle.
 * 
 * @param {!number} cx  the x-coordinate for the center point.
 * @param {!number} cy  the y-coordinate for the center point.
 * @param {!number} r  the radius.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.drawCircle = function(cx, cy, r) {
    this._ctx.beginPath();
    this._ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this._ctx.fill();
    this._ctx.stroke();
};

/**
 * Begins a new path.  The path can be defined using moveTo(), lineTo(), arc(),
 * arcTo() and closePath().  A defined path can be filled (see the fill()
 * method) or stroked (see the stroke() method).
 * 
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.beginPath = function() {
    this._ctx.beginPath();
};

/**
 * Closes the current path.
 * 
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.closePath = function() {
    this._ctx.closePath();
};

/**
 * Moves to the point (x, y).
 * 
 * @param {!number} x  the x-coordinate of the destination point.
 * @param {!number} y  the y-coordinate of the destination point.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.moveTo = function(x, y) {
    this._ctx.moveTo(x, y);
};

/**
 * Adds a line to the current path connecting the most recent point in the 
 * path to the destination point (x, y).
 * 
 * @param {!number} x  the x-coordinate of the destination point.
 * @param {!number} y  the y-coordinate of the destination point.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.lineTo = function(x, y) {
    this._ctx.lineTo(x, y);
};

// FIXME: arc methods

/**
 * Fills the current path with the current fill color.
 * 
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.fill = function() {
    this._ctx.fill();
};

/**
 * Draws an outline of the current path.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.stroke = function() {
    this._ctx.stroke();
};

/**
 * Sets the font used for text rendering.
 * 
 * @param {!jsfc.Font} font  the font.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.setFont = function(font) {
    this._font = font;
    this._ctx.font = font.canvasFontStr();
};

/**
 * Returns the dimensions of the specified text in the current font.
 * 
 * @param {!string} text  the text.
 * @returns {!jsfc.Dimension} The dimensions of the bounding rectangle for the 
 *     text.
 */
jsfc.CanvasContext2D.prototype.textDim = function(text) {
    var w = this._ctx.measureText(text).width;
    return new jsfc.Dimension(w, this._font.size); 
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
jsfc.CanvasContext2D.prototype.drawString = function(text, x, y) {
    this._ctx.fillText(text, x, y);
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
jsfc.CanvasContext2D.prototype.drawAlignedString = function(text, x, y, anchor) {
    var dim = this.textDim(text);
    var xadj = 0;
    var yadj = this._font.size;
    if (jsfc.TextAnchor.isHorizontalCenter(anchor)) {
        xadj = -dim.width() / 2;
    } else if (jsfc.TextAnchor.isRight(anchor)) {
        xadj = -dim.width();
    }
    if (jsfc.TextAnchor.isBottom(anchor)) {
        yadj = 0;
    } else if (jsfc.TextAnchor.isHalfHeight(anchor)) {
        yadj = this._font.size / 2;
    }
    this._ctx.fillText(text, x + xadj, y + yadj);
    return dim;
};

/**
 * Draws a string at (x, y) rotated by 'angle' radians.
 * 
 * @param {!string} text  the text to draw (null not permitted).
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @param {!number} anchor  the text anchor point (null not permitted).
 * @param {!number} angle  the rotation angle (in radians).
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.drawRotatedString = function(text, x, y, anchor, 
        angle) {
    this.translate(x, y);
    this.rotate(angle);
    this.drawAlignedString(text, 0, 0, anchor);
    this.rotate(-angle);
    this.translate(-x, -y);
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
jsfc.CanvasContext2D.prototype.fillText = function(text, x, y, maxWidth) {
    this._ctx.fillText(text, x, y);
};


jsfc.CanvasContext2D.prototype.beginGroup = function(classStr) {
    
};

jsfc.CanvasContext2D.prototype.endGroup = function() {
    
};

/**
 * Applies a translation.
 * 
 * @param {!number} dx  the translation along the x-axis.
 * @param {!number} dy  the translation along the y-axis.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.translate = function(dx, dy) {
    this._ctx.translate(dx, dy);
};

/**
 * Applies a rotation about (0, 0).
 * @param {!number} radians  the rotation angle in radians.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.rotate = function(radians) {
    this._ctx.rotate(radians);
};

/**
 * Sets the clip.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.setClip = function(rect) {  
    this._ctx.beginPath();
    this._ctx.rect(rect.x(), rect.y(), rect.width(), rect.height());
    this._ctx.clip();
};

jsfc.CanvasContext2D.prototype.save = function() {  
    this._ctx.save();
};

jsfc.CanvasContext2D.prototype.restore = function() {  
    this._ctx.restore();
};