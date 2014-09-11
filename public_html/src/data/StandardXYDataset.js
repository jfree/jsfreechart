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
 * Creates a new (empty) dataset instance.
 * 
 * @classdesc A dataset that stores one or more data series where each series
 *     consists of an arbitrary number of (x, y) data items.  The dataset also
 *     provides a selection state mechanism.  A typical dataset will serialise 
 *     to JSON format as follows:
 *     <blockquote>{"data":{"series":[{"seriesKey":"S1","items":[{"x":1.1,"y":10.1},{"x":2.2,"y":10.2},{"x":3.3,"y":10.3}]},{"seriesKey":"S2","items":[{"x":4.4,"y":10.4}]},{"seriesKey":"S3","items":[{"x":5.5,"y":10.5}]}]},"selections":[],"_listeners":[]}</blockquote>
 *
 * @constructor 
 * @implements {jsfc.XYDataset}
 */
jsfc.StandardXYDataset = function() {
    this.data = { "series": [] };
    this.properties = { "dataset": null, "series": [] };
    this.selections = [];
    
    // the index provides fast lookup of a series index from a series key,
    // and an item index from an item key.
    this._index = { "series": new jsfc.Map(), "items": [] };
    this._listeners = [];
};

/**
 * Returns the number of series in the dataset.
 * 
 * @returns {number} The series count.
 */
jsfc.StandardXYDataset.prototype.seriesCount = function() {
    return this.data.series.length;
};

/**
 * Returns an array containing the keys for all the series in the dataset.
 * 
 * @returns {Array} The series keys.
 */
jsfc.StandardXYDataset.prototype.seriesKeys = function() {
    return this.data.series.map(function(d) {
        return d.seriesKey;
    });
};

/**
 * Returns the key for the series with the specified index.
 * 
 * @param {!number} seriesIndex  the series index.
 * 
 * @returns {string} The series key.
 */
jsfc.StandardXYDataset.prototype.seriesKey = function(seriesIndex) {
    return this.data.series[seriesIndex].seriesKey;
};

/**
 * Returns the index for the series with the specified key, or -1.
 * 
 * @param {!string} seriesKey  the series key.
 * 
 * @returns {!number} The series index.
 */
jsfc.StandardXYDataset.prototype.seriesIndex = function(seriesKey) {
    jsfc.Args.requireString(seriesKey, "seriesKey");
    var index = +this._index.series.get(seriesKey);
    if (index >= 0) {
        return index;
    }
    return -1;
};

/**
 * Returns the number of items in the specified series.
 * 
 * @param {!number} seriesIndex  the series index.
 * 
 * @returns {!number} The item count.
 */
jsfc.StandardXYDataset.prototype.itemCount = function(seriesIndex) {
    return this.data.series[seriesIndex].items.length;
};

/**
 * Returns the key for an item in a series.
 * 
 * @param {!number} seriesIndex  the series index.
 * @param {!number} itemIndex  the item index.
 * @returns {!string} The item key.
 */
jsfc.StandardXYDataset.prototype.itemKey = function(seriesIndex, itemIndex) {
    return this.data.series[seriesIndex].items[itemIndex].key;  
};

/**
 * Returns the index of the item in the specified series that has the specified
 * item key.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @returns {!number} The item index.
 */
jsfc.StandardXYDataset.prototype.itemIndex = function(seriesKey, itemKey) {
    jsfc.Args.require(itemKey, "itemKey");
    var seriesIndex = this.seriesIndex(seriesKey);
    var i = this._index.items[seriesIndex].get(itemKey);
    if (i >= 0) {
        return i;
    }
    return -1;
};

/**
 * Returns the x-value for an item in a series.
 * 
 * @param {!number} seriesIndex  the series index.
 * @param {!number} itemIndex  the item index.
 * 
 * @returns {!number} The x-value.
 */
jsfc.StandardXYDataset.prototype.x = function(seriesIndex, itemIndex) {
    return this.data.series[seriesIndex].items[itemIndex].x; 
};

/**
 * Returns the y-value for an item in a series.
 * 
 * @param {!number} seriesIndex  the series index.
 * @param {!number} itemIndex  the item index.
 * 
 * @returns {number} The y-value.
 */
jsfc.StandardXYDataset.prototype.y = function(seriesIndex, itemIndex) {
    return this.data.series[seriesIndex].items[itemIndex].y;     
};

/**
 * Returns one item from a series.  The return value is an object with the form
 * {"x": x, "y": y, "key": key}.
 * 
 * @param {!number} seriesIndex  the series index.
 * @param {!number} itemIndex  the item index.
 * @returns {Object} A data item.
 */
jsfc.StandardXYDataset.prototype.item = function(seriesIndex, itemIndex) {
    return this.data.series[seriesIndex].items[itemIndex];  
};

/**
 * Returns an item based on the series and item keys.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @returns {Object}
 */
jsfc.StandardXYDataset.prototype.itemByKey = function(seriesKey, itemKey) {
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
 * @param {!number} seriesIndex
 * @param {!number} itemIndex
 * @returns {string}
 */
jsfc.StandardXYDataset.prototype.getItemKey = function(seriesIndex, itemIndex) {
    return this.item(seriesIndex, itemIndex).key;
};

/**
 * Generates a new (and unique) item key for the specified series.
 * 
 * @param {!number} seriesIndex  the series index.
 * 
 * @returns {!string}
 */
jsfc.StandardXYDataset.prototype.generateItemKey = function(seriesIndex) {
    // for a series that is not yet created, we can use 0 for the itemKey
    if (seriesIndex < 0) {
        return "0";
    }
    var map = this._index.items[seriesIndex];
    var candidate = map.get("_nextFreeKey_");
    while (map.contains("" + candidate)) {
        candidate++;
        map.put("_nextFreeKey_", candidate);
    }
    return "" + candidate;
};

/**
 * Returns the data items for the specified series.  This method provides 
 * direct access to the data for a series - if you update this array directly, 
 * dataset listeners will not receive notification of the change.
 * 
 * @param {!number} seriesIndex  the series index.
 * 
 * @returns {Array} An array of the data items.
 */
jsfc.StandardXYDataset.prototype.items = function(seriesIndex) {
    return this.data.series[seriesIndex].items;
};

/**
 * Returns a new array containing all the (x, y) items in the dataset.
 * 
 * @returns {Array} An array of data items.
 */
jsfc.StandardXYDataset.prototype.allItems = function() {
    var result = [];
    for (var s = 0; s < this.data.series.length; s++) {
        result.push(this.items(s));
    }
    return result;
};

/**
 * Adds an item to the specified series (if the series does not already exist,
 * it will be created).  The new item will have an auto-generated item key.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!number} x  the x-value.
 * @param {number|null} y  the y-value.
 * @param {boolean} [notify]  notify listeners? 
 * 
 * @returns {jsfc.XYDataset} This dataset for method call chaining.
 */
jsfc.StandardXYDataset.prototype.add = function(seriesKey, x, y, notify) {
    jsfc.Args.requireNumber(x, "x");
    var s = this.seriesIndex(seriesKey);
    if (s < 0) {
        this.addSeries(seriesKey);
        s = this.data.series.length - 1;
    }
    var itemKey = this.generateItemKey(s);
    // this code matches what is found in addByKey() but since we know this
    // is a new data item, and we already know the series index, it is faster 
    // to add it directly
    var items = this.data.series[s].items;
    items.push({"x": x, "y": y, "key": itemKey});
    this._index.items[s].put(itemKey, items.length - 1);
    this.properties.series[s].maps.push(null);
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;    
};

/**
 * Adds an item to the dataset with the specified seriesKey and itemKey.  If the
 * series does not already exist it will be created.  If the series contains
 * an item with the specified key, the values for that item will be updated,
 * otherwise a new item will be created in the series.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @param {!number} x  the x-value.
 * @param {number} y  the y-value.
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.StandardXYDataset.prototype.addByKey = function(seriesKey, itemKey, x, y, 
        notify) {
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
        var items = this.data.series[s].items;
        items.push({"x": x, "y": y, "key": itemKey});
        this._index.items[s].put(itemKey, items.length - 1);
        this.properties.series[s].maps.push(null);
    }
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;    
};

/**
 * Removes an item from one series in the dataset and sends a change event to 
 * all registered listeners.
 * 
 * @param {!number} seriesIndex  the series key.
 * @param {!number} itemIndex  the item index.
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.StandardXYDataset.prototype.remove = function(seriesIndex, itemIndex, 
        notify) {
    // TODO when an item is removed, any selections that point to it should
    // be updated accordingly
    var removedItemKey = this.itemKey(seriesIndex, itemIndex);
    this.data.series[seriesIndex].items.splice(itemIndex, 1);
    this.properties.series[seriesIndex].maps.splice(itemIndex, 1);
    // update the index of itemKeys --> item indices
    this._index.items[seriesIndex].remove(removedItemKey);
    for (var i = itemIndex; i < this.itemCount(seriesIndex); i++) {
        this._index.items[seriesIndex].put(this.itemKey(seriesIndex, i), i);
    }
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Removes an item from one series in the dataset and sends a change 
 * notification to all registered listeners.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @param {boolean} [notify]  notify listeners? (optional, defaults to true).
 * @returns {undefined}
 */
jsfc.StandardXYDataset.prototype.removeByKey = function(seriesKey, itemKey, 
        notify) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var itemIndex = this.itemIndex(seriesKey, itemKey);
    this.remove(seriesIndex, itemIndex, notify);
};

/**
 * Adds a new empty series with the specified key.
 * 
 * @param {!string} seriesKey  the series key.
 * 
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.StandardXYDataset.prototype.addSeries = function(seriesKey) {
    if (!(typeof seriesKey === 'string')) {
        throw new Error("The 'seriesKey' must be a string.");
    }
    if (this._index.series.contains(seriesKey)) {
        throw new Error("Duplicate key '" + seriesKey);
    }
    this.data.series.push({ "seriesKey": seriesKey, "items": [] });
    this._index.series.put(seriesKey, this.data.series.length - 1);
    var itemKeys = new jsfc.Map();
    itemKeys.put("_nextFreeKey_", 0); // hint for the next free key
    this._index.items.push(itemKeys); // map for itemKeys --> item index
    this.properties.series.push({ "seriesKey": seriesKey, 
            "seriesProperties": null, "maps": [] });
    return this;
};

/**
 * Removes the series with the specified ID and sends a change event to 
 * registered listeners.
 * 
 * @param {!string} seriesKey  the series key.
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.StandardXYDataset.prototype.removeSeries = function(seriesKey, notify) {
    if (!(typeof seriesKey === 'string')) {
        throw new Error("The 'seriesKey' must be a string.");
    }
    // TODO : when a series is removed, any selections that point to the series
    // should be updated accordingly
    var s = this.seriesIndex(seriesKey);
    if (s >= 0) {
        this.data.series.splice(s, 1);
        this.properties.series.splice(s, 1);
        // update the index of series keys to indices for every series affected
        this._index.series.remove(seriesKey);
        this._index.items.splice(s, 1);
        for (var i = s; i < this.seriesCount(); i++) {
            var key = this.seriesKey(i);
            this._index.series.put(key, i);
        }
        if (notify !== false) {
            this.notifyListeners();
        }
    } else {
        throw new Error("No series with that key. " + seriesKey);
    }
    return this;
};

/**
 * The bounds for the data values.  This method returns an array in the form
 * [xmin, xmax, ymin, ymax].
 * 
 * @returns {Array} An array containing the dataset bounds.
 */
jsfc.StandardXYDataset.prototype.bounds = function() {
    var xmin = Number.POSITIVE_INFINITY;
    var xmax = Number.NEGATIVE_INFINITY;
    var ymin = Number.POSITIVE_INFINITY;
    var ymax = Number.NEGATIVE_INFINITY;
    for (var s = 0; s < this.seriesCount(); s++) {
        for (var i = 0; i < this.itemCount(s); i++) {
            var xyitem = this.item(s, i);
            xmin = Math.min(xmin, xyitem.x);
            xmax = Math.max(xmax, xyitem.x);
            ymin = Math.min(ymin, xyitem.y);
            ymax = Math.max(ymax, xyitem.y);
        }
    }
    return [xmin, xmax, ymin, ymax];
};

/**
 * Returns [xmin, xmax] where xmin is the lowest x-value in the dataset and
 * xmax is this highest x-value in the dataset.  If the dataset is empty,
 * this method returns [POSITIVE_INFINITIY, NEGATIVE_INFINITY] (maybe we'll
 * change this).
 * 
 * @returns {Array}
 */
jsfc.StandardXYDataset.prototype.xbounds = function() {
    var xmin = Number.POSITIVE_INFINITY;
    var xmax = Number.NEGATIVE_INFINITY;
    for (var s = 0; s < this.seriesCount(); s++) {
        for (var i = 0; i < this.itemCount(s); i++) {
            var x = this.x(s, i);
            xmin = Math.min(xmin, x);
            xmax = Math.max(xmax, x);
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
jsfc.StandardXYDataset.prototype.ybounds = function() {
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
 * Returns the value of a property for the dataset.
 * 
 * @param {!string} key  the property key.
 * @returns {*} The property value.
 */
jsfc.StandardXYDataset.prototype.getProperty = function(key) {
    var map = this.properties.dataset;
    if (map) {
        return map.get(key);
    }
    return undefined;
};

/**
 * Sets the value of a property for the dataset.
 * 
 * @param {!string} key  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 */
jsfc.StandardXYDataset.prototype.setProperty = function(key, value, notify) {
    if (!this.properties.dataset) {
        this.properties.dataset = new jsfc.Map();
    }
    if (value !== null) {
        this.properties.dataset.put(key, value);
    } else {
        this.properties.dataset.remove(key);
    }
    
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
jsfc.StandardXYDataset.prototype.getPropertyKeys = function() {
    if (this.properties.dataset) {
        return this.properties.dataset.keys();
    }
    return [];
};

/**
 * Clears all the dataset-level properties and sends a change notification
 * to registered listeners (unless 'notify' is set to false).
 * 
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {jsfc.StandardXYDataset} This dataset for chaining method calls.
 */
jsfc.StandardXYDataset.prototype.clearProperties = function(notify) {
    this.properties.dataset = null;
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Returns the keys for the properties defined for a series.
 * 
 * @param {!string} seriesKey  the series key.
 * @returns {Array} The property keys.
 */
jsfc.StandardXYDataset.prototype.getSeriesPropertyKeys = function(seriesKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var map = this.properties.series[seriesIndex].seriesProperties;
    if (map) {
        return map.keys();
    } else {
        return [];
    }
};

/**
 * Returns the value of a property for a series.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.StandardXYDataset.prototype.getSeriesProperty = function(seriesKey, 
        propertyKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var map = this.properties.series[seriesIndex].seriesProperties;            
    if (map) {
        return map.get(propertyKey);
    } else {
        return undefined;
    }
};

/**
 * Sets the value of a property for the specified series.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} propertyKey  the property key.
 * @param {*} value  the property value.
 * @returns {undefined}
 */
jsfc.StandardXYDataset.prototype.setSeriesProperty = function(seriesKey, 
        propertyKey, value) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var map = this.properties.series[seriesIndex].seriesProperties;            
    if (!map) {
        map = new jsfc.Map();
        this.properties.series[seriesIndex].seriesProperties = map;
    } 
    map.put(propertyKey, value);
};

/**
 * Clears all the series-level properties for the specified series.
 * 
 * @param {!string} seriesKey  the series key.
 * @returns {undefined}
 */
jsfc.StandardXYDataset.prototype.clearSeriesProperties = function(seriesKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    this.properties.series[seriesIndex].seriesProperties = null;
};

/**
 * Returns a property for the specified data item.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.StandardXYDataset.prototype.getItemProperty = function(seriesKey, 
        itemKey, propertyKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var itemIndex = this.itemIndex(seriesKey, itemKey);
    return this.getItemPropertyByIndex(seriesIndex, itemIndex, propertyKey);
};

/**
 * Sets a property for the specified data item.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @param {!string} propertyKey  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (optional, defaults to true).
 * @returns {undefined}
 */
jsfc.StandardXYDataset.prototype.setItemProperty = function(seriesKey, 
        itemKey, propertyKey, value, notify) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var itemIndex = this.itemIndex(seriesKey, itemKey);
    this.setItemPropertyByIndex(seriesIndex, itemIndex, propertyKey, value, 
            notify);
};

/**
 * Returns a property for the specified data item.  See also the
 * getItemProperty() method where keys rather than indices are used to 
 * specify the data item.
 * 
 * @param {!number} seriesIndex  the series index.
 * @param {!number} itemIndex  the item index.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.StandardXYDataset.prototype.getItemPropertyByIndex = function(seriesIndex, 
        itemIndex, propertyKey) {
    var map = this.properties.series[seriesIndex].maps[itemIndex];
    if (map) {
        return map.get(propertyKey);
    }
    return undefined;
};

/**
 * Sets a property for the specified data item.
 * 
 * @param {!number} seriesIndex  the series index.
 * @param {!number} itemIndex  the item index.
 * @param {!string} propertyKey  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (optional, defaults to true).
 * @returns {undefined}
 */
jsfc.StandardXYDataset.prototype.setItemPropertyByIndex = function(seriesIndex, 
        itemIndex, propertyKey, value, notify) {
    var map = this.properties.series[seriesIndex].maps[itemIndex];
    if (!map) {
        map = new jsfc.Map();
        this.properties.series[seriesIndex].maps[itemIndex] = map;
    }
    map.put(propertyKey, value);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Clears all properties for one item.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @returns {undefined}
 */
jsfc.StandardXYDataset.prototype.clearItemProperties = function(seriesKey, 
        itemKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var itemIndex = this.itemIndex(seriesKey, itemKey);
    this.properties.series[seriesIndex].maps[itemIndex] = null;
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
jsfc.StandardXYDataset.prototype.select = function(selectionId, seriesKey, 
        itemKey, notify) {
    var selection;
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex < 0) { // no selection with that id
        selection = {"id": selectionId, "items": []};
        this.selections.push(selection);
    } else {
        selection = this.selections[selectionIndex];
    }
    var i = jsfc.Utils.findInArray(selection.items, function(item) {
        return (item.seriesKey === seriesKey && item.itemKey === itemKey); 
    });
    if (i < 0) {
        selection.items.push({"seriesKey": seriesKey, "itemKey": itemKey});
    }
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Unselects the specified item, returning true if the item was previously 
 * selected and false otherwise (in other words, the return value is true if
 * there is a state change). 
 * 
 * @param {!string} selectionId  the ID for the set of selected items.
 * @param {!string} seriesKey  the series key.
 * @param {!Object} itemKey  the item key.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * 
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.StandardXYDataset.prototype.unselect = function(selectionId, seriesKey, 
        itemKey, notify) {
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex >= 0) {
        var selection = this.selections[selectionIndex];
        var i = jsfc.Utils.findInArray(selection.items, function(obj, i) {
            return (obj.seriesKey === seriesKey && obj.itemKey === itemKey); 
        });
        if (i >= 0) {
            selection.items.splice(i, 1);
        }
    } 
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
jsfc.StandardXYDataset.prototype.isSelected = function(selectionId, seriesKey, 
        itemKey) {
    var selection;
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex < 0) {
        return false;
    } else {
        selection = this.selections[selectionIndex];
    }
    return (jsfc.Utils.findInArray(selection.items, function(obj) {
        return (obj.seriesKey === seriesKey && obj.itemKey === itemKey); 
    }) >= 0); 
};

/**
 * Clears any items from the selection with the specified id.
 * 
 * @param {!string} selectionId  the selection it.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.StandardXYDataset.prototype.clearSelection = function(selectionId, 
        notify) {
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex >= 0) {
        this.selections.splice(selectionIndex, 1);
    }
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Returns the index of the selection with the specified ID, or -1 if there is 
 * no such selection.
 * 
 * @param {string} selectionId  the selection ID.
 * @returns {number} The selection index.
 */
jsfc.StandardXYDataset.prototype._indexOfSelection = function(selectionId) {
    return jsfc.Utils.findInArray(this.selections, function(item) {
        return item.id === selectionId;
    });
};

/**
 * Registers a listener to receive notification of changes to the dataset. The
 * listener must have a 'datasetChanged(KeyedValuesDataset)' method.
 * 
 * @param {Function} listener  the listener object.
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.StandardXYDataset.prototype.addListener = function(listener) {
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
jsfc.StandardXYDataset.prototype.removeListener = function(listener) {
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
jsfc.StandardXYDataset.prototype.notifyListeners = function() {
    for (var i = 0; i < this._listeners.length; i++) {
        this._listeners[i](this);
    }
    return this;
};

