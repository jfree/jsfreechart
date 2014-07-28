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
 * A set of functions used to perform general argument checking.
 * @namespace
 */
jsfc.Args = {};

/**
 * Throws an error if the argument is undefined.
 * 
 * @param {*} arg  the argument.
 * @param {string} label  the argument name (displayed in the error message).
 * @returns {Object} This object (for chaining method calls).
 */
jsfc.Args.require = function(arg, label) {
    if (arg === null) {
        throw new Error("Require argument '" + label + "' to be specified.");
    }
    return jsfc.Args;
};

/**
 * Throws an error if the argument is not a number.
 * 
 * @param {*} arg  the argument.
 * @param {string} label  the argument name (displayed in the error message).
 * @returns {Object} This object (for chaining method calls).
 */
jsfc.Args.requireNumber = function(arg, label) {
    if (typeof arg !== "number") {
        throw new Error("Require '" + label + "' to be a number.");
    }
    return jsfc.Args;
};

/**
 * Throws an error if the argument is not a finite positive number.
 * 
 * @param {*} arg  the argument.
 * @param {string} label  the argument name (displayed in the error message).
 * @returns {Object} This object (for chaining method calls).
 */
jsfc.Args.requireFinitePositiveNumber = function(arg, label) {
    if (typeof arg !== "number" || arg <= 0) {
        throw new Error("Require '" + label + "' to be a positive number.");
    }
    return jsfc.Args;
};

/**
 * Checks that a number is in a required range (inclusive of the end points).
 * 
 * @param {!number} arg  the argument.
 * @param {!string} label  the label (used for the error message, if required).
 * @param {!number} min  the minimum permitted value.
 * @param {!number} max  the maximum permitted value.
 * @returns This object for chaining function calls.
 */
jsfc.Args.requireInRange = function(arg, label, min, max) {
    jsfc.Args.requireNumber(arg, label);
    if (arg < min || arg > max) {
        throw new Error("Require '" + label + "' to be in the range " + min 
                + " to " + max);
    }
    return jsfc.Args;
};

/**
 * Throws an error if the argument is not a string.
 * 
 * @param {*} arg  the argument.
 * @param {string} label  the argument name (displayed in the error message).
 * @returns {Object} This object (for chaining method calls).
 */
jsfc.Args.requireString = function(arg, label) {
    if (typeof arg !== "string") {
        throw new Error("Require '" + label + "' to be a string.");
    }
    return jsfc.Args;
};

/**
 * Throws an error if the argument is not a KeyedValuesDataset.
 * @param {*} arg  the argument.
 * @param {string} label  the argument name (used in the error message).
 * @returns {Object} This object (for chaining method calls).
 */
jsfc.Args.requireKeyedValuesDataset = function(arg, label) {
    if (!(arg instanceof jsfc.KeyedValuesDataset)) {
        throw new Error("Require '" + label 
                + "' to be an requireKeyedValuesDataset.");
    }
    return jsfc.Args;
};

/**
 * Throws an error if the argument is not a KeyedValues2DDataset.
 * @param {*} arg  the argument.
 * @param {string} label  the argument name (used in the error message).
 * @returns {Object} This object (for chaining method calls).
 */
jsfc.Args.requireKeyedValues2DDataset = function(arg, label) {
    if (!(arg instanceof jsfc.KeyedValues2DDataset)) {
        throw new Error("Require '" + label + "' to be a KeyedValues2DDataset.");
    }
    return jsfc.Args;
};

/**
 * Throws an error if the argument is not an XYDataset.
 * @param {*} arg
 * @param {string} label
 * @returns {Object} This object (for chaining method calls).
 */
jsfc.Args.requireXYDataset = function(arg, label) {
    //    FIXME: we'll support arbitrary implementations of the XYDataset interface
    //    so we need a way to test that the argument is really implementing this
    //    (or maybe give up trying to validate this)
//    if (!(arg instanceof jsfc.XYDataset)) {
//        throw new Error("Require '" + label + "' to be an XYDataset.");
//    }
    return jsfc.Args;
};
