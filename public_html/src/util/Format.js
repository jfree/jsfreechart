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
 * @interface
 */
jsfc.Format = function() {
    throw new Error("Documents an interface only.");
};

/**
 * Returns a formatted version of the supplied number.
 * 
 * @param {!number} n  the number to format.
 * @returns {!string} A string representing the formatted number.
 */
jsfc.Format.prototype.format = function(n) {
};

