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
jsfc.XYRenderer = function() {
    throw new Error("Documents the interface only.");
};

/**
 * Returns the number of passes required to render the data.  Most renderers
 * will require only one pass through the data, but there are some cases where
 * two or more passes are required.
 * 
 * @returns {!number}
 */
jsfc.XYRenderer.prototype.passCount = function() {
};

/**
 * Draws one data item in "immediate" mode.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} dataArea
 * @param {!jsfc.XYPlot} plot
 * @param {!jsfc.XYDataset} dataset
 * @param {!number} seriesIndex
 * @param {!number} itemIndex
 * @param {!number} pass
 * @returns {undefined}
 */
jsfc.XYRenderer.prototype.drawItem = function(ctx, dataArea, plot, 
        dataset, seriesIndex, itemIndex, pass) {
};
