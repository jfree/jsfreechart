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
 * An enumeration of the standard reference points for a rectangle.
 * @type Object
 */
jsfc.RefPt2D = {
    
    TOP_LEFT: 1,
  
    /** The middle of a rectangle at the top. */
    TOP_CENTER: 2,
  
    /** The top-right corner of a rectangle. */
    TOP_RIGHT: 3,
  
    /** The middle of a rectangle at the left side. */
    CENTER_LEFT: 4,
  
    /** The center of a rectangle. */
    CENTER: 5,
  
    /** The middle of a rectangle at the right side. */
    CENTER_RIGHT: 6,
  
    /** The bottom-left corner of a rectangle. */
    BOTTOM_LEFT: 7, 
  
    /** The middle of a rectangle at the bottom. */
    BOTTOM_CENTER: 8,
  
    /** The bottom-right corner of a rectangle. */
    BOTTOM_RIGHT : 9,

    /**
     * Returns true if refpt is one of the left-side points and false otherwise.
     * 
     * @param {!number} refpt  the reference point.
     * @returns {boolean}
     */
    isLeft: function(refpt) {
        return refpt === jsfc.RefPt2D.TOP_LEFT 
                || refpt === jsfc.RefPt2D.CENTER_LEFT 
                || refpt === jsfc.RefPt2D.BOTTOM_LEFT;
    },
    
    /**
     * Returns true if refpt is one of the right-side points and false otherwise.
     * 
     * @param {!number} refpt  the reference point.
     * @returns {boolean}
     */
    isRight: function(refpt) {
        return refpt === jsfc.RefPt2D.TOP_RIGHT 
                || refpt === jsfc.RefPt2D.CENTER_RIGHT 
                || refpt === jsfc.RefPt2D.BOTTOM_RIGHT;
    },
    
    /**
     * Returns true if refpt is one of the top points and false otherwise.
     * 
     * @param {!number} refpt  the reference point.
     * @returns {boolean}
     */
    isTop: function(refpt) {
        return refpt === jsfc.RefPt2D.TOP_LEFT 
                || refpt === jsfc.RefPt2D.TOP_CENTER 
                || refpt === jsfc.RefPt2D.TOP_RIGHT;
    },
    
    /**
     * Returns true if refpt is one of the bottom points and false otherwise.
     * 
     * @param {!number} refpt  the reference point.
     * @returns {boolean}
     */
    isBottom: function(refpt) {
        return refpt === jsfc.RefPt2D.BOTTOM_LEFT 
                || refpt === jsfc.RefPt2D.BOTTOM_CENTER 
                || refpt === jsfc.RefPt2D.BOTTOM_RIGHT;
    },

    /**
     * Returns true if refpt is one of the center (horizontally) points and 
     * false otherwise.
     * 
     * @param {!number} refpt  the reference point.
     * @returns {boolean}
     */
    isHorizontalCenter: function(refpt) {
        return refpt === jsfc.RefPt2D.TOP_CENTER 
                || refpt === jsfc.RefPt2D.CENTER 
                || refpt === jsfc.RefPt2D.BOTTOM_CENTER;  
    },
    
    /**
     * Returns true if refpt is one of the center (vertically) points and 
     * false otherwise.
     * 
     * @param {!number} refpt  the reference point.
     * @returns {boolean}
     */
    isVerticalCenter: function(refpt) {
        return refpt === jsfc.RefPt2D.CENTER_LEFT 
                || refpt === jsfc.RefPt2D.CENTER 
                || refpt === jsfc.RefPt2D.CENTER_RIGHT;
    }
};

if (Object.freeze) {
    Object.freeze(jsfc.RefPt2D);
}