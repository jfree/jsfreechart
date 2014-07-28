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
 * Creates a new (empty) dataset instance.
 * @constructor
 * @classdesc A dataset that stores one or more data series where each series
 *     consists of an arbitrary number of (x, y) data items.  The dataset also
 *     provides a selection state mechanism.  A typical dataset will serialise 
 *     to JSON format as follows:
 *     <blockquote>{"data":{"series":[{"seriesKey":"S1","items":[{"x":1.1,"y":10.1,"z":101},{"x":2.2,"y":10.2,"z":102},{"x":3.3,"y":10.3,"z":103}]},{"seriesKey":"S2","items":[{"x":4.4,"y":10.4,"z":104}]},{"seriesKey":"S3","items":[{"x":5.5,"y":10.5,"z":105}]}]},"selections":[],"listeners":[]}</blockquote>
 */
jsfc.XYZDataset = function() {
    this.data = { "series": [] };
    this.properties = [];
    this.selections = [];
    this._listeners = [];
};

/**
 * Returns the number of series in the dataset.
 * 
 * @returns {number} The series count.
 */
jsfc.XYZDataset.prototype.seriesCount = function() {
    return this.data.series.length;
};

/**
 * Returns an array containing the keys for all the series in the dataset.
 * 
 * @returns {Array} The series keys.
 */
jsfc.XYZDataset.prototype.seriesKeys = function() {
    return this.data.series.map(function(d) { return d.seriesKey; });
};

/**
 * Returns the key for the series with the specified index.
 * 
 * @param {number} seriesIndex  the series index.
 * 
 * @returns {string} The series key.
 */
jsfc.XYZDataset.prototype.seriesKey = function(seriesIndex) {
    return this.data.series[seriesIndex].seriesKey;
};

/**
 * Returns the index for the series with the specified key, or -1.
 * 
 * @param {string} seriesKey  the series key.
 * 
 * @returns {number} The series index.
 */
jsfc.XYZDataset.prototype.seriesIndex = function(seriesKey) {
    jsfc.Args.requireString(seriesKey, "seriesKey");
    var seriesArray = this.data.series;
    var seriesCount = this.data.series.length;
    for (var s = 0; s < seriesCount; s++) {
        if (seriesArray[s].seriesKey === seriesKey) {
            return s;
        }
    }
    return -1;
};

/**
 * Returns the number of items in the specified series.
 * 
 * @param {number} seriesIndex  the series index.
 * 
 * @returns {number} The item count.
 */
jsfc.XYZDataset.prototype.itemCount = function(seriesIndex) {
    return this.data.series[seriesIndex].items.length;
};

/**
 * Returns the index of the item in the specified series that has the specified
 * item key.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string|number} itemKey  the item key.
 * @returns {number} The item index.
 */
jsfc.XYZDataset.prototype.itemIndex = function(seriesKey, itemKey) {
    jsfc.Args.require(itemKey, "itemKey");
    var seriesIndex = this.seriesIndex(seriesKey);
    var items = this.data.series[seriesIndex].items;
    for (var i = 0; i < items.length; i++) {
        if (items[i].key === itemKey) {
            return i;
        }
    }
    return -1;
};

/**
 * Returns the x-value for an item in a series.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {number} The x-value.
 */
jsfc.XYZDataset.prototype.x = function(seriesIndex, itemIndex) {
    return this.data.series[seriesIndex].items[itemIndex].x; 
};

/**
 * Returns the y-value for an item in a series.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {number} The y-value.
 */
jsfc.XYZDataset.prototype.y = function(seriesIndex, itemIndex) {
    return this.data.series[seriesIndex].items[itemIndex].y;     
};

/**
 * Returns the z-value for an item in a series.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {number} The z-value.
 */
jsfc.XYZDataset.prototype.z = function(seriesIndex, itemIndex) {
    return this.data.series[seriesIndex].items[itemIndex].z;     
};

/**
 * Returns one item from a series.  The return value is an object with the form
 * {"x": x, "y": y, "z": z, "key": key}.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * @returns {Object} A data item.
 */
jsfc.XYZDataset.prototype.item = function(seriesIndex, itemIndex) {
    return this.data.series[seriesIndex].items[itemIndex]; 
};

/**
 * Returns an item based on the series and item keys.
 * 
 * @param {string} seriesKey  the series key.
 * @param {number|string} itemKey  the item key.
 * @returns {Object}
 */
jsfc.XYZDataset.prototype.itemByKey = function(seriesKey, itemKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var items = this.data.series[seriesIndex].items;
    for (var i = 0; i < items.length; i++) {
        if (items[i].key === itemKey) {
            return items[i];
        }
    }
    return null;
};

/**
 * Returns the item key for an item.  All items will have a key that is unique
 * within the series (either auto-generated or explicitly set).
 * 
 * @param {number} seriesIndex
 * @param {number} itemIndex
 * @returns {number|string}
 */
jsfc.XYZDataset.prototype.getItemKey = function(seriesIndex, itemIndex) {
    return this.item(seriesIndex, itemIndex).key;
};

/**
 * Generates a new (and unique) item key for the specified series.
 * 
 * @param {number} seriesIndex  the series index.
 * 
 * @returns {string|number}
 */
jsfc.XYZDataset.prototype.generateItemKey = function(seriesIndex) {
    // for a series that is not yet created, we can use 0 for the itemKey
    if (seriesIndex < 0) {
        return 0;
    }
    // if there is a prefix we can use that and append numbers to make something
    // unique
    // otherwise just use numbers
    var candidate = 0;
    var max = Number.MIN_VALUE;
    var items = this.data.series[seriesIndex].items;
    for (var i = 0; i < items.length; i++) {
        if (typeof items[i].key === "number") {
            max = Math.max(items[i].key, max);
        }
        if (candidate === items[i].key) {
            candidate = max + 1;
        };
    }
    return candidate;
};

/**
 * Adds a new item to the dataset.  If the specified series does not exist in 
 * the dataset, it will be created.
 * 
 * @param {string} seriesKey  the series key.
 * @param {number} x  the x-value.
 * @param {number} y  the y-value.
 * @param {number} z  the z-value.
 * 
 * @returns {jsfc.XYZDataset} This dataset (for chaining methods).
 */
jsfc.XYZDataset.prototype.add = function(seriesKey, x, y, z, notify) {
    jsfc.Args.requireNumber(x, "x");
    var itemKey = this.generateItemKey(this.seriesIndex(seriesKey));
    return this.addByKey(seriesKey, itemKey, x, y, z, notify);
};

/**
 * Adds an item to the dataset with the specified seriesKey and itemKey.  If the
 * series does not already exist it will be created.  If the series contains
 * an item with the specified key, the values for that item will be updated,
 * otherwise a new item will be created in the series.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string|number} itemKey  the item key.
 * @param {number} x  the x-value.
 * @param {number} y  the y-value.
 * @param {number} z  the y-value.
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.XYZDataset} This dataset (for chaining method calls).
 */
jsfc.XYZDataset.prototype.addByKey = function(seriesKey, itemKey, x, y, z, notify) {
    jsfc.Args.requireString(seriesKey, "seriesKey");
    var s = this.seriesIndex(seriesKey);
    if (s < 0) {
        this.addSeries(seriesKey);
        s = this.data.series.length - 1;
    }
    var item = this.itemByKey(seriesKey, itemKey);
    if (item) {
        item.x = x;
        item.y = y;
    } else {
        this.data.series[s].items.push({"x": x, "y": y, "z": z, "key": itemKey});
        this.properties[s].maps.push(null);
    }
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;    
};

/**
 * Adds a new empty series with the specified key.
 * 
 * @param {string} seriesKey  the series key.
 * 
 * @returns {jsfc.XYZDataset} This dataset (for chaining method calls).
 */
jsfc.XYZDataset.prototype.addSeries = function(seriesKey) {
    jsfc.Args.requireString(seriesKey, "seriesKey");
    var s = this.seriesIndex(seriesKey);
    if (s >= 0) {
        throw new Error("There is already a series with the key '" + seriesKey);
    }
    this.data.series.push({ "seriesKey": seriesKey, "items": [] });
    this.properties.push({ "seriesKey": seriesKey, "maps": [] });
    return this;
};

/**
 * Removes the series with the specified ID and sends a change event to 
 * registered listeners.
 * 
 * @param {string} seriesKey  the series key.
 * @returns {jsfc.XYZDataset} This dataset (for chaining method calls).
 */
jsfc.XYZDataset.prototype.removeSeries = function(seriesKey) {
    jsfc.Args.requireString(seriesKey, "seriesKey");
    var s = this.seriesIndex(seriesKey);
    if (s >= 0) {
        this.data.series.splice(s, 1);
    }
    return this;
};

/**
 * Registers a listener to receive notification of changes to the dataset. The
 * listener must have a 'datasetChanged(KeyedValuesDataset)' method.
 * 
 * @param {Object} listener  the listener object.
 * @returns {jsfc.XYZDataset} This dataset (for chaining method calls).
 */
jsfc.XYZDataset.prototype.addListener = function(listener) {
    this._listeners.push(listener);
    return this;
};

/**
 * Removes a listener so that it will no longer receive notification of changes
 * to this dataset.
 * 
 * @param {Object} listener the listener.
 * @returns {jsfc.XYZDataset} This dataset (for chaining method calls).
 */
jsfc.XYZDataset.prototype.removeListener = function(listener) {
    var i = this._listeners.indexOf(listener);
    if (i >= 0) {
        this._listeners.splice(i, 1);
    }
    return this;
};

/**
 * Notifies listeners that the dataset has changed.
 * @returns {jsfc.XYZDataset} This dataset (for chaining method calls).
 */
jsfc.XYZDataset.prototype.notifyListeners = function() {
    for (var i = 0; i < this._listeners.length; i++) {
        this._listeners[i](this);
    }
    return this;
};

/**
 * Returns a property for the specified data item.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string} itemKey  the item key.
 * @param {string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.XYZDataset.prototype.getProperty = function(seriesKey, itemKey, propertyKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var itemIndex = this.itemIndex(seriesKey, itemKey);
    var map = this.properties[seriesIndex].maps[itemIndex];
    if (map) {
        return map.get(propertyKey);
    }
};

/**
 * Sets a property for the specified data item.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string} itemKey  the item key.
 * @param {string} propertyKey  the property key.
 * @param {*} value
 * @returns {undefined}
 */
jsfc.XYZDataset.prototype.setProperty = function(seriesKey, itemKey, propertyKey, value) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var itemIndex = this.itemIndex(seriesKey, itemKey);
    var map = this.properties[seriesIndex][itemIndex];
    if (!map) {
        map = new jsfc.Map();
        this.properties[seriesIndex].maps[itemIndex] = map;
    }
    map.put(propertyKey, value);
};

/**
 * Clears all properties for one item.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string|number} itemKey  the item key.
 * @returns {undefined}
 */
jsfc.XYZDataset.prototype.clearProperties = function(seriesKey, itemKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var itemIndex = this.itemIndex(seriesKey, itemKey);
    this.properties[seriesIndex].maps[itemIndex] = null;
};

/**
 * Marks an item as selected within a selection with the specified ID.
 * 
 * @param {string} selectionId  the selection id.
 * @param {string} seriesKey  the series key.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {jsfc.XYZDataset} This dataset (for chaining method calls).
 */
jsfc.XYZDataset.prototype.select = function(selectionId, seriesKey, itemIndex) {
    var selection;
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex < 0) { // no selection with that id
        selection = {"id": selectionId, "items": []};
        this.selections.push(selection);
    } else {
        selection = this.selections[selectionIndex];
    }
    var i = jsfc.Utils.findInArray(selection.items, function(item) {
        return (item.seriesKey === seriesKey && item.item === itemIndex); 
    });
    if (i < 0) {
        selection.items.push({"seriesKey": seriesKey, "item": itemIndex});
    }
    return this;
};

/**
 * Unselects the specified item, returning true if the item was previously 
 * selected and false otherwise (in other words, the return value is true if
 * there is a state change). 
 * 
 * @param {string} selectionId  the ID for the set of selected items.
 * @param {string} seriesKey  the series key.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {jsfc.XYZDataset} This dataset (for chaining method calls).
 */
jsfc.XYZDataset.prototype.unselect = function(selectionId, seriesKey, itemIndex) {
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex >= 0) {
        var selection = this.selections[selectionIndex];
        var i = jsfc.Utils.findInArray(selection.items, function(obj, i) {
            return (obj.seriesKey === seriesKey && obj.item === itemIndex); 
        });
        if (i >= 0) {
            selection.items.splice(i, 1);
        }
    } 
    return this;
};

/**
 * Returns true if the specified item is selected (for the given selectionId) 
 * and false otherwise.
 * 
 * @param {string} selectionId  the selection ID.
 * @param {string} seriesKey  the series key.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {boolean}  the selection state.
 */
jsfc.XYZDataset.prototype.isSelected = function(selectionId, seriesKey, itemIndex) {
    var selection;
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex < 0) {
        return false;
    } else {
        selection = this.selections[selectionIndex];
    }
    return (jsfc.Utils.findInArray(selection.items, function(obj) {
        return (obj.seriesKey === seriesKey && obj.item === itemIndex); 
    }) >= 0); 
};

/**
 * Clears any items from the selection with the specified id.
 * 
 * @param {string} selectionId  the selection it.
 * @returns {undefined}
 */
jsfc.XYZDataset.prototype.clearSelection = function(selectionId) {
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex >= 0) {
        this.selections.splice(selectionIndex, 1);
    }
};

/**
 * Returns the index of the selection with the specified ID, or -1 if there is 
 * no such selection.
 * 
 * @param {string} selectionId  the selection ID.
 * @returns {number} The selection index.
 */
jsfc.XYZDataset.prototype._indexOfSelection = function(selectionId) {
    return jsfc.Utils.findInArray(this.selections, function(item) {
        return item.id === selectionId;
    });
};

