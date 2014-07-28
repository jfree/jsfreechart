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
 * @class A table element that is a grid of sub-elements.
 * 
 * @constructor
 * @implements {jsfc.TableElement}
 */
jsfc.GridElement = function() {
    if (!(this instanceof jsfc.GridElement)) {
        throw new Error("Use 'new' for construction.");
    }    
    jsfc.BaseElement.init(this); // inherit attributes from BaseElement
    this._elements = new jsfc.KeyedValues2DDataset();
};
 
// inherit from BaseElement (see also the init() call in the constructor)
jsfc.GridElement.prototype = new jsfc.BaseElement();
    
/**
 * Adds an element to the grid (or, if the keys are already defined, 
 * replaces an existing element).
 * 
 * @param {jsfc.TableElement} element  the table element to add.
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @returns {jsfc.GridElement} This object (for chaining method calls).
 */
jsfc.GridElement.prototype.add = function(element, rowKey, columnKey) {
    this._elements.add(rowKey, columnKey, element);
    return this;
};

// private method
jsfc.GridElement.prototype._findCellDims = function(context, bounds) {
    var widths = jsfc.Utils.makeArrayOf(0, this._elements.columnCount());
    var heights = jsfc.Utils.makeArrayOf(0, this._elements.rowCount());
    for (var r = 0; r < this._elements.rowCount(); r++) {
        for (var c = 0; c < this._elements.columnCount(); c++) {
            var element = this._elements.valueByIndex(r, c);
            if (!element) {
                continue;
            }
            var dim = element.preferredSize(context, bounds);
            widths[c] = Math.max(widths[c], dim.width());
            heights[r] = Math.max(heights[r], dim.height());
        }
    }
    return { "widths": widths, "heights": heights };
};
    
/**
 * Returns the preferred dimensions for this element.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} bounds  the drawing bounds.
 * 
 * @returns {jsfc.Dimension} The preferred dimensions for the text.
 */
jsfc.GridElement.prototype.preferredSize = function(ctx, bounds) {
    var me = this;
    var insets = this.getInsets();
    var cellDims = this._findCellDims(ctx, bounds);
    var w = insets.left() + insets.right();
    for (var i = 0; i < cellDims.widths.length; i++) {
        w = w + cellDims.widths[i];
    }
    var h = insets.top() + insets.bottom();
    for (var i = 0; i < cellDims.heights.length; i++) {
        h = h + cellDims.heights[i];
    }
    return new jsfc.Dimension(w, h);
};
    
/**
 * Performs a layout of the grid, returning an array with the positions of
 * the elements in the grid.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} bounds  the area available for drawing the grid.
 * 
 * @returns {Array}
 */
jsfc.GridElement.prototype.layoutElements = function(ctx, bounds) {
    var insets = this.getInsets();        
    var cellDims = this._findCellDims(ctx, bounds);
    var positions = [];
    var y = bounds.y() + insets.top();
    for (var r = 0; r < this._elements.rowCount(); r++) {
        var x = bounds.x() + insets.left();
        for (var c = 0; c < this._elements.columnCount(); c++) {
            positions.push(new jsfc.Rectangle(x, y, cellDims.widths[c], 
                cellDims.heights[r]));
            x += cellDims.widths[c];
        }
        y = y + cellDims.heights[r];
    }
    return positions;
};
 
/**
 * Draws the element within the specified bounds.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} bounds
 * @returns {undefined}
 */
jsfc.GridElement.prototype.draw = function(ctx, bounds) {
    var positions = this.layoutElements(ctx, bounds);
    for (var r = 0; r < this._elements.rowCount(); r++) {
        for (var c = 0; c < this._elements.columnCount(); c++) {
            var element = this._elements.valueByIndex(r, c);
            if (!element) {
                continue;
            }
            var pos = positions[r * this._elements.columnCount() + c];
            element.draw(ctx, pos);
        }
    }
};

jsfc.GridElement.prototype.receive = function(visitor) {
    for (var r = 0; r < this._elements.rowCount(); r++) {
        for (var c = 0; c < this._elements.columnCount(); c++) {
            var element = this._elements.valueByIndex(r, c);
            if (element === null) {
                continue;
            }
            element.receive(visitor);
        }
    }
};

