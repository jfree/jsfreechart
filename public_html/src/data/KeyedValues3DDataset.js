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
 * @classdesc A dataset that is a three-dimensional table where... 
 */
jsfc.KeyedValues3DDataset = function() {
    if (!(this instanceof jsfc.KeyedValues3DDataset)) {
        return new jsfc.KeyedValues3DDataset();
    }
    this.data = { "columnKeys": [], "rowKeys": [], "series": [] };
    this.properties = [];
    this._listeners = [];
};

/**
 * Returns true if the dataset is empty and false otherwise.
 * @returns {boolean}
 */
jsfc.KeyedValues3DDataset.prototype.isEmpty = function() {
    return this.data.columnKeys.length === 0 
            && this.data.rowKeys.length === 0;
};


/**
 * Returns the number of series in the dataset.
 * @returns {number} The series count.
 */
jsfc.KeyedValues3DDataset.prototype.seriesCount = function() {
    return this.data.series.length;  
};

/**
 * Returns the number of rows in the dataset.
 * @returns {number}
 */
jsfc.KeyedValues3DDataset.prototype.rowCount = function() {
    return this.data.rowKeys.length;
};

/**
 * Returns the number of columns in the dataset.
 * @returns {number}
 */
jsfc.KeyedValues3DDataset.prototype.columnCount = function() {
    return this.data.columnKeys.length; 
};

/**
 * Returns one row from the dataset.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {string} rowKey  the row key.
 * @returns {Object} The row.
 */
jsfc.KeyedValues3DDataset.prototype._fetchRow = function(seriesIndex, rowKey) {
    var rows = this.data.series[seriesIndex].rows;
    for (var r = 0; r < rows.length; r++) {
        if (rows[r].rowKey === rowKey) {
            return rows[r];
        }
    }
    return null;
};

/**
 * Returns a value by series, row and column index.
 * 
 * @param {number} seriesIndex
 * @param {number} rowIndex
 * @param {number} columnIndex
 * @returns {number|null} The value.
 */
jsfc.KeyedValues3DDataset.prototype.valueByIndex = function(seriesIndex, 
        rowIndex, columnIndex) {
    var rowKey = this.rowKey(rowIndex);
    var row = this._fetchRow(seriesIndex, rowKey);
    if (row === null) {
        return null;
    } else {
        return row.values[columnIndex];
    }
};

/**
 * Returns the index of the series with the specified key, or -1.
 * @param {string} seriesKey  the series key.
 * @returns {number} The series index, or -1.
 */
jsfc.KeyedValues3DDataset.prototype.seriesIndex = function(seriesKey) {
    var seriesCount = this.seriesCount();
    for (var s = 0; s < seriesCount; s++) {
        if (this.data.series[s].seriesKey === seriesKey) {
            return s;
        }
    }
    return -1;
};

/**
 * Returns the key for the series with the specified index.
 * @param {number} seriesIndex
 * @returns {string} The series key.
 */
jsfc.KeyedValues3DDataset.prototype.seriesKey = function(seriesIndex) {
    return this.data.series[seriesIndex].seriesKey;  
};

/**
 * Returns the key for the row with the specified index.
 * @param {number} rowIndex  the row index.
 * @returns {string} The row key.
 */
jsfc.KeyedValues3DDataset.prototype.rowKey = function(rowIndex) {
    return this.data.rowKeys[rowIndex];  
};

/**
 * Returns the index of the row with the specified key.
 * @param {string} rowKey  the row key.
 * @returns {number} The row index.
 */
jsfc.KeyedValues3DDataset.prototype.rowIndex = function(rowKey) {
    var rowCount = this.data.rowKeys.length;
    for (var r = 0; r < rowCount; r++) {
        if (this.data.rowKeys[r] === rowKey) {
            return r;
        }
    }
    return -1;
};

/**
 * Returns all the row keys.
 * 
 * @returns {Array} The row keys.
 */
jsfc.KeyedValues3DDataset.prototype.rowKeys = function() {
    return this.data.rowKeys.map(function(d) { return d; });
};
 
/**
 * Returns the key for the column with the specified index.
 * @param {number} columnIndex  the column index.
 * @returns {string} The column key.
 */
jsfc.KeyedValues3DDataset.prototype.columnKey = function(columnIndex) {
    return this.data.columnKeys[columnIndex];
};

/**
 * Returns the index of the column with the specified key.
 * @param {string} columnKey  the column key.
 * @returns {number} The column index.
 */
jsfc.KeyedValues3DDataset.prototype.columnIndex = function(columnKey) {
    var columnCount = this.data.columnKeys.length;
    for (var c = 0; c < columnCount; c++) {
        if (this.data.columnKeys[c] === columnKey) {
            return c;
        }
    }
    return -1;
};
 
/**
 * Returns all the column keys.
 * 
 * @returns {Array} The column keys.
 */
jsfc.KeyedValues3DDataset.prototype.columnKeys = function() {
    return this.data.columnKeys.map(function(d) { return d; });    
};
 
/**
 * Returns the value for the item identified by the specified series, row and
 * column keys.
 * @param {string} seriesKey  the series key.
 * @param {string} rowKey  the row key.
 * @param {string} columnKey  the column key.
 * @returns {number|null} The value (possibly null).
 */
jsfc.KeyedValues3DDataset.prototype.valueByKey = function(seriesKey, rowKey, 
        columnKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var row = this._fetchRow(seriesIndex, rowKey);
    if (row === null) {
        return null;
    } else {
        var columnIndex = this.columnIndex(columnKey);
        return row.values[columnIndex];
    }
};

/**
 * Adds a listener to the dataset (the listener method will be called whenever 
 * the dataset is modified)
 * @param {*} listener
 * @returns {undefined}
 */
jsfc.KeyedValues3DDataset.prototype.addListener = function(listener) {
    this._listeners.push(listener);  
};

/**
 * Deregisters the specified listener so that it no longer receives
 * notification of dataset changes.
 * 
 * @param {*} listener  the listener.
 * @returns {undefined}
 */
jsfc.KeyedValues3DDataset.prototype.removeListener = function(listener) {
    var i = this._listeners.indexOf(listener);
    if (i >= 0) {
        this._listeners.splice(i, 1);
    }
};

/**
 * Notifies all registered listeners that there has been a change to this 
 * dataset.
 * @returns {jsfc.KeyedValues3DDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValues3DDataset.prototype.notifyListeners = function() {
    for (var i = 0; i < this._listeners.length; i++) {
        this._listeners[i].datasetChanged(this);
    }
    return this;
};

/**
 * Adds a value to the dataset (or updates an existing value).
 * @param {string} seriesKey
 * @param {string} rowKey
 * @param {string} columnKey
 * @param {number} value
 * @returns {jsfc.KeyedValues3DDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValues3DDataset.prototype.add = function(seriesKey, rowKey, 
    columnKey, value) {

    if (this.isEmpty()) {
        this.data.rowKeys.push(rowKey);
        this.data.columnKeys.push(columnKey);
        this.data.series.push({"seriesKey": seriesKey, 
            "rows": [{ "rowKey": rowKey, "values": [value]}]});
        this.properties.push({"seriesKey": seriesKey, 
            "rows": [{ "rowKey": rowKey, "maps": [null]}]});
    } else {
        var seriesIndex = this.seriesIndex(seriesKey);
        if (seriesIndex < 0) {
            this.data.series.push({"seriesKey": seriesKey, "rows": []});
            this.properties.push({"seriesKey": seriesKey, "rows": []});
            seriesIndex = this.data.series.length - 1;
        }
        var columnIndex = this.columnIndex(columnKey);
        if (columnIndex < 0) {
            // add the column key and insert a null data item in all existing rows
            this.data.columnKeys.push(columnKey);
            for (var s = 0; s < this.data.series.length; s++) {
                var rows = this.data.series[s].rows;
                for (var r = 0; r < rows.length; r++) {
                    rows[r].values.push(null);
                }
            }
            for (var s = 0; s < this.properties.length; s++) {
                 var rows = this.properties[s].rows;
                 for (var r = 0; r < rows.length; r++) {
                     rows[r].maps.push(null);
                 }
            }
            columnIndex = this.columnCount() - 1;
        }
        var rowIndex = this.rowIndex(rowKey);
        if (rowIndex < 0) {
            this.data.rowKeys.push(rowKey);
            // add the row for the current series only
            var rowData = jsfc.Utils.makeArrayOf(null, this.columnCount());
            rowData[columnIndex] = value;
            this.data.series[seriesIndex].rows.push({ "rowKey": rowKey, "values": rowData}); 
            var rowMaps = jsfc.Utils.makeArrayOf(null, this.columnCount());
            this.properties[seriesIndex].rows.push({"rowKey": rowKey, "maps": rowMaps});
        } else {
            var row = this._fetchRow(seriesIndex, rowKey);
            if (row !== null) {
                row.values[columnIndex] = value;
            } else {
                var rowData = jsfc.Utils.makeArrayOf(null, this.columnCount());
                rowData[columnIndex] = value;
                this.data.series[seriesIndex].rows.push({"rowKey": rowKey, "values": rowData}); 
            }
            var propRow = this._fetchPropertyRow(seriesIndex, rowKey);
            if (propRow === null) {
                var rowMaps = jsfc.Utils.makeArrayOf(null, this.columnCount());
                this.properties[seriesIndex].rows.push({"rowKey": rowKey, 
                        "maps": rowMaps}); 
            }
        }
    }
    return this;
};

/**
 * Parses a JSON formatted string containing data.
 * 
 * @param {string} jsonStr  the JSON string.
 * @returns {jsfc.KeyedValues3DDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValues3DDataset.prototype.parse = function(jsonStr) {
    this.load(JSON.parse(jsonStr));
    return this;
};

/**
 * Loads a data object into the dataset directly, replacing any data that
 * already exists.  All properties are cleared.
 * 
 * @param {Object} dataObj  the data object.
 * 
 * @returns {jsfc.KeyedValues3DDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValues3DDataset.prototype.load = function(dataObj) {
    this.data = dataObj;
    if (!this.data.hasOwnProperty("rowKeys")) {
        this.data.rowKeys = [];
    }
    if (!this.data.hasOwnProperty("columnKeys")) {
        this.data.columnKeys = [];
    }
    if (!this.data.hasOwnProperty("series")) {
        this.data.series = [];
    }
    this.clearAllProperties(); // this rebuilds the properties data structure
    this.notifyListeners();
    return this;
};

/**
 * Returns a property for the specified data item.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string} rowKey  the row key.
 * @param {string} columnKey  the column key.
 * @param {string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.KeyedValues3DDataset.prototype.getProperty = function(seriesKey, rowKey, 
        columnKey, propertyKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var rowIndex = this.rowIndex(rowKey);
    var columnIndex = this.columnIndex(columnKey);
    var map = this.properties[seriesIndex].rows[rowIndex][columnIndex];
    if (map) {
        return map.get(propertyKey);
    }
};

/**
 * Sets a property for the specified data item.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string} rowKey  the row key.
 * @param {string} columnKey  the column key.
 * @param {string} propertyKey  the property key.
 * @param {*} value
 * @returns {undefined}
 */
jsfc.KeyedValues3DDataset.prototype.setProperty = function(seriesKey, rowKey, 
        columnKey, propertyKey, value) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var rowIndex = this.rowIndex(rowKey);
    var columnIndex = this.columnIndex(columnKey);
    var map = this.properties[seriesIndex].rows[rowIndex][columnIndex];
    if (!map) {
        map = new jsfc.Map();
        this.properties[seriesIndex].rows[rowIndex][columnIndex] = map;
    }
    map.put(propertyKey, value);
};

/**
 * Returns the keys for the properties defined for a data item in the dataset.
 * 
 * @param {string} seriesKey
 * @param {string} rowKey
 * @param {string} columnKey
 * @returns {Array} An array containing the property keys.
 */
jsfc.KeyedValues3DDataset.prototype.propertyKeys = function(seriesKey,
        rowKey, columnKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var rowIndex = this.rowIndex(rowKey);
    var columnIndex = this.columnIndex(columnKey);
    var map = this.properties[seriesIndex].rows[rowIndex][columnIndex];
    if (map) {
        return map.keys();
    } else {
        return [];
    }
};

/**
 * Clears all properties for one item.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the series key.
 * @returns {undefined}
 */
jsfc.KeyedValues3DDataset.prototype.clearProperties = function(seriesKey, 
        rowKey, columnKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var row = this._fetchPropertyRow(seriesIndex, rowKey);
    if (row) {
        var columnIndex = this.columnIndex(columnKey);
        row[columnIndex] = null;
    }
};

/**
 * Clears all the properties for the dataset.
 * 
 * @returns {jsfc.KeyedValues3DDataset} This dataset (for chaining method 
 *     calls).
 */
jsfc.KeyedValues3DDataset.prototype.clearAllProperties = function() {
    this.properties = [];
    var me = this;
    this.data.series.forEach(function(series) {
        var s = {"seriesKey": series.seriesKey, "rows": []};
        me.properties.push(s);
        series.rows.forEach(function(row) {
            var maps = jsfc.Utils.makeArrayOf(null, me.columnCount());
            var r = {"rowKey": row.rowKey, "maps": maps};
            s.rows.push(r);
        });
    });
    return this;
};

/**
 * Returns one row from the properties.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {string} rowKey  the row key.
 * @returns {Object} The row.
 */
jsfc.KeyedValues3DDataset.prototype._fetchPropertyRow = function(seriesIndex, 
        rowKey) {
    var rows = this.properties[seriesIndex].rows;
    for (var r = 0; r < rows.length; r++) {
        if (rows[r].rowKey === rowKey) {
            return rows[r];
        }
    }
    return null;
};

