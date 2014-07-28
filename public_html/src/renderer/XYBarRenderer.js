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
 * Creates a new renderer for generating bar charts from interval XY datasets.
 * 
 * @constructor
 * @returns {jsfc.XYBarRenderer}
 */
jsfc.XYBarRenderer = function() {
    if (!(this instanceof jsfc.XYBarRenderer)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.BaseXYRenderer.init(this);
};

// extends BaseXYRenderer (see also the init() call in the constructor)
jsfc.XYBarRenderer.prototype = new jsfc.BaseXYRenderer();

/**
 * Draws one data item.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} dataArea  the data area.
 * @param {!jsfc.XYPlot} plot  the plot.
 * @param {!jsfc.IntervalXYDataset} dataset
 * @param {!number} seriesIndex
 * @param {!number} itemIndex
 * @returns {undefined}
 */
jsfc.XYBarRenderer.prototype.drawItem = function(ctx, dataArea, plot, 
        dataset, seriesIndex, itemIndex, pass) {

    var xmin = dataset.xStart(seriesIndex, itemIndex);
    var xmax = dataset.xEnd(seriesIndex, itemIndex);
    var y = dataset.y(seriesIndex, itemIndex);

    // convert these to target coordinates using the plot's axes
    var xAxis = plot.getXAxis();
    var yAxis = plot.getYAxis();
    var w = dataArea.width();
    var h = dataArea.height();
    var xxmin = xAxis.valueToCoordinate(xmin, dataArea.x(), dataArea.x() + w);
    var xxmax = xAxis.valueToCoordinate(xmax, dataArea.x(), dataArea.x() + w);
    var yy = yAxis.valueToCoordinate(y, dataArea.y() + h, dataArea.y());
    var zz = yAxis.valueToCoordinate(0, dataArea.y() + h, dataArea.y());
            
    ctx.setLineColor(this._lineColorSource.getColor(seriesIndex, itemIndex));
    ctx.setLineStroke(new jsfc.Stroke(1));
    ctx.setFillColor(this._fillColorSource.getColor(seriesIndex, itemIndex));
    ctx.drawRect(xxmin, Math.min(yy, zz), xxmax - xxmin, Math.abs(yy - zz));
};
