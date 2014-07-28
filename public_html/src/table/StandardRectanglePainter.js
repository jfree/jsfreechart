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
 * Creates a new painter.
 * @class A painter that fills a rectangle with a color.
 * @constructor
 * @implements {jsfc.RectanglePainter}
 * @param {jsfc.Color} fillColor  the fill color (null permitted).
 * @param {jsfc.Color} [strokeColor]  the stroke color (null permitted).
 * @returns {undefined}
 */
jsfc.StandardRectanglePainter = function(fillColor, strokeColor) {
    if (!(this instanceof jsfc.StandardRectanglePainter)) {
        throw new Error("Use 'new' for construction.");
    }
    this._fillColor = fillColor;
    this._strokeColor = strokeColor;
};

/**
 * Paints the background within the specified bounds.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context (null not permitted).
 * @param {!jsfc.Rectangle} bounds  the bounds (null not permitted).
 * @returns {undefined}
 */
jsfc.StandardRectanglePainter.prototype.paint = function(ctx, bounds) {
    if (this._fillColor) {
        ctx.setFillColor(this._fillColor);
        ctx.fillRect(bounds.x(), bounds.y(), bounds.width(), bounds.height());
    }
    if (this._strokeColor) {
        ctx.setLineColor(this._strokeColor);
    }
};
