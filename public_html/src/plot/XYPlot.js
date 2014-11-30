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
 * Creates a new plot for the specified dataset.
 * 
 * @class An XYPlot is a two-dimensional plot where both the x and y axes are
 * numerical.
 * 
 * @constructor 
 * @param {!jsfc.XYDataset} dataset  the dataset (null not permitted).
 * @returns {jsfc.XYPlot}
 */
jsfc.XYPlot = function(dataset) {
    if (!(this instanceof jsfc.XYPlot)) {
        throw new Error("Use 'new' for construction.");
    }
    this._listeners = [];
    this._notify = true;
    this._plotBackground = null;
    this._dataBackground = new jsfc.StandardRectanglePainter(
            new jsfc.Color(230, 230, 230), new jsfc.Color(0, 0, 0, 0));
    this._dataArea = new jsfc.Rectangle(0, 0, 0, 0);
    this._renderer = new jsfc.ScatterRenderer(this);
    this._axisOffsets = new jsfc.Insets(0, 0, 0, 0);
    this._xAxis = new jsfc.LinearAxis();
    this._xAxisPosition = jsfc.RectangleEdge.BOTTOM;
    this._xAxis.configureAsXAxis(this);
    this._xAxisListener = function(p) {
        var plot = p;
        return function(axis) {
            if (axis.isAutoRange()) {
                axis.configureAsXAxis(plot);    
            }
            plot.notifyListeners();
        };
    }(this);
    this._xAxis.addListener(this._xAxisListener);
    
    this._yAxis = new jsfc.LinearAxis();
    this._yAxisPosition = jsfc.RectangleEdge.LEFT;
    this._yAxis.configureAsYAxis(this);
    this._yAxisListener = function(p) {
        var plot = p;
        return function(axis) {
            if (axis.isAutoRange()) {
                axis.configureAsYAxis(plot);    
            }
            plot.notifyListeners();
        };
    }(this);
    this._yAxis.addListener(this._yAxisListener);
    this.setDataset(dataset);
    
    this._staggerRendering = false;
    this._drawMS = 150; // milliseconds on then off
    this._pauseMS = 100;
    this._staggerID = null; // id of setTimeout so we can cancel if necessary
    this._progressColor1 = new jsfc.Color(100, 100, 200, 200);
    this._progressColor2 = new jsfc.Color(100, 100, 100, 100);
    this._progressLabelFont = new jsfc.Font("sans-serif", 12);
    this._progressLabelColor = jsfc.Colors.WHITE;
    this._progressLabelFormatter = new jsfc.NumberFormat(0);
};

/**
 * Returns the dataset.
 * 
 * @returns {!jsfc.XYDataset} The XY dataset (never null).
 */
jsfc.XYPlot.prototype.getDataset = function() {
    return this._dataset;
};

/**
 * Sets the dataset for the plot and sends a change notification to 
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {!jsfc.XYDataset} dataset  the new dataset (null not permitted).
 * @param {boolean} [notify]  notify listeners? (the default is true).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setDataset = function(dataset, notify) {
    if (this._datasetListener) {
        this._dataset.removeListener(this._datasetListener);
    }
    this._dataset = dataset;
    
    // keep a reference to the listener so we can deregister it when changing
    // the dataset
    this._datasetListener = function(plot) {
        var me = plot;
        return function(dataset) {
            me.datasetChanged();
        };
    }(this);
    this._dataset.addListener(this._datasetListener);
    
    // reconfigure the axes
    this._xAxis.configureAsXAxis(this);
    this._yAxis.configureAsYAxis(this);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the background painter for the plot.  The default value is 
 * 'undefined' (which means that no background is painted for the plot - the
 * chart background color will be visible).
 * 
 * @returns {jsfc.RectanglePainter} The background painter.
 */
jsfc.XYPlot.prototype.getBackground = function() {
    return this._plotBackground;
};

/**
 * Sets the background painter and sends a change event to registered listeners
 * (unless 'notify' is set to false).
 * 
 * @param {jsfc.RectanglePainter} painter  the painter.
 * @param {boolean} [notify]  notify listeners? (the default is true).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setBackground = function(painter, notify) {
    this._plotBackground = painter;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Sets the background color for the plot and sends a change notification to 
 * all registered listeners.
 * 
 * @param {jsfc.Color} color  the new color.
 * @param {boolean} [notify]  notify listeners? (the default is true).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setBackgroundColor = function(color, notify) {
    var painter = new jsfc.StandardRectanglePainter(color, null);
    this.setBackground(painter, notify);
};

/**
 * Returns the background painter for the data area.
 * 
 * @returns {jsfc.RectanglePainter} The painter.
 */
jsfc.XYPlot.prototype.getDataBackground = function() {
    return this._dataBackground;
};

/**
 * Sets the background painter for the data area and sends a change event to 
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.RectanglePainter} painter  the painter.
 * @param {boolean} [notify]  notify listeners? (the default is true).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setDataBackground = function(painter, notify) {
    this._dataBackground = painter;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Sets the background color for the data area and sends a change 
 * notification to all registered listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.Color} color  the new color.
 * @param {boolean} [notify]  notify listeners? (the default is true).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setDataBackgroundColor = function(color, notify) {
    var painter = new jsfc.StandardRectanglePainter(color, null);
    this.setDataBackground(painter, notify);
};

/**
 * Returns the renderer.
 * @returns {jsfc.XYRenderer}
 */
jsfc.XYPlot.prototype.getRenderer = function() {
    return this._renderer;
};

/**
 * Returns the flag that controls whether or not rendering is staggered (the
 * default value is false).
 * Staggered rendering will draw the chart in chunks with a pause in between
 * each chunk to allow the browser to process user events.
 * 
 * @returns {!boolean}
 */
jsfc.XYPlot.prototype.getStaggerRendering = function() {
    return this._staggerRendering;
};

/**
 * Sets the flag that controls whether or not rendering is staggered and sends
 * a change notification to all registered listeners.
 * 
 * @param {!boolean} stagger
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setStaggerRendering = function(stagger) {
    this._staggerRendering = stagger;
    this.notifyListeners(); 
};

/**
 * Returns the number of milliseconds that the renderer aims to spend 
 * drawing each chunk.  The default value is 150.
 * 
 * @returns {!number}
 */
jsfc.XYPlot.prototype.getDrawMillis = function() {
    return this._drawMS;
};

/**
 * Sets the number of milliseconds as the target for each chunk when staggered
 * rendering is being used.
 * 
 * @param {!number} ms  the number of milliseconds.
 * 
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setDrawMillis = function(ms) {
    this._drawMS = ms;
};

/**
 * Returns the number of milliseconds to pauses after drawing each chunk.  The 
 * default value is 100.
 * 
 * @returns {!number}
 */
jsfc.XYPlot.prototype.getPauseMillis = function() {
    return this._pauseMS;
};

/**
 * Sets the number of milliseconds to pause after drawing each chunk when 
 * staggered rendering is being used.
 * 
 * @param {!number} ms  the number of milliseconds.
 * 
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setPauseMillis = function(ms) {
    this._pauseMS = ms;
};

jsfc.XYPlot.prototype.getProgressColor1 = function() {
    return this._progressColor1;
};

jsfc.XYPlot.prototype.setProgressColor1 = function(color) {
    this._progressColor1 = color;
};
jsfc.XYPlot.prototype.getProgressColor2 = function() {
    return this._progressColor2;
};

jsfc.XYPlot.prototype.setProgressColor2 = function(color) {
    this._progressColor2 = color;
};

jsfc.XYPlot.prototype.getProgressLabelFont = function() {
    return this._progressLabelFont;
};
jsfc.XYPlot.prototype.setProgressLabelFont = function(font) {
    this._progressLabelFont = font;
};
jsfc.XYPlot.prototype.getProgressLabelColor = function() {
    return this._progressLabelColor;
};
jsfc.XYPlot.prototype.setProgressLabelColor = function(color) {
    this._progressLabelColor = color;
};

jsfc.XYPlot.prototype.getProgressLabelFormatter = function() {
    return this._progressLabelFormatter;
};
jsfc.XYPlot.prototype.setProgressLabelFormatter = function(formatter) {
    this._progressLabelFormatter = formatter;
};

/**
 * Handles changes to the dataset (this method is called by the dataset 
 * change listener, you don't normally need to call this directly).
 * 
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.datasetChanged = function() {
    // if the x-axis is auto-range, then update the range
    if (this._xAxis.isAutoRange()) {
        this._xAxis.configureAsXAxis(this); 
    }
    // if the y-axis is auto-range, then update the range
    if (this._yAxis.isAutoRange()) {
        this._yAxis.configureAsYAxis(this); 
    }
    // notify listeners that the plot has changed
    this.notifyListeners();
};

/**
 * Returns the axis offsets (the gap between the data area and the axis line).
 * The default is Insets(0, 0, 0, 0).
 * 
 * @returns {jsfc.Insets} The axis offsets.
 */
jsfc.XYPlot.prototype.getAxisOffsets = function() {
    return this._axisOffsets;
};

/**
 * Sets the axis offsets and sends a change notification to all registered
 * listeners (unless 'notify' is false).
 * 
 * @param {jsfc.Insets} offsets  the new offsets.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setAxisOffsets = function(offsets, notify) {
    this._axisOffsets = offsets;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the x-axis for the plot.
 * 
 * @returns {!jsfc.ValueAxis}
 */
jsfc.XYPlot.prototype.getXAxis = function() {
    return this._xAxis;
};

/**
 * Sets the x-axis and sends a change notification to registered listeners
 * (unless 'notify' is set to false).
 * 
 * @param {!jsfc.ValueAxis} axis  the new axis.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setXAxis = function(axis, notify) {
    this._xAxis.removeListener(this._xAxisListener);
    this._xAxis = axis;
    this._xAxis.addListener(this._xAxisListener);
    this._xAxis.configureAsXAxis(this);
    if (notify !== false) {
        this.notifyListeners();
    }  
};

/**
 * Returns the position of the x-axis (either "TOP" or "BOTTOM", see the
 * values defined in jsfc.RectangleEdge).
 * 
 * @returns {String} The position.
 */
jsfc.XYPlot.prototype.getXAxisPosition = function() {
    return this._xAxisPosition;
};

/**
 * Sets the x-axis position and sends a change notification to all registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {String} edge  the edge ("TOP" or "BOTTOM").
 * @param {boolean} [notify] notify listeners? (the default is true).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setXAxisPosition = function(edge, notify) {
    this.xAxisPosition = edge;
    if (notify !== false) {
        this.notifyListeners();
    }
};

jsfc.XYPlot.prototype.isXZoomable = function() { 
    return true;  // later we could allow the user to set this
};

/**
 * Returns the y-axis for the plot.
 * 
 * @returns {jsfc.ValueAxis}
 */
jsfc.XYPlot.prototype.getYAxis = function() {
    return this._yAxis;
};

/**
 * Sets the y-axis and sends a change notification to registered listeners
 * (unless 'notify' is set to false).
 * 
 * @param {!jsfc.ValueAxis} axis  the new axis.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setYAxis = function(axis, notify) {
    this._yAxis.removeListener(this._yAxisListener);
    this._yAxis = axis;
    this._yAxis.addListener(this._yAxisListener);
    this._yAxis.configureAsYAxis(this);
    if (notify !== false) {
        this.notifyListeners();
    }  
};

/**
 * Returns the position of the y-axis (either "LEFT" or "RIGHT", see the
 * values defined in jsfc.RectangleEdge).
 * 
 * @returns {String} The position.
 */
jsfc.XYPlot.prototype.getYAxisPosition = function() {
    return this._yAxisPosition;
};

/**
 * Sets the y-axis position and sends a change notification to all registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {String} edge  the edge ("TOP" or "BOTTOM").
 * @param {boolean} [notify] notify listeners.
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setYAxisPosition = function(edge, notify) {
    this.yAxisPosition = edge;
    if (notify !== false) {
        this.notifyListeners();
    }
};

jsfc.XYPlot.prototype.isYZoomable = function() {
    return true;  // later we could allow the user to set this
};

/**
 * Performs a zoom (in or out) on the x-axis about the specified anchor point
 * (which is a coordinate from document space).
 * 
 * @param {number} factor  the zoom factor.
 * @param {number} anchor  the anchor point (in document space).
 * @param {boolean} [notify]  notify listeners? (optional).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.zoomXAboutAnchor = function(factor, anchor, notify) {
    // convert anchor to an axis value
    var x0 = this._dataArea.minX();
    var x1 = this._dataArea.maxX();
    var anchorX = this._xAxis.coordinateToValue(anchor, x0, x1);
    this._xAxis.resizeRange(factor, anchorX, notify !== false);
};

jsfc.XYPlot.prototype.zoomX = function(lowpc, highpc, notify) {
    this._xAxis.setBoundsByPercent(lowpc, highpc, notify);    
};

/**
 * Performs a zoom (in or out) on the y-axis about the specified anchor point
 * (which is a coordinate from document space).
 * 
 * @param {number} factor  the zoom factor.
 * @param {number} anchor  the anchor point (in document space).
 * @param {boolean} [notify]  notify listeners? (optional).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.zoomYAboutAnchor = function(factor, anchor, notify) {
    // convert anchor to an axis value
    var y0 = this._dataArea.minY();
    var y1 = this._dataArea.maxY();
    var anchorY = this._yAxis.coordinateToValue(anchor, y1, y0);
    this._yAxis.resizeRange(factor, anchorY, notify !== false);
};

jsfc.XYPlot.prototype.zoomY = function(lowpc, highpc, notify) {
    this._yAxis.setBoundsByPercent(lowpc, highpc, notify);    
};

/**
 * Slides the x-axis values (up or down) by the specified percentage and
 * notifies registered listeners (unless 'notify' is set to false).
 * 
 * @param {number} percent  the percentage.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.panX = function(percent, notify) {
    this._xAxis.pan(percent, notify !== false);
};

/**
 * Slides the x-axis values (up or down) by the specified percentage and
 * notifies registered listeners (unless 'notify' is set to false).
 * 
 * @param {number} percent  the percentage.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.panY = function(percent, notify) {
    this._yAxis.pan(percent, notify !== false);    
};

/**
 * Sets the renderer and sends a change notification to all registered 
 * listeners (unless 'notify' is set to false).
 * 
 * @param {Object} renderer  the new renderer.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setRenderer = function(renderer, notify) {
    this._renderer = renderer;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Draws the plot on a 2D rendering context (such as the HTML5 canvas). This
 * provides an alternative rendering approach.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} bounds  the chart bounds.
 * @param {!jsfc.Rectangle} plotArea  the area for drawing the plot.
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.draw = function(ctx, bounds, plotArea) {
    
    if (this._staggerID) {
        clearTimeout(this._staggerID);
        ctx.setHint("layer", "progress");
        ctx.clear();
        ctx.setHint("layer", "default");
    }
    // fill the plot background if there is one (very often this is not defined
    // so that the chart background shows through, and note that there is also
    // a 'dataBackground' painter that is used for the area inside the axes).
    if (this._plotBackground) {
        this._plotBackground.paint(ctx, plotArea);
    }

    // compute the data area by getting the space required for the axes
    var space = new jsfc.AxisSpace(0, 0, 0, 0);
    var edge = this.axisPosition(this._xAxis);
    var xspace = this._xAxis.reserveSpace(ctx, this, bounds, plotArea, edge);
    space.extend(xspace, edge);
    
    var adjArea = space.innerRect(plotArea);
    edge = this.axisPosition(this._yAxis);
    var yspace = this._yAxis.reserveSpace(ctx, this, bounds, adjArea, edge);
    space.extend(yspace, edge);
    
    this._dataArea = space.innerRect(plotArea);
    if (this._dataBackground) {
        this._dataBackground.paint(ctx, this._dataArea);
    }
    this.drawAxes(ctx, bounds, this._dataArea);    

    
    // get the renderer to draw the data points - this may involve multiple
    // passes through the data
    if (this._staggerRendering) {
        this._renderDataItemsByChunks(ctx);
    } else {
        this._renderAllDataItems(ctx);
    }
};

/**
 * Render all the data items at once.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @returns {undefined}
 */
jsfc.XYPlot.prototype._renderAllDataItems = function(ctx) {
    // for SVG we are setting the clip via hints
    ctx.setHint("clip", this._dataArea);
    ctx.setHint("glass", this._dataArea);
    ctx.beginGroup("dataArea");
    ctx.save();
    ctx.setClip(this._dataArea);
    var passCount = this._renderer.passCount();
    for (var pass = 0; pass < passCount; pass++) {
        for (var s = 0; s < this._dataset.seriesCount(); s++) {
            for (var i = 0; i < this._dataset.itemCount(s); i++) {
                this._renderer.drawItem(ctx, this._dataArea, this, 
                        this._dataset, s, i, pass);
            }
        }
    }    
    ctx.restore();
    ctx.endGroup();
};

/**
 * Renders the data items in multiple chunks, pausing between each chunk to 
 * allow the browser to process user events.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @returns {undefined}
 */
jsfc.XYPlot.prototype._renderDataItemsByChunks = function(ctx) {
    var chunkSize = 200;  // we could ask the renderer for a default, so that if
        // a renderer does something complex, it could suggest a lower number
        
    // if we have a small number of items, just go for regular rendering
    var itemCount = jsfc.XYDatasetUtils.itemCount(this._dataset);
    if (itemCount <= chunkSize * 2) {
        this._renderAllDataItems(ctx);
        return;
    }
    var cursor = {"series": 0, "item": 0};
    // first chunk is drawn immediately
    this._processChunk(ctx, this, chunkSize * 2, cursor);
    // remaining chunks are staggered
    this._processChunkAndSubmitAnother(ctx, this, chunkSize, cursor);

};

/**
 * Renders a chunk of data items starting from the item designated by the 
 * cursor.
 * @param {!jsfc.XYPlot} plot
 * @param {!jsfc.Context2D} ctx  the graphics context (null not permitted).
 * @param {!number} chunkSize  the chunk size (number of data items).
 * @param {!Object} cursor  the cursor.
 * @returns {undefined}
 */
jsfc.XYPlot.prototype._processChunk = function(ctx, plot, chunkSize, cursor) {
    ctx.setHint("clip", this._dataArea);
    ctx.setHint("glass", this._dataArea);
    ctx.beginGroup("chunk");
    var dataset = plot.getDataset();
    var moreItems = true;
    for (var i = 0; i < chunkSize && moreItems; i++) {
        plot._renderer.drawItem(ctx, plot._dataArea, plot, 
                dataset, cursor.series, cursor.item, 0);
        moreItems = plot._advanceCursor(cursor, dataset);
    }  
    ctx.endGroup();
};

/**
 * Processes one chunk of data items then submits a job to process the next 
 * chunk after a short delay.
 * 
 * @param {!jsfc.Context2D} ctx
 * @param {!jsfc.XYPlot} plot
 * @param {!number} chunkSize  the number of data items to process in each chunk
 * @param {!Object} cursor  pointer to the current data item.
 * @returns {undefined}
 */
jsfc.XYPlot.prototype._processChunkAndSubmitAnother = function(ctx, plot, 
        chunkSize, cursor) {
    
    var f = function(plot, ctx, chunkSize, cursor) {
        return function() {
            var start = Date.now();
            plot._processChunk(ctx, plot, chunkSize, cursor);
            var elapsed = Date.now() - start;
            // if there is more to do, call plot._processChunkAndSubmitAnother
            if (cursor.series !== plot._dataset.seriesCount()) {
                chunkSize = chunkSize * (plot._drawMS / elapsed);
                plot._processChunkAndSubmitAnother(ctx, plot, chunkSize, cursor);
            } else {
                ctx.setHint("layer", "progress");
                ctx.clear();
                ctx.setHint("layer", "default");
            }
        };
    };
    this._staggerID = setTimeout(f(plot, ctx, chunkSize, cursor), 
            plot._pauseMS);
    
    // switch to the "progress" layer and draw a progress indicator
    this._drawProgressIndicator(ctx, plot.dataArea(), cursor, plot.getDataset());
    
};

/**
 * Draws a progress indicator for the render-by-chunk process.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} area  the data area.
 * @param {!Object} cursor  the cursor (has 'series' and 'item' properties).
 * @param {!jsfc.XYDataset} dataset  the dataset (required to calculate the
 *         number of items *before* the cursor (that is, already processed).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype._drawProgressIndicator = function(ctx, area, cursor, 
        dataset) {
    ctx.setHint("layer", "progress");
    ctx.clear();
    var itemCount = jsfc.XYDatasetUtils.itemCount(this._dataset);
    var processed = this._itemsProcessed(cursor, this._dataset);
    var x = area.centerX();
    var y = area.maxY() - (0.1 * area.height());
    var width = area.width() / 1.2;
    var height = this._progressLabelFont.size + 4;
    var percent = processed / itemCount;
    var x0 = x - width / 2;
    var y0 = y - height / 2;
    var x1 = x + width / 2;
    var px = x0 + (width * percent);
    ctx.setFillColor(this._progressColor1);
    ctx.fillRect(x0, y0, px - x0, height);
    ctx.setFillColor(this._progressColor2);
    ctx.fillRect(px, y0, x1 - px, height);
    ctx.setFillColor(this._progressLabelColor);
    ctx.setFont(this._progressLabelFont);
    var text = this._progressLabelFormatter.format(percent * 100) + "%";
    ctx.drawAlignedString(text, x, y0, jsfc.TextAnchor.TOP_CENTER);
    ctx.setHint("layer", "default");    
};

/**
 * Calculates the number of data items that precede the cursor.
 * 
 * @param {!Object} cursor  the cursor.
 * @param {!jsfc.XYDataset} dataset  the dataset.
 * @returns {!number} The number of items that precede the item that the cursor 
 *     is pointing to.
 */
jsfc.XYPlot.prototype._itemsProcessed = function(cursor, dataset) {   
    var result = cursor.item;
    for (var s = 0 ; s < cursor.series; s++) {
        result += dataset.itemCount(s);
    }
    return result;
};

/**
 * Advances the cursor to the next item in the dataset, returning true if 
 * the cursor is advanced and false if the cursor was already pointing at the
 * last item in the dataset.
 * 
 * @param {Object} cursor
 * @param {!jsfc.XYDataset} dataset
 * @returns {!boolean}
 */
jsfc.XYPlot.prototype._advanceCursor = function(cursor, dataset) {
    var itemCount = dataset.itemCount(cursor.series);
    if (cursor.item === itemCount - 1) {
        var seriesCount = dataset.seriesCount();
        if (cursor.series === seriesCount - 1) {
            cursor.series++;
            return false;
        } else {
            cursor.series++;
            cursor.item = 0;
            return true;
        }
    } else {
        cursor.item++;
        return true;
    }
};

/**
 * Returns the data area from the most recent rendering of the plot.  If the
 * plot has never been rendered, this method will return a rectangle with
 * zero width and height.
 * 
 * @returns {!jsfc.Rectangle} The data area (never null).
 */
jsfc.XYPlot.prototype.dataArea = function() { 
    return this._dataArea;
};

/**
 * Draws the plot's axes around the specified dataArea.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} bounds  the bounds.
 * @param {!jsfc.Rectangle} dataArea  the data area.
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.drawAxes = function(ctx, bounds, dataArea) {
    var offset = this._axisOffsets.value(this._xAxisPosition);
    this._xAxis.draw(ctx, this, bounds, dataArea, offset);
    offset = this._axisOffsets.value(this._yAxisPosition);
    this._yAxis.draw(ctx, this, bounds, dataArea, offset);
};

/**
 * Returns the edge location of the specified axis.
 * @param {jsfc.ValueAxis} axis  the axis.
 * @returns {string} The axis position (refer to jsfc.RectangleEdge).
 */
jsfc.XYPlot.prototype.axisPosition = function(axis) {
    if (axis === this._xAxis) {
        return this._xAxisPosition;
    } else if (axis === this._yAxis) {
        return this._yAxisPosition;
    }
    throw new Error("The axis does not belong to this plot.");
};

/**
 * Returns a list of items that should be included in the plot's legend (each
 * item is an instance of jsfc.LegendItemInfo).  
 * 
 * @returns {Array} The legend items.
 */
jsfc.XYPlot.prototype.legendInfo = function() {
    var info = [];
    var plot = this;
    this._dataset.seriesKeys().forEach(function(key) {
        var dataset = plot._dataset;
        var index = dataset.seriesIndex(key);
        var color = plot._renderer.lookupLineColor(dataset, index, 0);
        var item = new jsfc.LegendItemInfo(key, color);
        item.label = key;
        info.push(item);
    });
    return info;
};

/**
 * Finds the nearest visible data item to the location (x, y) and returns
 * an object containing the "seriesKey" and "itemKey" for that data item.
 * 
 * @param {!number} x  the x-value.
 * @param {!number} y  the y-value.
 * @param {number} [xscale]  the scale factor for the x-values (used in the 
 *         distance calculation, this defaults to 1).
 * @param {number} [yscale]  the scale factor for the y-values (used in the 
 *         distance calculation, this defaults to 1).
 * @returns {Object|undefined} A key for the data item.
 */
jsfc.XYPlot.prototype.findNearestDataItem = function(x, y, xscale, yscale) {
    xscale = xscale || 1;
    yscale = yscale || 1;
    var minD = Number.MAX_VALUE;
    var nearest;
    for (var s = 0; s < this._dataset.seriesCount(); s++) {
        for (var i = 0; i < this._dataset.itemCount(s); i++) {
            var xy = this._dataset.item(s, i);
            var xx = xy.x;
            var yy = xy.y;
            if (this._xAxis.contains(xx) && this._yAxis.contains(yy)) {
                var dx = (x - xx) / xscale;
                var dy = (y - yy) / yscale;
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d < minD) {
                    nearest = { "seriesKey": this._dataset.seriesKey(s), 
                            "itemKey": this._dataset.itemKey(s, i) };
                    minD = d;
                }
            }
        }
    }
    return nearest;
};

/**
 * Registers a listener to receive notification of changes to the plot.  The
 * listener is a function - it will be passed one argument (this plot).
 * 
 * @param {Function} f  the listener function.
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.addListener = function(f) {
    this._listeners.push(f);  
};

/**
 * Notify each listener function that this plot has changed.
 * 
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.notifyListeners = function() {
    if (!this._notify) {
        return;
    }
    var plot = this;
    this._listeners.forEach(function(f) {
        f(plot);
    });
};

/**
 * Returns the flag that controls whether or not notifications are forwarded 
 * to registered listeners.  The default value is true.  This flag can be used
 * to temporarily disable event notifications.
 * 
 * @returns {!boolean}
 */
jsfc.XYPlot.prototype.getNotify = function() {
    return this._notify;
};

/**
 * Sets the notify flag.  If the new value is true, this method also sends a 
 * change notification to all registered listeners (it is usually the case
 * that multiple changes have been made, but it is possible that no changes
 * have occurred).
 * 
 * @param {!boolean} notify  notify listeners?
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setNotify = function(notify) {
    this._notify = notify;
    if (notify) {
        this.notifyListeners();
    }
};

