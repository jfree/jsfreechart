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
 * @class A table element that contains a rectangle (centered within the 
 * element).
 * @constructor
 * @param {number} width  the rectangle width.
 * @param {number} height  the rectangle height.
 * @returns {jsfc.RectangleElement}
 */
jsfc.RectangleElement = function(width, height) {
    if (!(this instanceof jsfc.RectangleElement)) {
        throw new Error("Use 'new' for construction.");
    }
    jsfc.BaseElement.init(this); // inherit attributes from BaseElement
    this._width = width;
    this._height = height;
    this._fillColor = new jsfc.Color(255, 255, 255);

    // the following field overrides the default from BaseElement
    this._backgroundPainter = new jsfc.StandardRectanglePainter(
            new jsfc.Color(255,255,255,0.3), new jsfc.Color(0,0,0,0));
};

jsfc.RectangleElement.prototype = new jsfc.BaseElement();

/**
 * Gets/sets the rectangle width.
 * 
 * @param {number} [value]  the new width.
 * @returns {number|jsfc.RectangleElement} 
 */
jsfc.RectangleElement.prototype.width = function(value) {
    if (!arguments.length) {
        return this._width;
    }
    this._width = value;
    return this;
};

/**
 * Gets/sets the rectangle height.
 * 
 * @param {number} [value]  the new height.
 * @returns {jsfc.RectangleElement|number}
 */
jsfc.RectangleElement.prototype.height = function(value) {
    if (!arguments.length) {
        return this._height;
    }
    this._height = value;
    return this;
};

jsfc.RectangleElement.prototype.getFillColor = function() {
    return this._fillColor;
};

jsfc.RectangleElement.prototype.setFillColor = function(color) {
    if (typeof color === "string") {
        throw new Error("needs to be a color");
    }
    this._fillColor = color;
    return this;
};

/**
 * Returns the preferred dimensions for this element, which is the 
 * size of the rectangle plus the insets.
 * 
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} bounds  the drawing bounds.
 * 
 * @returns {jsfc.Dimension} The preferred dimensions for the text.
 */
jsfc.RectangleElement.prototype.preferredSize = function(ctx, bounds) {
    var insets = this.getInsets();
    var w = insets.left() + this._width + insets.right();
    var h = insets.top() + this._height + insets.bottom();
    var bw = bounds.width();
    var bh = bounds.height();
    return new jsfc.Dimension(Math.min(w, bw), Math.min(h, bh));
};
    
/**
 * Performs a layout of the element.
 * 
 * @param {jsfc.Context2D} ctx  the SVG context.
 * @param {jsfc.Rectangle} bounds  the bounds.
 * @returns {Array}
 */
jsfc.RectangleElement.prototype.layoutElements = function(ctx, bounds) {
    var insets = this.getInsets();
    var w = Math.min(insets.left() + this._width + insets.right(), 
            bounds.width());
    var h = Math.min(insets.top() + this._height + insets.bottom(), 
            bounds.height());
    var pos = new jsfc.Rectangle(bounds.centerX() - w / 2, 
            bounds.centerY() - h / 2, w, h);
    return [pos];
};

/**
 * Draws the element.
 * 
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} bounds  the bounds.
 * @returns {undefined}
 */
jsfc.RectangleElement.prototype.draw = function(ctx, bounds) {
    var backgroundPainter = this.backgroundPainter();
    if (backgroundPainter) {
        backgroundPainter.paint(ctx, bounds);
    }
    // create a new rectangle element
    var insets = this.getInsets();
    var ww = Math.max(bounds.width() - insets.left() - insets.right(), 0);
    var hh = Math.max(bounds.height() - insets.top() - insets.bottom(), 0);
    var w = Math.min(this._width, ww);
    var h = Math.min(this._height, hh);
    ctx.setFillColor(this._fillColor);
    ctx.fillRect(bounds.centerX() - w / 2, bounds.centerY() - h / 2, w, h);
};
