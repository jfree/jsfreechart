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
 * @constructor
 * @implements {jsfc.Values2DDataset}
 * @classdesc A dataset that is a two-dimensional table where each column is 
 *     identified by a unique key, each row is identified by a unique key, and
 *     each element (identified by a (rowKey, columnKey) pair) contains a 
 *     numeric value (possibly null).  Such a table can be used to create
 *     bar and stacked-bar charts, where each row represents a data series and
 *     the columns represent the items within the data series.
 *     <p>A typical dataset will serialise to JSON format as follows:</p>
 *     <blockquote>{"data":{"columnKeys":["C1","C2","C3"],"rows":[{"key":"R1","values":[1.1,2.2,3.3]},{"key":"R2","values":[4.4,6.6,null]}]},"selections":[{"id":"hilite","items":[{"rowKey":"R2","columnKey":"C1"},{"rowKey":"R2","columnKey":"C2"}]},{"id":"selection","items":[{"rowKey":"R1","columnKey":"C1"}]}],"_listeners":[]}</blockquote>
 */
jsfc.KeyedValues2DDataset = function() {
    if (!(this instanceof jsfc.KeyedValues2DDataset)) {
        return new jsfc.KeyedValues2DDataset();
    }
    this.data = { "columnKeys": [], "rows": []};
    // the 'dataset' properties will be stored in a jsfc.Map, for the column
    // properties there will be one entry in the array per column, and for
    // the row properties there will be one entry per row (either null or a
    // jsfc.Map)
    this.properties = { "dataset": null, "columns": [], "rows": [] };
    this.selections = [];
    this._rowKeyToIndexMap = new jsfc.Map();
    this._columnKeyToIndexMap = new jsfc.Map();
    this._listeners = [];
};

/**
 * Returns the number of rows in the dataset.
 * @returns {!number} The row count.
 */
jsfc.KeyedValues2DDataset.prototype.rowCount = function() {
    return this.data.rows.length;
};

/**
 * Returns the number of columns in the dataset.
 * @returns {!number} The column count.
 */
jsfc.KeyedValues2DDataset.prototype.columnCount = function() {
    return this.data.columnKeys.length; 
};

/**
 * Returns true if the dataset is empty, and false otherwise.  Note that a 
 * dataset that contains all null values or all zero values is not considered
 * empty - it is required that the dataset contains zero rows and zero columns
 * to be considered empty.
 * 
 * @returns {boolean} A boolean.
 */
jsfc.KeyedValues2DDataset.prototype.isEmpty = function() {
    if (!this.data.hasOwnProperty("columnKeys")) {
        return true;
    }
    return (this.data.columnKeys.length === 0 && this.data.rows.length === 0);
};

/**
 * Adds a value to the dataset for the specified cell identified by the row
 * and column keys.  If necessary, a new row and/or column will be added to the
 * dataset.
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @param {number} value  the value.
 * @param {boolean} [notify]  notify listeners? (the default is true).
 * @returns {jsfc.KeyedValues2DDataset} This dataset for chaining method calls.
 */
jsfc.KeyedValues2DDataset.prototype.add = function(rowKey, columnKey, value, 
        notify) {
    if (this.isEmpty()) {
        this.data.columnKeys.push(columnKey);
        this._columnKeyToIndexMap.put(columnKey, 0);
        this.data.rows.push({"key": rowKey, "values": [value]});
        this.properties.columns.push(null);
        this.properties.rows.push({"key": rowKey, "rowProperties": null, 
            "maps": [null]});
        this._rowKeyToIndexMap.put(rowKey, 0);
        return this;
    }
    var columnIndex = this.columnIndex(columnKey);
    if (columnIndex < 0) {
        // add the column key and insert a null data item in all existing rows
        var i = this.data.columnKeys.push(columnKey);
        this._columnKeyToIndexMap.put(columnKey, i - 1);
        this.properties.columns.push(null);
        var rowCount = this.data.rows.length;
        for (var r = 0; r < rowCount; r++) {
            this.data.rows[r].values.push(null);
            this.properties.rows[r].maps.push(null);
        }
        columnIndex = this.columnCount() - 1;
    }
    var rowIndex = this.rowIndex(rowKey);
    if (rowIndex < 0) {
        var rowData = new Array(this.columnCount());
        rowData[columnIndex] = value;
        var i = this.data.rows.push({"key": rowKey, "values": rowData});
        this._rowKeyToIndexMap.put(rowKey, i - 1);
        var rowItemProperties = new Array(this.columnCount());
        this.properties.rows.push({"key": rowKey, "maps": rowItemProperties});
    } else {
        // update an existing data item
        this.data.rows[rowIndex].values[columnIndex] = value;
    }
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Inserts a new row in the dataset, containing undefined values, at the 
 * specified index and assigns the supplied rowKey.
 * 
 * @param {!string} rowKey  the row key (should be a key that does not already
 *         appear in the list of row keys for the dataset).
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.KeyedValues2DDataset.prototype.insertRow = function(rowKey, rowIndex, 
        notify) {
    if (this.rowIndex(rowKey) >= 0) {
        throw new Error("The 'rowKey' (" + rowKey 
                + ") already exists in the dataset.");
    }
    var items = jsfc.Utils.makeArrayOf(undefined, this.columnCount());
    this.data.rows.splice(rowIndex, 0, {"key": rowKey, "values": items});
    this._rowKeyToIndexMap = this._buildKeyMap(this.rowKeys());
    if (notify !== false) {
        this.notifyListeners();
    }
};
        
/**
 * Parses the supplied JSON-format string to populate the 'data' attribute
 * for this dataset.
 * 
 * @param {string} jsonStr  a string in JSON format.
 * @param {boolean} [notify]  notify listeners (optional, defaults to true).
 * 
 * @returns {jsfc.KeyedValues2DDataset} This dataset (for chaining method 
 *         calls).
 */
jsfc.KeyedValues2DDataset.prototype.parse = function(jsonStr, notify) {
    this.load(JSON.parse(jsonStr));
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Loads the supplied data object into the dataset.  The object must be either
 * an empty object {} or an object with properties "columnKeys" (an array of 
 * strings) and "rows" (an array of row objects, where each row object has a 
 * "key" attribute (a string that is the unique key identifying the row, and a 
 * "values" array containing the data values (there should be the same number 
 * of values as there are columns in the dataset - data values can be null.
 * 
 * @param {*} data  the data object.
 * @param {boolean} [notify]  notify listeners? (optional, defaults to true).
 * 
 * @returns {jsfc.KeyedValues2DDataset} This dataset (for chaining method 
 *         calls).
 */
jsfc.KeyedValues2DDataset.prototype.load = function(data, notify) {
    this.data = data;
    if (!this.data.hasOwnProperty("rows")) {
        this.data.rows = [];
    }
    if (!this.data.hasOwnProperty("columnKeys")) {
        this.data.columnKeys = [];
    }
    this._columnKeyToIndexMap = this._buildKeyMap(this.data.columnKeys);
    this._rowKeyToIndexMap = this._buildKeyMap(this.rowKeys());
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

jsfc.KeyedValues2DDataset.prototype._buildKeyMap = function(keys) {
    var map = new jsfc.Map();
    for (var i = 0; i < keys.length; i++) {
        map.put(keys[i], i);
    }
    return map;
};

/**
 * Returns the data value in the cell with the specified row and column indices.
 * 
 * @param {!number} r  the row index.
 * @param {!number} c  the column index.
 * @returns {number} The data value.
 */
jsfc.KeyedValues2DDataset.prototype.valueByIndex = function(r, c) {
    return this.data.rows[r].values[c];
};

/**
 * Returns the key for the row with the specified index.
 * 
 * @param {!number} r  the row index.
 * @returns {string} The row key.
 */
jsfc.KeyedValues2DDataset.prototype.rowKey = function(r) {
    return this.data.rows[r].key;
};

/**
 * Returns the index of the row with the specified key, or -1 if there is no
 * such row.
 * 
 * @param {!string} key  the row key.
 * @returns {number} The row index, or -1.
 */
jsfc.KeyedValues2DDataset.prototype.rowIndex = function(key) {
    var r = this._rowKeyToIndexMap.get(key);
    if (r !== undefined) {
        return r;
    }
    return -1;    
};

/**
 * Returns an array containing all the row keys for this dataset in the order
 * of their respective row indices.
 * 
 * @returns {Array} An array of row keys.
 */
jsfc.KeyedValues2DDataset.prototype.rowKeys = function() {
    return this.data.rows.map(function(d) { return d.key; }); 
};

/**
 * Returns the column key at the specified index.
 * 
 * @param {!number} c  the column index.
 * @returns The column key.
 */
jsfc.KeyedValues2DDataset.prototype.columnKey = function(c) {
    return this.data.columnKeys[c];  
};

/**
 * Returns the index of the column with the specified key, or -1 if there is no
 * such column.
 * 
 * @param {!string} key  the column key.
 * @returns {number} The column index, or -1.
 */
jsfc.KeyedValues2DDataset.prototype.columnIndex = function(key) {
    var c = this._columnKeyToIndexMap.get(key);
    if (c !== undefined) {
        return c;
    }
    return -1;    
};

/**
 * Returns an array containing all the column keys for this dataset.
 * 
 * @returns {Array} An array of column keys.
 */
jsfc.KeyedValues2DDataset.prototype.columnKeys = function() {
    return this.data.columnKeys.map(function(d) { return d; });
};

/**
 * Returns the value (possibly null) of the cell identified by the supplied
 * row and column keys.
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @returns {number} The data value.
 */
jsfc.KeyedValues2DDataset.prototype.valueByKey = function(rowKey, columnKey) {
    var r = this.rowIndex(rowKey);
    var c = this.columnIndex(columnKey);
    return this.valueByIndex(r, c);
};

/**
 * Returns the value of a property for the dataset.
 * 
 * @param {!string} key  the property key.
 * @returns {*} The property value.
 */
jsfc.KeyedValues2DDataset.prototype.getProperty = function(key) {
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
jsfc.KeyedValues2DDataset.prototype.setProperty = function(key, value, notify) {
    if (!this.properties.dataset) {
        this.properties.dataset = new jsfc.Map();
    }
    this.properties.dataset.put(key, value);
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
jsfc.KeyedValues2DDataset.prototype.getPropertyKeys = function() {
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
 * @returns {jsfc.KeyedValues2DDataset} This dataset for chaining method calls.
 */
jsfc.KeyedValues2DDataset.prototype.clearProperties = function(notify) {
    this.properties.dataset = null;
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Returns an array containing the keys for the properties (if any) defined
 * on the specified row.
 * 
 * @param {!string} rowKey  the row key.
 * @returns {Array} An array of keys.
 */
jsfc.KeyedValues2DDataset.prototype.getRowPropertyKeys = function(rowKey) {
    var r = this.rowIndex(rowKey);
    var map = this.properties.rows[r].rowProperties;
    if (map) {
        return map.keys();
    } else {
        return [];
    }
};

/**
 * Returns the value of a property for a row.
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.KeyedValues2DDataset.prototype.getRowProperty = function(rowKey, 
        propertyKey) {
    var r = this.rowIndex(rowKey);
    var map = this.properties.rows[r].rowProperties;
    if (map) {
        return map.get(propertyKey);
    } else {
        return undefined;
    }                
};

/**
 * Sets a property for a row and sends a change notification to all 
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} propertyKey  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.KeyedValues2DDataset.prototype.setRowProperty = function(rowKey, 
        propertyKey, value, notify) {
    var r = this.rowIndex(rowKey);
    var map = this.properties.rows[r].rowProperties;
    if (!map) {
        map = new jsfc.Map();
        this.properties.rows[r].rowProperties = map;
    }
    map.put(propertyKey, value);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Clears the row properties for the specified row and sends a change 
 * notification to registered listeners (unless 'notify' is set to false).
 * 
 * @param {!string} rowKey  the row key.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * 
 * @returns {undefined}
 */
jsfc.KeyedValues2DDataset.prototype.clearRowProperties = function(rowKey, 
        notify) {
    var r = this.rowIndex(rowKey);
    this.properties.rows[r].rowProperties = null;    
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns an array containing all the keys for the properties defined for
 * the specified column.
 * 
 * @param {!string} columnKey  the column key.
 * @returns {Array} The property keys.
 */
jsfc.KeyedValues2DDataset.prototype.getColumnPropertyKeys = function(columnKey) {
    var c = this.columnIndex(columnKey);
    var map = this.properties.columns[c];
    if (map) {
        return map.keys();
    } else {
        return [];
    }
};

/**
 * Returns the value of a property defined for the specified column.
 * 
 * @param {!string} columnKey  the column key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.KeyedValues2DDataset.prototype.getColumnProperty = function(columnKey, 
        propertyKey) {
    var c = this.columnIndex(columnKey);
    var map = this.properties.columns[c];
    if (map) {
        return map.get(propertyKey);
    } else {
        return undefined;
    }
};

/**
 * Sets a property for a column and sends a change notification to registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {!string} columnKey  the column key.
 * @param {!string} propertyKey  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.KeyedValues2DDataset.prototype.setColumnProperty = function(columnKey, 
        propertyKey, value, notify) {
    var c = this.columnIndex(columnKey);
    var map = this.properties.columns[c];
    if (!map) {
        map = new jsfc.Map();
        this.properties.columns[c] = map;
    }
    map.put(propertyKey, value);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Clears all the column properties for the specified column and sends a 
 * change notification to registered listeners (unless 'notify' is set to 
 * false).
 * 
 * @param {!string} columnKey  the column key.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.KeyedValues2DDataset.prototype.clearColumnProperties = function(columnKey,
        notify) {
    var c = this.columnIndex(columnKey);
    this.properties.columns[c] = null;      
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns a property for the specified data item.
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.KeyedValues2DDataset.prototype.getItemProperty = function(rowKey, 
        columnKey, propertyKey) {
    var r = this.rowIndex(rowKey);
    var c = this.columnIndex(columnKey);
    var map = this.properties.rows[r][c];
    if (map) {
        return map.get(propertyKey);
    }
};

/**
 * Sets a property for the specified data item and sends a change notification
 * to all registered listeners (unless 'notify' is set to false).
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @param {!string} propertyKey  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.KeyedValues2DDataset.prototype.setItemProperty = function(rowKey, 
        columnKey, propertyKey, value, notify) {
    var r = this.rowIndex(rowKey);
    var c = this.columnIndex(columnKey);
    var map = this.properties.rows[r][c];
    if (!map) {
        map = new jsfc.Map();
        this.properties.rows[r][c] = map;
    }
    map.put(propertyKey, value);
};

/**
 * Returns the keys for the properties defined for a data item in the dataset.
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @returns {Array} An array containing the property keys.
 */
jsfc.KeyedValues2DDataset.prototype.getItemPropertyKeys = function(rowKey, 
        columnKey) {
    var r = this.rowIndex(rowKey);
    var c = this.columnIndex(columnKey);
    var map = this.properties.rows[r][c];
    if (map) {
        return map.keys();
    } else {
        return [];
    }
};

/**
 * Clears all properties for one item and sends a change notification to
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @returns {undefined}
 */
jsfc.KeyedValues2DDataset.prototype.clearItemProperties = function(rowKey, 
        columnKey, notify) {
    var r = this.rowIndex(rowKey);
    var c = this.columnIndex(columnKey);
    this.properties.rows[r][c] = null;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Marks an item as selected within a selection with the specified ID.
 * 
 * @param {string} selectionId  the selection id.
 * @param {string} rowKey  the row key.
 * @param {string} columnKey  the column key.
 * 
 * @returns {jsfc.KeyedValues2DDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValues2DDataset.prototype.select = function(selectionId, rowKey, 
        columnKey) {
    var selection;
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex < 0) { // no selection with that id
        selection = {"id": selectionId, "items": []};
        this.selections.push(selection);
    } else {
        selection = this.selections[selectionIndex];
    }
    var i = jsfc.Utils.findInArray(selection.items, function(item) {
        return (item.rowKey === rowKey && item.columnKey === columnKey); 
    });
    if (i < 0) {
        selection.items.push({"rowKey": rowKey, "columnKey": columnKey});
    }
    return this;
};

/**
 * Resets the selection state of the specified item. 
 * 
 * @param {string} selectionId  the ID for the set of selected items.
 * @param {string} rowKey  the row key.
 * @param {string} columnKey  the column key.
 * 
 * @returns {jsfc.KeyedValues2DDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValues2DDataset.prototype.unselect = function(selectionId, rowKey, 
        columnKey) {
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex >= 0) {
        var selection = this.selections[selectionIndex];
        var i = jsfc.Utils.findInArray(selection.items, function(obj, i) {
            return (obj.rowKey === rowKey && obj.columnKey === columnKey); 
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
 * @param {string} rowKey  the row key.
 * @param {string} columnKey  the column key.
 * 
 * @returns {boolean} A boolean (the selection state).
 */
jsfc.KeyedValues2DDataset.prototype.isSelected = function(selectionId, rowKey, 
        columnKey) {
    var selection;
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex < 0) {
        return false;
    } else {
        selection = this.selections[selectionIndex];
    }
    return (jsfc.Utils.findInArray(selection.items, function(obj) {
        return (obj.rowKey === rowKey && obj.columnKey === columnKey); 
    }) >= 0); 
};

/**
 * Clears any items from the selection with the specified id.
 * 
 * @param {string} selectionId  the selection ID.
 * @returns {jsfc.KeyedValues2DDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValues2DDataset.prototype.clearSelection = function(selectionId) {
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex >= 0) {
        this.selections.splice(selectionIndex, 1);
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
jsfc.KeyedValues2DDataset.prototype._indexOfSelection = function(selectionId) {
    return jsfc.Utils.findInArray(this.selections, function(item) {
        return item.id === selectionId;
    });
};

/**
 * Registers a listener to receive notification of changes to the dataset.
 * @param {Object} listener  the listener.
 * @returns {jsfc.KeyedValues2DDataset} This dataset (for chaining method 
 *         calls).
 */
jsfc.KeyedValues2DDataset.prototype.addListener = function(listener) {
    this._listeners.push(listener);
    return this;
};

/**
 * Deregisters a listener so that it no longer receives notification of changes
 * to the dataset.
 * 
 * @param {Object} listener  the listener.
 * @returns {jsfc.KeyedValues2DDataset} This dataset (for chaining method 
 *         calls).
 */
jsfc.KeyedValues2DDataset.prototype.removeListener = function(listener) {
    var i = this._listeners.indexOf(listener);
    if (i >= 0) {
        this._listeners.splice(i, 1);
    }
    return this;
};

/**
 * Notifies all registered listeners that there has been a change to this 
 * dataset.
 * 
 * @returns {jsfc.KeyedValues2DDataset} This dataset (for chaining method 
 *         calls).
 */
jsfc.KeyedValues2DDataset.prototype.notifyListeners = function() {
    for (var i = 0; i < this._listeners.length; i++) {
        this._listeners[i].datasetChanged(this);
    }
    return this;
};

