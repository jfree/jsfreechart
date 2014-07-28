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
 * @interface
 */
jsfc.MouseHandler = function() {
    throw new Error("Documents an interface only.");
};

/**
 * Handles a mouse down event.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.MouseHandler.prototype.mouseDown = function(e) {
};

/**
 * Handles a mouse move event.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.MouseHandler.prototype.mouseMove = function(e) {
};
 
/**
 * Handles a mouse up event.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.MouseHandler.prototype.mouseUp = function(e) {
};

/**
 * Handles a mouse over event.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.MouseHandler.prototype.mouseOver = function(e) {
};

/**
 * Handles a mouse out event.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.MouseHandler.prototype.mouseOut = function(e) {
};

/**
 * Handles a mouse wheen event.
 * 
 * @param {MouseEvent} e  the mouse event.
 * 
 * @returns {undefined}
 */
jsfc.MouseHandler.prototype.mouseWheel = function(e) {
};

/**
 * Perform any cleanup required before the handler is removed.
 * 
 * @returns {undefined}
 */
jsfc.MouseHandler.prototype.cleanUp = function() {
};
