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

// for running tests via Grunt (with Node)
if (typeof module === "object" && module.exports) var jsfc = require("../../lib/jsfreechart.js");

// TableXYDataset
describe("TableXYDataset", function() {
    
    describe("After creating a new TableXYDataset...", function() {
        var dataset;
        beforeEach(function() {
            var source = new jsfc.KeyedValues2DDataset();
            source.add("R1", "X", 1.0);
            source.add("R1", "Y1", 1.1);
            source.add("R1", "Y2", 2.2);
            source.add("R1", "Y3", 3.3);
            source.add("R2", "X", 2.0);
            source.add("R2", "Y1", 5.0);
            source.add("R2", "Y2", 4.0);
            source.add("R2", "Y3", 3.0);
            source.add("R3", "X", 4.0);
            source.add("R3", "Y1", 7.0);
            source.add("R3", "Y2", 4.0);
            source.add("R3", "Y3", 9.0);
            source.setColumnProperty("Y2", "PropertyKey1", "YES");
            dataset = new jsfc.TableXYDataset(source, "X", ["Y1", "Y3"]);
        });
        it("it should contain a series count according to the number of series selected", function() {
            expect(dataset.seriesCount()).toEqual(2);
        });
        it("it should have no dataset-level properties", function() {
            expect(dataset.getPropertyKeys()).toEqual([]);
        });
        it("it should retrieve series properties from the existing column properties", function() {
            expect(dataset.getSeriesProperty("Y2", "PropertyKey1")).toEqual("YES");
        });
    });
 
    describe("Setting series properties...", function() {
        var dataset;
        beforeEach(function() {
            var source = new jsfc.KeyedValues2DDataset();
            source.add("R1", "X", 1.0);
            source.add("R1", "Y1", 1.1);
            source.add("R1", "Y2", 2.2);
            source.add("R1", "Y3", 3.3);
            source.add("R2", "X", 2.0);
            source.add("R2", "Y1", 5.0);
            source.add("R2", "Y2", 4.0);
            source.add("R2", "Y3", 3.0);
            source.add("R3", "X", 4.0);
            source.add("R3", "Y1", 7.0);
            source.add("R3", "Y2", 4.0);
            source.add("R3", "Y3", 9.0);
            dataset = new jsfc.TableXYDataset(source, "X", ["Y1", "Y2", "Y3"]);
        });
        it("setting a series property should write to the column properties of the source dataset", function() {
            dataset.setSeriesProperty("Y3", "P1", "the value");
            expect(dataset.getSeriesProperty("Y3", "P1")).toEqual("the value");
            expect(dataset._source.getColumnProperty("Y3", "P1")).toEqual("the value");
        });
    });

});
