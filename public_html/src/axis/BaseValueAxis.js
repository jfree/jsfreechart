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
 * @classdesc A base class for value axes.
 * @constructor
 * @param {string|null|undefined} [label]  the axis label (null permitted).
 * @param {jsfc.BaseValueAxis} [instance] The instance object (optional).
 */
jsfc.BaseValueAxis = function(label, instance) {
    if (!(this instanceof jsfc.BaseValueAxis)) {
        throw new Error("Use 'new' for construction.");
    }
    if (!instance) {
        instance = this;
    }
    if (!label) {
        label = null;
    }
    jsfc.BaseValueAxis.init(label, instance);
};

/**
 * Initialises the attributes for an instance.
 * 
 * @param {string|null|undefined} label  the label (null permitted).
 * @param {!jsfc.BaseValueAxis} instance  the instance.
 * @returns {undefined}
 */
jsfc.BaseValueAxis.init = function(label, instance) {
    instance._label = label;
    instance._listeners = [];
    instance._labelFont = new jsfc.Font("Palatino;serif", 12, true, false);
    instance._labelColor = new jsfc.Color(0, 0, 0);
    instance._labelMargin = new jsfc.Insets(2, 2, 2, 2);
    instance._tickLabelFont = new jsfc.Font("Palatino;serif", 12);
    instance._tickLabelColor = new jsfc.Color(0, 0, 0);
    instance._axisLineColor = new jsfc.Color(100, 100, 100);
    instance._axisLineStroke = new jsfc.Stroke(0.5);
    instance._gridLinesVisible = true;
    instance._gridLineStroke = new jsfc.Stroke(1);
    instance._gridLineColor = new jsfc.Color(255, 255, 255);
};

/**
 * Returns the axis label.
 * 
 * @returns {string} The axis label (possibly null).
 */
jsfc.BaseValueAxis.prototype.getLabel = function() {
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
jsfc.BaseValueAxis.prototype.setLabel = function(label, notify) {
    this._label = label;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the font for the axis label.
 * 
 * @returns {jsfc.Font} The font.
 */
jsfc.BaseValueAxis.prototype.getLabelFont = function() {
    return this._labelFont;
};

/**
 * Sets the font for the axis label and sends a change notification to 
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.Font} font  the font.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setLabelFont = function(font, notify) {
    this._labelFont = font;
    if (notify !== false) {
        this.notifyListeners();   
    };
};

/**
 * Returns the color for the axis label.  The default color is black.
 * 
 * @returns {jsfc.Color} The color (never null).
 */
jsfc.BaseValueAxis.prototype.getLabelColor = function() {
    return this._labelColor;
};

/**
 * Sets the color for the axis label and sends a change notification to 
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {!jsfc.Color} color  the color.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setLabelColor = function(color, notify) {
    this._labelColor = color;
    if (notify !== false) {
        this.notifyListeners();   
    };
};

/**
 * Returns the label margin (the number of pixels to leave around the edges
 * of the axis label (this can be used to control the spacing between the axis
 * label and the tick labels).  The default value is Insets(2, 2, 2, 2).  
 * 
 * Note that the insets are applied in the regular screen orientation, even if
 * the label is rotated (that is, left is always to the left side of the 
 * screen, top is always to the top of the screen).
 * 
 * @returns {jsfc.Insets} The margin.
 */
jsfc.BaseValueAxis.prototype.getLabelMargin = function() {
    return this._labelMargin;
};

/**
 * Sets the label margin and sends a change notification to all registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.Insets} margin  the new margin.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setLabelMargin = function(margin, notify) {
    this._labelMargin = margin;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the font used to display the tick labels.
 * 
 * @returns {jsfc.Font} The font (never null).
 */
jsfc.BaseValueAxis.prototype.getTickLabelFont = function() {
    return this._tickLabelFont;
};

/**
 * Sets the font used to display tick labels and sends a change event to 
 * all registered listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.Font} font  the font.
 * @param {boolean} notify
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setTickLabelFont = function(font, notify) {
    this._tickLabelFont = font;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the color used to display the tick labels.
 * 
 * @returns {jsfc.Color}
 */
jsfc.BaseValueAxis.prototype.getTickLabelColor = function() {
    return this._tickLabelColor;
};

/**
 * Sets the color for the tick labels and sends a change notification to 
 * all registered listeners (unless 'notify' is set to false).
 * 
 * @param {!jsfc.Color} color  the color.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setTickLabelColor = function(color, notify) {
    this._tickLabelColor = color;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the axis line color.
 * 
 * @returns {jsfc.Color} The color (never null).
 */
jsfc.BaseValueAxis.prototype.getAxisLineColor = function() {
    return this._axisLineColor;
};

/**
 * Sets the axis line color and sends a change notification to all registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {!jsfc.Color} color  the new color (null not permitted).
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setAxisLineColor = function(color, notify) {
    this._axisLineColor = color;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the stroke used to draw the axis line.
 * 
 * @returns {jsfc.Stroke} The stroke (never null).
 */
jsfc.BaseValueAxis.prototype.getAxisLineStroke = function() {
    return this._axisLineStroke;
};

/**
 * Sets the axis line stroke and sends a change notification to registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.Stroke} stroke  the stroke.
 * @param {boolean} notify  notify listeners.
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setAxisLineStroke = function(stroke, notify) {
    this._axisLineStroke = stroke;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Registers a listener to receive notification of changes to the axis.
 * 
 * @param {Function} listener  the listener.
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.addListener = function(listener) {
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
jsfc.BaseValueAxis.prototype.removeListener = function(listener) {
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
jsfc.BaseValueAxis.prototype.notifyListeners = function() {
    var axis = this;
    this._listeners.forEach(function(listener) {
        listener(axis);
    });
};

/**
 * Returns the flag that controls whether or not gridlines are drawn for this
 * axis.
 * 
 * @returns {Boolean} A boolean.
 */
jsfc.BaseValueAxis.prototype.isGridLinesVisible = function() {
    return this._gridLinesVisible;
};

/**
 * Sets the flag that controls whether or not gridlines are drawn for this
 * axis and sends a change notification to all registered listeners (unless
 * 'notify' is set to false).
 * 
 * @param {boolean} visible  the new flag value.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setGridLinesVisible = function(visible, notify) {
    this._gridLinesVisible = visible !== false;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the stroke for the gridlines.
 * 
 * @returns {jsfc.Stroke} The stroke.
 */
jsfc.BaseValueAxis.prototype.getGridLineStroke = function() {
    return this._gridLineStroke;
};

/**
 * Sets the stroke for the gridlines and sends a change notification to all
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.Stroke} stroke  the stroke (null not permitted).
 * @param {boolean} notify  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setGridLineStroke = function(stroke, notify) {
    this._gridLineStroke = stroke;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the color for the gridlines.
 * 
 * @returns {jsfc.Color} The color.
 */
jsfc.BaseValueAxis.prototype.getGridLineColor = function() {
    return this._gridLineColor;
};

/**
 * Sets the color for the gridlines and sends a change notification to all
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.Color} color  the color (null not permitted).
 * @param {boolean} notify  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setGridLineColor = function(color, notify) {
    this._gridLineColor = color;
    if (notify !== false) {
        this.notifyListeners();
    }
};




