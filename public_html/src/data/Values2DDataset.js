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
 * A dataset representing a two dimensional table of values where each row is 
 * uniquely identified by a row key and each column is uniquely identified by
 * a column key.  In addition to the data values, properties can be defined at 
 * the dataset level, the row and column level, and the item level.
 *  
 * @interface
 */
jsfc.Values2DDataset = function() {
    throw new Error("Interface only.");
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
jsfc.Values2DDataset.prototype.add = function(rowKey, columnKey, value, notify) {
};

/**
 * Returns the number of rows in the dataset.
 * @returns {!number} The row count.
 */
jsfc.Values2DDataset.prototype.rowCount = function() {
};

/**
 * Returns the number of columns in the dataset.
 * @returns {!number} The column count.
 */
jsfc.Values2DDataset.prototype.columnCount = function() {
};

/**
 * Returns true if the dataset has zero rows and zero columns, and false
 * otherwise.
 * 
 * @returns {!boolean} A boolean.
 */
jsfc.Values2DDataset.prototype.isEmpty = function() {  
};

/**
 * Returns the data value in the cell with the specified row and column indices.
 * 
 * @param {!number} r  the row index.
 * @param {!number} c  the column index.
 * @returns {number} The data value.
 */
jsfc.Values2DDataset.prototype.valueByIndex = function(r, c) {
};

/**
 * Returns an array containing all the row keys for this dataset.
 * 
 * @returns {Array} An array of row keys.
 */
jsfc.Values2DDataset.prototype.rowKeys = function() {
};

/**
 * Returns an array containing all the column keys for this dataset.
 * 
 * @returns {Array} An array of column keys.
 */
jsfc.Values2DDataset.prototype.columnKeys = function() {
};

/**
 * Returns the key for the row with the specified index.
 * 
 * @param {!number} r  the row index.
 * @returns {string} The row key.
 */
jsfc.Values2DDataset.prototype.rowKey = function(r) {
};

/**
 * Returns the index of the row with the specified key, or -1 if there is no
 * such row.
 * 
 * @param {!string} key  the row key.
 * @returns {number} The row index, or -1.
 */
jsfc.Values2DDataset.prototype.rowIndex = function(key) {  
};

/**
 * Returns the column key at the specified index.
 * 
 * @param {!number} c  the column index.
 * @returns The column key.
 */
jsfc.Values2DDataset.prototype.columnKey = function(c) { 
};

/**
 * Returns the index of the column with the specified key, or -1 if there is no
 * such column.
 * 
 * @param {!string} key  the column key.
 * @returns {number} The column index, or -1.
 */
jsfc.Values2DDataset.prototype.columnIndex = function(key) {
};

/**
 * Returns the value (possibly null) of the cell identified by the supplied
 * row and column keys.
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @returns {number} The data value.
 */
jsfc.Values2DDataset.prototype.valueByKey = function(rowKey, columnKey) {
};

jsfc.Values2DDataset.prototype.getProperty = function(key) {
};

jsfc.Values2DDataset.prototype.setProperty = function(key, value, notify) {
};

jsfc.Values2DDataset.prototype.getPropertyKeys = function() {
};

jsfc.Values2DDataset.prototype.clearProperties = function(notify) {
};
    
/**
 * Returns an array containing the keys for the properties (if any) defined
 * on the specified row.
 * 
 * @param {!string} rowKey  the row key.
 * @returns {Array} An array of keys.
 */
jsfc.Values2DDataset.prototype.getRowPropertyKeys = function(rowKey) {
};

/**
 * Returns the value of a property for a row.
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.Values2DDataset.prototype.getRowProperty = function(rowKey, propertyKey) {             
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
jsfc.Values2DDataset.prototype.setRowProperty = function(rowKey, propertyKey, 
        value, notify) {
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
jsfc.Values2DDataset.prototype.clearRowProperties = function(rowKey, notify) {
};

/**
 * Returns an array containing all the keys for the properties defined for
 * the specified column.
 * 
 * @param {!string} columnKey  the column key.
 * @returns {Array} The property keys.
 */
jsfc.Values2DDataset.prototype.getColumnPropertyKeys = function(columnKey) {
};

/**
 * Returns the value of a property defined for the specified column.
 * 
 * @param {!string} columnKey  the column key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.Values2DDataset.prototype.getColumnProperty = function(columnKey, 
        propertyKey) {
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
jsfc.Values2DDataset.prototype.setColumnProperty = function(columnKey, 
        propertyKey, value, notify) {
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
jsfc.Values2DDataset.prototype.clearColumnProperties = function(columnKey,
        notify) {
};

/**
 * Returns a property for the specified data item.
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.Values2DDataset.prototype.getItemProperty = function(rowKey, columnKey, 
        propertyKey) {
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
jsfc.Values2DDataset.prototype.setItemProperty = function(rowKey, 
        columnKey, propertyKey, value, notify) {
};

/**
 * Returns the keys for the properties defined for a data item in the dataset.
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @returns {Array} An array containing the property keys.
 */
jsfc.Values2DDataset.prototype.getItemPropertyKeys = function(rowKey, 
        columnKey) {
};

/**
 * Clears all properties for one item and sends a change notification to
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @returns {undefined}
 */
jsfc.Values2DDataset.prototype.clearItemProperties = function(rowKey, 
        columnKey, notify) {
};
