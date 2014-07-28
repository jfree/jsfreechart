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
 * Creates a new (empty) HistogramDataset.
 * @classdesc A dataset that summarises univariate data according to predefined 
 *     bins.
 * @constructor
 * @implements {jsfc.IntervalXYDataset}
 * @param {!string} seriesKey  the series key (null not permitted).
 */
jsfc.HistogramDataset = function(seriesKey) {
    this._seriesKey = seriesKey;
    this._bins = [];
    this._selections = [];
    this._listeners = [];
};

/**
 * Returns the number of bins in the dataset.
 * 
 * @returns {!number} The bin count.
 */
jsfc.HistogramDataset.prototype.binCount = function() {
    return this._bins.length;
};

/**
 * Returns true if the dataset is empty (all bins have a zero count) and
 * false otherwise.
 * 
 * @returns {!boolean} A boolean.
 */
jsfc.HistogramDataset.prototype.isEmpty = function() {
    // return false if there is any bin with a non-zero count
    var result = true;
    this._bins.forEach(function(bin) { 
        if (bin.count > 0.0) {
            result = false;
        };
    });
    return result;
};

/**
 * Adds a new bin to the dataset.
 * 
 * @param {!number} xmin  the lower bound for the bin.
 * @param {!number} xmax  the upper bound for the bin.
 * @param {boolean} [incmin]  is the bin range inclusive of the minimum value? 
 *         (optional, defaults to true).
 * @param {boolean} [incmax]  is the bin range inclusive of the maximum value? 
 *         (optional, defaults to true).
 * 
 * @returns {jsfc.HistogramDataset} This dataset (for method chaining).
 */
jsfc.HistogramDataset.prototype.addBin = function(xmin, xmax, incmin, incmax) {
    var incmin_ = incmin !== false;
    var incmax_ = incmax !== false;
    var bin = new jsfc.Bin(xmin, xmax, incmin_, incmax_);
    // check that this bin does not overlap any existing bins TODO
    this._bins.push(bin);
    return this;
};

/**
 * Returns true if the specified bin overlaps with any of the existing bins in
 * the dataset.
 * 
 * @param {!jsfc.Bin} bin  the bin.
 * @returns {!boolean} A boolean.
 */
jsfc.HistogramDataset.prototype.isOverlapping = function(bin) {
    for (var i = 0; i < this._bins.length; i++) {
        if (this._bins[i].overlaps(bin)) {
            return true;
        }
    }
    return false;
};

/**
 * Returns the mid-point on the x-axis for the bin with the specified index.
 * 
 * @param {!number} binIndex  the bin index.
 * @returns {!number} The mid-point for a bin.
 */
jsfc.HistogramDataset.prototype.binMid = function(binIndex) {
    var bin = this._bins[binIndex];
    return (bin.xmin + bin.xmax) / 2;    
};

/**
 * Returns the lower bound (on the x-axis) for the bin with the specified index.
 * 
 * @param {!number} binIndex  the bin index.
 * @returns {!number} The lower bound for a bin.
 */
jsfc.HistogramDataset.prototype.binStart = function(binIndex) {
    return this._bins[binIndex].xmin;
};

/**
 * Returns the upper bound (on the x-axis) for the bin with the specified index.
 * 
 * @param {!number} binIndex  the bin index.
 * @returns {!number} The upper bound for a bin.
 */
jsfc.HistogramDataset.prototype.binEnd = function(binIndex) {
    return this._bins[binIndex].xmax;
};

/**
 * Returns the count for the bin with the specified index.
 * 
 * @param {!number} binIndex  the bin index.
 * @returns {!number} The y-value (the count for the bin).
 */
jsfc.HistogramDataset.prototype.count = function(binIndex) {
    return this._bins[binIndex].count;    
};

/**
 * Resets the counters in all bins (to 0.0).
 * @returns {jsfc.HistogramDataset} 'this' (for chaining method calls).
 */
jsfc.HistogramDataset.prototype.reset = function() {
    this._bins.forEach(function(bin) { bin.count = 0; } );
    return this;
};

/**
 * Returns the index of the bin that will contain the specified value, or
 * -1 if there is no such bin.
 * @param {!number} value  the data value to be placed in a bin.
 * @returns {!number} The index of the bin in which the value belongs.
 */
jsfc.HistogramDataset.prototype._binIndex = function(value) {
    for (var i = 0; i < this._bins.length; i++) {
        if (this._bins[i].includes(value)) {
            return i;
        }
    }
    return -1;
};

/**
 * Returns the bounds for this dataset as an array in the form
 * [xmin, xmax, ymin, ymax].
 * 
 * @returns {Array} The bounds.
 */
jsfc.HistogramDataset.prototype.bounds = function() {
    var xmin = Number.POSITIVE_INFINITY;
    var xmax = Number.NEGATIVE_INFINITY;
    var ymin = 0.0;
    var ymax = 0.0;
    for (var i = 0; i < this.binCount(); i++) {
        var bin = this._bins[i];
        xmin = Math.min(xmin, bin.xmin);
        xmax = Math.max(xmax, bin.xmax);
        ymin = Math.min(ymin, bin.y);
        ymax = Math.max(ymax, bin.y);
    }
    return [xmin, xmax, ymin, ymax];
};

/**
 * Adds a value to the dataset (by finding the bin that the value belongs to
 * and incrementing the count for that bin).
 * 
 * @param {number} value  the data value.
 * @param {boolean} [notify]  notify listeners? (optional, defaults to true)
 * @returns {jsfc.HistogramDataset} 'this' (for chaining method calls).
 */
jsfc.HistogramDataset.prototype.add = function(value, notify) {
    var binIndex = this._binIndex(value);
    if (binIndex >= 0) {
        this._bins[binIndex].count++;        
    } else {
        throw new Error("No bin for the value " + value);
    }
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Adds an array of values to the dataset
 * @param {Array} values an array of Numbers
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.HistogramDataset} 'this' (for chaining method calls).
 */
jsfc.HistogramDataset.prototype.addAll = function(values, notify) {
    var me = this;
    values.forEach(function(v) { me.add(v, false); });
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

// the methods below augment the API to make it appear like an XYDataset

/**
 * Returns the number of series in the dataset.  It is always 1 for the
 * HistogramDataset.
 * 
 * @returns {number} The series count.
 */
jsfc.HistogramDataset.prototype.seriesCount = function() {
    return 1;
};

/**
 * Returns the number of items in the specified series.  Bear in mind that
 * the dataset has only one series, and the number of items is the same as
 * the number of bins.
 * 
 * @param {number} seriesIndex  the series index.
 * 
 * @returns {number} The item count.
 */
jsfc.HistogramDataset.prototype.itemCount = function(seriesIndex) {
    return this.binCount();
};

/**
 * Returns [xmin, xmax] where xmin is the lowest x-value in the dataset and
 * xmax is this highest x-value in the dataset.  If the dataset is empty,
 * this method returns [POSITIVE_INFINITIY, NEGATIVE_INFINITY] (maybe we'll
 * change this).
 * 
 * @returns {Array}
 */
jsfc.HistogramDataset.prototype.xbounds = function() {
    var xmin = Number.POSITIVE_INFINITY;
    var xmax = Number.NEGATIVE_INFINITY;
    for (var s = 0; s < this.seriesCount(); s++) {
        for (var i = 0; i < this.itemCount(s); i++) {
            var xs = this.xStart(s, i);
            var xe = this.xEnd(s, i);
            xmin = Math.min(xmin, xs);
            xmax = Math.max(xmax, xe);
        }
    }
    return [xmin, xmax];    
};

/**
 * Returns [ymin, ymax] where ymin is the lowest y-value in the dataset and
 * xmax is this highest y-value in the dataset.  If the dataset is empty,
 * this method returns [POSITIVE_INFINITIY, NEGATIVE_INFINITY] (maybe we'll
 * change this).
 * 
 * @returns {Array}
 */
jsfc.HistogramDataset.prototype.ybounds = function() {
    var ymin = Number.POSITIVE_INFINITY;
    var ymax = Number.NEGATIVE_INFINITY;
    for (var s = 0; s < this.seriesCount(); s++) {
        for (var i = 0; i < this.itemCount(s); i++) {
            var y = this.y(s, i);
            ymin = Math.min(ymin, y);
            ymax = Math.max(ymax, y);
        }
    }
    return [ymin, ymax];    
};

/**
 * Returns an array containing the keys for all the series in the dataset.
 * 
 * @returns {Array} The series keys.
 */
jsfc.HistogramDataset.prototype.seriesKeys = function() {
    return [this._seriesKey];
};

/**
 * Returns the index for the series with the specified key, or -1.
 * 
 * @param {string} seriesKey  the series key.
 * 
 * @returns {number} The series index.
 */
jsfc.HistogramDataset.prototype.seriesIndex = function(seriesKey) {
    if (seriesKey === this._seriesKey) {
        return 0;
    }
    return -1;
};

/**
 * Returns the key for the series with the specified index.
 * 
 * @param {number} seriesIndex  the series index.
 * 
 * @returns {string} The series key.
 */
jsfc.HistogramDataset.prototype.seriesKey = function(seriesIndex) {
    if (seriesIndex === 0) {
        return this._seriesKey;
    }
    throw new Error("Invalid seriesIndex: " + seriesIndex);
};

/**
 * Returns the item key for an item.  All items will have a key that is unique
 * within the series (either auto-generated or explicitly set).
 * 
 * @param {number} seriesIndex
 * @param {number} itemIndex
 * @returns {number|string}
 */
jsfc.HistogramDataset.prototype.getItemKey = function(seriesIndex, 
        itemIndex) {
    if (seriesIndex === 0) {
        return itemIndex;  // for now we will use the bin index as the key
    }
    throw new Error("Invalid seriesIndex: " + seriesIndex);
};

/**
 * Returns the index of the item in the specified series that has the specified
 * item key.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @returns {!number} The item index.
 */
jsfc.HistogramDataset.prototype.itemIndex = function(seriesKey, itemKey) {
    if (seriesKey === this._seriesKey) {
        // find the bin with the specified key
        return itemKey; // for now we are assuming the key is a number that is the index of the bin
    }
    throw new Error("Invalid seriesIndex: " + seriesKey);
};

/**
 * Returns the x-value for an item in a series.  This corresponds to the 
 * mid-point on the x-axis for the bin with the specified index.
 * 
 * @param {!number} seriesIndex  the bin index.
 * @param {!number} itemIndex  the bin index.
 * @returns {!number} The mid-point for a bin.
 */
jsfc.HistogramDataset.prototype.x = function(seriesIndex, itemIndex) {
    return this.binMid(itemIndex);    
};

/**
 * Returns the start value for the x-interval of the item with the specified
 * series and item indices.  This is for implementing the IntervalXYDataset 
 * interface.
 * 
 * @param {!number} seriesIndex  the series index.
 * @param {!number} itemIndex  the item index.
 * @returns {number} The start value of the x-interval.
 */
jsfc.HistogramDataset.prototype.xStart = function(seriesIndex, itemIndex) {
    return this.binStart(itemIndex);    
};

/**
 * Returns the end value for the x-interval of the item with the specified
 * series and item indices.  This is for implementing the IntervalXYDataset 
 * interface.
 * 
 * @param {!number} seriesIndex  the series index.
 * @param {!number} itemIndex  the item index.
 * @returns {number} The start value of the x-interval.
 */
jsfc.HistogramDataset.prototype.xEnd = function(seriesIndex, itemIndex) {
    return this.binEnd(itemIndex);    
};

/**
 * Returns the y-value for the specified item.  Keep in mind that this dataset
 * has a single series, and the item indices correspond to the bin indices.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * @returns {number}
 */
jsfc.HistogramDataset.prototype.y = function(seriesIndex, itemIndex) {
    return this.count(itemIndex);    
};

/**
 * Returns a property for the specified data item.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string} itemKey  the item key.
 * @param {string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.HistogramDataset.prototype.getProperty = function(seriesKey, itemKey, 
        propertyKey) {
    return null;  // FIXME: implement this
};

/**
 * Registers a listener to receive notification of changes to this dataset.
 * 
 * @param {Object} listenerObj  the listener to register.
 * @returns {jsfc.HistogramDataset} This dataset (for chaining method calls).
 */
jsfc.HistogramDataset.prototype.addListener = function(listenerObj) {
    this._listeners.push(listenerObj);
    return this;
};

/**
 * Deregisters a listener so that it no longer receives notification of changes
 * to the dataset.
 * 
 * @param {Object} listenerObj  the listener to remove.
 * @returns {jsfc.HistogramDataset} This dataset (for chaining method calls).
 */
jsfc.HistogramDataset.prototype.removeListener = function(listenerObj) {
    var i = this._listeners.indexOf(listenerObj);
    if (i >= 0) {
        this._listeners.splice(i, 1);
    }
    return this;
};

/**
 * Notifies all registered listeners that this dataset has changed. 
 * @returns {jsfc.HistogramDataset} This dataset (for chaining method calls).
 */
jsfc.HistogramDataset.prototype.notifyListeners = function() {
    for (var i = 0; i < this._listeners.length; i++) {
        this._listeners[i].datasetChanged(this);
    }
    return this;
};

