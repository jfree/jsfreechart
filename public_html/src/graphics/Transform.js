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
 * Creates a new transform.
 * 
 * @constructor 
 * @classdesc A transform (only supporting translate and rotate which are the
 *     options we require for text positioning).
 * @returns {jsfc.Transform} The new instance.
 */
jsfc.Transform = function() {
    if (!(this instanceof jsfc.Transform)) {
        throw new Error("Use 'new' for constructors.");
    }
    this.scaleX = 1.0; // m00
    this.scaleY = 1.0; // m11
    this.translateX = 0.0;
    this.translateY = 0.0;
    this.shearX = 0.0; // m01
    this.shearY = 0.0; // m10
};

/**
 * Applies a translation (dx, dy) to the transform.
 * @param {!number} dx
 * @param {!number} dy
 * @returns {undefined}
 */
jsfc.Transform.prototype.translate = function(dx, dy) {
    this.translateX = this.translateX + dx;
    this.translateY = this.translateY + dy;
};

/**
 * Applies a rotation of theta to the transform.
 * @param {!number} theta
 * @returns {undefined}
 */
jsfc.Transform.prototype.rotate = function(theta) {
    var c = Math.cos(theta);
    var s = Math.sin(theta);
    var n00 = this.scaleX * c + this.shearX * s;
    var n01 = this.scaleX * -s + this.shearX * c;
    var n10 = this.shearY * c + this.scaleY * s;
    var n11 = this.shearY * -s + this.scaleY * c;
    this.scaleX = n00;
    this.shearX = n01;
    this.shearY = n10;
    this.scaleY = n11;
};