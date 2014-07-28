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
 * @namespace
 */
jsfc.Charts = {};

/**
 * Creates a table element containing the specified title and subtitle.
 *  
 * @param {!string} title  the title.
 * @param {string} [subtitle]  the subtitle (optional).
 * @param {jsfc.Anchor2D} [anchor]  the title anchor (optional, used to 
 *         determine the default text alignment).
 * 
 * @returns {jsfc.TableElement}
 */
jsfc.Charts.createTitleElement = function(title, subtitle, anchor) {
    jsfc.Args.requireString(title, "title");
    var titleFont = new jsfc.Font("Palatino, serif", 16, true, false);
    var halign = jsfc.HAlign.LEFT;
    var refPt = anchor ? anchor.refPt() : jsfc.RefPt2D.TOP_LEFT;
    if (jsfc.RefPt2D.isHorizontalCenter(refPt)) {
        halign = jsfc.HAlign.CENTER;
    } else if (jsfc.RefPt2D.isRight(refPt)) {
        halign = jsfc.HAlign.RIGHT;
    }
    var titleElement = new jsfc.TextElement(title);
    titleElement.setFont(titleFont);
    titleElement.halign(halign);
    titleElement.isTitle = true;
    if (subtitle) {
        var subtitleFont = new jsfc.Font("Palatino, serif", 12, false, true);
        var subtitleElement = new jsfc.TextElement(subtitle);
        subtitleElement.setFont(subtitleFont);
        subtitleElement.halign(halign);
        subtitleElement.isSubtitle = true;
        var composite = new jsfc.GridElement();
        composite.setInsets(new jsfc.Insets(0, 0, 0, 0));
        composite.add(titleElement, "R1", "C1");
        composite.add(subtitleElement, "R2", "C1");
        return composite;
    } else {
        return titleElement;
    }    
};

/**
 * Creates a bar chart based on the supplied dataset (any object that
 * implements the jsfc.Values2DDataset interface).
 * 
 * @param {string} title  the chart title (null permitted).
 * @param {string} subtitle  the chart subtitle (null permitted).
 * @param {!jsfc.Values2DDataset} dataset  the dataset.
 * @param {string} [xAxisLabel]  the x-axis label (defaults to 'Category').
 * @param {string} [yAxisLabel]  the y-axis label (defaults to 'Value').
 * @returns {jsfc.Chart}
 */
jsfc.Charts.createBarChart = function(title, subtitle, dataset, xAxisLabel, 
        yAxisLabel) {
    var plot = new jsfc.CategoryPlot(dataset);
    var renderer = new jsfc.BarRenderer(plot);
    plot.setRenderer(renderer);
    var xAxis = plot.getXAxis();
    xAxis.setLabel(xAxisLabel || "Category");
    var yAxis = plot.getYAxis();
    yAxis.setLabel(yAxisLabel || "Value");    
    yAxis.setAutoRangeIncludesZero(true);
    return new jsfc.Chart(plot)
            .setTitle(title, subtitle);
};

/**
 * Creates a stacked bar chart based on the supplied dataset (any object that
 * implements the jsfc.Values2DDataset interface).
 * 
 * @param {string} title  the chart title (null permitted).
 * @param {string} subtitle  the chart subtitle (null permitted).
 * @param {!jsfc.Values2DDataset} dataset  the dataset.
 * @param {string} [xAxisLabel]  the x-axis label (defaults to 'Category').
 * @param {string} [yAxisLabel]  the y-axis label (defaults to 'Value').
 * @returns {jsfc.Chart}
 */
jsfc.Charts.createStackedBarChart = function(title, subtitle, dataset, 
        xAxisLabel, yAxisLabel) {
    var plot = new jsfc.CategoryPlot(dataset);
    plot.setRenderer(new jsfc.StackedBarRenderer(plot));
    var xAxis = plot.getXAxis();
    xAxis.setLabel(xAxisLabel || "Category");
    var yAxis = plot.getYAxis();
    yAxis.setLabel(yAxisLabel || "Value");    
    yAxis.setAutoRangeIncludesZero(true);
    return new jsfc.Chart(plot)
            .setTitle(title, subtitle);
};

// Creates a line chart based on the supplied dataset (KeyedValues2DDataset)
jsfc.Charts.createLineChart = function(title, subtitle, dataset, 
        xAxisLabel, yAxisLabel) {
//    jsfc.Args.requireKeyedValues2DDataset(dataset, "dataset");
//    var plot = new jsfc.CategoryPlot(dataset);
//    plot.xAxis.label = xAxisLabel;
//    plot.yAxis.label = yAxisLabel;
//    plot.renderer = new jsfc.LineRenderer();
//    var chart = new jsfc.Chart(plot);
//    chart.initMargin({ top: 5, right: 5, left: 30, bottom: 20});
//    chart.title(jsfc.Charts.createTitleElement(title, subtitle, 
//            chart.titleAnchor()));
//    return chart;
};

/**
 * Creates a scatter chart with the supplied dataset.
 * 
 * @param {string} title  the chart title (null permitted).
 * @param {string} subtitle  the chart subtitle (null permitted).
 * @param {!jsfc.XYDataset} dataset  the dataset (null not permitted).
 * @param {string} xAxisLabel  the x-axis label.
 * @param {string} yAxisLabel  the y-axis label.
 * @returns {jsfc.Chart} A chart.
 */
jsfc.Charts.createScatterChart = function(title, subtitle, dataset, 
        xAxisLabel, yAxisLabel) {
    jsfc.Args.requireXYDataset(dataset, "dataset");
    var plot = new jsfc.XYPlot(dataset);
    plot.getXAxis().setLabel(xAxisLabel);
    plot.getYAxis().setLabel(yAxisLabel);
    plot.setRenderer(new jsfc.ScatterRenderer(plot));
    var chart = new jsfc.Chart(plot);
    chart.setPadding(5, 5, 5, 5);
    chart.setTitle(title, subtitle, chart.getTitleAnchor());
    return chart;
};

/**
 * Creates a line chart based on the supplied dataset (XYDataset).
 * 
 * @param {string} title  the chart title (null permitted).
 * @param {string} subtitle  the chart subtitle (null permitted).
 * @param {!jsfc.XYDataset} dataset  the dataset (null not permitted).
 * @param {string} xAxisLabel  the x-axis label.
 * @param {string} yAxisLabel  the y-axis label.
 * @returns {jsfc.Chart} A chart.
 */
jsfc.Charts.createXYLineChart = function(title, subtitle, dataset, 
        xAxisLabel, yAxisLabel) {
    jsfc.Args.requireXYDataset(dataset, "dataset");
    var plot = new jsfc.XYPlot(dataset);
    plot.getXAxis().setLabel(xAxisLabel);
    plot.getYAxis().setLabel(yAxisLabel);
    var renderer = new jsfc.XYLineRenderer();
    var chart = new jsfc.Chart(plot);
    chart.setTitleElement(jsfc.Charts.createTitleElement(title, subtitle, 
            chart.getTitleAnchor()));
    plot.setRenderer(renderer);
    return chart;
};

/**
 * Creates a bar chart from the specified dataset (IntervalXYDataset).
 * 
 * @param {string} title  the chart title (null permitted).
 * @param {string} subtitle  the chart subtitle (null permitted).
 * @param {!jsfc.XYDataset} dataset  the dataset (null not permitted).
 * @param {string} xAxisLabel  the x-axis label.
 * @param {string} yAxisLabel  the y-axis label.
 * @returns {jsfc.Chart} A chart.
 */
jsfc.Charts.createXYBarChart = function(title, subtitle, dataset, xAxisLabel,
        yAxisLabel) {
    var plot = new jsfc.XYPlot(dataset);
    plot.getXAxis().setLabel(xAxisLabel);
    plot.getYAxis().setLabel(yAxisLabel);
    var renderer = new jsfc.XYBarRenderer();
    plot.setRenderer(renderer);
    var chart = new jsfc.Chart(plot);
    var titleAnchor = new jsfc.Anchor2D(jsfc.RefPt2D.TOP_LEFT);
    chart.setTitle(title, subtitle, titleAnchor);
    return chart;
};

