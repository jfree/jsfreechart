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
 * Creates a new anchor.
 * 
 * @class An anchor point defined relative to a rectangle in two-dimensional 
 * space (the point coordinates can be resolved once a concrete rectangle is 
 * provided).
 * @constructor 
 * @param {!number} refpt  the reference point on the rectangle.
 * @param {jsfc.Offset2D} [offset]  the offset to the rectangle (positive 
 *     deltas move to the interior of the rectangle).  If this argument is
 *     not supplied, it defaults to a zero offset.
 * @returns {jsfc.Anchor2D}
 */
jsfc.Anchor2D = function(refpt, offset) {
    if (!(this instanceof jsfc.Anchor2D)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.Args.requireNumber(refpt, "refpt"); 
    this._refpt = refpt;
    this._offset = offset || new jsfc.Offset2D(0, 0);
};

/**
 * Returns the reference point for the anchor (one of the numerical 
 * constants defined in jsfc.RefPt2D).
 * 
 * @return {number}
 */
jsfc.Anchor2D.prototype.refPt = function() {
    return this._refpt;
};
    
/**
 * Returns the offset for the anchor.
 * 
 * @returns {jsfc.Offset2D}
 */
jsfc.Anchor2D.prototype.offset = function() {
    return this._offset;
};

/**
 * Returns a Point2D that is the anchor point for the supplied rectangle.
 * @param {jsfc.Rectangle} rect  the reference rectangle.
 * @returns {jsfc.Point2D}
 */
jsfc.Anchor2D.prototype.anchorPoint = function(rect) {
    var x = 0.0;
    var y = 0.0;
    if (jsfc.RefPt2D.isLeft(this._refpt)) {
        x = rect.x() + this._offset.dx();
    } else if (jsfc.RefPt2D.isHorizontalCenter(this._refpt)) {
        x = rect.centerX();
    } else if (jsfc.RefPt2D.isRight(this._refpt)) {
        x = rect.maxX() - this._offset.dx();
    }
    if (jsfc.RefPt2D.isTop(this._refpt)) {
        y = rect.minY() + this._offset.dy();
    } else if (jsfc.RefPt2D.isVerticalCenter(this._refpt)) {
        y = rect.centerY();
    } else if (jsfc.RefPt2D.isBottom(this._refpt)) {
        y = rect.maxY() - this._offset.dy();
    }
    return new jsfc.Point2D(x, y);
};