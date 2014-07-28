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
 * An enumeration of the standard reference points for a single line text item.
 * @type Object
 */
jsfc.TextAnchor = {
    
    /** The top left corner of the text bounds. */
    TOP_LEFT: 0,

    /** The center of the top edge of the text bounds. */
    TOP_CENTER: 1,

    /** The top right corner of the text bounds. */
    TOP_RIGHT: 2,

    /**
     * The left edge of a horizontal line through the midpoint of the font's
     * ascent.
     */
    HALF_ASCENT_LEFT: 3,

    /**
     * The center point of a horizontal line through the midpoint of the font's
     * ascent.
     */
    HALF_ASCENT_CENTER: 4,

    /**
     * The right edge of a horizontal line through the midpoint of the font's
     * ascent.
     */
    HALF_ASCENT_RIGHT: 5,

    /** The mid-point of the left edge of the text bounding box. */
    CENTER_LEFT: 6,

    /** The center of the text bounding box. */
    CENTER: 7,

    /** The mid-point of the right edge of the text bounding box. */
    CENTER_RIGHT: 8,

    /** The left edge of the text baseline. */
    BASELINE_LEFT: 9,

    /** The mid-point of the text baseline. */
    BASELINE_CENTER: 10,

    /** The right edge of the text baseline. */
    BASELINE_RIGHT: 11,

    /** The bottom left corner of the text bounds. */
    BOTTOM_LEFT: 12,

    /** The center of the bottom edge of the text bounds. */
    BOTTOM_CENTER: 13,

    /** The bottom right corner of the text bounds. */
    BOTTOM_RIGHT: 14,

    /**
     * Returns true if the specified anchor is a "left" anchor, and false 
     * otherwise.
     * 
     * @param {!number} anchor  the anchor.
     * @returns {!boolean}
     */
    isLeft: function(anchor) {
        return anchor === jsfc.TextAnchor.TOP_LEFT 
                || anchor === jsfc.TextAnchor.CENTER_LEFT
                || anchor === jsfc.TextAnchor.HALF_ASCENT_LEFT 
                || anchor === jsfc.TextAnchor.BASELINE_LEFT
                || anchor === jsfc.TextAnchor.BOTTOM_LEFT;
    },

    /**
     * Returns true if the specified anchor is a "center" anchor, and false 
     * otherwise.
     * 
     * @param {!number} anchor  the anchor.
     * @returns {!boolean}
     */
    isHorizontalCenter: function(anchor) {
        return anchor === jsfc.TextAnchor.TOP_CENTER 
                || anchor === jsfc.TextAnchor.CENTER
                || anchor === jsfc.TextAnchor.HALF_ASCENT_CENTER 
                || anchor === jsfc.TextAnchor.BASELINE_CENTER
                || anchor === jsfc.TextAnchor.BOTTOM_CENTER;
    },

    /**
     * Returns true if the specified anchor is a "right" anchor, and false 
     * otherwise.
     * 
     * @param {!number} anchor  the anchor.
     * @returns {!boolean}
     */
    isRight: function(anchor) {
        return anchor === jsfc.TextAnchor.TOP_RIGHT 
                || anchor === jsfc.TextAnchor.CENTER_RIGHT
                || anchor === jsfc.TextAnchor.HALF_ASCENT_RIGHT 
                || anchor === jsfc.TextAnchor.BASELINE_RIGHT
                || anchor === jsfc.TextAnchor.BOTTOM_RIGHT;
    },

    /**
     * Returns true if the specified anchor is a "top" anchor, and false 
     * otherwise.
     * 
     * @param {!number} anchor  the anchor.
     * @returns {!boolean}
     */
    isTop: function(anchor) {
        return anchor === jsfc.TextAnchor.TOP_LEFT 
                || anchor === jsfc.TextAnchor.TOP_CENTER 
                || anchor === jsfc.TextAnchor.TOP_RIGHT;
    },

    /**
     * Returns true if the specified anchor is a "half ascent" anchor, and 
     * false otherwise.
     * 
     * @param {!number} anchor  the anchor.
     * @returns {!boolean}
     */
    isHalfAscent: function(anchor) {
        return anchor === jsfc.TextAnchor.HALF_ASCENT_LEFT 
                || anchor === jsfc.TextAnchor.HALF_ASCENT_CENTER
                || anchor === jsfc.TextAnchor.HALF_ASCENT_RIGHT;
    },

    /**
     * Returns true if the specified anchor is a "center" anchor (vertically), 
     * and false otherwise.
     * 
     * @param {!number} anchor  the anchor.
     * @returns {!boolean}
     */
    isHalfHeight: function(anchor) {
        return anchor === jsfc.TextAnchor.CENTER_LEFT 
                || anchor === jsfc.TextAnchor.CENTER 
                || anchor === jsfc.TextAnchor.CENTER_RIGHT;
    },

    /**
     * Returns true if the specified anchor is a "baseline" anchor (vertically), 
     * and false otherwise.
     * 
     * @param {!number} anchor  the anchor.
     * @returns {!boolean}
     */
    isBaseline: function(anchor) {
        return anchor === jsfc.TextAnchor.BASELINE_LEFT 
                || anchor === jsfc.TextAnchor.BASELINE_CENTER
                || anchor === jsfc.TextAnchor.BASELINE_RIGHT;
    },

    /**
     * Returns true if the specified anchor is a "bottom" anchor, 
     * and false otherwise.
     * 
     * @param {!number} anchor  the anchor.
     * @returns {!boolean}
     */
    isBottom: function(anchor) {
        return anchor === jsfc.TextAnchor.BOTTOM_LEFT 
                || anchor === jsfc.TextAnchor.BOTTOM_CENTER
                || anchor === jsfc.TextAnchor.BOTTOM_RIGHT;
    }
};

if (Object.freeze) {
    Object.freeze(jsfc.TextAnchor);
}