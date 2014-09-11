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
 * Creates a new renderer for generating line charts.
 * 
 * @returns {jsfc.XYLineRenderer}
 * 
 * @constructor
 */
jsfc.XYLineRenderer = function() {
    if (!(this instanceof jsfc.XYLineRenderer)) {
        return new jsfc.XYLineRenderer();
    }
    jsfc.BaseXYRenderer.init(this);
    this._drawSeriesAsPath = true;
};

jsfc.XYLineRenderer.prototype = new jsfc.BaseXYRenderer();

/**
 * Returns the number of passes required to render the data.  In this case,
 * two passes are required, the first draws the lines and the second overlays
 * the shapes on top.
 * 
 * @returns {!number}
 */
jsfc.XYLineRenderer.prototype.passCount = function() {
    return 2;
};

/**
 * Draws a path for one series to the specified graphics context.
 * 
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} dataArea
 * @param {jsfc.XYPlot} plot
 * @param {jsfc.XYDataset} dataset
 * @param {number} seriesIndex
 * @returns {undefined}
 */
jsfc.XYLineRenderer.prototype.drawSeries = function(ctx, dataArea, plot,
        dataset, seriesIndex) {
    var itemCount = dataset.itemCount(seriesIndex);
    if (itemCount == 0) {
        return;
    }
    var connect = false;
    ctx.beginPath();
    for (var i = 0; i < itemCount; i++) {
        var x = dataset.x(seriesIndex, i);
        var y = dataset.y(seriesIndex, i);
        if (y === null) {
            connect = false;
            continue;
        }

        // convert these to target coordinates using the plot's axes
        var xx = plot.getXAxis().valueToCoordinate(x, dataArea.x(), dataArea.x() 
                + dataArea.width());
        var yy = plot.getYAxis().valueToCoordinate(y, dataArea.y() 
                + dataArea.height(), dataArea.y());
        if (!connect) {
            ctx.moveTo(xx, yy);
            connect = true;
        } else {
            ctx.lineTo(xx, yy);
        }
    }
    ctx.setLineColor(this.lookupLineColor(dataset, seriesIndex, i));
    ctx.setLineStroke(this._strokeSource.getStroke(seriesIndex, 0));
    ctx.stroke();
};

/**
 * Draws one data item to the specified graphics context.
 * 
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} dataArea
 * @param {jsfc.XYPlot} plot
 * @param {jsfc.XYDataset} dataset
 * @param {number} seriesIndex
 * @param {number} itemIndex
 * @returns {undefined}
 */
jsfc.XYLineRenderer.prototype.drawItem = function(ctx, dataArea, plot, 
        dataset, seriesIndex, itemIndex, pass) {

    if (pass === 0 && this._drawSeriesAsPath) {
        var itemCount = dataset.itemCount(seriesIndex);
        if (itemIndex === itemCount - 1) {
            this.drawSeries(ctx, dataArea, plot, dataset, seriesIndex);
        }
        return;
    }
    var x = dataset.x(seriesIndex, itemIndex);
    var y = dataset.y(seriesIndex, itemIndex);

    // convert these to target coordinates using the plot's axes
    var xx = plot.getXAxis().valueToCoordinate(x, dataArea.x(), dataArea.x() 
            + dataArea.width());
    var yy = plot.getYAxis().valueToCoordinate(y, dataArea.y() 
            + dataArea.height(), dataArea.y());
    
    if (pass === 0) { // in the FIRST pass draw lines
        if (itemIndex > 0) {
            // get the previous item
            var x0 = dataset.x(seriesIndex, itemIndex - 1);
            var y0 = dataset.y(seriesIndex, itemIndex - 1);
            var xx0 = plot.getXAxis().valueToCoordinate(x0, dataArea.x(), 
                    dataArea.x() + dataArea.width());
            var yy0 = plot.getYAxis().valueToCoordinate(y0, dataArea.y() 
                    + dataArea.height(), dataArea.y());
            // connect with a line
            ctx.setLineColor(this.lookupLineColor(dataset, seriesIndex, 
                    itemIndex));
            ctx.setLineStroke(this._strokeSource.getStroke(seriesIndex, 
                    itemIndex));
            ctx.drawLine(xx0, yy0, xx, yy);
        }
    } else if (pass === 1) { // in the second pass draw shapes if there are any
        //ctx.setFillColor(this.fillColors[seriesIndex]);
        //ctx.drawCircle(xx, yy, 4);
    }
  
};
