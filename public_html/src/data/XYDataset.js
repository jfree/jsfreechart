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
 * A dataset containing an arbitrary number of data series where each series 
 * contains an arbitrary number of (x, y) data items.  In addition to the
 * data values, properties can be defined at the dataset level, the series 
 * level and the item level.
 *  
 * @interface
 */
jsfc.XYDataset = function() {
    throw new Error("Interface only.");
};

/**
 * Returns the value of a property for the dataset.
 * 
 * @param {!string} key  the property key.
 * @returns {*} The property value.
 */
jsfc.XYDataset.prototype.getProperty = function(key) {    
};

/**
 * Sets the value of a property for the dataset.
 * 
 * @param {!string} key  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (the default is true).
 */
jsfc.XYDataset.prototype.setProperty = function(key, value, notify) {    
};

/**
 * Returns an array containing all the keys of the properties defined for
 * this dataset.
 * 
 * @returns {Array}
 */
jsfc.XYDataset.prototype.getPropertyKeys = function() {
};

/**
 * Clears the dataset-level properties and sends a change notification to
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {boolean} [notify] notify listeners? (defaults to true).
 * @returns {jsfc.XYDataset} The dataset for chaining method calls.
 */
jsfc.XYDataset.prototype.clearProperties = function(notify) {  
};

/**
 * Returns the number of series in the dataset.
 * 
 * @returns {number} The series count.
 */
jsfc.XYDataset.prototype.seriesCount = function() {
};

/**
 * Returns an array containing the keys for all the series in the dataset.
 * 
 * @returns {Array} The series keys.
 */
jsfc.XYDataset.prototype.seriesKeys = function() {
};

/**
 * Returns the key for the series with the specified index.
 * 
 * @param {number} seriesIndex  the series index.
 * 
 * @returns {string} The series key.
 */
jsfc.XYDataset.prototype.seriesKey = function(seriesIndex) {
};

/**
 * Returns the index for the series with the specified key, or -1.
 * 
 * @param {string} seriesKey  the series key.
 * 
 * @returns {number} The series index.
 */
jsfc.XYDataset.prototype.seriesIndex = function(seriesKey) {
};

/**
 * Returns the number of items in the specified series.
 * 
 * @param {number} seriesIndex  the series index.
 * 
 * @returns {number} The item count.
 */
jsfc.XYDataset.prototype.itemCount = function(seriesIndex) {
};

/**
 * Returns the index of the item in the specified series that has the specified
 * item key.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @returns {!number} The item index.
 */
jsfc.XYDataset.prototype.itemIndex = function(seriesKey, itemKey) {
};

/**
 * Returns the x-value for an item in a series.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {number} The x-value.
 */
jsfc.XYDataset.prototype.x = function(seriesIndex, itemIndex) {
};

/**
 * Returns the y-value for an item in a series.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {number} The y-value.
 */
jsfc.XYDataset.prototype.y = function(seriesIndex, itemIndex) {  
};

/**
 * Returns one item from a series.  The return value is an object with the form
 * {"x": x, "y": y, "key": key}.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * @returns {Object} A data item.
 */
jsfc.XYDataset.prototype.item = function(seriesIndex, itemIndex) {
};

/**
 * Registers a listener to receive notification of changes to the dataset. The
 * listener must have a 'datasetChanged(KeyedValuesDataset)' method.
 * 
 * @param {Function} listener  the listener object.
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.XYDataset.prototype.addListener = function(listener) {
};

/**
 * Removes a listener so that it will no longer receive notification of changes
 * to this dataset.
 * 
 * @param {Function} listener the listener.
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.XYDataset.prototype.removeListener = function(listener) {
};

/**
 * The bounds for the data values.  This method returns an array in the form
 * [xmin, xmax, ymin, ymax].
 * 
 * @returns {Array} An array containing the dataset bounds.
 */
jsfc.XYDataset.prototype.bounds = function() {
};

/**
 * Returns [xmin, xmax] where xmin is the lowest x-value in the dataset and
 * xmax is this highest x-value in the dataset.  If the dataset is empty,
 * this method returns [POSITIVE_INFINITIY, NEGATIVE_INFINITY] (maybe we'll
 * change this).
 * 
 * @returns {Array}
 */
jsfc.XYDataset.prototype.xbounds = function() {
};

/**
 * Returns [ymin, ymax] where ymin is the lowest y-value in the dataset and
 * xmax is this highest y-value in the dataset.  If the dataset is empty,
 * this method returns [POSITIVE_INFINITIY, NEGATIVE_INFINITY] (maybe we'll
 * change this).
 * 
 * @returns {Array}
 */
jsfc.XYDataset.prototype.ybounds = function() {   
};

/**
 * Returns a property for the specified data item.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.XYDataset.prototype.getItemProperty = function(seriesKey, itemKey, 
        propertyKey) {
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
jsfc.XYDataset.prototype.setItemProperty = function(seriesKey, 
        itemKey, propertyKey, value, notify) {
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
jsfc.XYDataset.prototype.select = function(selectionId, seriesKey, itemKey, 
        notify) {
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
jsfc.XYDataset.prototype.unselect = function(selectionId, seriesKey, itemKey) {
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
jsfc.XYDataset.prototype.isSelected = function(selectionId, seriesKey, 
        itemKey) {
};

/**
 * Clears any items from the selection with the specified id.
 * 
 * @param {string} selectionId  the selection it.
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.XYDataset.prototype.clearSelection = function(selectionId) {
};
