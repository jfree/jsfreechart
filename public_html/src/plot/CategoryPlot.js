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
 * @class A CategoryPlot is a two-dimensional plot where the x-axis is ordinal
 * and the y-axis is numerical (for example, a typical bar chart).
 * 
 * @constructor 
 * @param {!jsfc.Values2DDataset} dataset  the dataset (required).
 * @returns {jsfc.CategoryPlot}
 */
jsfc.CategoryPlot = function(dataset) {
    if (!(this instanceof jsfc.CategoryPlot)) {
        throw new Error("Use 'new' for construction.");
    }
    this._listeners = [];
    this._plotBackground = null;
    this._dataBackground = new jsfc.StandardRectanglePainter(
            new jsfc.Color(230, 230, 230), new jsfc.Color(0, 0, 0, 0));
    
    this._renderer = new jsfc.BarRenderer(this);
    this._rendererListener = function(p) {
        var plot = p;
        return function(renderer) {
            plot.rendererChanged(renderer);
        };
    }(this);
    
    this._axisOffsets = new jsfc.Insets(0, 0, 0, 0);
    this._xAxis = new jsfc.StandardCategoryAxis();
    this._xAxisPosition = jsfc.RectangleEdge.BOTTOM;
    this._xAxis.configureAsXAxis(this);
    this._xAxisListener = function(p) {
        var plot = p;
        return function(axis) {
            axis.configureAsXAxis(plot);
            plot.notifyListeners();
        };
    }(this);
    this._xAxis.addListener(this._xAxisListener);
    
    this._yAxis = new jsfc.LinearAxis();
    this._yAxis.setAutoRangeIncludesZero(true);
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
    this.itemLabelGenerator = new jsfc.KeyedValue2DLabels();      
};

/**
 * Returns the dataset.
 * 
 * @returns {jsfc.KeyedValues2DDataset} The category dataset.
 */
jsfc.CategoryPlot.prototype.getDataset = function() {
    return this._dataset;
};

/**
 * Sets the dataset for the plot and sends a change notification to
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {!jsfc.Values2DDataset} dataset  the new dataset.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.setDataset = function(dataset, notify) {
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
jsfc.CategoryPlot.prototype.getBackground = function() {
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
jsfc.CategoryPlot.prototype.setBackground = function(painter, notify) {
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
jsfc.CategoryPlot.prototype.setBackgroundColor = function(color, notify) {
    var painter = new jsfc.StandardRectanglePainter(color, null);
    this.setBackground(painter, notify);
};

/**
 * Returns the background painter for the data area.
 * 
 * @returns {jsfc.RectanglePainter} The painter.
 */
jsfc.CategoryPlot.prototype.getDataBackground = function() {
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
jsfc.CategoryPlot.prototype.setDataBackground = function(painter, notify) {
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
jsfc.CategoryPlot.prototype.setDataBackgroundColor = function(color, notify) {
    var painter = new jsfc.StandardRectanglePainter(color, null);
    this.setDataBackground(painter, notify);
};

/**
 * Returns the renderer.
 * 
 * @returns {jsfc.CategoryRenderer}
 */
jsfc.CategoryPlot.prototype.getRenderer = function() {
    return this._renderer;
};

/**
 * Sets the renderer and sends a change notification to all registered 
 * listeners (unless 'notify' is set to false).
 * 
 * @param {Object} renderer  the new renderer.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.setRenderer = function(renderer, notify) {
    this._renderer.removeListener(this._rendererListener);
    this._renderer = renderer;
    this._renderer.addListener(this._rendererListener);
    // reconfigure the axes
    this._xAxis.configureAsXAxis(this);
    this._yAxis.configureAsYAxis(this);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Handles changes to the dataset (this method is called by the dataset 
 * change listener, you don't normally need to call this directly).
 * 
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.datasetChanged = function() {
    this._xAxis.configureAsXAxis(this); 

    // if the y-axis is auto-range, then update the range
    if (this._yAxis.isAutoRange()) {
        this._yAxis.configureAsYAxis(this); 
    }
    // notify listeners that the plot has changed
    this.notifyListeners();
};

/**
 * Handles a change to the renderer.  The change could be a property change 
 * (for example a new series color) or a completely new renderer (switching
 * from a bar renderer to a stacked bar renderer would require the axis ranges
 * to be updated).
 * 
 * @param {jsfc.CategoryRenderer} renderer  the renderer.
 * 
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.rendererChanged = function(renderer) {
    this._xAxis.configureAsXAxis(this); 

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
jsfc.CategoryPlot.prototype.getAxisOffsets = function() {
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
jsfc.CategoryPlot.prototype.setAxisOffsets = function(offsets, notify) {
    this._axisOffsets = offsets;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the x-axis for the plot.
 * 
 * @returns {!jsfc.CategoryAxis}
 */
jsfc.CategoryPlot.prototype.getXAxis = function() {
    return this._xAxis;
};

/**
 * Sets the x-axis and sends a change notification to registered listeners
 * (unless 'notify' is set to false).
 * 
 * @param {!jsfc.CategoryAxis} axis  the new axis.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.setXAxis = function(axis, notify) {
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
jsfc.CategoryPlot.prototype.getXAxisPosition = function() {
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
jsfc.CategoryPlot.prototype.setXAxisPosition = function(edge, notify) {
    this.xAxisPosition = edge;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the y-axis for the plot.
 * 
 * @returns {jsfc.ValueAxis}
 */
jsfc.CategoryPlot.prototype.getYAxis = function() {
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
jsfc.CategoryPlot.prototype.setYAxis = function(axis, notify) {
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
jsfc.CategoryPlot.prototype.getYAxisPosition = function() {
    return this._yAxisPosition;
};

/**
 * Sets the y-axis position and sends a change notification to all registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {String} edge  the edge ("TOP" or "BOTTOM").
 * @param {boolean} [notify] notify listeners? (the default is true).
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.setYAxisPosition = function(edge, notify) {
    this.yAxisPosition = edge;
    if (notify !== false) {
        this.notifyListeners();
    }
};

jsfc.CategoryPlot.prototype.isYZoomable = function() {
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
jsfc.CategoryPlot.prototype.zoomXAboutAnchor = function(factor, anchor, notify) {
    // convert anchor to an axis value
    var x0 = this._dataArea.minX();
    var x1 = this._dataArea.maxX();
    var anchorX = this._xAxis.coordinateToValue(anchor, x0, x1);
    this._xAxis.resizeRange(factor, anchorX, notify !== false);
};

jsfc.CategoryPlot.prototype.zoomX = function(lowpc, highpc, notify) {
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
jsfc.CategoryPlot.prototype.zoomYAboutAnchor = function(factor, anchor, notify) {
    // convert anchor to an axis value
    var y0 = this._dataArea.minY();
    var y1 = this._dataArea.maxY();
    var anchorY = this._yAxis.coordinateToValue(anchor, y1, y0);
    this._yAxis.resizeRange(factor, anchorY, notify !== false);
};

jsfc.CategoryPlot.prototype.zoomY = function(lowpc, highpc, notify) {
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
jsfc.CategoryPlot.prototype.panX = function(percent, notify) {
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
jsfc.CategoryPlot.prototype.panY = function(percent, notify) {
    this._yAxis.pan(percent, notify !== false);    
};

/**
 * Registers a listener to receive notification of changes to the plot.  The
 * listener is a function - it will be passed one argument (this plot).
 * 
 * @param {Function} f  the listener function.
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.addListener = function(f) {
    this._listeners.push(f);  
};

/**
 * Notify each listener function that this plot has changed.
 * 
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.notifyListeners = function() {
    var plot = this;
    this._listeners.forEach(function(f) {
        f(plot);
    });
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
jsfc.CategoryPlot.prototype.draw = function(ctx, bounds, plotArea) {
    
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

    ctx.setHint("clip", this._dataArea);
    ctx.setHint("glass", this._dataArea);
    ctx.beginGroup("dataArea");
    // get the renderer to draw the data points - this may involve multiple
    // passes through the data
    var passCount = this._renderer.passCount();
    for (var pass = 0; pass < passCount; pass++) {
        for (var r = 0; r < this._dataset.rowCount(); r++) {
            for (var c = 0; c < this._dataset.columnCount(); c++) {
                this._renderer.drawItem(ctx, this._dataArea, this, 
                        this._dataset, r, c, pass);
            }
        }
    }
    ctx.endGroup();
};

/**
 * Returns the data area from the most recent rendering of the plot.
 * 
 * @returns {jsfc.Rectangle}
 */
jsfc.CategoryPlot.prototype.dataArea = function() { 
    return this._dataArea;
};

jsfc.CategoryPlot.prototype.drawAxes = function(ctx, bounds, dataArea) {
    var offset = this._axisOffsets.value(this._xAxisPosition);
    this._xAxis.draw(ctx, this, bounds, dataArea, offset);
    offset = this._axisOffsets.value(this._yAxisPosition);
    this._yAxis.draw(ctx, this, bounds, dataArea, offset);
};

/**
 * Returns the edge location of the specified axis.
 * @param {jsfc.ValueAxis|jsfc.CategoryAxis} axis  the axis.
 * @returns {string} The axis position (refer to jsfc.RectangleEdge).
 */
jsfc.CategoryPlot.prototype.axisPosition = function(axis) {
    if (axis === this._xAxis) {
        return this._xAxisPosition;
    } else if (axis === this._yAxis) {
        return this._yAxisPosition;
    }
    throw new Error("The axis does not belong to this plot.");
};

/**
 * Returns a list of jsfc.LegendItemInfo objects for the plot.  
 * 
 * @returns {Array}
 */
jsfc.CategoryPlot.prototype.legendInfo = function() {
    var info = [];
    var plot = this;
    this._dataset.rowKeys().forEach(function(key) {
        var dataset = plot._dataset;
        var index = dataset.rowIndex(key);
        var color = plot._renderer.getLineColorSource().getLegendColor(index);
        var item = new jsfc.LegendItemInfo(key, color);
        item.label = key;
        info.push(item);
    });
    return info;
};