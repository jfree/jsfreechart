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
 * Creates a new dataset instance.
 * 
 * @classdesc An adapter class that wraps a KeyedValues2DDataset and presents
 *     it as an XYDataset.  One column from the source dataset is designated
 *     to be the source of x-values for all series (every series has this 
 *     common set of x-values), and multiple columns can be specified as the 
 *     source for the y-values.  The series keys are taken from the key of the 
 *     column containing the y-values for the series.  Not every column from
 *     the source dataset must be used, some may be omitted.
 *
 * @param {jsfc.KeyedValues2DDataset} source the source dataset.
 * @param {!string} xcol  the key for the column containing x-values.
 * @param {Array.<string>} ycols  the keys for the columns containing y-values.
 * 
 * @constructor 
 * @implements {jsfc.XYDataset}
 */
jsfc.TableXYDataset = function(source, xcol, ycols) {
    // the source data is stored in a 2D table structure, with x-values read
    // from the column with the key matching the parameter 'xcol' and the 
    // y-values read from columns with keys matching the parameter 'ycols' (an
    // array of strings).
    this._source = source;
    
    if (this._source.columnIndex(xcol) < 0) {
        throw new Error("The column 'xcol' (" + xcol + ") is not present.");
    }
    this._xcol = xcol;
    
    ycols.forEach(function(entry) {
        if (source.columnIndex(entry) < 0) {
            throw new Error("The y-column " + entry + " is not present.");
        }
    });
    this._ycols = ycols;
    this._nextRowID = 0;
    this._listeners = [];
};

/**
 * Returns the value of a property for the dataset.
 * 
 * @param {!string} key  the property key.
 * @returns {*} The property value.
 */
jsfc.TableXYDataset.prototype.getProperty = function(key) {
    return this._source.getProperty(key);
};

/**
 * Sets the value of a property for the dataset.
 * 
 * @param {!string} key  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (the default is true).
 */
jsfc.TableXYDataset.prototype.setProperty = function(key, value, notify) {
    this._source.setProperty(key, value, false);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns an array containing all the keys of the properties defined for
 * this dataset.
 * 
 * @returns {Array}
 */
jsfc.TableXYDataset.prototype.getPropertyKeys = function() {
    return this._source.getPropertyKeys();
};

/**
 * Clears the dataset-level properties and sends a change notification to
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {boolean} [notify] notify listeners? (defaults to true).
 * @returns {jsfc.XYDataset} The dataset for chaining method calls.
 */
jsfc.TableXYDataset.prototype.clearProperties = function(notify) {
    this._source.clearProperties(false);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the number of series in the dataset.
 * 
 * @returns {number} The series count.
 */
jsfc.TableXYDataset.prototype.seriesCount = function() {
    // the number of series is equal to the number of keys in the 'ycols'
    // array
    return this._ycols.length;
};

/**
 * Returns an array containing the keys for all the series in the dataset.
 * 
 * @returns {Array} The series keys.
 */
jsfc.TableXYDataset.prototype.seriesKeys = function() {
    var result = [];
    for (var s = 0; s < this.seriesCount(); s++) {
        result.push(this.seriesKey(s)); 
    }
    return result;
};

/**
 * Returns the key for the series with the specified index.
 * 
 * @param {!number} seriesIndex  the series index.
 * 
 * @returns {string} The series key.
 */
jsfc.TableXYDataset.prototype.seriesKey = function(seriesIndex) {
    return this._ycols[seriesIndex];
};

/**
 * Returns the index for the series with the specified key, or -1.
 * 
 * @param {string} seriesKey  the series key.
 * 
 * @returns {number} The series index.
 */
jsfc.TableXYDataset.prototype.seriesIndex = function(seriesKey) {
    return this._ycols.indexOf(seriesKey);
};

/**
 * Returns the number of items in the specified series.
 * 
 * @param {!number} seriesIndex  the series index.
 * 
 * @returns {!number} The item count.
 */
jsfc.TableXYDataset.prototype.itemCount = function(seriesIndex) {
    // TODO: what if seriesIndex is out of range
    // all series have the same number of items
    return this._source.rowCount();
};

/**
 * Returns the index of the item in the specified series that has the specified
 * item key.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @returns {!number} The item index.
 */
jsfc.TableXYDataset.prototype.itemIndex = function(seriesKey, itemKey) {
    // TODO: what if there is no such series
    return this._source.rowIndex(itemKey);
};

/**
 * Returns the x-value for an item in a series.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {number} The x-value.
 */
jsfc.TableXYDataset.prototype.x = function(seriesIndex, itemIndex) {
    var col = this._source.columnIndex(this._xcol);
    return this._source.valueByIndex(itemIndex, col);
};

/**
 * Returns the y-value for an item in a series.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {number} The y-value.
 */
jsfc.TableXYDataset.prototype.y = function(seriesIndex, itemIndex) {
    var col = this._source.columnIndex(this._ycols[seriesIndex]);
    return this._source.valueByIndex(itemIndex, col);
};

/**
 * Returns one item from a series.  The return value is an object with the form
 * {"x": x, "y": y, "key": key}.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * @returns {Object} A data item.
 */
jsfc.TableXYDataset.prototype.item = function(seriesIndex, itemIndex) {
    var result = {};
    result.x = this.x(seriesIndex, itemIndex);
    result.y = this.y(seriesIndex, itemIndex);
    result.key = this.underlying.rowKey(itemIndex);
    return result;
};

/**
 * Registers a listener to receive notification of changes to the dataset. The
 * listener must have a 'datasetChanged(KeyedValuesDataset)' method.
 * 
 * @param {Function} listener  the listener object.
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.TableXYDataset.prototype.addListener = function(listener) {
    this._listeners.push(listener);
    return this;
};

/**
 * Removes a listener so that it will no longer receive notification of changes
 * to this dataset.
 * 
 * @param {Function} listener the listener.
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.TableXYDataset.prototype.removeListener = function(listener) {
    var i = this._listeners.indexOf(listener);
    if (i >= 0) {
        this._listeners.splice(i, 1);
    }
    return this;
};

/**
 * Notifies listeners that the dataset has changed.
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.TableXYDataset.prototype.notifyListeners = function() {
    for (var i = 0; i < this._listeners.length; i++) {
        this._listeners[i](this);
    }
    return this;
};

/**
 * The bounds for the data values.  This method returns an array in the form
 * [xmin, xmax, ymin, ymax].
 * 
 * @returns {Array} An array containing the dataset bounds.
 */
jsfc.TableXYDataset.prototype.bounds = function() {
    var result = this.xbounds();
    var yb = this.ybounds();
    result.push(yb[0]);
    result.push(yb[1]);
    return result;
};

/**
 * Returns [xmin, xmax] where xmin is the lowest x-value in the dataset and
 * xmax is this highest x-value in the dataset.  If the dataset is empty,
 * this method returns [POSITIVE_INFINITIY, NEGATIVE_INFINITY] (maybe we'll
 * change this).
 * 
 * @returns {Array}
 */
jsfc.TableXYDataset.prototype.xbounds = function() {
    var xmin = Number.POSITIVE_INFINITY;
    var xmax = Number.NEGATIVE_INFINITY;
    for (var r = 0; r < this._source.rowCount(); r++) {
        var x = this.x(0, r);
        xmin = Math.min(xmin, x);
        xmax = Math.max(xmax, x);    
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
jsfc.TableXYDataset.prototype.ybounds = function() {
    var ymin = Number.POSITIVE_INFINITY;
    var ymax = Number.NEGATIVE_INFINITY;
    for (var s = 1; s <= this.seriesCount(); s++) {
        for (var i = 0; i < this.itemCount(s); i++) {
            var y = this.y(s, i);
            ymin = Math.min(ymin, y);
            ymax = Math.max(ymax, y);
        }
    }
    return [ymin, ymax];    
};

/**
 * Returns the keys for the properties defined for a series.
 * 
 * @param {!string} seriesKey  the series key.
 * @returns {Array} The property keys.
 */
jsfc.TableXYDataset.prototype.getSeriesPropertyKeys = function(seriesKey) {
    return this._source.getColumnPropertyKeys(seriesKey);
};

/**
 * Returns the value of a property for a series.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.TableXYDataset.prototype.getSeriesProperty = function(seriesKey, 
        propertyKey) {
    return this._source.getColumnProperty(seriesKey, propertyKey);
};

/**
 * Sets a series property and sends a change event to all registered listeners.
 * @param {!string} seriesKey  the series key.
 * @param {!strnig} propertyKey  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify] notify listeners (defaults to true).
 * @returns {undefined}
 */
jsfc.TableXYDataset.prototype.setSeriesProperty = function(seriesKey, 
        propertyKey, value, notify) {
    this._source.setColumnProperty(seriesKey, propertyKey, value);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Clears all the series-level properties for the specified series.
 * 
 * @param {!string} seriesKey  the series key.
 * @returns {undefined}
 */
jsfc.TableXYDataset.prototype.clearSeriesProperties = function(seriesKey, 
        notify) {
    this._source.clearColumnProperties();
};

/**
 * Returns a property for the specified data item.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.TableXYDataset.prototype.getItemProperty = function(seriesKey, itemKey, 
        propertyKey) {
    // TODO
};

/**
 * Sets a property for the specified data item and sends a change notification
 * to registered listeners.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @param {!string} propertyKey  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (optional, defaults to true).
 * @returns {undefined}
 */
jsfc.TableXYDataset.prototype.setItemProperty = function(seriesKey, 
        itemKey, propertyKey, value, notify) {
    // TODO
};

/**
 * Marks an item as selected within a selection with the specified ID.
 * 
 * @param {!string} selectionId  the selection id.
 * @param {!string} seriesKey  the series key.
 * @param {!Object} itemKey  the item key.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * 
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.TableXYDataset.prototype.select = function(selectionId, seriesKey, itemKey, 
        notify) {
    // the itemKey maps to rows, and the seriesKeys are columnKeys from 1..N.
    this._source.select(selectionId, itemKey, seriesKey);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Unselects the specified item, returning true if the item was previously 
 * selected and false otherwise (in other words, the return value is true if
 * there is a state change). 
 * 
 * @param {!string} selectionId  the ID for the set of selected items.
 * @param {!string} seriesKey  the series key.
 * @param {!Object} itemKey  the item key.
 * 
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.TableXYDataset.prototype.unselect = function(selectionId, seriesKey, 
        itemKey, notify) {
    // the itemKey maps to rows, and the seriesKeys are columnKeys from 1..N.
    this._source.select(selectionId, itemKey, seriesKey);
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Returns true if the specified item is selected (for the given selectionId) 
 * and false otherwise.
 * 
 * @param {!string} selectionId  the selection ID.
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * 
 * @returns {!boolean} The selection state.
 */
jsfc.TableXYDataset.prototype.isSelected = function(selectionId, seriesKey, 
        itemKey) {
    return this._source.isSelected(selectionId, itemKey, seriesKey);
};

/**
 * Clears any items from the selection with the specified id.
 * 
 * @param {string} selectionId  the selection it.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.TableXYDataset.prototype.clearSelection = function(selectionId, notify) {
    this._source.clearSelection(selectionId);
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Adds an (x, y) item to a series.  If the series does not already exist, it
 * is added to the dataset.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {type} x
 * @param {type} y
 * @param {type} notify
 * @returns {undefined}
 */
jsfc.TableXYDataset.prototype.add = function(seriesKey, x, y, notify) {
    
    // if the dataset is empty, we just add directly
    if (this._source.isEmpty()) {
        var rowKey = this._newRowID();
        this._source.add(rowKey, "x", x, false);
        this._source.add(rowKey, seriesKey, y, false);
        if (notify !== false) {
            this.notifyListeners();
        }
        return;
    }
    
    // is there a row already with the specified x-value? if not we should
    // insert a new row for the existing series (it doesn't matter yet whether
    // or not we are adding a new series) preserving the x-values in 
    // ascending order
    var r = this._rowForX(x);
    var rowKey;
    if (r < 0) {
        rowKey = this._newRowID();
        this._source.insertRow(rowKey, -r-1, false);
    } else {
        rowKey = this._source.rowKey(r);
    }
    this._source.add(rowKey, "x", x, false);
    this._source.add(rowKey, seriesKey, y, false);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the index for the row that contains the specified x-value, or
 * -n-1 if there is no such row.
 * 
 * @param {!number} x  the x-value.
 * @returns {!number} The row index or -1.
 */
jsfc.TableXYDataset.prototype._rowForX = function(x) {
    var low = 0;
    var high = this._source.rowCount() - 1;
    var result = -1;
    while (low <= high) {
        var current = (low + high) / 2;
        var xx = this._source.valueByIndex(current, 0);
        if (x < xx) {
            high = current - 1;
            result = - Math.max(high, 0) - 1;
        } else if (x > xx) {
            low = current + 1;
            result = - low - 1;
        } else {
            return result;
        }
    }
    return result;
};

/**
 * Returns a new row ID (one that is not already in use).
 * 
 * @returns {!string} The rowID.
 */
jsfc.TableXYDataset.prototype._newRowID = function() {
    do {
        var rowID = "R" + this._nextRowID;
        this._nextRowID++;
    } while (this.underlying.rowIndex(rowID) >= 0);
    return rowID;
};