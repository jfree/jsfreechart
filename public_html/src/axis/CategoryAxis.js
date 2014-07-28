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
jsfc.CategoryAxis = function() {
    throw new Error("This object documents an interface.");
};

/**
 * Sets the label for the axis and sends a change notification to registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {string} label  the new label (null is permitted).
 * @param {boolean} [notify]  notify listeners (defaults to true).
 * @returns {undefined}
 */
jsfc.CategoryAxis.prototype.setLabel = function(label, notify) {
};

/**
 * Configures this axis so it is up-to-date with respect to being the x-axis
 * for the specified plot.
 * 
 * @param {!jsfc.CategoryPlot} plot  the plot.
 * @returns {undefined}
 */
jsfc.CategoryAxis.prototype.configureAsXAxis = function(plot) {    
};

/**
 * Returns the range of coordinates allocated for the category with the
 * specified key.
 * 
 * @param {!string} key  the column key.
 * @param {!number} r0  the starting screen coordinate.
 * @param {!number} r1  the ending screen coordinate.
 * @returns {jsfc.Range}
 */
jsfc.CategoryAxis.prototype.keyToRange = function(key, r0, r1) {
};

/**
 * Returns the range of coordinates allocated for an item within a category.
 * 
 * @param {!number} item  the item index.
 * @param {!number} itemCount  the item count.
 * @param {!string} columnKey  the column key.
 * @param {!number} r0  the starting screen coordinate.
 * @param {!number} r1  the ending screen coordinate.
 * @returns {!jsfc.Range}
 */
jsfc.CategoryAxis.prototype.itemRange = function(item, itemCount, columnKey, 
        r0, r1) { 
};

/**
 * Converts a (screen) coordinate to a category key, assuming that the axis
 * is drawn with r0 and r1 as the screen bounds.
 * 
 * @param {!number} coordinate  the screen coordinate.
 * @param {!number} r0  the lower (screen) bound of the axis.
 * @param {!number} r1  the upper (screen) bound of the axis.
 * @returns {string} The category key.
 */
jsfc.CategoryAxis.prototype.coordinateToKey = function(coordinate, r0, r1) {  
};

/**
 * Calculates the amount of space to reserve for the axis.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.CategoryPlot} plot  the plot.
 * @param {!jsfc.Rectangle} bounds  the bounds for the plot.
 * @param {!jsfc.Rectangle} area  the (estimated) data area.
 * @param {!string} edge  the edge along which the axis will be drawn.
 * @returns {!number} The space to reserve for the axis.
 */
jsfc.CategoryAxis.prototype.reserveSpace = function(ctx, plot, bounds, area, 
        edge) {
};

/**
 * Draws the axis to the specified graphics context.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.CategoryPlot} plot  the plot.
 * @param {!jsfc.Rectangle} bounds  the bounds for the plot.
 * @param {!jsfc.Rectangle} dataArea  the data area.
 * @param {!number} offset  the offset for the axis.
 * @returns {undefined}
 */
jsfc.CategoryAxis.prototype.draw = function(ctx, plot, bounds, dataArea, 
        offset) {
};

/**
 * Registers a listener to receive notification of changes to the axis.
 * 
 * @param {!Function} listener  the listener.
 * @returns {undefined}
 */
jsfc.CategoryAxis.prototype.addListener = function(listener) {
};