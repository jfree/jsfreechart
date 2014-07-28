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
 * Creates a new axis with a logarithmic numerical scale.
 * 
 * Note that all properties having names beginning with an underscore should
 * be treated as private.  Updating these properties directly is strongly
 * discouraged.  Look for accessor methods instead.
 * 
 * @param {string} [label]  the axis label.
 * @returns {jsfc.LinearAxis}
 * @constructor
 */
jsfc.LogAxis = function(label) {
    if (!(this instanceof jsfc.LogAxis)) {
        throw new Error("Use 'new' with constructor.");
    }
    jsfc.LinearAxis.init(label, this);
    this._base = 10;
    this._baseLog = Math.log(this._base);
    this._smallestValue = 1e-100;
    var lb = Math.log(Math.max(this._lowerBound, this._smallestValue)) / this._baseLog;
    var ub = Math.log(Math.max(this._upperBound, this._smallestValue)) / this._baseLog;
    this._logRange = new jsfc.Range(lb, ub);
};

// extend LinearAxis - see also the init() call in the constructor
jsfc.LogAxis.prototype = new jsfc.LinearAxis();

/**
 * Calculates the log of the specified value.
 * 
 * @param {number} value  the value.
 * @returns {number} The log value.
 */
jsfc.LogAxis.prototype.calculateLog = function(value) {
    return Math.log(value) / this._baseLog;
};

/**
 * Calculates the value from the specified log.
 * 
 * @param {number} log  the log value.
 * @returns {number} The value.
 */
jsfc.LogAxis.prototype.calculateValue = function(log) {
    return Math.pow(this._base, log);
};

/**
 * Sets the bounds for the axis.
 * 
 * @param {number} lower  the lower bound.
 * @param {number} upper  the upper bound.
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.LogAxis} This object for chaining method calls.
 */
jsfc.LogAxis.prototype.setBounds = function(lower, upper, notify) {
    this._lowerBound = lower;
    this._upperBound = upper;
    this._logRange = new jsfc.Range(this.calculateLog(lower), 
            this.calculateLog(upper));
    this._autoRange = false;
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Translates a data value to a coordinate in the given range.
 * 
 * @param {number} value  the value.
 * @param {number} r0  the lower bound of the coordinate (screen) range.
 * @param {number} r1  the upper bound of the coordinate (screen) range.
 * 
 * @returns {undefined}
 */
jsfc.LogAxis.prototype.valueToCoordinate = function(value, r0, r1) {
    jsfc.Args.requireNumber(r0, "r0");
    jsfc.Args.requireNumber(r1, "r1");
    // let's say the axis runs from a to b...
    var log = this.calculateLog(value);
    var percent = this._logRange.percent(log);    
    return r0 + percent * (r1 - r0);
};

/**
 * Translates a coordinate from the given range to a value on the axis scale.
 * 
 * @param {number} coordinate  the coordinate value.
 * @param {number} r0
 * @param {number} r1
 * @returns {number}
 */
jsfc.LogAxis.prototype.coordinateToValue = function(coordinate, r0, r1) {
    var percent = (coordinate - r0) / (r1 - r0);
    var logValue = this._logRange.value(percent);
    return this.calculateValue(logValue);
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
 * @param {jsfc.RectangleEdge} edge  the edge along which the axis lies.
 * @returns {number} The tick size.
 */
jsfc.LogAxis.prototype._calcTickSize = function(ctx, area, edge) {
    var result = Number.NaN;
    var pixels = area.length(edge);
    var range = this._logRange.length();
    var orientation = this._resolveTickLabelOrientation(edge);
    var selector = this._tickSelector;
    if (orientation === jsfc.LabelOrientation.PERPENDICULAR) {
        // work with the label height
        var textHeight = ctx.textDim("123").height();
        var maxTicks = pixels / (textHeight * this._tickLabelFactor);
        if (maxTicks > 2) {
            var tickSize = selector.select(range / 2);
            var tickCount = Math.floor(range / tickSize);
            while (tickCount < maxTicks) {
                selector.previous();
                tickCount = Math.floor(range / selector.currentTickSize());
            }
            selector.next();
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
 * Returns a list of ticks for the axis.
 * 
 * @param {number} tickSize  the tick size.
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} area  the data area.
 * @param {string} edge  the edge.
 * 
 * @returns {Array} An array of jsfc.TickMark instances.
 */
jsfc.LogAxis.prototype.ticks = function(tickSize, ctx, area, edge) {
    var formatter = this._tickLabelFormatOverride || this._formatter;
    if (!isNaN(tickSize)) {
        var result = [];
        var t = Math.ceil(this._logRange._lowerBound / tickSize) * tickSize; 
        while (t < this._logRange._upperBound) {
            var v = this.calculateValue(t);
            var tm = new jsfc.TickMark(v, formatter.format(v));
            result.push(tm);
            t += tickSize;
        }
        return result;
    } else {
        var tm0 = new jsfc.TickMark(this._lowerBound, 
                formatter.format(this._logRange._lowerBound));
        var tm1 = new jsfc.TickMark(this._upperBound, 
                formatter.format(this._logRange._upperBound));
        return [tm0, tm1];
    }
};

