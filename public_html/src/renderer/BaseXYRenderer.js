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
 * A base object for XYRenderer implementations.
 * @constructor
 * @param {jsfc.BaseXYRenderer} [instance]  the instance.
 */
jsfc.BaseXYRenderer = function(instance) {
    if (!(this instanceof jsfc.BaseXYRenderer)) {
        throw new Error("Use 'new' for constructor.");
    }
    if (!instance) {
        instance = this;
    }
    jsfc.BaseXYRenderer.init(instance);
};

/**
 * Initialises an object to have the attributes provided by this base 
 * renderer.
 * 
 * @param {jsfc.BaseXYRenderer} instance  the instance.
 * @returns {undefined}
 */
jsfc.BaseXYRenderer.init = function(instance) {
    var lineColors = jsfc.Colors.colorsAsObjects(jsfc.Colors.fancyLight());
    var fillColors = jsfc.Colors.colorsAsObjects(jsfc.Colors.fancyLight());
    instance._lineColorSource = new jsfc.ColorSource(lineColors);
    instance._fillColorSource = new jsfc.ColorSource(fillColors);
    instance._listeners = [];    
};

/**
 * Returns the color source that provides line colors.
 * 
 * @returns {jsfc.ColorSource}
 */
jsfc.BaseXYRenderer.prototype.getLineColorSource = function() {
    return this._lineColorSource;
};

/**
 * Sets the color source that determines the line color for each data item.
 * 
 * @param {jsfc.ColorSource} cs  the color source.
 * @param {boolean} [notify]
 * @returns {undefined}
 */
jsfc.BaseXYRenderer.prototype.setLineColorSource = function(cs, notify) {
    this._lineColorSource = cs;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the color source that provides fill colors.
 * 
 * @returns {jsfc.ColorSource}
 */
jsfc.BaseXYRenderer.prototype.getFillColorSource = function() {
    return this._fillColorSource;
};

/**
 * Sets the color source that determines the fill color for each data item.
 * 
 * @param {jsfc.ColorSource} cs  the color source.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseXYRenderer.prototype.setFillColorSource = function(cs, notify) {
    this._fillColorSource = cs;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the number of passes required to render the data.  In this case,
 * one pass is required.
 * 
 * @returns {!number} The number of passes required.
 */
jsfc.BaseXYRenderer.prototype.passCount = function() {
    return 1;
};

jsfc.BaseXYRenderer.prototype.calcYRange = function(dataset) {
    var bounds = jsfc.XYDatasetUtils.ybounds(dataset);
    return new jsfc.Range(bounds[0], bounds[1]);
};

/**
 * Registers a listener to receive notification of changes to the renderer.  
 * The listener is a function - it will be passed one argument (this plot).
 * 
 * @param {Function} f  the listener function.
 * @returns {undefined}
 */
jsfc.BaseXYRenderer.prototype.addListener = function(f) {
    this._listeners.push(f);  
};

/**
 * Notify each listener function that this plot has changed.
 * 
 * @returns {undefined}
 */
jsfc.BaseXYRenderer.prototype.notifyListeners = function() {
    var plot = this;
    this._listeners.forEach(function(f) {
        f(plot);
    });
};


