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
 * Creates a new category axis.
 * Note that all properties having names beginning with an underscore should
 * be treated as private.  Updating these properties directly is strongly
 * discouraged.  Look for accessor methods instead.
 * 
 * @constructor
 * @implements {jsfc.CategoryAxis} 
 * @param {string} [label]  the axis label.
 * @returns {jsfc.StandardCategoryAxis}
 */
jsfc.StandardCategoryAxis = function(label) {
    if (!(this instanceof jsfc.StandardCategoryAxis)) {
        throw new Error("Use 'new' with constructor.");
    }
    this._label = label;
    this._labelFont = new jsfc.Font("Palatino;serif", 12, true, false);
    this._labelColor = new jsfc.Color(0, 0, 0);
    this._labelMargin = new jsfc.Insets(2, 2, 2, 2);
    this._tickLabelMargin = new jsfc.Insets(2, 2, 2, 2);
    this._tickLabelFont = new jsfc.Font("Palatino;serif", 12);
    this._tickLabelColor = new jsfc.Color(100, 100, 100);
    this._tickLabelFactor = 1.4;
    this._tickLabelOrientation = null;
    
    // when there are many labels they can overlap ... if maxLevels is set to
    // a value greater than 1 then the labels will be offset (if required) on 
    // different levels so there is more space for each label.  This only 
    // applies when the label orientation is PARALLEL to the axis.
    this._tickLabelMaxLevels = 3;
    
    this._tickMarkInnerLength = 2;
    this._tickMarkOuterLength = 2;
    this._tickMarkStroke = new jsfc.Stroke(0.5);
    this._tickMarkColor = new jsfc.Color(100, 100, 100);

    this._axisLineColor = new jsfc.Color(100, 100, 100);
    this._axisLineStroke = new jsfc.Stroke(0.5);

    this._lowerMargin = 0.05;
    this._upperMargin = 0.05;
    this._categoryMargin = 0.1;
    this._categories = [];
    this._listeners = [];
};

/**
 * Returns the axis label.
 * 
 * @returns {string|undefined} The axis label (possibly null).
 */
jsfc.StandardCategoryAxis.prototype.getLabel = function() {
    return this._label;
};

/**
 * Sets the axis label and sends a change notification to all registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {string} label  the label (null permitted).
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.StandardCategoryAxis.prototype.setLabel = function(label, notify) {
    this._label = label;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the maximum number of levels for the tick labels on the axis.  The
 * default value is 3.
 * 
 * @returns {number} The maximum tick label levels.
 */
jsfc.StandardCategoryAxis.prototype.getTickLabelMaxLevels = function() {
    return this._tickLabelMaxLevels;  
};

/**
 * Sets the maximum number of levels for the tick labels on the axis.  This 
 * should be an integer that is greater than or equal to 1.
 *   
 * @param {!number} maxLevels  the new value.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.StandardCategoryAxis.prototype.getTickLabelMaxLevels = function(maxLevels, 
        notify) {
    this._tickLabelMaxLevels = maxLevels;    
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Configures this axis so it is up-to-date with respect to being the x-axis
 * for the specified plot.
 * 
 * @param {!jsfc.CategoryPlot} plot  the plot.
 * @returns {undefined}
 */
jsfc.StandardCategoryAxis.prototype.configureAsXAxis = function(plot) {
    var dataset = plot.getDataset();
    if (dataset) {
        this._categories = dataset.columnKeys();
    }
};

/**
 * Returns the tick label orientation, which is either the value specified or
 * a default value derived from the edge.
 * 
 * @param {!string} edge  the edge along which the axis is drawn (valid values
 *         are defined in jsfc.RectangleEdge).
 * @returns {string} The label orientation (see jsfc.LabelOrientation for valid
 *         values).
 */
jsfc.StandardCategoryAxis.prototype._resolveTickLabelOrientation = function(edge) {
    var result = this._tickLabelOrientation;
    if (!result) {
        if (edge === jsfc.RectangleEdge.LEFT 
                || edge === jsfc.RectangleEdge.RIGHT) {
           result = jsfc.LabelOrientation.PERPENDICULAR; 
        } else if (edge === jsfc.RectangleEdge.TOP 
                || edge === jsfc.RectangleEdge.BOTTOM) {
           result = jsfc.LabelOrientation.PARALLEL;
        } else {
            throw new Error("Unrecognised 'edge' code: " + edge);
        }
    }
    return result;
};

/**
 * Returns a list of tick marks for the axis.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} area  the data area.
 * @param {!string} edge  the edge.
 * 
 * @returns {Array} An array of jsfc.TickMark instances.
 */
jsfc.StandardCategoryAxis.prototype.ticks = function(ctx, area, edge) {
    return this._categories.map(function(key, i) {
        return new jsfc.TickMark(i, key + "");  // here we could run a label generator
    });
};

/**
 * Returns a subset of the specified array of tick marks including only those
 * tickmarks for the specified level (assuming there are levelCount levels).
 * 
 * @param {!Array} ticks  the tick marks.
 * @param {!number} level  the level.
 * @param {!number} levelCount  the total number of levels.
 * @returns {unresolved}
 */
jsfc.StandardCategoryAxis.prototype._ticksForLevel = function(ticks, level, levelCount) {
    return ticks.filter(function(element, index){
        return (index % levelCount === level); 
    });
};

/**
 * Returns the amount of space to reserve for this axis when drawing 
 * it along the specified edge.
 * 
 * @param {!jsfc.Context2D} ctx  the drawing context.
 * @param {!jsfc.CategoryPlot} plot  the plot.
 * @param {!jsfc.Rectangle} bounds  the bounds within which the plot (including
 *         axes) will be drawn.
 * @param {!jsfc.Rectangle} area  the estimated data area.
 * @param {!string} edge  the edge (see jsfc.RectangleEdge for valid values).
 * @returns {Number} The amount of space.
 */
jsfc.StandardCategoryAxis.prototype.reserveSpace = function(ctx, plot, bounds, 
        area, edge) {
    var space = 0; //this._tickMarkOuterLength;
    
    // if there is an axis label we need to include space for it 
    // plus its margins
    if (this._label) {
        ctx.setFont(this._labelFont);
        var dim = ctx.textDim(this._label);
        var lm = this._labelMargin;
        space += dim.height();
        if (jsfc.RectangleEdge.isTopOrBottom(edge)) {
            space += lm.top() + lm.bottom();
        } else if (jsfc.RectangleEdge.isLeftOrRight(edge)) {
            space += lm.left() + lm.right();
        } else {
            throw new Error("Unrecognised edge code: " + edge);
        }
    }
    
    // tick marks
    var ticks = this.ticks(ctx, area, edge);
    ctx.setFont(this._tickLabelFont);
    var orientation = this._resolveTickLabelOrientation(edge);
    var levels = 1;
    if (orientation === jsfc.LabelOrientation.PERPENDICULAR) {
        var max = 0;
        ticks.forEach(function(t) {
            max = Math.max(max, ctx.textDim(t.label).width());    
        });
        space += max;
    } else if (orientation === jsfc.LabelOrientation.PARALLEL) {
        // figure out how many 'levels' will be used to display the labels
        if (this._tickLabelMaxLevels > 1) {
            levels = this._calcRequiredLabelLevels(ctx, area, edge, ticks, 
                    this._tickLabelMaxLevels);
        }
        // just add the height of one label, because they are all the same,
        // multiplied by the number of levels
        var dim = ctx.textDim("123");
        space += levels * dim.height();
    }
    if (jsfc.RectangleEdge.isTopOrBottom(edge)) {
        space += levels * (this._tickLabelMargin.top() + this._tickLabelMargin.bottom());
    } else if (jsfc.RectangleEdge.isLeftOrRight(edge)) {
        space += levels * (this._tickLabelMargin.left() + this._tickLabelMargin.right());
    } else {
        throw new Error("Unrecognised edge code: " + edge);
    }
    return space;   
};

/**
 * Calculates the required number of levels to display the given ticks along
 * an axis lying on the specified edge of the given data area.  This method
 * assumes that the labels are drawn PARALLEL to the axis.
 * 
 * @param {!jsfc.Context2D} ctx  the drawing context.
 * @param {type} dataArea  the data area.
 * @param {type} edge  the edge.
 * @param {type} ticks  the ticks
 * @param {type} maxLevels  the maximum number of levels permitted.
 * 
 * @returns {number} Thenumber of levels that should be used to display the
 *         tick labels.
 */
jsfc.StandardCategoryAxis.prototype._calcRequiredLabelLevels = function(ctx, 
        dataArea, edge, ticks, maxLevels) {
    for (var levels = 1; levels <= maxLevels; levels++) {
        var overlap = false;
        for (var i = 0; i < levels; i++) {
            // get the ticks (to get the labels)
            var ticksForLevel = this._ticksForLevel(ticks, i, levels);
            var prevDim, prevRange;
            for (var j = 0; j < ticksForLevel.length; j++) {
                // compute the position and width of the label
                var tickLabel = ticksForLevel[j].label;
                var dim = ctx.textDim(tickLabel);
                var range = this.keyToRange(tickLabel, dataArea.minX(), 
                        dataArea.maxX());
                if (j > 0) {
                    if (prevRange.value(0.5) + prevDim.width() / 2 + this._tickLabelMargin.right() 
                            > range.value(0.5) - dim.width() / 2 - this._tickLabelMargin.left()) {
                        overlap = true;
                    }
                }
                prevDim = dim;
                prevRange = range;
            }
            if (!overlap) {
                return levels;
            }
        }
    }
    return maxLevels;
};

/**
 * Draws the axis to the specified graphics context.
 * 
 * @param {!jsfc.Context2D} ctx  the drawing context.
 * @param {!jsfc.CategoryPlot} plot  the plot.
 * @param {!jsfc.Rectangle} bounds  the bounds for drawing the plot (including 
 *         axes).
 * @param {!jsfc.Rectangle} dataArea  the area in which the data will be drawn 
 *        (the axis lies along one edge of this area).
 * @param {!number} offset  an offset from the edge of the data area.
 * 
 * @returns {undefined}
 */
jsfc.StandardCategoryAxis.prototype.draw = function(ctx, plot, bounds, dataArea,
        offset) {
    var edge = plot.axisPosition(this);
    var isLeft = edge === jsfc.RectangleEdge.LEFT;
    var isRight = edge === jsfc.RectangleEdge.RIGHT;
    var isTop = edge === jsfc.RectangleEdge.TOP;
    var isBottom = edge === jsfc.RectangleEdge.BOTTOM;
    var ticks = this.ticks(ctx, dataArea, edge);
    var x = dataArea.x();
    var y = dataArea.y();
    var w = dataArea.width();
    var h = dataArea.height();
    var gap = offset + this._tickMarkOuterLength;
    if (isLeft || isRight) {
        // so far this is not supported (TODO)
    }
    else if (isTop || isBottom) {
        ctx.setFont(this._tickLabelFont);
        ctx.setFillColor(this._tickLabelColor);
        var tlm = this._tickLabelMargin;
        var levels = this._calcRequiredLabelLevels(ctx, dataArea, edge, ticks, 
                this._tickLabelMaxLevels);
        var levelHeight = ctx.textDim("123").height() + tlm.top() + tlm.bottom();
        if (isTop) {
            gap += this._tickLabelMargin.bottom();
        } else {
            gap += this._tickLabelMargin.top();
        }
        for (var i = 0; i < ticks.length; i++) {
            var tick = ticks[i];
            var level = i % levels;
            var rx = this.keyToRange(tick.label, x, x + w);
            var xx = rx.value(0.5);
//            if (this._gridLinesVisible) {
//                ctx.setLineStroke(this._gridLineStroke);
//                ctx.setLineColor(this._gridLineColor);
//                ctx.drawLine(Math.round(rx.value(0.5)), y, Math.round(xx), y + h);
//            }
            if (this._tickMarkInnerLength + this._tickMarkOuterLength > 0) {
                ctx.setLineStroke(this._tickMarkStroke);
                ctx.setLineColor(this._tickMarkColor);
                if (isTop) {
                    ctx.drawLine(xx, y - offset - this._tickMarkOuterLength, xx, 
                            y - offset + this._tickMarkInnerLength);
                    ctx.drawAlignedString(tick.label, xx, y - gap - (levelHeight * level), 
                            jsfc.TextAnchor.BOTTOM_CENTER);
                } else {
                    ctx.drawLine(xx, y + h + offset - this._tickMarkInnerLength, 
                            xx, y + h + offset + this._tickMarkOuterLength);
                    ctx.drawAlignedString(tick.label, xx, y + h + gap + (levelHeight * level), 
                            jsfc.TextAnchor.TOP_CENTER);
                }
            }
        }
        ctx.setLineColor(this._axisLineColor);
        ctx.setLineStroke(this._axisLineStroke);
        if (isTop) {
            ctx.drawLine(x, y - offset, x + w, y - offset);            
        } else {
            ctx.drawLine(x, y + h + offset, x + w, y + h + offset);
        }
    }

    // if the axis has a label, draw it
    if (this._label) {
        ctx.setFont(this._labelFont);
        ctx.setFillColor(this._labelColor);
        if (isTop) {
            ctx.drawAlignedString(this._label, x + w / 2, 
                    y - gap - this._tickLabelMargin.bottom() 
                    - this._labelMargin.top() - (levels * levelHeight), 
                    jsfc.TextAnchor.BOTTOM_CENTER);                
        } else {
            ctx.drawAlignedString(this._label, x + w / 2, 
                    y + h + gap + this._tickLabelMargin.bottom() 
                    + this._labelMargin.top() + (levels * levelHeight), 
                    jsfc.TextAnchor.TOP_CENTER);
        }
    }
};

/**
 * Converts a (screen) coordinate to a category key, assuming that the axis
 * is drawn with r0 and r1 as the screen bounds.
 * 
 * @param {!number} coordinate  the screen coordinate.
 * @param {!number} r0  the lower (screen) bound of the axis.
 * @param {!number} r1  the upper (screen) bound of the axis.
 * @returns {string} The category key.
 */
jsfc.StandardCategoryAxis.prototype.coordinateToKey = function(coordinate, r0, 
        r1) {
    return null; // FIXME: to implement
};

/**
 * Returns the range of coordinates allocated for the category with the
 * specified key.
 * 
 * @param {!string} key  the column key.
 * @param {!number} r0  the starting screen coordinate.
 * @param {!number} r1  the ending screen coordinate.
 * @returns {jsfc.Range} The range.
 */
jsfc.StandardCategoryAxis.prototype.keyToRange = function(key, r0, r1) {
    var c = jsfc.Utils.findItemInArray(key, this._categories);
    if (c < 0) {
        throw new Error("Key is not present in the axis. " + key);
    }
    var length = r1 - r0;
    var x0 = Math.round(r0 + this._lowerMargin * length);
    var x1 = Math.round(r1 - this._upperMargin * length);
    var xlength = x1 - x0;
    var count = this._categories.length;
    var tw = xlength / count;
    var mlength = count > 1 ? xlength * this._categoryMargin : 0;
    var cm = count > 1 ? mlength / (count - 1) : 0;
    var clength = xlength - mlength;
    var cw = clength / count;
    var s = x0 + c * tw + (c / count) * cm;
    var e = s + cw;
    return new jsfc.Range(s, e);
};

/**
 * Returns the range of coordinates allocated for an item within a category.
 * 
 * @param {!number} item  the item index.
 * @param {!number} itemCount  the item count.
 * @param {!string} columnKey  the column key.
 * @param {!number} r0  the starting screen coordinate.
 * @param {!number} r1  the ending screen coordinate.
 * @returns {jsfc.Range}
 */
jsfc.StandardCategoryAxis.prototype.itemRange = function(item, itemCount, 
        columnKey, r0, r1) { 
    var r = this.keyToRange(columnKey, r0, r1);
    var w = r.length() / itemCount;
    var s = r.lowerBound() + item * w;
    var e = s + w;
    return new jsfc.Range(s, e);
};

/**
 * Registers a listener to receive notification of changes to the axis.
 * 
 * @param {!Function} listener  the listener.
 * @returns {undefined}
 */
jsfc.StandardCategoryAxis.prototype.addListener = function(listener) {
    this._listeners.push(listener);  
};

/**
 * Removes a listener so that it no longer receives event notifications from 
 * this axis.
 * 
 * @param {!Function} listener  the listener function.
 * 
 * @returns {jsfc.BaseValueAxis} This object for chaining method calls.
 */
jsfc.StandardCategoryAxis.prototype.removeListener = function(listener) {
    var i = this._listeners.indexOf(listener);
    if (i >= 0) {
        this._listeners.splice(i, 1);
    }
    return this;    
};

/**
 * Notify each listener function that this axis has changed.
 * 
 * @returns {undefined}
 */
jsfc.StandardCategoryAxis.prototype.notifyListeners = function() {
    var axis = this;
    this._listeners.forEach(function(listener) {
        listener(axis);
    });
};