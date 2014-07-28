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
 * @class An object containing the core info for one item in a legend.  Each
 * plot object (CategoryPlot, PiePlot and XYPlot) has a legendInfo() method
 * that returns a list of LegendItemInfo instances for the plot.
 * @constructor
 */
jsfc.LegendItemInfo = function(key, color) {
    this.seriesKey = key || "";
    this.label = key || "";
    this.description = "";
    this.shape = null;
    this.color = color;
};
