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
 * Creates a new symbolic axis (initially with no symbols defined).
 * 
 * @class An axis that displays its scale using user-defined symbols to 
 * represent values from the dataset.
 * 
 * @constructor 
 * @implements {jsfc.ValueAxis}
 * @param {string} label  the axis label.
 * @returns {jsfc.SymbolAxis}
 */
jsfc.SymbolAxis = function(label) {
    if (!(this instanceof jsfc.SymbolAxis)) {
        throw new Error("Use 'new' with constructor.");
    }
    jsfc.LinearAxis.init(label, this);
    this._symbols = [];
    this._showEndPointValuesIfNoSymbols = true;
};

// extend LinearAxis - see also the init() call in the constructor
jsfc.SymbolAxis.prototype = new jsfc.LinearAxis();

/**
 * Configures this axis to function as an x-axis for the specified plot.
 * In addition to the auto-range behaviour inherited from LinearAxis, this 
 * method will, in the case where no symbols have been defined, check if the
 * dataset has a property 'x-symbols' and use that to configure the symbols 
 * for the axis.  The 'x-symbols' property should be an array containing
 * one or more objects in the form { "symbol": "abc", "value": 123 }.
 * 
 * @param {Object} plot  the plot (XYPlot).
 * @returns {undefined}
 */
jsfc.SymbolAxis.prototype.configureAsXAxis = function(plot) {
    // if the axis doesn't have defined symbols, see if the dataset provides
    // them via the 'x-symbol' property
    if (this._symbols.length === 0) {
        var s = plot.getDataset().getProperty("x-symbols");
        if (s) {
            this._symbols = s.map(function(e) { return e; });
        }
    }
    // call the super 
    jsfc.LinearAxis.prototype.configureAsXAxis.call(this, plot);     
};

/**
 * Configures this axis to function as a y-axis for the specified plot.
 * In addition to the auto-range behaviour inherited from LinearAxis, this 
 * method will, in the case where no symbols have been defined, check if the
 * dataset has a property 'y-symbols' and use that to configure the symbols 
 * for the axis.  The 'y-symbols' property should be an array containing
 * one or more objects in the form { "symbol": "abc", "value": 123 }.
 * 
 * @param {Object} plot  the plot (XYPlot or, later, CategoryPlot).
 * @returns {undefined}
 */
jsfc.SymbolAxis.prototype.configureAsYAxis = function(plot) {
    // if the axis doesn't have defined symbols, see if the dataset provides
    // them via the 'y-symbol' property
    if (this._symbols.length === 0) {
        var s = plot.getDataset().getProperty("y-symbols");
        if (s) {
            this._symbols = s.map(function(e) { return e; });
        }
    }
    // call the super 
    jsfc.LinearAxis.prototype.configureAsXAxis.call(this, plot); 
};

/**
 * Adds a symbol and its corresponding value to the axis and sends a change
 * notification to registered listeners (unless 'notify' is set to false).
 * 
 * @param {!string} symbol  the symbol.
 * @param {!number} value  the value.
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.SymbolAxis} This axis for chaining method calls.
 */
jsfc.SymbolAxis.prototype.addSymbol = function(symbol, value, notify) {
    this._symbols.push({ "symbol": symbol, "value": value});
    this._symbols.sort(function(a, b) {
        return a.value - b.value;    
    });
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Removes all symbols from the axis and sends a change notification to all 
 * registered listeners (unless 'notify' is set to false).  Note that when an 
 * axis has no symbols, the end points will be labelled with their numerical 
 * values.
 * 
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {jsfc.SymbolAxis} This axis for chaining method calls.
 */
jsfc.SymbolAxis.prototype.clearSymbols = function(notify) {
    this._symbols = [];
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Returns the number of symbols having a value within the specified range.
 * 
 * @param {!jsfc.Range} range  the range.
 * @returns {number} The number of symbols with values visible in the range.
 * @private
 */
jsfc.SymbolAxis.prototype._symbolCount = function(range) {
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
 * @param {number} tickSize  the tick size (ignored by this axis).
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} area  the data area.
 * @param {string} edge  the edge.
 * 
 * @returns {Array} An array of jsfc.TickMark instances.
 */
jsfc.SymbolAxis.prototype.ticks = function(tickSize, ctx, area, edge) {
    var r = new jsfc.Range(this._lowerBound, this._upperBound);
    if (this._symbolCount(r) > 0) {
        var result = [];
        var axis = this;
        this._symbols.forEach(function(s) {
            if (s.value > axis._lowerBound && s.value < axis._upperBound) {
                result.push(new jsfc.TickMark(s.value, s.symbol));
            }
        });
        return result;
    } else if (this._showEndPointValuesIfNoSymbols) {
        var formatter = this._tickLabelFormatOverride || this._formatter;
        var tm0 = new jsfc.TickMark(this._lowerBound, 
                formatter.format(this._lowerBound));
        var tm1 = new jsfc.TickMark(this._upperBound, 
                formatter.format(this._upperBound));
        return [tm0, tm1];
    } else {
        return [];
    }
};

