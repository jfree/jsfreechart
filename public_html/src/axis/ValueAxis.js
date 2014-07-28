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
jsfc.ValueAxis = function() {
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
jsfc.ValueAxis.prototype.setLabel = function(label, notify) {
};

/**
 * Returns the lower bound of the axis (the minimum data value that will be
 * displayed).
 * 
 * @returns {!number} The lower bound.
 */
jsfc.ValueAxis.prototype.getLowerBound = function() {
};

/**
 * Returns the upper bound of the axis (the maximum data value that will be
 * displayed).
 * 
 * @returns {!number} The lower bound.
 */
jsfc.ValueAxis.prototype.getUpperBound = function() {
};

/**
 * Returns the length of the axis (the difference between the upper bound and
 * the lower bound).
 * 
 * @returns {!number}
 */
jsfc.ValueAxis.prototype.length = function() {
};

/**
 * Returns true if the current axis range contains the specified value, and
 * false otherwise.
 * 
 * @param {!number} value  the data value.
 * @returns {!boolean}
 */
jsfc.ValueAxis.prototype.contains = function(value) {  
};

/**
 * Configures this axis for use as an x-axis for the specified plot.
 * 
 * @param {!jsfc.XYPlot} plot  the plot.
 * @returns {undefined}
 */
jsfc.ValueAxis.prototype.configureAsXAxis = function(plot) {    
};

/**
 * Configures this axis for use as a y-axis for the specified plot.
 * 
 * @param {jsfc.CategoryPlot|jsfc.XYPlot} plot  the plot.
 * @returns {undefined}
 */
jsfc.ValueAxis.prototype.configureAsYAxis = function(plot) {
};

/**
 * Converts a data value to a coordinate in the range r0 to r1, assuming that
 * these are equivalent to the current axis range.
 * 
 * @param {!number} value  the data value.
 * @param {!number} r0  the starting coordinate of the target range.
 * @param {!number} r1  the ending coordinate of the target range.
 * @returns {!number} The coordinate.
 */
jsfc.ValueAxis.prototype.valueToCoordinate = function(value, r0, r1) {  
};

/**
 * Converts a coordinate to a data value, assuming that the coordinate range
 * r0 to r1 corresponds to the current axis bounds.
 * 
 * @param {!number} coordinate  the coordinate.
 * @param {!number} r0  the starting coordinate.
 * @param {!number} r1  the ending coordinate.
 * @returns {!number} The data value.
 */
jsfc.ValueAxis.prototype.coordinateToValue = function(coordinate, r0, r1) {  
};

jsfc.ValueAxis.prototype.resizeRange = function(factor, anchorValue, notify) {
};
    
jsfc.ValueAxis.prototype.pan = function(percent, notify) {
};

/**
 * Calculates the amount of space to reserve for drawing the axis.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.CategoryPlot|jsfc.XYPlot} plot  the plot.
 * @param {!jsfc.Rectangle} bounds  the plot bounds.
 * @param {!jsfc.Rectangle} area  the estimated data area.
 * @param {!string} edge  the edge that denotes the axis position.
 * @returns {!number} The space to reserve for the axis.
 */
jsfc.ValueAxis.prototype.reserveSpace = function(ctx, plot, bounds, area, 
        edge) {
};

/**
 * Draws the axis.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.CategoryPlot|jsfc.XYPlot} plot
 * @param {!jsfc.Rectangle} bounds
 * @param {!jsfc.Rectangle} dataArea
 * @param {!number} offset
 * @returns {undefined}
 */
jsfc.ValueAxis.prototype.draw = function(ctx, plot, bounds, dataArea, offset) {
};

/**
 * Registers a listener to receive notification of changes to the axis.
 * 
 * @param {Function} listener  the listener.
 * @returns {undefined}
 */
jsfc.ValueAxis.prototype.addListener = function(listener) {
};