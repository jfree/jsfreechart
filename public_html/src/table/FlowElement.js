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
 * Creates a new instance.
 * 
 * @class A container element that lays out its children in a horizontal 
 * flow layout running from left to right (wrapping to a new line when 
 * necessary).
 * 
 * @constructor 
 * @implements {jsfc.TableElement}
 * @returns {jsfc.FlowElement}
 */
jsfc.FlowElement = function() {
    if (!(this instanceof jsfc.FlowElement)) {
        throw Error("Use 'new' for constructor.");
    }
    jsfc.BaseElement.init(this); // inherit attributes from BaseElement
    this._elements = [];
    this._halign = jsfc.HAlign.LEFT;
    this._hgap = 2;
};

jsfc.FlowElement.prototype = new jsfc.BaseElement();
    
/**
 * Gets/sets the horizontal alignment of the elements.
 * 
 * @param {number} align  the new alignment.
 * 
 * @returns {number|jsfc.FlowElement}
 */
jsfc.FlowElement.prototype.halign = function(align) {
    if (!arguments.length) {
        return this._halign;
    }
    this._halign = align;
    return this;
};

/**
 * Gets or sets the gap between items in the flowlayout (when no argument
 * is supplied, the function returns the current value). 
 * 
 * @param {number} [value]  the new value.
 * @returns {number|jsfc.FlowElement}
 */
jsfc.FlowElement.prototype.hgap = function(value) {
    if (!arguments.length) {
        return this._hgap;
    }
    this._hgap = value;
    return this;
};

/**
 * Adds an element to the flow layout.
 * 
 * @param {Object} element  the element.
 * @returns {undefined}
 */
jsfc.FlowElement.prototype.add = function(element) {
    this._elements.push(element);
    return this;
};
    
jsfc.FlowElement.prototype.receive = function(visitor) {
    this._elements.forEach(function(child) { child.receive(visitor); });    
};
    
/**
 * Returns the preferred dimensions for this element.
 * 
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} bounds  the drawing bounds.
 * 
 * @returns {jsfc.Dimension} The preferred dimensions for the text.
 */
jsfc.FlowElement.prototype.preferredSize = function(ctx, bounds) {
    // split the children into rows and measure the rows
    var insets = this.getInsets();
    var w = insets.left() + insets.right();
    var h = insets.top() + insets.bottom();
    var maxRowWidth = 0.0;
    var elementCount = this._elements.length;
    var i = 0;
    while (i < elementCount) {
        // get one row of elements...
        var elementsInRow = this._rowOfElements(i, ctx, bounds);
        var rowHeight = this._calcRowHeight(elementsInRow);
        var rowWidth = this._calcRowWidth(elementsInRow, this._hgap);
        maxRowWidth = Math.max(rowWidth, maxRowWidth);
        h += rowHeight;
        i = i + elementsInRow.length;
    }
    w += maxRowWidth;
    return new jsfc.Dimension(insets.left() + w + insets.right(), 
            insets.top() + h + insets.bottom());
};
    
/**
 * Returns a row of elements starting with the specified element and
 * respecting the width of the supplied bounds.
 * 
 * @param {number} first  the index of the first element to include.
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} bounds  the bounds.
 * 
 * @returns {Array}
 */
jsfc.FlowElement.prototype._rowOfElements = function(first, ctx, bounds) {
    var result = [];
    var index = first;
    var full = false;
    var insets = this.getInsets();
    var w = insets.left() + insets.right();
    while (index < this._elements.length && !full) {
        var element = this._elements[index];
        var dim = element.preferredSize(ctx, bounds);
        if (w + dim.width() < bounds.width() || index === first) {
            result.push({ "element": element, "dim": dim });
            w += dim.width() + this._hgap;
            index++;
        } else {
            full = true;
        }
    }
    return result;
};
    
jsfc.FlowElement.prototype._calcRowHeight = function(elements) {
    var height = 0.0;
    for (var i = 0; i < elements.length; i++) {
        height = Math.max(height, elements[i].dim.height());
    }    
    return height;
};
    
jsfc.FlowElement.prototype._calcRowWidth = function(elements) {
    var width = 0.0;
    var count = elements.length;
    for (var i = 0; i < elements.length; i++) {
        width += elements[i].dim.width();
    }
    if (count > 1) {
        width += (count - 1) * this._hgap;
    }
    return width;
};
    
jsfc.FlowElement.prototype.layoutElements = function(context, bounds) {
    var result = []; // a list of jsfc.Rectangle objects
    var i = 0;
    var insets = this.getInsets();
    var x = bounds.x() + insets.left();
    var y = bounds.y() + insets.top();
    while (i < this._elements.length) {
        var elementsInRow = this._rowOfElements(i, context, bounds);
        var h = this._calcRowHeight(elementsInRow);
        var w = this._calcRowWidth(elementsInRow);  
        if (this._halign === jsfc.HAlign.CENTER) {
            x = bounds.centerX() - (w / 2);
        } else if (this._halign === jsfc.HAlign.RIGHT) {
            x = bounds.maxX() - insets.right() - w;
        }
        for (var j = 0; j < elementsInRow.length; j++) {
            //Dimension2D dim = elementInfo.getDimension();
            var position = new jsfc.Rectangle(x, y, 
                elementsInRow[j].dim.width(), h);
            result.push(position);
            x += position.width() + this._hgap;
        }
        i = i + elementsInRow.length;
        x = bounds.x() + insets.left();
        y += h;        
    }
    return result;
};
    
jsfc.FlowElement.prototype.draw = function(context, bounds) {
    var dim = this.preferredSize(context, bounds);
    var fitter = new jsfc.Fit2D(new jsfc.Anchor2D(this.refPt()), 
        jsfc.Scale2D.NONE);
    var dest = fitter.fit(dim, bounds);
    var layoutInfo = this.layoutElements(context, dest);
    for (var i = 0; i < this._elements.length; i++) {
        var rect = layoutInfo[i];
        var element = this._elements[i];
        element.draw(context, rect);
    }
};
