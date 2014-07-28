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
 * @class A utility object that fits a source rectangle into a target 
 *     rectangle with optional scaling.
 * 
 * @constructor
 * @param {jsfc.Anchor2D} anchor  the anchor point.
 * @param {number} [scale]  the scaling type (optional, defaults to NONE).
 * 
 * @returns {jsfc.Fit2D}
 */
jsfc.Fit2D = function(anchor, scale) {
    if (!(this instanceof jsfc.Fit2D)) {
        throw new Error("Use 'new' for constructor.");
    }
    this._anchor = anchor;
    this._scale = scale || jsfc.Scale2D.NONE;
};
    
/**
 * Returns the anchor used for the fitting.
 * 
 * @returns {jsfc.Anchor2D}
 */
jsfc.Fit2D.prototype.anchor = function() {
    return this._anchor;
};
   
/**
 * Returns the scaling type (constants defined in jsfc.Scale2D).
 * 
 * @returns {number}
 */
jsfc.Fit2D.prototype.scale = function() {
    return this._scale;
};
    
/**
 * Returns a new rectangle that is fitted to the target according to the
 * anchor and scale attributes of this fitter.
 * 
 * @param {!jsfc.Dimension} srcDim  the dimensions of the source rectangle.
 * @param {!jsfc.Rectangle} target  the target rectangle.
 * @returns {!jsfc.Rectangle} The rectangle.
 */
jsfc.Fit2D.prototype.fit = function(srcDim, target) {
    if (this._scale === jsfc.Scale2D.SCALE_BOTH) {
        return jsfc.Rectangle.copy(target);
    }
    var w = srcDim.width();
    if (this._scale === jsfc.Scale2D.SCALE_HORIZONTAL) {
        w = target.width();
        if (!jsfc.RefPt2D.isHorizontalCenter(this._anchor.refPt())) {
            w -= 2 * this._anchor.offset().dx();
        }
    }
    var h = srcDim.height();
    if (this._scale === jsfc.Scale2D.SCALE_VERTICAL) {
        h = target.height();
        if (!jsfc.RefPt2D.isVerticalCenter(this._anchor.refPt())) {
            h -= 2 * this._anchor.offset().dy();
        }
    }
    var pt = this._anchor.anchorPoint(target);
    var x = Number.NaN; 
    if (jsfc.RefPt2D.isLeft(this._anchor.refPt())) {
        x = pt.x();
    } else if (jsfc.RefPt2D.isHorizontalCenter(this._anchor.refPt())) {
        x = target.centerX() - w / 2;
    } else if (jsfc.RefPt2D.isRight(this._anchor.refPt())) {
        x = pt.x() - w;
    }
    var y = Number.NaN;
    if (jsfc.RefPt2D.isTop(this._anchor.refPt())) {
        y = pt.y();
    } else if (jsfc.RefPt2D.isVerticalCenter(this._anchor.refPt())) {
        y = target.centerY() - h / 2;
    } else if (jsfc.RefPt2D.isBottom(this._anchor.refPt())) {
        y = pt.y() - h;
    }
    return new jsfc.Rectangle(x, y, w, h);    
};

/**
 * Creates an returns a fitter that performs no scaling and fits a rectangle
 * to the given anchor point.
 * 
 * @param {!jsfc.RefPt2D} refPt  the anchor.
 * @returns {!jsfc.Fit2D} The fitter.
 */
jsfc.Fit2D.prototype.noScalingFitter = function(refPt) {
    var anchor = new jsfc.Anchor2D(refPt, new jsfc.Offset2D(0, 0));
    return new jsfc.Fit2D(anchor, jsfc.Scale2D.NONE);
};