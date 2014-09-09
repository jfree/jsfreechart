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

// tests for the KeyedValues3DDataset object
if (typeof module === "object" && module.exports) var jsfc = require("../../lib/jsfreechart.js");

describe("KeyedValues3DDataset", function() {
    
    describe("When a new KeyedValues3DDataset is created", function() {
        var dataset;
        beforeEach(function() {
            dataset = new jsfc.KeyedValues3DDataset();
        });
        it("it should contain zero series", function() {
            expect(dataset.seriesCount()).toEqual(0);
        });
        it("it should contain zero rows", function() {
            expect(dataset.rowCount()).toEqual(0);
        });
        it("it should contain zero columns", function() {
            expect(dataset.columnCount()).toEqual(0);
        });
    });
  
    describe("After one item is added to the dataset", function() {
        beforeEach(function() {
            dataset = new jsfc.KeyedValues3DDataset();
            dataset.add("S1", "R1", "C1", 1.1);
        });
        it("it should contain one series", function() {
            expect(dataset.seriesCount()).toEqual(1);
            expect(dataset.seriesIndex("S1")).toEqual(0);
            expect(dataset.seriesKey(0)).toEqual("S1");
        });
        it("it should contain one row", function() {
            expect(dataset.rowCount()).toEqual(1);
            expect(dataset.rowIndex("R1")).toEqual(0);
            expect(dataset.rowKey(0)).toEqual("R1");
        });
        it("it should contain one column", function() {
            expect(dataset.columnCount()).toEqual(1);
            expect(dataset.columnIndex("C1")).toEqual(0);
            expect(dataset.columnKey(0)).toEqual("C1");
        });
        it("one can retrieve the value", function() {
            expect(dataset.valueByKey("S1", "R1", "C1")).toEqual(1.1);
        });
    });

    describe("More generally", function() {
        beforeEach(function() {
            dataset = new jsfc.KeyedValues3DDataset();
            dataset.add("S1", "R1", "C1", 1.0);
            dataset.add("S1", "R1", "C2", 2.0);
            dataset.add("S1", "R1", "C3", 3.0);
            dataset.add("S1", "R2", "C1", 4.0);
            dataset.add("S1", "R2", "C2", 5.0);
            dataset.add("S1", "R2", "C3", 6.0);
            dataset.add("S2", "R1", "C1", 7.0);
            dataset.add("S2", "R1", "C2", 8.0);
            dataset.add("S2", "R1", "C3", 9.0);
            dataset.add("S2", "R2", "C1", 10.0);
            dataset.add("S2", "R2", "C2", 11.0);
            dataset.add("S2", "R2", "C3", 12.0);
        });
        it("all values can be retrieved", function() {
            expect(dataset.valueByKey("S1", "R1", "C1")).toEqual(1.0);
            expect(dataset.valueByKey("S1", "R1", "C2")).toEqual(2.0);
            expect(dataset.valueByKey("S1", "R1", "C3")).toEqual(3.0);
            expect(dataset.valueByKey("S1", "R2", "C1")).toEqual(4.0);
            expect(dataset.valueByKey("S1", "R2", "C2")).toEqual(5.0);
            expect(dataset.valueByKey("S1", "R2", "C3")).toEqual(6.0);
            expect(dataset.valueByKey("S2", "R1", "C1")).toEqual(7.0);
            expect(dataset.valueByKey("S2", "R1", "C2")).toEqual(8.0);
            expect(dataset.valueByKey("S2", "R1", "C3")).toEqual(9.0);
            expect(dataset.valueByKey("S2", "R2", "C1")).toEqual(10.0);
            expect(dataset.valueByKey("S2", "R2", "C2")).toEqual(11.0);
            expect(dataset.valueByKey("S2", "R2", "C3")).toEqual(12.0);
        });
    });
  
    describe("When the parse() method is used", function() {
        beforeEach(function() {
            dataset = new jsfc.KeyedValues3DDataset();
        });
        it("{} represents an empty dataset", function() {
            dataset.parse("{}");
            expect(dataset.isEmpty()).toBe(true);
        });
        it("a single-row, single-column dataset has one item that can be retrieved", function() {
            dataset.parse("{\"columnKeys\": [\"C1\"], \"rowKeys\": [\"R1\"], \"series\": [{\"seriesKey\": \"S1\", \"rows\": [{\"rowKey\": \"R1\", \"values\": [1.0]}]}]}");
            expect(dataset.isEmpty()).toBe(false);
            expect(dataset.rowCount()).toEqual(1.0);
            expect(dataset.columnCount()).toEqual(1.0);
            expect(dataset.rowKey(0)).toEqual("R1");
            expect(dataset.columnKey(0)).toEqual("C1");
            expect(dataset.valueByIndex(0, 0, 0)).toEqual(1.0);
            expect(dataset.valueByKey("S1", "R1", "C1")).toEqual(1.0);
        });
        it("a multi-row, multi-column dataset has items that can be retrieved", function() {
            dataset.parse("{\"columnKeys\": [\"C1\", \"C2\", \"C3\"], \"rowKeys\": [\"R1\", \"R2\"], \"series\": [{\"seriesKey\": \"S1\", \"rows\": [{\"rowKey\": \"R1\", \"values\": [1.0, 2.0, 3.0]}, {\"rowKey\": \"R2\", \"values\": [4.0, 5.0, 6.0]}]}, {\"seriesKey\": \"S2\", \"rows\": [{\"rowKey\": \"R1\", \"values\": [7.0, 8.0, 9.0]}, {\"rowKey\": \"R2\", \"values\": [10.0, 11.0, 12.0]}]}]}");
            expect(dataset.isEmpty()).toBe(false);
            expect(dataset.seriesCount()).toEqual(2.0);
            expect(dataset.rowCount()).toEqual(2.0);
            expect(dataset.columnCount()).toEqual(3.0);
            expect(dataset.seriesKey(0)).toEqual("S1");
            expect(dataset.seriesKey(1)).toEqual("S2");
            expect(dataset.rowKey(0)).toEqual("R1");
            expect(dataset.rowKey(1)).toEqual("R2");
            expect(dataset.columnKey(0)).toEqual("C1");
            expect(dataset.columnKey(1)).toEqual("C2");
            expect(dataset.columnKey(2)).toEqual("C3");
            expect(dataset.valueByIndex(0, 0, 0)).toEqual(1.0);
            expect(dataset.valueByIndex(0, 0, 1)).toEqual(2.0);
            expect(dataset.valueByIndex(0, 0, 2)).toEqual(3.0);
            expect(dataset.valueByIndex(0, 1, 0)).toEqual(4.0);
            expect(dataset.valueByIndex(0, 1, 1)).toEqual(5.0);
            expect(dataset.valueByIndex(0, 1, 2)).toEqual(6.0);
            expect(dataset.valueByIndex(1, 0, 0)).toEqual(7.0);
            expect(dataset.valueByIndex(1, 0, 1)).toEqual(8.0);
            expect(dataset.valueByIndex(1, 0, 2)).toEqual(9.0);
            expect(dataset.valueByIndex(1, 1, 0)).toEqual(10.0);
            expect(dataset.valueByIndex(1, 1, 1)).toEqual(11.0);
            expect(dataset.valueByIndex(1, 1, 2)).toEqual(12.0);
            expect(dataset.valueByKey("S1", "R1", "C1")).toEqual(1.0);
            expect(dataset.valueByKey("S1", "R1", "C2")).toEqual(2.0);
            expect(dataset.valueByKey("S1", "R1", "C3")).toEqual(3.0);
            expect(dataset.valueByKey("S1", "R2", "C1")).toEqual(4.0);
            expect(dataset.valueByKey("S1", "R2", "C2")).toEqual(5.0);
            expect(dataset.valueByKey("S1", "R2", "C3")).toEqual(6.0);
            expect(dataset.valueByKey("S2", "R1", "C1")).toEqual(7.0);
            expect(dataset.valueByKey("S2", "R1", "C2")).toEqual(8.0);
            expect(dataset.valueByKey("S2", "R1", "C3")).toEqual(9.0);
            expect(dataset.valueByKey("S2", "R2", "C1")).toEqual(10.0);
            expect(dataset.valueByKey("S2", "R2", "C2")).toEqual(11.0);
            expect(dataset.valueByKey("S2", "R2", "C3")).toEqual(12.0);
        });
    });
  
    describe("A special case retrieving data when some rows are not specified", function() {
        beforeEach(function() {
            dataset = new jsfc.KeyedValues3DDataset();
            dataset.add("S1", "R1", "C1", 1.0);
            dataset.add("S1", "R2", "C1", 2.0);
            dataset.add("S2", "R2", "C1", 3.0);
        });
        it("expect that the first row for S2 is empty", function() {
            expect(dataset.valueByKey("S2", "R1", "C1")).toBe(null);
            expect(dataset.valueByKey("S2", "R2", "C1")).toEqual(3.0);      
            expect(dataset.valueByIndex(1, 0, 0)).toBe(null);
            expect(dataset.valueByIndex(1, 1, 0)).toEqual(3.0);      
        });
    });
    
    describe("Regarding properties", function() {
        var dataset;
        beforeEach(function() {
            dataset = new jsfc.KeyedValues3DDataset()
                    .add("S1", "R1", "C1", 1.0)
                    .add("S1", "R1", "C2", 2.0)
                    .add("S1", "R2", "C1", 3.0)
                    .add("S1", "R2", "C2", 4.0)
                    .add("S2", "R1", "C1", 11.0)
                    .add("S2", "R1", "C2", 12.0)
                    .add("S2", "R2", "C1", 13.0)
                    .add("S2", "R2", "C2", 14.0);
        });
        it("Properties can be defined for individual data items", function() {
            expect(dataset.getProperty("S1", "R1", "C1", "color")).toBe(undefined);
            dataset.setProperty("S1", "R1", "C1", "color", "red");
            expect(dataset.getProperty("S1", "R1", "C1", "color")).toEqual("red");
            expect(dataset.getProperty("S2", "R2", "C2", "shape")).toBe(undefined);
            dataset.setProperty("S2", "R2", "C2", "shape", "circle");
            expect(dataset.getProperty("S2", "R2", "C2", "shape")).toEqual("circle");
        });
        it("Multiple properties are allowed", function() {
            expect(dataset.getProperty("S2", "R2", "C2", "color")).toBe(undefined);
            dataset.setProperty("S2", "R2", "C2", "color", "red");
            expect(dataset.getProperty("S2", "R2", "C2", "color")).toEqual("red");
            expect(dataset.getProperty("S2", "R2", "C2", "shape")).toBe(undefined);
            dataset.setProperty("S2", "R2", "C2", "shape", "circle");
            expect(dataset.getProperty("S2", "R2", "C2", "shape")).toEqual("circle");
        });
        it("Properties can be cleared", function() {
            dataset.setProperty("S2", "R2", "C2", "color", "red");
            expect(dataset.getProperty("S2", "R2", "C2", "color")).toEqual("red");
            dataset.setProperty("S2", "R2", "C2", "shape", "circle");
            expect(dataset.getProperty("S2", "R2", "C2", "shape")).toEqual("circle");
            dataset.clearProperties("S2", "R2", "C2");
            expect(dataset.getProperty("S2", "R2", "C2", "color")).toBe(undefined);
            expect(dataset.getProperty("S2", "R2", "C2", "shape")).toBe(undefined);
        });
        
        it("Calling load() will clear all existing properties", function() {
            dataset.setProperty("S1", "R1", "C1", "color", "red");
            expect(dataset.getProperty("S1", "R1", "C1", "color")).toEqual("red");
            dataset.load({"columnKeys": ["C1"], "rowKeys": ["R1"], 
                "series": [{"seriesKey": "S1", "rows": [{"rowKey": "R1", "values": [1.0]}]}]});
            var p = dataset.getProperty("S1", "R1", "C1", "color");
            expect(dataset.getProperty("S1", "R1", "C1", "color")).toBe(undefined);
        });
       
    });


});

