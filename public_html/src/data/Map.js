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
 * Constructor for a new (empty) Map.
 * @classdesc A simple map implementation (with ideas taken from 
 *     https://github.com/rauschma/strmap/blob/master/strmap.js).
 * @constructor     
 */
jsfc.Map = function() {
    this._data = {};
};

/**
 * Escapes any special key instances.
 * 
 * @param {!string} key  the key.
 * @returns {!string} The escaped key.
 */
jsfc.Map.prototype._escapeKey = function(key) {
    if (key.indexOf("__proto__") === 0) {
        return key + "%";
    } else {
        return key;
    }
};

/**
 * Returns true if the map contains an entry for the specified key, and false
 * otherwise.
 * 
 * @param {!string} key  the key.
 * @returns {!boolean}
 */
jsfc.Map.prototype.contains = function(key) {
    return Object.prototype.hasOwnProperty.call(this._data, key);       
};

/**
 * Returns an array of the keys that are defined for this map.
 * @returns {Array}
 */
jsfc.Map.prototype.keys = function() {
    return Object.keys(this._data);
};

/**
 * Adds a (key, value) pair to the map or, if an item already exists for the
 * specified key, updates the value for that item.
 * 
 * @param {string} key  the key.
 * @param {*} value  the value.
 * @returns {undefined}
 */
jsfc.Map.prototype.put = function(key, value) {
    key = this._escapeKey(key);
    this._data[key] = value;
};

/**
 * Returns the value of the property with the specified key, or 'undefined'
 * if there is no property with that key.
 * 
 * @param {!string} key  the property key.
 * 
 * @returns {*} The property value.
 */
jsfc.Map.prototype.get = function(key) {
    key = this._escapeKey(key);
    return this._getOwnPropertyValue(this._data, key);
};

/**
 * Returns a property value defined on the specified object.
 * 
 * @param {!Object} obj  the object.
 * @param {!string} prop  the property name.
 * @returns {*} The property value.
 */
jsfc.Map.prototype._getOwnPropertyValue = function(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop) ? obj[prop] 
            : undefined;    
};

/**
 * Removes the property with the specified key.
 * 
 * @param {!string} key  the property key.
 * 
 * @returns {*} The removed property entry.
 */
jsfc.Map.prototype.remove = function(key) {
    key = this._escapeKey(key);
    var value = this._getOwnPropertyValue(this._data, key);
    delete this._data[key];
    return value;
};
