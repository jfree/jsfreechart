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
 * @constructor
 * @param {string} id
 * @returns {undefined}
 */
jsfc.SVGLayer = function(id) {
    if (!(this instanceof jsfc.SVGLayer)) {
        throw new Error("Use 'new' for constructors.");
    }
    this._id = id;
    this._container = this.createElement("g");
    this._content = this.createElement("g");
    this._container.appendChild(this._content);
    this._stack = [ this._content ];
    this._defsContainer = this.createElement("g");
    this._defsContent = this.createElement("g");
    this._defsContainer.appendChild(this._defsContent);
};

/**
 * Returns the id.
 * @returns {string}
 */
jsfc.SVGLayer.prototype.getID = function() {
    return this._id;
};

/**
 * Returns the group element that is the container for this layer.  This
 * container will have a single child, another group element, that holds the
 * actual content.
 * 
 * @returns {Node}
 */
jsfc.SVGLayer.prototype.getContainer = function() {
    return this._container;
};

/**
 * Returns the group containing the content for the layer.  This group sits 
 * within the layer's container, and can be discarded and recreated (the
 * layer's container remains and preserves the layer rendering order).
 * 
 * @returns {Node}
 */
jsfc.SVGLayer.prototype.getContent = function() {
    return this._content;
};

/**
 * A stack of group elements with the content group at the bottom.  The
 * beginGroup() and endGroup() methods will push and pop groups from the
 * stack.
 * 
 * @returns {Array}
 */
jsfc.SVGLayer.prototype.getStack = function() {
    return this._stack;
};

/**
 * Returns the group that is present in the SVG 'defs' element to represent
 * this layer.  The group contains a single child group (see getDefsContent())
 * that holds the actual defs.
 * 
 * @returns {Node}
 */
jsfc.SVGLayer.prototype.getDefsContainer = function() {
    return this._defsContainer;    
};

/**
 * Returns the group containing the defs content for this layer.  This
 * group can be removed and replaced.
 * 
 * @returns {Node}
 */
jsfc.SVGLayer.prototype.getDefsContent = function() {
    return this._defsContent;
};

/**
 * Clears the content for this layer.
 * 
 * @returns {undefined}
 */
jsfc.SVGLayer.prototype.clear = function() {
    this._container.removeChild(this._content);
    this._defsContainer.removeChild(this._defsContent);
    this._content = this.createElement("g");
    this._container.appendChild(this._content);
    this._stack = [ this._content ];
    this._defsContent = this.createElement("g");
    this._defsContainer.appendChild(this._defsContent);
};

/**
 * Creates a new element of the specified type.
 * 
 * @param {!string} elementType  the element type.
 * @returns {Element}
 */
jsfc.SVGLayer.prototype.createElement = function(elementType) {
    return document.createElementNS("http://www.w3.org/2000/svg", elementType);
};

