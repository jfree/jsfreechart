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
    instance._strokeSource = new jsfc.StrokeSource([new jsfc.Stroke(2)]);
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
 * Returns a color to be used to draw lines for the specified data item.  The
 * method will first check if there is a series property in the dataset with
 * the key 'color'.  If it is present, it will be used as the line color, if
 * not the lineColorSource will be used.
 * 
 * @param {jsfc.XYDataset} dataset  the dataset.
 * @param {number} series  the series index.
 * @param {number} item  the item index.
 * @returns {jsfc.Color}
 */
jsfc.BaseXYRenderer.prototype.lookupLineColor = function(dataset, series, 
        item) {
    var seriesKey = dataset.seriesKey(series);
    var colorStr = dataset.getSeriesProperty(seriesKey, "color");
    if (colorStr) {
        return jsfc.Color.fromStr(colorStr);
    } else {
        return this._lineColorSource.getColor(series, item);
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
 * Returns the object that determines the line stroke to be used by the
 * renderer for a particular data item.
 * 
 * @returns {jsfc.StrokeSource}  the stroke source.
 */
jsfc.BaseXYRenderer.prototype.getStrokeSource = function() {
    return this._strokeSource;
};

/**
 * Sets the object that determines the line stroke to be used by the renderer
 * for a particular data item and notifies listeners that the renderer has
 * changed.
 * 
 * @param {jsfc.StrokeSource} ss  the stroke source.
 * @param {boolean} [notify]
 * @returns {undefined}
 */
jsfc.BaseXYRenderer.prototype.setStrokeSource = function(ss, notify) {
    this._strokeSource = ss;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the number of passes required to render the data.  Most renderers
 * will make a single pass through the dataset, but there are cases where 
 * multiple passes will be required.
 * 
 * @returns {!number} The number of passes required.
 */
jsfc.BaseXYRenderer.prototype.passCount = function() {
    return 1;
};

/**
 * Returns the range required on the y-axis in order for this renderer to 
 * fully display all the data items in the dataset.
 * 
 * @param {jsfc.StandardXYDataset} dataset  the dataset.
 * @returns {jsfc.Range} The range (can be undefined if the dataset has no data
 *         values).
 */
jsfc.BaseXYRenderer.prototype.calcYRange = function(dataset) {
    var bounds = jsfc.XYDatasetUtils.ybounds(dataset);
    if (bounds[1] >= bounds[0]) {
        return new jsfc.Range(bounds[0], bounds[1]);
    }
    return;
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


