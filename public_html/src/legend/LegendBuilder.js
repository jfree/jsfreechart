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
 * @interface
 */
jsfc.LegendBuilder = function() {
};
    
/**
 * Creates a legend containing items representing the content of the specified
 * plot.
 * 
 * @param {jsfc.XYPlot|jsfc.CategoryPlot} plot  the plot.
 * @param {jsfc.Anchor2D} anchor  the legend anchor (used to determine 
 *     default item alignment).
 * @param {string} orientation  the orientation ("horizontal" or "vertical").
 * @param {Object} style  the style (currently ignored).
 * 
 * @returns {jsfc.TableElement} The legend (a table element).
 */
jsfc.LegendBuilder.prototype.createLegend = function(plot, anchor, 
        orientation, style) {
};