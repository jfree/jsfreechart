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
 * Creates a new (empty) dataset.
 * @constructor
 * @classdesc A dataset that consists of a list of (key, value) pairs.  The keys
 *     must be non-null and unique within the dataset (the same key cannot be
 *     used twice).
 *     <br><br>
 *     A typical dataset would serialise to JSON format as follows:
 *     <blockquote><code>{"data":{"sections":[{"key":"A","value":1.1},{"key":"B","value":2.2},{"key":"C","value":3.3},{"key":"D","value":4.4}]},"selections":[{"id":"hilite","items":["B","C"]},{"id":"selection","items":["A"]}],"_listeners":[]}</code></blockquote>
`*/
jsfc.KeyedValuesDataset = function() {
    if (!(this instanceof jsfc.KeyedValuesDataset)) {
        return new jsfc.KeyedValuesDataset();
    }
    this.data = { "sections": [] };
    this.properties = [];
    this.selections = [];
    this._listeners = [];
};

/**
 * Returns the number of items in the dataset.
 * 
 * @returns {number} The item count.
 */
jsfc.KeyedValuesDataset.prototype.itemCount = function() {
    return this.data.sections.length;
};

/**
 * Returns true if the dataset contains no items and false otherwise.
 * 
 * @returns {boolean} A boolean.
 */
jsfc.KeyedValuesDataset.prototype.isEmpty = function() {
    return this.data.sections.length === 0;
};

/**
 * Returns the key for the section with the specified index.
 * 
 * @param {number} index  the section index.
 * 
 * @returns {string} The section key.
 */
jsfc.KeyedValuesDataset.prototype.key = function(index) {
    return this.data.sections[index].key;  
};

/**
 * Returns an array containing the keys for all the sections in the dataset.
 * 
 * @returns {Array} The keys.
 */
jsfc.KeyedValuesDataset.prototype.keys = function() {
    return this.data.sections.map(function(d) { return d.key; });
};

/**
 * Returns the index of the section with the specified key, or -1.
 * 
 * @param {string} sectionKey  the section key.
 * 
 * @returns {number} The section index.
 */
jsfc.KeyedValuesDataset.prototype.indexOf = function(sectionKey) {
    var arrayLength = this.data.sections.length;
    for (var i = 0; i < arrayLength; i++) {
        if (this.data.sections[i].key === sectionKey) {
            return i;
        }
    }
    return -1;
};

/**
 * Returns the value of the item with the specified index.
 * 
 * @param {number} index  the section index.
 * 
 * @returns {number} The section value.
 */
jsfc.KeyedValuesDataset.prototype.valueByIndex = function(index) {
    return this.data.sections[index].value;
};

/**
 * Returns the value for the section with the specified key.
 * 
 * @param {string} sectionKey  the section key.
 * @returns {number|null}
 */
jsfc.KeyedValuesDataset.prototype.valueByKey = function(sectionKey) {
    var sectionIndex = this.indexOf(sectionKey);
    if (sectionIndex < 0) {
        return null;
    }
    return this.valueByIndex(sectionIndex);
};

/**
 * Registers a listener to receive notification of changes to the dataset. The
 * listener must have a 'datasetChanged(KeyedValuesDataset)' method.
 * 
 * @param {Object} listener  the listener object.
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.addListener = function(listener) {
    this._listeners.push(listener);
    return this;
};

/**
 * Removes a listener so that it will no longer receive notification of changes
 * to this dataset.
 * 
 * @param {Object} listener the listener.
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.removeListener = function(listener) {
    var i = this._listeners.indexOf(listener);
    if (i >= 0) {
        this._listeners.splice(i, 1);
    }
    return this;
};

/**
 * Notifies all registered listeners that there has been a change to this dataset.
 * 
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.notifyListeners = function() {
    for (var i = 0; i < this._listeners.length; i++) {
        this._listeners[i].datasetChanged(this);
    }
    return this;
};

/**
 * Adds the specified key and value to the dataset (if the key exists already,
 * the value for that key is updated).
 * 
 * @param {string} sectionKey  the section key.
 * @param {number} value  the value.
 * @param {boolean} notify  notify listeners (optional, defaults to true).
 * 
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.add = function(sectionKey, value, notify) {
    var i = this.indexOf(sectionKey);
    if (i < 0) {
        this.data.sections.push({"key": sectionKey, "value": value});
        this.properties.push(new jsfc.Map());
    } else {
        this.data.sections[i].value = value;
    }
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Removes the item with the specified key and sends a change event to all 
 * registered listeners.
 * 
 * @param {string} sectionKey  the section key.
 * @param {boolean} [notify]  notify listeners (optional, defaults to true).
 * 
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.remove = function(sectionKey, notify) {
    if (!sectionKey) {
        throw new Error("The 'sectionKey' must be defined.");
    }
    var i = this.indexOf(sectionKey);
    if (i < 0) throw new Error("The sectionKey '" + sectionKey.toString() 
            + "' is not recognised.");
    this.data.sections.splice(i, 1);
    this.properties.splice(i, 1);
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Parses the supplied JSON-format string to populate the 'sections' attribute
 * for this dataset.
 * 
 * @param {string} jsonStr  a string in JSON format.
 * @param {boolean} [notify]  notify listeners (optional, defaults to true).
 * 
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.parse = function(jsonStr, notify) {
    this.data.sections = JSON.parse(jsonStr);
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Loads the supplied data array into the dataset.
 * 
 * @param {Array} data  an array of data items, where each data item is an
 * array containing two values, the key (a string) and the value (a number).
 * @param {boolean} [notify]  notify listeners?
 * 
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.load = function(data, notify) {
    this.data.sections = data;
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Removes the item with the specified index.
 * 
 * @param {number} itemIndex  the item index.
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.removeByIndex = function(itemIndex) {
    this.data.sections.splice(itemIndex, 1);
    this.properties.splice(itemIndex, 1);
    return this;
};

/**
 * Returns the total for all non-null values in the supplied dataset.
 * 
 * @param {jsfc.KeyedValuesDataset} dataset  the dataset.
 * @returns {number} The total of all non-null values.
 */
jsfc.KeyedValuesDataset.prototype.totalForDataset = function(dataset) {
  var total = 0.0;
  var itemCount = dataset.itemCount();
  for (var i = 0; i < itemCount; i++) {
    var v = dataset.valueByIndex(i);
    if (v) {
      total = total + v;
    }
  }
  return total;
};

/**
 * Returns the minimum value for the specified dataset.
 * 
 * @param {jsfc.KeyedValuesDataset} dataset  the dataset.
 * @returns {number} The minimum value.
 */
jsfc.KeyedValuesDataset.prototype.minForDataset = function(dataset) {
    var min = Number.NaN;
    var itemCount = dataset.itemCount();
    for (var i = 0; i < itemCount; i++) {
        var v = dataset.valueByIndex(i);
        if (v) {
            if (min) {
                min = Math.min(min, v);
            } else {
                min = v;
            }
        }
    }
    return min;
};

/**
 * Returns the maximum value for the specified dataset.
 * 
 * @param {jsfc.KeyedValuesDataset} dataset  the dataset.
 * @returns {number} The minimum value.
 */
jsfc.KeyedValuesDataset.prototype.maxForDataset = function(dataset) {
    var max = Number.NaN;
    var itemCount = dataset.itemCount();
    for (var i = 0; i < itemCount; i++) {
        var v = dataset.valueByIndex(i);
        if (v) {
            if (max) {
                max = Math.max(max, v);
            } else {
                max = v;
            }
        }
    }
    return max;
};

/**
 * Returns the total of all non-null values in this dataset.
 * 
 * @returns {number} The total.
 */
jsfc.KeyedValuesDataset.prototype.total = function() {
    return this.totalForDataset(this);
};

/**
 * Returns the minimum non-null value in this dataset.
 * 
 * @returns {number} The minimum value.
 */
jsfc.KeyedValuesDataset.prototype.min = function() {
  return this.minForDataset(this);
};

/**
 * Returns the maximum non-null value in this dataset.
 * 
 * @returns {number} The maximum value.
 */
jsfc.KeyedValuesDataset.prototype.max = function() {
  return this.maxForDataset(this);
};

/**
 * Returns an array containing the keys for the properties that are defined
 * for the specified section.
 * 
 * @param {string} sectionKey  the section key.
 * @returns {Array}
 */
jsfc.KeyedValuesDataset.prototype.propertyKeys = function(sectionKey) {
    var i = this.indexOf(sectionKey);
    var map = this.properties[i];
    if (map) {
        return map.keys();
    } else {
        return [];
    }
};

/**
 * Returns the value of a property defined for one item in the dataset.
 * 
 * @param {string} sectionKey
 * @param {string} propertyKey
 * @returns {*} The property value.
 */
jsfc.KeyedValuesDataset.prototype.getProperty = function(sectionKey, propertyKey) {
    var i = this.indexOf(sectionKey);
    return this.properties[i].get(propertyKey);    
};

/**
 * Sets a property for one data item in the dataset (or updates an existing
 * property).  Special properties include 'color', 'shape' and 'size'.
 * .  
 * @param {string} sectionKey
 * @param {string} propertyKey
 * @param {*} value
 * @returns {undefined}
 */
jsfc.KeyedValuesDataset.prototype.setProperty = function(sectionKey, 
        propertyKey, value) {
    var i = this.indexOf(sectionKey);
    if (i < 0) {
        throw new Error("Did not recognise 'sectionKey' " + sectionKey);
    }
    var map = this.properties[i];
    map.put(propertyKey, value);
};

/**
 * Clears all properties for one item.
 * 
 * @param {string} sectionKey  the section key.
 * @returns {undefined}
 */
jsfc.KeyedValuesDataset.prototype.clearProperties = function(sectionKey) {
    var i = this.indexOf(sectionKey);
    this.properties[i] = new jsfc.Map();
};

/**
 * Marks an item as selected within a selection with the specified ID.
 * 
 * @param {string} selectionId  the selection id.
 * @param {string} key  the section key.
 * 
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.select = function(selectionId, key) {
    var selection;
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex < 0) { // no selection with that id
        selection = {"id": selectionId, "items": []};
        this.selections.push(selection);
    } else {
        selection = this.selections[selectionIndex];
    }
    var i = selection.items.indexOf(key);
    if (i < 0) {
        selection.items.push(key);
    }
    return this;
};

/**
 * Unselects the specified item. 
 * 
 * @param {string} selectionId  the ID for the set of selected items.
 * @param {string} key  the section key.
 * 
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.unselect = function(selectionId, key) {
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex >= 0) {
        var selection = this.selections[selectionIndex];
        var i = selection.items.indexOf(key);
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
 * @param {string} key  the item key.
 * 
 * @returns {boolean} A boolean.
 */
jsfc.KeyedValuesDataset.prototype.isSelected = function(selectionId, key) {
    var selection;
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex < 0) {
        return false;
    } else {
        selection = this.selections[selectionIndex];
        return (selection.items.indexOf(key) >= 0); 
    }
};

/**
 * Clears any items from the selection with the specified id.
 * 
 * @param {string} selectionId  the selection id.
 * @param {boolean} [notify]  notify listeners (optional, the default value is true).
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.clearSelection = function(selectionId, notify) {
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
jsfc.KeyedValuesDataset.prototype._indexOfSelection = function(selectionId) {
    return jsfc.Utils.findInArray(this.selections, function(selection) {
        return selection.id === selectionId;
    });
};
