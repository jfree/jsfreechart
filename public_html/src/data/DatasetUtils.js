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
 * A collection of utility functions for working with datasets.
 * @namespace
 */
jsfc.DatasetUtils = {};

/**
 * Creates and returns a new dataset containing the base values that are
 * required to create a stacked bar or area chart.
 * 
 * @param {jsfc.KeyedValues2DDataset} dataset  the source dataset.
 * @param {number} [baseline]  the baseline value (defaults to 0.0).
 * 
 * @returns {jsfc.KeyedValues2DDataset} A new dataset containing the base
 *    values.
 */
jsfc.DatasetUtils.extractStackBaseValues = function(dataset, baseline) {
    baseline = typeof baseline !== 'undefined' ? baseline : 0.0;
    var result = new jsfc.KeyedValues2DDataset();
    var columnCount = dataset.columnCount();
    var rowCount = dataset.rowCount();
    for (var c = 0; c < columnCount; c++) {
        var columnKey = dataset.columnKey(c);
        var posBase = baseline;
        var negBase = baseline;
        for (var r = 0; r < rowCount; r++) {
            var y = dataset.valueByIndex(r, c);
            var rowKey = dataset.rowKey(r);
            if (r > 0) {                
                if (y >= 0) {
                    result.add(rowKey, columnKey, posBase);
                } else {
                    result.add(rowKey, columnKey, negBase);
                }
            } else { // row 0 should contain the baseline value for all entries
                result.add(rowKey, columnKey, baseline);   
            } 
            if (y > 0) {
                posBase = posBase + y;
            }
            if (y < 0) {
                negBase = negBase + y;
            }
        }
    }
    return result;
};

/**
 * Creates and returns a new XYDataset by extracting data from the specified 
 * columns (to form a single series in the new dataset).
 * 
 * @param {jsfc.KeyedValues2DDataset} dataset  the dataset.
 * @param {!string} xcol  the key for the column containing the x-values.
 * @param {!string} ycol  the key for the column containing the y-values.
 * @param {string} [seriesKey]  the key to use for the series in the new 
 *         dataset (defaults to 'series 1').
 * @returns {jsfc.XYDataset} The XY dataset.
 */
jsfc.DatasetUtils.extractXYDatasetFromColumns2D = function(dataset, xcol, 
        ycol, seriesKey) {
    jsfc.Args.requireString(xcol, "xcol");
    jsfc.Args.requireString(ycol, "ycol");
    var result = new jsfc.StandardXYDataset();
    seriesKey = seriesKey || "series 1";
    for (var r = 0; r < dataset.rowCount(); r++) {
        var rowKey = dataset.rowKey(r);
        var x = dataset.valueByKey(rowKey, xcol);
        var y = dataset.valueByKey(rowKey, ycol);
        result.add(seriesKey, x, y);
        var rowPropKeys = dataset.getRowPropertyKeys(rowKey);
        var xPropKeys = dataset.getItemPropertyKeys(rowKey, xcol);
        var yPropKeys = dataset.getItemPropertyKeys(rowKey, ycol);
        var itemIndex = result.itemCount(0) - 1;
        rowPropKeys.forEach(function(key) {
            var p = dataset.getRowProperty(rowKey, key);
            result.setItemPropertyByIndex(0, itemIndex, key, p);
        });
        xPropKeys.forEach(function(key) {
            var p = dataset.getItemProperty(rowKey, xcol, key);
            result.setItemPropertyByIndex(0, itemIndex, key, p); 
        });
        yPropKeys.forEach(function(key) {
            var p = dataset.getItemProperty(rowKey, ycol, key);
            result.setItemPropertyByIndex(0, itemIndex, key, p); 
        });
    }

    // special handling for 'symbols' property
    var xsymbols = dataset.getColumnProperty(xcol, "symbols");
    if (xsymbols) {
        result.setProperty("x-symbols", xsymbols);
    }
    var ysymbols = dataset.getColumnProperty(ycol, "symbols");
    if (ysymbols) {
        result.setProperty("y-symbols", ysymbols);
    }
    
    return result;
};

/**
 * Creates and returns a new XYDataset by extracting a single series of data
 * from the specified rows.
 * 
 * @param {jsfc.KeyedValues2DDataset} dataset  the dataset.
 * @param {string} xrow  the key for the row containing the x-values.
 * @param {string} yrow  the key for the row containing the y-values.
 * @returns {jsfc.XYDataset} The XY dataset.
 */
jsfc.DatasetUtils.extractXYDatasetFromRows2D = function(dataset, xrow, 
        yrow, seriesKey) {
    var result = new jsfc.StandardXYDataset();
    seriesKey = seriesKey || "series 1";
    for (var c = 0; c < dataset.columnCount(); c++) {
        var colKey = dataset.columnKey(c);
        var x = dataset.valueByKey(xrow, colKey);
        var y = dataset.valueByKey(yrow, colKey);
        result.add(seriesKey, x, y);
        var colPropKeys = dataset.getColumnPropertyKeys(colKey);
        var xPropKeys = dataset.getItemPropertyKeys(xrow, colKey);
        var yPropKeys = dataset.getItemPropertyKeys(yrow, colKey);
        var itemKey = result.getItemKey(0, result.itemCount(0) - 1);
        colPropKeys.forEach(function(key) {
            var p = dataset.getColumnProperty(colKey, key);
            result.setItemProperty(seriesKey, itemKey, key, p); 
        });
        xPropKeys.forEach(function(key) {
            var p = dataset.getItemProperty(xrow, colKey, key);
            result.setItemProperty(seriesKey, itemKey, key, p); 
        });
        yPropKeys.forEach(function(key) {
            var p = dataset.getItemProperty(yrow, colKey, key);
            result.setItemProperty(seriesKey, itemKey, key, p); 
        });
    }

    // special handling for 'symbols' property
    var xsymbols = dataset.getRowProperty(xrow, "symbols");
    if (xsymbols) {
        result.setProperty("x-symbols", xsymbols);
    }
    var ysymbols = dataset.getRowProperty(yrow, "symbols");
    if (ysymbols) {
        result.setProperty("y-symbols", ysymbols);
    }
    
    return result;
};

/**
 * Creates a new XYDataset by extracting values from selected columns of
 * a KeyedValues3DDataset.
 * 
 * @param {!jsfc.KeyedValues3DDataset} dataset  the source dataset.
 * @param {!string} xcol  the key for the column containing the x-values.
 * @param {!string} ycol  the key for the column containing the y-values.
 * @returns {jsfc.XYDataset} A new XYDataset.
 */
jsfc.DatasetUtils.extractXYDatasetFromColumns = function(dataset, xcol, ycol) {
    var result = new jsfc.StandardXYDataset();
    for (var s = 0; s < dataset.seriesCount(); s++) {
        var seriesKey = dataset.seriesKey(s);
        for (var r = 0; r < dataset.rowCount(); r++) {
            var rowKey = dataset.rowKey(r);
            var x = dataset.valueByKey(seriesKey, rowKey, xcol);
            if (x === null) continue;
            var xPropKeys = dataset.propertyKeys(seriesKey, rowKey, xcol);
            var y = dataset.valueByKey(seriesKey, rowKey, ycol);
            var yPropKeys = dataset.propertyKeys(seriesKey, rowKey, ycol);
            result.add(seriesKey, x, y);
            var itemKey = result.getItemKey(s, result.itemCount(s) - 1);
            xPropKeys.forEach(function(key) {
                var p = dataset.getProperty(seriesKey, rowKey, xcol, key);
                result.setItemProperty(seriesKey, itemKey, key, p); 
            });
            yPropKeys.forEach(function(key) {
                var p = dataset.getProperty(seriesKey, rowKey, ycol, key);
                result.setItemProperty(seriesKey, itemKey, key, p); 
            });
        }
    }
    return result;
};

/**
 * Creates a new jsfc.XYDataset by extracting values from selected rows of
 * a KeyedValues3DDataset.
 * 
 * @param {!jsfc.KeyedValues3DDataset} dataset  the source dataset.
 * @param {!string} xrow  the key for the row containing the x-values.
 * @param {!string} yrow  the key for the row containing the y-values.
 * @returns {jsfc.XYDataset} A new XYDataset.
 */
jsfc.DatasetUtils.extractXYDatasetFromRows = function(dataset, xrow, yrow) {
    var result = new jsfc.StandardXYDataset();
    for (var s = 0; s < dataset.seriesCount(); s++) {
        var seriesKey = dataset.seriesKey(s);
        for (var c = 0; c < dataset.columnCount(); c++) {
            var colKey = dataset.columnKey(c);
            var x = dataset.valueByKey(seriesKey, xrow, colKey);
            if (x === null) continue;
            var xPropKeys = dataset.propertyKeys(seriesKey, xrow, colKey);
            var y = dataset.valueByKey(seriesKey, yrow, colKey);
            var yPropKeys = dataset.propertyKeys(seriesKey, yrow, colKey);
            var itemKey = result.getItemKey(s, result.itemCount(s) - 1);
            xPropKeys.forEach(function(key) {
                var p = dataset.getProperty(seriesKey, xrow, colKey, key);
                result.setItemProperty(seriesKey, itemKey, key, p); 
            });
            yPropKeys.forEach(function(key) {
                var p = dataset.getProperty(seriesKey, yrow, colKey, key);
                result.setItemProperty(seriesKey, itemKey, key, p); 
            });
            result.add(seriesKey, x, y);
        }
    }
    return result;
};
