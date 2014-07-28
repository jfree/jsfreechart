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
 * Creates a new renderer for generating bar charts on a jsfc.CategoryPlot.
 * @constructor
 * @implements {jsfc.CategoryRenderer}
 * @param {!jsfc.CategoryPlot} plot  the plot that the renderer is assigned to
 * @returns {!jsfc.BarRenderer}
 */
jsfc.BarRenderer = function(plot) {
    if (!(this instanceof jsfc.BarRenderer)) {
        throw new Error("Use 'new' for constructors.");
    }
    jsfc.BaseCategoryRenderer.init(this);
    this._plot = plot;
};

jsfc.BarRenderer.prototype = new jsfc.BaseCategoryRenderer();
    
/**
 * Returns the item fill color.
 * 
 * @param {string} rowKey  the row key.
 * @param {string} columnKey  the column key.
 * @returns {jsfc.Color}
 */
jsfc.BarRenderer.prototype.itemFillColor = function(dataset, rowKey, columnKey) {
    var r = dataset.rowIndex(rowKey);
    var c = dataset.columnIndex(columnKey);
    return this._lineColorSource.getColor(r, c);
};

jsfc.BarRenderer.prototype.itemStrokeColor = function(rowKey, columnKey) {
    return "none";
};

/**
 * Calculates the range of values required on the y-axis for this renderer to
 * show all the data items.
 * 
 * @param {jsfc.Values2DDataset} dataset  the dataset.
 * 
 * @returns {jsfc.Range} The range.
 */
jsfc.BarRenderer.prototype.calcYRange = function(dataset) {
    var bounds = jsfc.Values2DDatasetUtils.ybounds(dataset, 0);
    return new jsfc.Range(bounds[0], bounds[1]);
};

/**
 * Draws one item.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} dataArea  the data area.
 * @param {!jsfc.CategoryPlot} plot  the plot.
 * @param {!jsfc.Values2DDataset} dataset  the dataset.
 * @param {!number} rowIndex
 * @param {!number} columnIndex
 * @param {!number} pass
 * @returns {undefined}
 */
jsfc.BarRenderer.prototype.drawItem = function(ctx, dataArea, plot, 
        dataset, rowIndex, columnIndex, pass) {

    var rowKey = dataset.rowKey(rowIndex);
    var columnKey = dataset.columnKey(columnIndex);
    var y = dataset.valueByIndex(rowIndex, columnIndex);
    
    var xAxis = plot.getXAxis();
    var yAxis = plot.getYAxis();
    // convert these to target coordinates using the plot's axes
    var rowCount = dataset.rowCount();
    var xr = xAxis.itemRange(rowIndex, rowCount, columnKey, dataArea.minX(), 
            dataArea.maxX());    
    var yy = yAxis.valueToCoordinate(y, dataArea.maxY(), dataArea.minY());
    var zz = yAxis.valueToCoordinate(0, dataArea.maxY(), dataArea.minY());
    var color = this.itemFillColor(dataset, rowKey, columnKey);
    ctx.setFillColor(color);
    ctx.setLineColor(new jsfc.Color(50, 50, 50));
    
    ctx.drawRect(xr.lowerBound(), Math.min(yy, zz), xr.length(), 
            Math.abs(zz - yy));
};
