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
 * @classdesc A table element that displays a text string on a single line.
 * @implements jsfc.TableElement
 * 
 * @param {!string} textStr  the element text.
 * @returns {jsfc.TextElement}
 * @constructor
 */
jsfc.TextElement = function(textStr) {
    if (!(this instanceof jsfc.TextElement)) {
        throw new Error("Use 'new' for construction.");
    };
    jsfc.BaseElement.init(this); // inherit attributes from BaseElement
    this._text = textStr;
    this._font = new jsfc.Font("Palatino, serif", 16);
    this._color = new jsfc.Color(0, 0, 0);
    this._halign = jsfc.HAlign.LEFT;
    // the following field overrides the default from BaseElement
    this._backgroundPainter = new jsfc.StandardRectanglePainter(
            new jsfc.Color(255,255,255,0.3), new jsfc.Color(0,0,0,0));
};

// inherit from BaseElement (see also the init() call in the constructor)
jsfc.TextElement.prototype = new jsfc.BaseElement();
    
/**
 * Returns the text displayed by this element.
 * 
 * @returns {!string} The text.
 */
jsfc.TextElement.prototype.getText = function() {
    return this._text;
};

/**
 * Sets the text to be displayed by this element.
 * 
 * @param {!string} text  the text.
 * @returns {jsfc.TextElement}
 */
jsfc.TextElement.prototype.setText = function(text) {
    this._text = text;
    return this;
};

jsfc.TextElement.prototype.getFont = function() {
    return this._font;
};

jsfc.TextElement.prototype.setFont = function(font) {
    this._font = font;
    return this;
};

jsfc.TextElement.prototype.getColor = function() {
    return this._color;
};

jsfc.TextElement.prototype.setColor = function(color) {
    this._color = color;
    return this;
};

/**
 * Gets/sets the text to be displayed by this element.
 * 
 * @param {string} str  the string.
 * 
 * @returns {string|jsfc.TextElement}
 */
jsfc.TextElement.prototype.text = function(str) {
    throw new Error("Use get/setText()");
};

/**
 * Gets/sets the color for the text.
 * 
 * @param {string} str  the color string.
 * @returns {jsfc.Color|jsfc.TextElement}
 */
jsfc.TextElement.prototype.color = function(str) {
    throw new Error("Use get/setColor()");
};

/**
 * Gets/sets the font.
 * 
 * @param {jsfc.Font} font  the new font.
 * 
 * @returns {jsfc.Font|jsfc.TextElement}
 */
jsfc.TextElement.prototype.font = function(font) {
    throw new Error("Use get/setFont().");
};
    
/**
 * Gets/sets the horizontal alignment.
 * 
 * @param {number} align  the new alignment.
 * @returns {number|jsfc.TextElement}
 */
jsfc.TextElement.prototype.halign = function(align) {
    if (!arguments.length) {
        return this._halign;
    }
    this._halign = align;
    return this;
};

/**
 * Returns the preferred dimensions for this element.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} bounds  the drawing bounds.
 * 
 * @returns {jsfc.Dimension} The preferred dimensions for the text.
 */
jsfc.TextElement.prototype.preferredSize = function(ctx, bounds) {
    var insets = this.getInsets();
    ctx.setFont(this._font);
    var dim = ctx.textDim(this._text);
    return new jsfc.Dimension(insets.left() + dim.width() + insets.right(), 
            insets.top() + dim.height() + insets.bottom());
};
    
/**
 * Calculates the layout for the element subject to the specified bounds.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} bounds  the available space for the layout.
 * @returns {Array} An array containing a jsfc.Rectangle that is the location
 *     of the text element.
 */
jsfc.TextElement.prototype.layoutElements = function(ctx, bounds) {
    var insets = this.getInsets();
    ctx.setFont(this._font);
    var dim = ctx.textDim(this._text);
    var w = dim.width() + insets.left() + insets.right();
    var x = bounds.x();
    switch(this._halign) {
        case jsfc.HAlign.LEFT : 
            x = bounds.x();
            break;
        case jsfc.HAlign.CENTER :
            x = bounds.centerX() - w / 2;
            break;
        case jsfc.HAlign.RIGHT :
            x = bounds.maxX() - w;
            break;
    }
    var y = bounds.y();
    var h = Math.min(dim.height() + insets.top() + insets.bottom(), 
        bounds.height());
    return [new jsfc.Rectangle(x, y, w, h)];
};

/**
 * Draws the text element within the specified bounds by creating the 
 * required SVG text element and setting the attributes.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} bounds
 * @returns {undefined}
 */
jsfc.TextElement.prototype.draw = function(ctx, bounds) {
    var backgroundPainter = this.backgroundPainter();
    if (backgroundPainter) {
        backgroundPainter.paint(ctx, bounds);
    }
    var insets = this.getInsets();
    var pos = this.layoutElements(ctx, bounds)[0];

    ctx.setFillColor(this._color);
    ctx.setFont(this._font);
    var upper = pos.y() + insets.top();
    var lower = pos.maxY() - insets.bottom();
    var span = lower - upper; 
    var base = lower - 0.18 * span;
    ctx.drawString(this._text, pos.x() + insets.left(), base);
};