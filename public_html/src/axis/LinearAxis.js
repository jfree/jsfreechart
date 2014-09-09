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
 * Creates a new instance.
 * @constructor  
 * @implements {jsfc.ValueAxis}
 * @param {string} [label]  the axis label.
 * @param {jsfc.LinearAxis} [instance]  the instance.
 * @returns {jsfc.LinearAxis}
 * 
 * @class A linear numerical axis.  Note that all properties having names 
 * beginning with an underscore should be treated as private.  Updating these 
 * properties directly is strongly discouraged.  Look for accessor methods 
 * instead.
 */
jsfc.LinearAxis = function(label, instance) {
    if (!(this instanceof jsfc.LinearAxis)) {
        throw new Error("Use 'new' with constructor.");
    }
    if (!instance) {
        instance = this;
    }
    jsfc.LinearAxis.init(label, instance);
};

/**
 * Initialise the attributes for this instance.
 * 
 * @param {string|undefined} label  the label (can be undefined).
 * @param {!jsfc.LinearAxis} instance  the instance.
 * @returns {undefined}
 */
jsfc.LinearAxis.init = function(label, instance) {

    // extend the BaseValueAxis object
    jsfc.BaseValueAxis.init(label, instance);
    
    // current axis bounds 
    instance._lowerBound = 0.0;
    instance._upperBound = 1.0;
   
    // do we automatically calculate the axis range based on the data and, if
    // yes, do we force the range to include zero? 
    instance._autoRange = true;  
    instance._autoRangeIncludesZero = false;
    instance._lowerMargin = 0.05;
    instance._upperMargin = 0.05;
    
    // default range (when there is no data), this can also be used for the
    // default axis length when there is just a single value
    instance._defaultRange = new jsfc.Range(0, 1);
    
    // the tick selector and tick formatter
    instance._tickSelector = new jsfc.NumberTickSelector(false);
    instance._formatter = new jsfc.NumberFormat(2);
    
    // tick mark attributes
    instance._tickMarkInnerLength = 0;
    instance._tickMarkOuterLength = 2;
    instance._tickMarkStroke = new jsfc.Stroke(0.5);
    instance._tickMarkColor = new jsfc.Color(100, 100, 100);
    
    // tick label attributes
    instance._tickLabelMargin = new jsfc.Insets(2, 2, 2, 2);
    instance._tickLabelFactor = 1.4;
    instance._tickLabelOrientation = null;
        // null means it will be derived, otherwise
        // it can be set to PARALLEL or PERPENDICULAR
        
    // if not null, this formatter overrides the one provided by the selector
    instance._tickLabelFormatOverride = null;
    
    instance._symbols = [];
};

// extend BaseValueAxis - see also the init() call in the constructor
jsfc.LinearAxis.prototype = new jsfc.BaseValueAxis();

/**
 * Returns the lower bound for the axis.
 * 
 * @returns {!number}
 */
jsfc.LinearAxis.prototype.getLowerBound = function() {
    return this._lowerBound;
};

/**
 * Returns the upper bound for the axis.
 * 
 * @returns {!number}
 */
jsfc.LinearAxis.prototype.getUpperBound = function() {
    return this._upperBound;
};

/**
 * Returns the length of the axis (upper bound minus the lower bound).
 * 
 * @returns {!number}
 */
jsfc.LinearAxis.prototype.length = function() {
    return this._upperBound - this._lowerBound;
};

/**
 * Returns true if the current axis range contains the specified value, and
 * false otherwise.  The test is inclusive of the axis end points (lower and
 * upper bounds).
 * 
 * @param {!number} value  the data value.
 * @returns {!boolean}
 */
jsfc.LinearAxis.prototype.contains = function(value) {
    return value >= this._lowerBound && value <= this._upperBound;
};

/**
 * Sets the upper and lower bounds for the axis, switches off the auto-range
 * calculation (if it was enabled) and sends a change notification to 
 * registered listeners.
 * 
 * @param {!number} lower  the lower bound.
 * @param {!number} upper  the upper bound.
 * @param {boolean} [notify]  notify listeners?
 * @param {boolean} [keepAutoRangeFlag]  preserve the autoRange flag setting?
 * 
 * @returns {jsfc.LinearAxis} This object for chaining method calls.
 */
jsfc.LinearAxis.prototype.setBounds = function(lower, upper, notify, 
        keepAutoRangeFlag) {
    if (lower >= upper) {
        throw new Error("Require upper > lower: " + lower + " > " + upper);
    }
    this._lowerBound = lower;
    this._upperBound = upper;
    if (!keepAutoRangeFlag) {
        this._autoRange = false;
    }
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Sets the axis bounds using percentage values relative to the current bounds.
 * 
 * @param {!number} lower  the lower percentage.
 * @param {!number} upper  the upper percentage.
 * @param {boolean} [notify]  notify listeners? (optional, defaults to true).
 * @param {boolean} [keepAutoRangeFlag]  don't reset the auto-range flag
 * @returns {jsfc.LinearAxis} This axis for chaining method calls.
 */
jsfc.LinearAxis.prototype.setBoundsByPercent = function(lower, upper, notify, 
        keepAutoRangeFlag) {
    var v0 = this._lowerBound;
    var v1 = this._upperBound;
    var len = v1 - v0;
    var b0 = v0 + lower * len;
    var b1 = v0 + upper * len;
    if (b1 > b0 && isFinite(b1 - b0)) {
        this._lowerBound = b0;
        this._upperBound = b1;
        if (!keepAutoRangeFlag) {
            this._autoRange = false;
        }
        if (notify !== false) {
            this.notifyListeners();
        }
    }
    return this;
};

/**
 * Returns the flag that controls whether the axis bounds are automatically 
 * updated whenever the dataset changes.  The default value is true.
 * 
 * @returns {Boolean} A boolean.
 */
jsfc.LinearAxis.prototype.isAutoRange = function() {
    return this._autoRange;
};

/**
 * Sets the flag that controls whether the axis bounds are automatically 
 * updated whenever the dataset changes and sends a change notification to
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {boolean} auto  the new flag value.
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.LinearAxis} This object for chaining method calls.
 */
jsfc.LinearAxis.prototype.setAutoRange = function(auto, notify) {
    this._autoRange = auto;
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Returns the flag that controls whether the auto-range is forced to include
 * zero.  The default value is false.
 * 
 * @returns {Boolean} A boolean.
 */
jsfc.LinearAxis.prototype.getAutoRangeIncludesZero = function() {
    return this._autoRangeIncludesZero;
};

/**
 * Sets the flag that controls whether the auto-range is forced to include
 * zero and sends a change notification to registered listeners (unless the
 * 'notify' flag is set to false).
 * 
 * @param {boolean} include  the new value.
 * @param {boolean} [notify]  notify listeners.
 * @returns {jsfc.LinearAxis} This object for chaining method calls.
 */
jsfc.LinearAxis.prototype.setAutoRangeIncludesZero = function(include, 
        notify) {
    this._autoRangeIncludesZero = include;
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Returns the lower margin, a percentage of the axis length that is added
 * as a margin during the auto-range calculation.  The default value is 0.05
 * (five percent).
 * 
 * @returns {!number} The lower margin.
 */
jsfc.LinearAxis.prototype.getLowerMargin = function() {
    return this._lowerMargin;
};

/**
 * Sets the lower margin and sends a change notification to all registered
 * listeners.
 * 
 * @param {!number} margin  the new margin.
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.LinearAxis} This object for chaining method calls.
 */
jsfc.LinearAxis.prototype.setLowerMargin = function(margin, notify) {
    this._lowerMargin = margin;
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Returns the upper margin, a percentage of the axis length that is added
 * as a margin during the auto-range calculation.  The default value is 0.05
 * (five percent).
 * 
 * @returns {!number} The upper margin.
 */
jsfc.LinearAxis.prototype.getUpperMargin = function() {
    return this._upperMargin;
};

/**
 * Sets the upper margin and sends a change notification to all registered
 * listeners.
 * 
 * @param {!number} margin  the new margin.
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.LinearAxis} This object for chaining method calls.
 */
jsfc.LinearAxis.prototype.setUpperMargin = function(margin, notify) {
    this._upperMargin = margin;
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Returns the override formatter for the tick labels.  The default value is
 * null.
 * 
 * @returns {jsfc.Format} The override formatter (possibly undefined/null).
 */
jsfc.LinearAxis.prototype.getTickLabelFormatOverride = function() {
    return this._tickLabelFormatOverride;
};

/**
 * Sets the override formatter for the tick labels and sends a change 
 * notification to registered listeners (unless 'notify' is false).
 * 
 * @param {jsfc.Format} formatter  the formatter (null permitted).
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.LinearAxis} This object for chaining method calls.
 */
jsfc.LinearAxis.prototype.setTickLabelFormatOverride = function(formatter, 
        notify) {
    this._tickLabelFormatOverride = formatter;
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Applies the auto-range (including the addition of margins, or the default
 * range length in the case where the supplied min and max are the same).
 * 
 * @param {number} min  the minimum data value.
 * @param {number} max  the maximum data value.
 * @returns {undefined}
 */
jsfc.LinearAxis.prototype._applyAutoRange = function(min, max) {
    if (this._autoRangeIncludesZero) {
        if (min > 0) min = 0;
        if (max < 0) max = 0;
    }
    var xrange = max - min;
    var lowAdj, highAdj;
    if (xrange > 0.0) {
        lowAdj = this._lowerMargin * xrange;
        highAdj = this._upperMargin * xrange;
    } else {
        lowAdj = 0.5 * this._defaultRange.length();
        highAdj = 0.5 * this._defaultRange.length();
    }
    this.setBounds(min - lowAdj, max + highAdj, false, true);
};

/**
 * Translates a data value to a coordinate in the given range.
 * 
 * @param {number} value  the value.
 * @param {number} r0  the lower bound of the coordinate (screen) range.
 * @param {number} r1  the upper bound of the coordinate (screen) range.
 * 
 * @returns {number} The coordinate value.
 */
jsfc.LinearAxis.prototype.valueToCoordinate = function(value, r0, r1) {
    jsfc.Args.requireNumber(r0, "r0");
    jsfc.Args.requireNumber(r1, "r1");
    // let's say the axis runs from a to b...
    var a = this._lowerBound;
    var b = this._upperBound;
    return r0 + ((value - a) / (b - a)) * (r1 - r0);
};

/**
 * Translates a coordinate from the given range to a value on the axis scale.
 * 
 * @param {number} coordinate  the coordinate value.
 * @param {number} r0  the lower bound of the coordinate (screen) range.
 * @param {number} r1  the upper bound of the coordinate (screen) range.
 * @returns {number} The data value.
 */
jsfc.LinearAxis.prototype.coordinateToValue = function(coordinate, r0, r1) {
    var a = this._lowerBound;
    var b = this._upperBound;
    return a + ((coordinate - r0) / (r1 - r0)) * (b - a);
};

/**
 * Calculates a good tick size for the axis assuming it is drawn along the
 * specified edge of the area.  This method should return NaN if there is
 * no good tick size (in which case the axis should just label the end points).
 * 
 * @param {jsfc.Context2D} ctx  the graphics context (used to measure string 
 *         dimensions).
 * @param {jsfc.Rectangle} area  the data area for the plot (the axis lies 
 *         along one edge).
 * @param {string} edge  the edge along which the axis lies.
 * @returns {number} The tick size.
 */
jsfc.LinearAxis.prototype._calcTickSize = function(ctx, area, edge) {
    var result = Number.NaN;
    var pixels = area.length(edge);
    var range = this._upperBound - this._lowerBound;
    if (range <= 0) {
        throw new Error("Can't have a zero range.");
    }
    var orientation = this._resolveTickLabelOrientation(edge);
    var selector = this._tickSelector;
    if (orientation === jsfc.LabelOrientation.PERPENDICULAR) {
        // work with the label height
        var textHeight = ctx.textDim("123").height();
        var maxTicks = pixels / (textHeight * this._tickLabelFactor);
        if (maxTicks > 2) {
            var tickSize = selector.select(range / 2);
            var tickCount = Math.floor(range / tickSize);
            var b = true;
            while (tickCount < maxTicks && b) {
                b = selector.previous();
                tickCount = Math.floor(range / selector.currentTickSize());
            }
            if (b) selector.next();
            result = selector.currentTickSize();
            this._formatter = selector.currentTickFormat();
        } else {
            // result remains Number.NaN
        }
    } else if (orientation === jsfc.LabelOrientation.PARALLEL) {
        // work with label widths (approximate by measuring the min and max)
        selector.select(range);
        ctx.setFont(this._tickLabelFont);
        var done = false;
        while (!done) {
            if (selector.previous()) {
                // estimate the label widths, and do they overlap?
                var f = selector.currentTickFormat();
                this._formatter = f;
                var s0 = f.format(this._lowerBound);
                var s1 = f.format(this._upperBound);
                var w0 = ctx.textDim(s0).width();
                var w1 = ctx.textDim(s1).width();
                var w = Math.max(w0, w1);
                if (w == 0 && s0.length > 0 && s1.length > 0) {
                	// text could not be measured (could be IE bug)
                	return Number.NaN;
                }
                var n = Math.floor(pixels / (w * this._tickLabelFactor));
                if (n < range / selector.currentTickSize()) {
                    selector.next();
                    this._formatter = selector.currentTickFormat();
                    done = true;
                }
            } else {
                done = true;
            }
        }
        result = selector.currentTickSize();        
    }
    return result;
};

/**
 * Returns the tick label orientation, which is either the value specified or
 * a default value derived from the edge.
 * 
 * @param {string} edge  the edge along which the axis is drawn.
 * @returns {number} The label orientation.
 */
jsfc.LinearAxis.prototype._resolveTickLabelOrientation = function(edge) {
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
 * Calculates and returns the space (width or height) required to draw this 
 * axis on one edge of the specified area.
 * 
 * This method will be called by the plot.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.CategoryPlot|jsfc.XYPlot} plot  the plot.
 * @param {!jsfc.Rectangle} bounds  the plot bounds.
 * @param {!jsfc.Rectangle} area  the estimated data area.
 * @param {!string} edge  the edge that denotes the axis position.
 * @returns {!number} The space to reserve for the axis.
 */
jsfc.LinearAxis.prototype.reserveSpace = function(ctx, plot, bounds, area, 
        edge) {
            
    var space = this._tickMarkOuterLength;
    
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
    var tickSize = this._calcTickSize(ctx, area, edge);
    var ticks = this.ticks(tickSize, ctx, area, edge);
    ctx.setFont(this._tickLabelFont);
    var orientation = this._resolveTickLabelOrientation(edge);
    if (orientation === jsfc.LabelOrientation.PERPENDICULAR) {
        var max = 0;
        ticks.forEach(function(t) {
            max = Math.max(max, ctx.textDim(t.label).width());    
        });
        space += max;
    } else if (orientation === jsfc.LabelOrientation.PARALLEL) {
        // just add the height of one label, because they are all the same
        var dim = ctx.textDim("123");
        space += dim.height();
    }
    if (jsfc.RectangleEdge.isTopOrBottom(edge)) {
        space += this._tickLabelMargin.top() + this._tickLabelMargin.bottom();
    } else if (jsfc.RectangleEdge.isLeftOrRight(edge)) {
        space += this._tickLabelMargin.left() + this._tickLabelMargin.right();
    } else {
        throw new Error("Unrecognised edge code: " + edge);
    }
    return space;   
};

/**
 * Returns the number of symbols having a value within the specified range.
 * 
 * @param {!jsfc.Range} range  the range.
 * @returns {number} The number of symbols with values visible in the range.
 * @private
 */
jsfc.LinearAxis.prototype._symbolCount = function(range) {
    var c = 0;
    this._symbols.forEach(function(s) {
        if (range.contains(s.value)) {
            c++;
        }
    });
    return c;
};

/**
 * Returns a list of ticks for the axis.
 * 
 * @param {number} tickSize  the tick size.
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} area  the data area.
 * @param {string} edge  the edge.
 * 
 * @returns {Array} An array of jsfc.TickMark instances.
 */
jsfc.LinearAxis.prototype.ticks = function(tickSize, ctx, area, edge) {

    // special case - if symbols were defined in the dataset
    var b0 = this._lowerBound;
    var b1 = this._upperBound;
    var r = new jsfc.Range(b0, b1);
    if (this._symbolCount(r) > 0) {
        var result = [];
        this._symbols.forEach(function(s) {
            if (s.value > b0 && s.value < b1) {
                result.push(new jsfc.TickMark(s.value, s.symbol));
            }
        });
        return result;
    }

    var formatter = this._tickLabelFormatOverride || this._formatter;
    var result = [];
    if (!isNaN(tickSize)) {
        var t = Math.ceil(b0 / tickSize) * tickSize;
        var t0 = t;
        var count = 0;
        while (t < b1) {
            var tprev = t;
            var tm = new jsfc.TickMark(t, formatter.format(t));
            result.push(tm);
            while (t === tprev) {
                t = t0 + (count * tickSize);
                count++;
            }
        }
    } 
    if (result.length < 2) { 
        var tm0 = new jsfc.TickMark(b0, formatter.format(b0));
        var tm1 = new jsfc.TickMark(b1, formatter.format(b1));
        result = [tm0, tm1];            
    }
    return result;
};

/**
 * Draws the axis.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.CategoryPlot|jsfc.XYPlot} plot
 * @param {!jsfc.Rectangle} bounds
 * @param {!jsfc.Rectangle} dataArea
 * @param {!number} offset
 * @returns {undefined}
 */
jsfc.LinearAxis.prototype.draw = function(ctx, plot, bounds, dataArea, offset) {
    var edge = plot.axisPosition(this);
    var tickSize = this._calcTickSize(ctx, dataArea, edge);
    var ticks = this.ticks(tickSize, ctx, dataArea, edge);
    var x = dataArea.x();
    var y = dataArea.y();
    var w = dataArea.width();
    var h = dataArea.height();
    
    var isLeft = edge === jsfc.RectangleEdge.LEFT;
    var isRight = edge === jsfc.RectangleEdge.RIGHT;
    var isTop = edge === jsfc.RectangleEdge.TOP;
    var isBottom = edge === jsfc.RectangleEdge.BOTTOM;
    if (isLeft || isRight) {
        // draw the tick marks and labels
        ctx.setFont(this._tickLabelFont);
        ctx.setFillColor(this._tickLabelColor);
        var maxTickLabelWidth = 0;
        for (var i = 0; i < ticks.length; i++) {
            var tick = ticks[i];
            var yy = this.valueToCoordinate(tick.value, y + h, y);
            if (this._gridLinesVisible) {
                ctx.setLineStroke(this._gridLineStroke);
                ctx.setLineColor(this._gridLineColor);
                ctx.drawLine(x, Math.round(yy), x + w, Math.round(yy));
            }
            if (this._tickMarkInnerLength + this._tickMarkOuterLength > 0) {
                ctx.setLineStroke(this._tickMarkStroke);
                ctx.setLineColor(this._tickMarkColor);
                if (isRight) {
                    ctx.drawLine(x + w + offset - this._tickMarkInnerLength, yy, 
                            x + w + offset + this._tickMarkOuterLength, yy);
                } else {
                    ctx.drawLine(x - offset - this._tickMarkOuterLength, yy, 
                            x - offset + this._tickMarkInnerLength, yy);
                }
            }
            if (isRight) {
                var adj = offset + this._tickMarkOuterLength 
                        + this._tickLabelMargin.left();
                var dim = ctx.drawAlignedString(tick.label, x + w + adj, yy, 
                        jsfc.TextAnchor.CENTER_LEFT);                
            } else {
                var adj = offset + this._tickMarkOuterLength 
                        + this._tickLabelMargin.right();
                var dim = ctx.drawAlignedString(tick.label, x - adj, yy, 
                        jsfc.TextAnchor.CENTER_RIGHT);
            }
            maxTickLabelWidth = Math.max(maxTickLabelWidth, dim.width());
        }
        ctx.setLineColor(this._axisLineColor);
        ctx.setLineStroke(this._axisLineStroke);
        if (isRight) {
            ctx.drawLine(x + w + offset, y, x + w + offset, 
                    y + dataArea.height());                    
        } else {
            ctx.drawLine(x - offset, y, x - offset, y + dataArea.height());        
        }
        if (this._label) {
            ctx.setFont(this._labelFont);
            ctx.setFillColor(this._labelColor);
            if (isRight) {
                var adj = offset + maxTickLabelWidth + this._tickMarkOuterLength 
                    + this._tickLabelMargin.left() + this._tickLabelMargin.right() 
                    + this._labelMargin.left();
                ctx.drawRotatedString(this._label, x + w + adj, y + h / 2, 
                        jsfc.TextAnchor.BOTTOM_CENTER, Math.PI / 2);                
            } else {
                var adj = offset + maxTickLabelWidth + this._tickMarkOuterLength 
                    + this._tickLabelMargin.left() + this._tickLabelMargin.right() 
                    + this._labelMargin.right();
                ctx.drawRotatedString(this._label, x - adj, y + h / 2, 
                        jsfc.TextAnchor.BOTTOM_CENTER, -Math.PI / 2);
            }
        }
    } else if (isTop || isBottom) {
        ctx.setFont(this._tickLabelFont);
        ctx.setFillColor(this._tickLabelColor);
        var gap = offset + this._tickMarkOuterLength;
        if (isTop) {
            gap += this._tickLabelMargin.bottom();
        } else {
            gap += this._tickLabelMargin.top();
        }
        for (var i = 0; i < ticks.length; i++) {
            var tick = ticks[i];
            var xx = this.valueToCoordinate(tick.value, x, x + w);
            if (this._gridLinesVisible) {
                ctx.setLineStroke(this._gridLineStroke);
                ctx.setLineColor(this._gridLineColor);
                ctx.drawLine(Math.round(xx), y, Math.round(xx), y + h);
            }
            if (this._tickMarkInnerLength + this._tickMarkOuterLength > 0) {
                ctx.setLineStroke(this._tickMarkStroke);
                ctx.setLineColor(this._tickMarkColor);
                if (isTop) {
                    ctx.drawLine(xx, y - offset - this._tickMarkOuterLength, xx, 
                            y - offset + this._tickMarkInnerLength);                    
                    ctx.drawAlignedString(tick.label, xx, y - gap, 
                            jsfc.TextAnchor.BOTTOM_CENTER);
                } else {
                    ctx.drawLine(xx, y + h + offset - this._tickMarkInnerLength, 
                            xx, y + h + offset + this._tickMarkOuterLength);
                    ctx.drawAlignedString(tick.label, xx, y + h + gap, 
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
        // if the axis has a label, draw it
        if (this._label) {
            ctx.setFont(this._labelFont);
            ctx.setFillColor(this._labelColor);
            if (isTop) {
                ctx.drawAlignedString(this._label, x + w / 2, 
                        y - gap - this._tickLabelMargin.bottom() 
                        - this._labelMargin.top() - this._tickLabelFont.size, 
                        jsfc.TextAnchor.BOTTOM_CENTER);                
            } else {
                ctx.drawAlignedString(this._label, x + w / 2, 
                        y + h + gap + this._tickLabelMargin.bottom() 
                        + this._labelMargin.top() + this._tickLabelFont.size, 
                        jsfc.TextAnchor.TOP_CENTER);
            }
        }
    }
};

/**
 * Configures this axis to function as an x-axis for the specified plot.
 * 
 * @param {Object} plot  the plot (XYPlot).
 * @returns {undefined}
 */
jsfc.LinearAxis.prototype.configureAsXAxis = function(plot) {
    var dataset = plot.getDataset();
    if (this._autoRange && dataset) {
        var bounds = plot.getDataset().xbounds();
        if (bounds[0] <= bounds[1]) {
            this._applyAutoRange(bounds[0], bounds[1]);
        }
    }
    
    // auto-detect symbols in dataset
    if (dataset) {
        var s = plot.getDataset().getProperty("x-symbols");
        if (s) {
            this._symbols = s.map(function(e) { return e; });
        } else {
            this._symbols = [];
        }
    }

};

/**
 * Configures this axis to function as a y-axis for the specified plot.
 * 
 * @param {Object} plot  the plot (XYPlot or, later, CategoryPlot).
 * @returns {undefined}
 */
jsfc.LinearAxis.prototype.configureAsYAxis = function(plot) {
    var dataset = plot.getDataset();
    if (this._autoRange && dataset) {
        var range = plot.getRenderer().calcYRange(dataset);
        if (range) {
            this._applyAutoRange(range.lowerBound(), range.upperBound());
        } else {
            this._applyAutoRange(this._defaultRange.lowerBound(), 
                    this._defaultRange.upperBound());
        }
    }
    // auto-detect symbols in dataset
    if (dataset) {
        var s = plot.getDataset().getProperty("y-symbols");
        if (s) {
            this._symbols = s.map(function(e) { return e; });
        } else {
            this._symbols = [];
        }
    }
};

/**
 * Resizes the axis range by the specified factor (values above 1.0 will 
 * increase the range, values below 1.0 will decrease the range).  If the 
 * factor is not positive, the axis range will be reset to the auto-calculated
 * range.  If the resize would cause the axis range to become zero or infinite,
 * then no resize will be performed.
 * 
 * @param {number} factor  the factor.
 * @param {number} anchorValue  the anchor value.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.LinearAxis.prototype.resizeRange = function(factor, anchorValue, 
        notify) {
    jsfc.Args.requireNumber(factor, "factor");
    if (factor > 0.0) {
        var left = anchorValue - this._lowerBound;
        var right = this._upperBound - anchorValue;
        var b0 = anchorValue - left * factor;
        var b1 = anchorValue + right * factor;
        if (b1 > b0 && isFinite(b1 - b0)) {
            this._lowerBound = b0;
            this._upperBound = b1;
            this._autoRange = false;
            if (notify !== false) {
                this.notifyListeners();
            }
        }
    }
    else {
        this.setAutoRange(true);
    }
};

/**
 * Pans the axis by the specified percentage (positive values will increase
 * the axis bounds, negative values will decrease the axis bounds) and sends a 
 * change notification to registered listeners (unless 'notify' is set to 
 * false).
 * 
 * @param {number} percent  the percentage.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.LinearAxis.prototype.pan = function(percent, notify) {
    jsfc.Args.requireNumber(percent, "percent");
    var length = this._upperBound - this._lowerBound;
    var adj = percent * length;
    var b0 = this._lowerBound + adj;
    var b1 = this._upperBound + adj;
    if (isFinite(b0) && isFinite(b1)) {
        this._lowerBound = b0;
        this._upperBound = b1;
        this._autoRange = false;
        if (notify !== false) {
            this.notifyListeners();
        }
    }
};
