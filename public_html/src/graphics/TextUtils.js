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
 * A set of functions used for text.
 * 
 * @namespace
 */
jsfc.TextUtils = {};

/**
 * Calculates an returns the bounds of a string drawn to the specified
 * graphics context (using the font settings from that context) and anchored
 * to a specific location.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!string} str  the string.
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @param {!number} anchor  the text anchor (defined in jsfc.TextAnchor).
 * @returns {!jsfc.Rectangle}
 */
jsfc.TextUtils.bounds = function(ctx, str, x, y, anchor) {
    var dim = ctx.textDim(str);
    var w = dim.width();
    var h = dim.height();
    var xadj = 0;
    if (jsfc.TextAnchor.isHorizontalCenter(anchor)) {
        xadj = -w / 2;
    } else if (jsfc.TextAnchor.isRight(anchor)) {
        xadj = -w;
    }
    // the y-adjustment is not so easy since we don't have a lot of detailed
    // font metrics...we use best efforts for now
    var yadj = 0; // baseline
    if (jsfc.TextAnchor.isBottom()) {
        yadj = 0; // FIXME
    } else if (jsfc.TextAnchor.isHalfAscent(anchor) 
            || jsfc.TextAnchor.isHalfHeight(anchor)) {
        yadj = -h / 2;    
    } else if (jsfc.TextAnchor.isTop(anchor)) {
        yadj = -h;
    }
    return new jsfc.Rectangle(x + xadj, y + yadj, w, h);
};
