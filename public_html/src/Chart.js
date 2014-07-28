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
 * Creates a new chart containing the specified plot.
 * 
 * @classdesc Represents a chart which has an optional title and subtitle,
 *   a plot where the data is presented, and an optional legend.  Different
 *   types of plot are supported to represent different types of data.
 *   
 * @constructor
 * @param {jsfc.CategoryPlot|jsfc.XYPlot} plot  the plot.
 * @returns {jsfc.Chart}
 */
jsfc.Chart = function(plot) {
    if (!(this instanceof jsfc.Chart)) {
        throw new Error("Use 'new' for construction.");
    } 
    this._size = new jsfc.Dimension(400, 240);
    var white = new jsfc.Color(255, 255, 255);
    this._backgroundPainter = new jsfc.StandardRectanglePainter(white, null);

    /** The margin around the edges of the plot. */
    this._padding = new jsfc.Insets(4, 4, 4, 4);
    
    /**
     * The title for the chart.
     * @type {jsfc.TableElement}
     */
    this._titleElement = null;
    
    /** The anchor point for the title. */
    this._titleAnchor = new jsfc.Anchor2D(jsfc.RefPt2D.TOP_LEFT);
    
    /** 
     * @type {jsfc.CategoryPlot|jsfc.XYPlot} 
     * @private 
     */
    this._plot = plot;
    
    /**
     * @type {jsfc.LegendBuilder}
     * @private
     */
    this._legendBuilder = new jsfc.StandardLegendBuilder();
    
    /**
     * @type {jsfc.Anchor2D}
     * @private
     */
    this._legendAnchor = new jsfc.Anchor2D(jsfc.RefPt2D.BOTTOM_RIGHT);
    
    this._listeners = [];
     
    // listen for changes to the plot
    var plotListener = function(c) {
        var chart = c;
        return function(plot) {
            chart.notifyListeners();
        };
    }(this);
    plot.addListener(plotListener);
    plot.chart = this;
};

jsfc.Chart.prototype.getElementID = function() {
    return this._elementId;
};

jsfc.Chart.prototype.setElementID = function(id) {
    this._elementId = id;
};

/**
 * Returns the size of the chart.
 * 
 * @returns {!jsfc.Dimension} The size.
 */
jsfc.Chart.prototype.getSize = function() {
    return this._size;
};

/**
 * Sets the dimensions of the chart and sends a change notification to 
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {!number} width  the new width.
 * @param {!number} height  the new height.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.Chart.prototype.setSize = function(width, height, notify) {
    this._size = new jsfc.Dimension(width, height);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the painter for the chart's background.  The default value will draw
 * a white background for the chart.
 * 
 * @returns {jsfc.RectanglePainter} The background painter.
 */
jsfc.Chart.prototype.getBackground = function() {
    return this._backgroundPainter;
};

/**
 * Sets the background painter for the chart and sends a change notification
 * to all registered listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.RectanglePainter} painter  the new painter.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.Chart.prototype.setBackground = function(painter, notify) {
    this._backgroundPainter = painter;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Sets the background color for the chart and sends a change event to 
 * registered listeners (unless 'notify' is set to false.  This is a 
 * convenience method that creates a new 'StandardRectanglePainter' and passes 
 * it to the setBackground(painter, notify) method.
 * 
 * @param {jsfc.Color} color  the background color.
 * @param {boolean} [notify]  notify listeners.
 * @returns {undefined}
 */
jsfc.Chart.prototype.setBackgroundColor = function(color, notify) {
    var painter = new jsfc.StandardRectanglePainter(color);
    this.setBackground(painter, notify);
};

/**
 * Returns the current padding.
 * 
 * @returns {jsfc.Insets} The padding.
 */
jsfc.Chart.prototype.getPadding = function() {
    return this._padding;
};

/**
 * Sets the padding around the edges of the chart and sends a change 
 * notification to all registered listeners (unless 'notify' is set to false).
 * 
 * @param {!number} top  the padding at the top.
 * @param {!number} left  the padding at the left.
 * @param {!number} bottom  the padding at the bottom.
 * @param {!number} right  the padding at the right.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.Chart.prototype.setPadding = function(top, left, bottom, right, notify) {
    this._padding = new jsfc.Insets(top, left, bottom, right);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the chart title (this is a table element structure of arbitrary
 * complexity, the typical case contains a title and subtitle).
 * 
 * @returns {jsfc.TableElement} The chart title (possibly null/undefined).
 */
jsfc.Chart.prototype.getTitleElement = function() {
    return this._titleElement;
};

/**
 * Sets the chart title and sends a change notification to registered listeners
 * (unless 'notify' is set to false).
 * 
 * @param {jsfc.TableElement} title  the chart title (null permitted).
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.Chart.prototype.setTitleElement = function(title, notify) {
    this._titleElement = title;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Sets the chart title and subtitle (this builds a table element representing
 * the title and calls setTitleElement()).
 * 
 * @param {!string} title  the title.
 * @param {string} [subtitle]  the subtitle (null permitted).
 * @param {jsfc.Anchor2D} [anchor]  the anchor point (null permitted).
 * @param {boolean} [notify]  notify listeners.
 * @returns {jsfc.Chart} This object for chaining method calls.
 */
jsfc.Chart.prototype.setTitle = function(title, subtitle, anchor, 
        notify) {
    var element = jsfc.Charts.createTitleElement(title, subtitle, anchor);
    this.setTitleElement(element, notify);
    return this;
};

/**
 * Updates the text, font and color for the existing title.
 * 
 * @param {string} title  the new title text.
 * @param {jsfc.Font} [font]  the new title font.
 * @param {jsfc.Color} [color]  the new title color.
 * @returns {undefined}
 */
jsfc.Chart.prototype.updateTitle = function(title, font, color) {
    if (!this._titleElement) {
        return;
    }
    this._titleElement.receive(function(e) {
        if (e instanceof jsfc.TextElement && e.isTitle) {
            if (title) {
                e.setText(title);
            }
            if (font) {
                e.setFont(font);
            }
            if (color) {
                e.setColor(color);
            }
        }    
    });
};

jsfc.Chart.prototype.updateSubtitle = function(subtitle, font, color) {  
    if (!this._titleElement) {
        return;
    }
    this._titleElement.receive(function(e) {
        if (e instanceof jsfc.TextElement && e.isSubtitle) {
            if (subtitle) {
                e.setText(subtitle);
            }
            if (font) {
                e.setFont(font);
            }
            if (color) {
                e.setColor(color);
            }
        }    
    });
};

/**
 * Returns the title anchor.
 * 
 * @returns {jsfc.Anchor2D} The title anchor.
 */
jsfc.Chart.prototype.getTitleAnchor = function() {
    return this._titleAnchor;
};

/**
 * Sets the title anchor and sends a change notification to all registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {!jsfc.Anchor2D} anchor  the anchor point.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.Chart.prototype.setTitleAnchor = function(anchor, notify) {
    this._titleAnchor = anchor;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the plot, the object that manages the dataset, axes and renderer
 * for the chart.  The plot is set via the constructor.
 * 
 * @returns {Object} The plot (never null).
 */
jsfc.Chart.prototype.getPlot = function() {
    return this._plot;    
};

/**
 * Returns the object that builds the legend for this chart.  The default
 * builder will create a legend that matches the dataset (with colors from 
 * the plot or renderer).  If the legend builder is null, no legend will be
 * drawn for the chart.
 * 
 * @returns {jsfc.LegendBuilder} The legend builder (possibly null).
 */
jsfc.Chart.prototype.getLegendBuilder = function() {
    return this._legendBuilder;
};

/**
 * Sets the legend builder for the chart and sends a change notification to
 * all registered listeners (unless 'notify' is set to false).  Set this 
 * builder to null if you don't require a legend.
 * 
 * @param {jsfc.LegendBuilder} builder  the legend builder (null permitted).
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.Chart.prototype.setLegendBuilder = function(builder, notify) {
    this._legendBuilder = builder;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the legend anchor point.  The default value is BOTTOM_RIGHT.
 * 
 * @returns {jsfc.Anchor2D} The anchor point.
 */
jsfc.Chart.prototype.getLegendAnchor = function() {
    return this._legendAnchor;
};

/**
 * Sets the legend anchor point and sends a change notification to all 
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {!jsfc.Anchor2D} anchor  the anchor point (null not permitted).
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.Chart.prototype.setLegendAnchor = function(anchor, notify) {
    this._legendAnchor = anchor;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Applies an increment to the margins to accommodate an item with the 
 * specified dimensions at the given position (anchor).
 * 
 * @param {Object} margin  the margin object to adjust.
 * @param {jsfc.Dimension} dim  the dimensions for the adjustment.
 * @param {jsfc.Anchor2D} anchor  the anchor point.
 * 
 * @returns {undefined}
 */
jsfc.Chart.prototype._adjustMargin = function(margin, dim, anchor) {
    if (jsfc.RefPt2D.isTop(anchor.refPt())) {
        margin.top += dim.height();
    } else if (jsfc.RefPt2D.isBottom(anchor.refPt())) {
        margin.bottom += dim.height();
    };
};
    
/**
 * Draws the chart on a 2D drawing context (HTML5 Canvas for example).  This
 * is provided as an alternative rendering path.
 * 
 * @param {!jsfc.Context2D} ctx  the drawing context.
 * @param {!jsfc.Rectangle} bounds  the drawing bounds.
 * @returns {undefined}
 */
jsfc.Chart.prototype.draw = function(ctx, bounds) {

    // fill in the chart background
    if (this._backgroundPainter) {
        this._backgroundPainter.paint(ctx, bounds);
    }
        
    var titleDim = new jsfc.Dimension(0, 0);
    var legendDim = new jsfc.Dimension(0, 0);
    if (this._titleElement) {
        titleDim = this._titleElement.preferredSize(ctx, bounds);
    }
    var legend;
    if (this._legendBuilder) {
        legend = this._legendBuilder.createLegend(this._plot, 
                this._legendAnchor, "orientation", {});
        legendDim = legend.preferredSize(ctx, bounds); 
    }
    var padding = this.getPadding();
    var px = padding.left();
    var py = padding.top() + titleDim.height();
    var pw = this._size.width() - padding.left() - padding.right();
    var ph = this._size.height() - padding.top() - padding.bottom() 
            - titleDim.height() - legendDim.height();
        // draw the axes and plot the data
    this._plotArea = new jsfc.Rectangle(px, py, pw, ph);
    this._plot.draw(ctx, bounds, this._plotArea);
        
    // draw the legend
    if (legend) {
        var fitter = new jsfc.Fit2D(this._legendAnchor);
        var dest = fitter.fit(legendDim, bounds);
        legend.draw(ctx, dest);
    }
    if (this._titleElement) {
        var fitter = new jsfc.Fit2D(this._titleAnchor);
        var dest = fitter.fit(titleDim, bounds);
        this._titleElement.draw(ctx, dest);
    }
};

/**
 * Returns the plot area from the most recent rendering of the chart.
 * 
 * @returns {jsfc.Rectangle} The plot area.
 */
jsfc.Chart.prototype.plotArea = function() {
    return this._plotArea;
};

/**
 * Registers a listener to receive notification of changes to the chart.  The
 * listener is a function - it will be passed one argument (this chart).
 * 
 * @param {Function} f  the listener function.
 * @returns {undefined}
 */
jsfc.Chart.prototype.addListener = function(f) {
    this._listeners.push(f);  
};

/**
 * Notify each listener function that this chart has changed.
 * 
 * @returns {undefined}
 */
jsfc.Chart.prototype.notifyListeners = function() {
    var chart = this;
    this._listeners.forEach(function(f) {
        f(chart);
    });
};
