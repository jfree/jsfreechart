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
 * Creates a new instance.
 * 
 * @class A record that defines a combination of modifier keys.  The mouse 
 * handlers will specify a modifier combination that can be used to trigger the
 * handler.
 * 
 * @constructor 
 * @param {boolean} [altKey]  requires ALT key?
 * @param {boolean} [ctrlKey]  requires CTRL key?
 * @param {boolean} [metaKey]  requires META key?
 * @param {boolean} [shiftKey]  requires SHIFT key?
 * @returns {undefined}
 */
jsfc.Modifier = function(altKey, ctrlKey, metaKey, shiftKey) {
    if (!(this instanceof jsfc.Modifier)) {
        throw new Error("Use 'new' for constructor.");
    }
    this.altKey = altKey || false;
    this.ctrlKey = ctrlKey || false;
    this.metaKey = metaKey || false;
    this.shiftKey = shiftKey || false;
};

/**
 * Returns true if the modifier matches the specified combination of keys,
 * and false otherwise.
 * 
 * @param {!boolean} alt  the ALT key is pressed.
 * @param {!boolean} ctrl  the CTRL key is pressed.
 * @param {!boolean} meta  the META key is pressed.
 * @param {!boolean} shift  the SHIFT key is pressed.
 * @returns {!boolean}
 */
jsfc.Modifier.prototype.match = function(alt, ctrl, meta, shift) {
    return this.altKey === alt 
            && this.ctrlKey === ctrl 
            && this.metaKey === meta 
            && this.shiftKey === shift;    
};

jsfc.Modifier.prototype.matchEvent = function(e) {
    return this.match(e.altKey, e.ctrlKey, e.metaKey, e.shiftKey);
};

/**
 * Returns true if this modifier record matches the specified 'other' 
 * modifier record.
 * 
 * @param {jsfc.Modifier} other  the modifier record to compare.
 * @returns {!boolean}
 */
jsfc.Modifier.prototype.matches = function(other) {
    if (this.altKey !== other.altKey) {
        return false;
    }
    if (this.ctrlKey !== other.ctrlKey) {
        return false;
    }
    if (this.metaKey !== other.metaKey) {
        return false;
    }
    if (this.shiftKey !== other.shiftKey) {
        return false;
    }
    return true;
};

