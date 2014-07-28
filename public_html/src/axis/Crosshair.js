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
 * Creates a new crosshair with the specified value and default attributes.
 * 
 * @class Represents a crosshair for an axis.  It is intended that this object 
 * can be used in different contexts, but for the moment only the 
 * jsfc.CrosshairHandler object makes use of it.
 * 
 * @constructor
 * @returns {jsfc.Crosshair}
 */
jsfc.Crosshair = function(value) {
    if (!(this instanceof jsfc.Crosshair)) {
        throw new Error("Use 'new' with constructor.");
    }
    this._value = value;
    this._color = jsfc.Colors.BLUE;
    this._stroke = new jsfc.Stroke(0.5);
    this._label = null;  // if a string is provided, it will be displayed
    this._labelAnchor = jsfc.RefPt2D.TOP_RIGHT;
    this._labelFont = new jsfc.Font("sans-serif", 10);
    this._labelColor = jsfc.Colors.BLACK;
    this._labelMargin = new jsfc.Insets(4, 4, 4, 4);
    this._labelPadding = new jsfc.Insets(2, 2, 2, 2);
    this._labelBackground = new jsfc.StandardRectanglePainter(
            new jsfc.Color(255, 255, 100, 100));
};

/**
 * Returns the data value for the crosshair.
 * 
 * @returns {number}
 */
jsfc.Crosshair.prototype.getValue = function() {
    return this._value;
};

/**
 * Sets the data value for the crosshair.
 * 
 * @param {number} value  the new value.
 * @returns {undefined}
 */
jsfc.Crosshair.prototype.setValue = function(value) {
    this._value = value;
};

/**
 * Returns the color used to draw the crosshair.
 * 
 * @returns {jsfc.Color}
 */
jsfc.Crosshair.prototype.getColor = function() {
    return this._color;
};

/**
 * Sets the color used to draw the crosshair.
 * 
 * @param {!jsfc.Color} color  the new color.
 * @returns {undefined}
 */
jsfc.Crosshair.prototype.setColor = function(color) {
    this._color = color;
};

/**
 * Returns the stroke used to draw the crosshair.
 * 
 * @returns {!jsfc.Stroke} The stroke.
 */
jsfc.Crosshair.prototype.getStroke = function() {
    return this._stroke;
};

jsfc.Crosshair.prototype.setStroke = function(stroke) {
    this._stroke = stroke;
};

/**
 * Returns the label for the crosshair, if any.
 * 
 * @returns {string|null} The label.
 */
jsfc.Crosshair.prototype.getLabel = function() {
    return this._label;
};

/**
 * Sets the label for the crosshair.
 * 
 * @param {string|null} label  the new label (null permitted).
 * @returns {undefined}
 */
jsfc.Crosshair.prototype.setLabel = function(label) {
    this._label = label;
};

jsfc.Crosshair.prototype.getLabelAnchor = function() {
    return this._labelAnchor;
};

jsfc.Crosshair.prototype.setLabelAnchor = function(anchor) {
    this._labelAnchor = anchor;
};

jsfc.Crosshair.prototype.getLabelFont = function() {
    return this._labelFont;
};

jsfc.Crosshair.prototype.setLabelColor = function(color) {
    this._labelColor = color;
};

jsfc.Crosshair.prototype.getLabelMargin = function() {
    return this._labelMargin;
};

jsfc.Crosshair.prototype.setLabelMargin = function(margin) {
    this._labelMargin = margin;
};

jsfc.Crosshair.prototype.getLabelPadding = function() {
    return this._labelPadding;
};

jsfc.Crosshair.prototype.setLabelPadding = function(insets) {
    this._labelPadding = insets;
};

jsfc.Crosshair.prototype.getLabelBackground = function() {
    return this._labelBackground;
};

jsfc.Crosshair.prototype.setLabelBackground = function(insets) {
    this._labelBackground = insets;
};

/**
 * Draws the crosshair as a horizontal line within the specified data area.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!number} ycoord  the y-coordinate.
 * @param {!jsfc.Rectangle} dataArea  the data area.
 * @returns {undefined}
 */
jsfc.Crosshair.prototype.drawHorizontal = function(ctx, ycoord, dataArea) {
 
    ctx.setLineStroke(this._stroke);
    ctx.setLineColor(this._color);
    ctx.setHint("pointer-events", "none");
    ctx.drawLine(dataArea.minX(), ycoord, dataArea.maxX(), ycoord);
    ctx.setHint("pointer-events", null);
    
    if (this._label) {
        ctx.setFont(this._labelFont);
        var dim = ctx.textDim(this._label);
        var pad = this._labelPadding;
        var margin = this._labelMargin;
        var anchor = this._labelAnchor;
        var w = dim.width() + pad.left() + pad.right();
        var h = dim.height() + pad.top() + pad.bottom();

        var x = dataArea.centerX() - w / 2;
        if (jsfc.RefPt2D.isLeft(anchor)) {
            // add margin at left
            x = dataArea.minX() + margin.left();
        } else if (jsfc.RefPt2D.isRight(anchor)) {
            // subtract margin, padding and width
            x = dataArea.maxX() - margin.right() - w;
        }
        var y = ycoord - h / 2; 
        if (jsfc.RefPt2D.isTop(anchor)) {
            y -= margin.bottom() + h / 2; 
        } else if (jsfc.RefPt2D.isBottom(anchor)) {
            y += margin.top() + h / 2;
        }
        var r = new jsfc.Rectangle(x, y, w, h);

        // if the label area doesn't fit, flip to the other side of the line
        if (!dataArea.containsRect(r)) {
            var adj = h + margin.bottom() + margin.top();
            if (jsfc.RefPt2D.isTop(anchor)) {
                r = new jsfc.Rectangle(x, y + adj, w, h);
            } else if (jsfc.RefPt2D.isBottom(anchor)) {
                r = new jsfc.Rectangle(x, y - adj, w, h);
            }
        }
        if (this._labelBackground) {
            this._labelBackground.paint(ctx, r);
        }
        ctx.setFillColor(this._labelColor);
        ctx.drawAlignedString(this._label, r.x() + pad.left(), 
                r.y() + pad.top(), jsfc.TextAnchor.TOP_LEFT);
    }
};

/**
 * Draws the crosshair as a vertical line within the specified data area.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!number} xcoord  the x-coordinate.
 * @param {!jsfc.Rectangle} dataArea  the data area.
 * @returns {undefined}
 */
jsfc.Crosshair.prototype.drawVertical = function(ctx, xcoord, dataArea) {
    
    ctx.setLineStroke(this._stroke);
    ctx.setLineColor(this._color);
    ctx.setHint("pointer-events", "none");
    ctx.drawLine(xcoord, dataArea.minY(), xcoord, dataArea.maxY());
    ctx.setHint("pointer-events", null);
    
    if (this._label) {
        ctx.setFont(this._labelFont);
        var dim = ctx.textDim(this._label);
        var pad = this._labelPadding;
        var margin = this._labelMargin;
        var anchor = this._labelAnchor;
        var w = dim.width() + pad.left() + pad.right();
        var h = dim.height() + pad.top() + pad.bottom();
        
        var x = xcoord - w / 2;
        if (jsfc.RefPt2D.isLeft(anchor)) {
            x -= w / 2 + margin.right();
        } else if (jsfc.RefPt2D.isRight(anchor)) {
            x += w / 2 + margin.left();
        }
        var y = dataArea.centerY(); 
        if (jsfc.RefPt2D.isTop(anchor)) {
            y = dataArea.minY() + margin.top();
        } else if (jsfc.RefPt2D.isBottom(anchor)) {
            y = dataArea.maxY() - margin.bottom() - h;
        }
        var r = new jsfc.Rectangle(x, y, w, h);

        // if the label area doesn't fit, flip to the other side of the line
        if (!dataArea.containsRect(r)) {
            var adj = w + margin.left() + margin.right();
            if (jsfc.RefPt2D.isLeft(anchor)) {
                r = new jsfc.Rectangle(x + adj, y, w, h);
            } else if (jsfc.RefPt2D.isRight(anchor)) {
                r = new jsfc.Rectangle(x - adj, y, w, h);
            }
        }
        if (this._labelBackground) {
            this._labelBackground.paint(ctx, r);
        }
        ctx.setFillColor(this._labelColor);
        ctx.drawAlignedString(this._label, r.x() + pad.left(), 
                r.y() + pad.top(), jsfc.TextAnchor.TOP_LEFT);        
    }
};
