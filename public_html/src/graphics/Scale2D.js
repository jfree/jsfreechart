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
 * An enumeration of the scaling options for a rectangular shape being fitted 
 * within 2D bounds.
 * 
 * @type Object
 */
jsfc.Scale2D = {
    
    /** No scaling. */
    NONE: 1,
    
    /** Scale horizontally (but not vertically). */
    SCALE_HORIZONTAL: 2,
    
    /** Scale vertically (but not horizontally). */
    SCALE_VERTICAL: 3, 
    
    /** Scale both horizontally and vertically. */
    SCALE_BOTH: 4

};

if (Object.freeze) {
    Object.freeze(jsfc.Scale2D);
}