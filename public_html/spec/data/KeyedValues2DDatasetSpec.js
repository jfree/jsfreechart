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

// tests for the KeyedValues2DDataset object
if (typeof module === "object" && module.exports) var jsfc = require("../../lib/jsfreechart.js");

describe("KeyedValues2DDataset", function() {
    
    describe("When a new KeyedValues2DDataset is created", function() {
        var dataset;
        beforeEach(function() {
            dataset = new jsfc.KeyedValues2DDataset();
        });
        it("it should contain zero rows", function() {
            expect(dataset.rowCount()).toEqual(0);
        });
        it("it should contain zero columns", function() {
            expect(dataset.columnCount()).toEqual(0);
        });
        it("isEmpty() should return true.", function() {
            expect(dataset.isEmpty()).toEqual(true);
        });
        it("it should have no dataset-level properties", function() {
            expect(dataset.getPropertyKeys()).toEqual([]);
        });
    });
  
    describe("After one item is added to the dataset", function() {
        beforeEach(function() {
            dataset = new jsfc.KeyedValues2DDataset();
            dataset.add("R1", "C1", 1.1);
        });
        it("it should contain one column", function() {
            expect(dataset.columnCount()).toEqual(1);
            expect(dataset.columnIndex("C1")).toEqual(0);
            expect(dataset.columnKey(0)).toEqual("C1");
        });
        it("it should contain one row", function() {
            expect(dataset.rowCount()).toEqual(1);
            expect(dataset.rowIndex("R1")).toEqual(0);
            expect(dataset.rowKey(0)).toEqual("R1");
        });
        it("one can retrieve the value", function() {
            expect(dataset.valueByKey("R1", "C1")).toEqual(1.1);
        });
    });

    describe("Regarding the bounds for a dataset", function() {
        beforeEach(function() {
            dataset = new jsfc.KeyedValues2DDataset();
        });
        it("an empty dataset should have no bounds", function() {
            var bounds = jsfc.Values2DDatasetUtils.ybounds(dataset);
            expect(bounds[0] === Number.POSITIVE_INFINITY);
            expect(bounds[1] === Number.NEGATIVE_INFINITY);
        });
        it("check a dataset with a single item", function() {
            dataset.add("R1", "C1", 5.0);
            var bounds = jsfc.Values2DDatasetUtils.ybounds(dataset);
            expect(bounds[0] === 5.0);
            expect(bounds[1] === 5.0);
        });
        it("check a dataset with a two items", function() {
            dataset.add("R1", "C1", 5.0);
            dataset.add("R1", "C2", -5.0);
            var bounds = jsfc.Values2DDatasetUtils.ybounds(dataset);
            expect(bounds[0] === -5.0);
            expect(bounds[1] === 5.0);
        });
        it("check a dataset with a null y-value", function() {
            dataset.add("R1", "C1", 5.0);
            dataset.add("R1", "C2", -5.0);
            dataset.add("R1", "C3", null);
            var bounds = jsfc.Values2DDatasetUtils.ybounds(dataset);
            expect(bounds[0] === -5);
            expect(bounds[1] === 5);
        });
    });

    describe("More generally", function() {
        beforeEach(function() {
            dataset = new jsfc.KeyedValues2DDataset();
            dataset.add("R1", "C1", 1.0);
            dataset.add("R1", "C2", 2.0);
            dataset.add("R1", "C3", 3.0);
            dataset.add("R2", "C1", 4.0);
            dataset.add("R2", "C2", 5.0);
            dataset.add("R2", "C3", 6.0);
        }); 
        it("one can retrieve the items that were added to the dataset", function() {
            expect(dataset.valueByKey("R1", "C1")).toEqual(1.0);
            expect(dataset.valueByKey("R1", "C2")).toEqual(2.0);
            expect(dataset.valueByKey("R1", "C3")).toEqual(3.0);
            expect(dataset.valueByKey("R2", "C1")).toEqual(4.0);
            expect(dataset.valueByKey("R2", "C2")).toEqual(5.0);
            expect(dataset.valueByKey("R2", "C3")).toEqual(6.0);
        });
        it("one can retrieve the row key for the row with a given index", function() {
            expect(dataset.rowKey(1)).toEqual("R2");
        });
        it("one can retrieve the index for the row with a given key", function() {
            expect(dataset.rowIndex("R1")).toEqual(0);
            expect(dataset.rowIndex("R2")).toEqual(1);
            expect(dataset.rowIndex("XXXXXXXXX")).toEqual(-1);
        });
        it("one can retrieve the column key for the column with a given index", function() {
            expect(dataset.columnKey(0)).toEqual("C1");
            expect(dataset.columnKey(1)).toEqual("C2");
            expect(dataset.columnKey(2)).toEqual("C3");
        });
        it("one can retrieve the index for the column with a given key", function() {
            expect(dataset.columnIndex("C1")).toEqual(0);
            expect(dataset.columnIndex("C2")).toEqual(1);
            expect(dataset.columnIndex("C3")).toEqual(2);
            expect(dataset.columnIndex("XXXXXXXXX")).toEqual(-1);
        });
        it("one can retrieve all the row keys", function() {
            expect(dataset.rowKeys()).toEqual(["R1", "R2"]);
        });
        it("one can retrieve all the column keys", function() {
            expect(dataset.columnKeys()).toEqual(["C1", "C2", "C3"]);
        });
    });
  
    describe("When the parse() method is used", function() {
        beforeEach(function() {
            dataset = new jsfc.KeyedValues2DDataset();
        });
        it("{} represents an empty dataset", function() {
            dataset.parse("{}");
            expect(dataset.isEmpty()).toBe(true);
        });
        it("a single-row, single-column dataset has one item that can be retrieved", function() {
            dataset.parse("{\"columnKeys\": [\"C1\"], \"rows\":[{\"key\": \"R1\", \"values\": [1.0]}]}");
            expect(dataset.isEmpty()).toBe(false);
            expect(dataset.rowCount()).toEqual(1.0);
            expect(dataset.columnCount()).toEqual(1.0);
            expect(dataset.rowKey(0)).toEqual("R1");
            expect(dataset.columnKey(0)).toEqual("C1");
            expect(dataset.valueByIndex(0, 0)).toEqual(1.0);
            expect(dataset.valueByKey("R1", "C1")).toEqual(1.0);
        });
        it("a multi-row, multi-column dataset has items that can be retrieved", function() {
            dataset.parse("{\"columnKeys\": [\"C1\", \"C2\", \"C3\"], \"rows\": [{\"key\": \"R1\", \"values\": [1.0, 2.0, 3.0]}, {\"key\": \"R2\", \"values\": [4.0, 5.0, 6.0]}]}");
            expect(dataset.isEmpty()).toBe(false);
            expect(dataset.rowCount()).toEqual(2.0);
            expect(dataset.columnCount()).toEqual(3.0);
            expect(dataset.rowKey(0)).toEqual("R1");
            expect(dataset.rowKey(1)).toEqual("R2");
            expect(dataset.columnKey(0)).toEqual("C1");
            expect(dataset.columnKey(1)).toEqual("C2");
            expect(dataset.columnKey(2)).toEqual("C3");
            expect(dataset.valueByIndex(0, 0)).toEqual(1.0);
            expect(dataset.valueByIndex(0, 1)).toEqual(2.0);
            expect(dataset.valueByIndex(0, 2)).toEqual(3.0);
            expect(dataset.valueByIndex(1, 0)).toEqual(4.0);
            expect(dataset.valueByIndex(1, 1)).toEqual(5.0);
            expect(dataset.valueByIndex(1, 2)).toEqual(6.0);
            expect(dataset.valueByKey("R1", "C1")).toEqual(1.0);
            expect(dataset.valueByKey("R1", "C2")).toEqual(2.0);
            expect(dataset.valueByKey("R1", "C3")).toEqual(3.0);
            expect(dataset.valueByKey("R2", "C1")).toEqual(4.0);
            expect(dataset.valueByKey("R2", "C2")).toEqual(5.0);
            expect(dataset.valueByKey("R2", "C3")).toEqual(6.0);
        });
    });
    describe("Special case for parse() : empty dataset", function() {
        beforeEach(function() {
            dataset = new jsfc.KeyedValues2DDataset();
            dataset.parse("{}");
        });
        it("{} represents an empty dataset", function() {
            expect(dataset.isEmpty()).toBe(true);
            expect(dataset.rowCount()).toEqual(0.0);
            expect(dataset.columnCount()).toEqual(0.0);
            expect(dataset.rowIndex("R1")).toEqual(-1.0);
            expect(dataset.columnIndex("C1")).toEqual(-1.0);
            expect(dataset.rowKeys()).toEqual([]);
            expect(dataset.columnKeys()).toEqual([]);
        });
        it("the dataset should be ready for populating", function() {
            dataset.add("R1", "C1", 1.0);
            expect(dataset.valueByKey("R1", "C1")).toEqual(1.0);
        });
    });
  
    describe("Regarding properties", function() {
        var dataset;
        beforeEach(function() {
            dataset = new jsfc.KeyedValues2DDataset()
                    .add("R1", "C1", 1.0)
                    .add("R1", "C2", 2.0)
                    .add("R2", "C1", 3.0)
                    .add("R2", "C2", 4.0);
        });
        it("Properties can be defined for individual data items", function() {
            expect(dataset.getItemProperty("R1", "C1", "color")).toBe(undefined);
            dataset.setItemProperty("R1", "C1", "color", "red");
            expect(dataset.getItemProperty("R1", "C1", "color")).toEqual("red");
            expect(dataset.getItemProperty("R2", "C2", "shape")).toBe(undefined);
            dataset.setItemProperty("R2", "C2", "shape", "circle");
            expect(dataset.getItemProperty("R2", "C2", "shape")).toEqual("circle");
        });
        it("Multiple properties are allowed", function() {
            expect(dataset.getItemProperty("R2", "C2", "color")).toBe(undefined);
            dataset.setItemProperty("R2", "C2", "color", "red");
            expect(dataset.getItemProperty("R2", "C2", "color")).toEqual("red");
            expect(dataset.getItemProperty("R2", "C2", "shape")).toBe(undefined);
            dataset.setItemProperty("R2", "C2", "shape", "circle");
            expect(dataset.getItemProperty("R2", "C2", "shape")).toEqual("circle");
        });
        it("Properties can be cleared", function() {
            expect(dataset.getItemProperty("R1", "C2", "color")).toBe(undefined);
            dataset.setItemProperty("R1", "C2", "color", "red");
            expect(dataset.getItemProperty("R1", "C2", "color")).toEqual("red");
            expect(dataset.getItemProperty("R1", "C2", "shape")).toBe(undefined);
            dataset.setItemProperty("R1", "C2", "shape", "circle");
            expect(dataset.getItemProperty("R1", "C2", "shape")).toEqual("circle");
            dataset.clearItemProperties("R1", "C2");
            expect(dataset.getItemProperty("R1", "C2", "color")).toBe(undefined);
            expect(dataset.getItemProperty("R1", "C2", "shape")).toBe(undefined);
        });
        it("Properties can be defined for rows", function() {
            expect(dataset.getRowProperty("R1", "color")).toBe(undefined);
            dataset.setRowProperty("R1", "color", "red");
            expect(dataset.getRowProperty("R1", "color")).toEqual("red");
            dataset.setRowProperty("R1", "color", "blue");
            expect(dataset.getRowProperty("R1", "color")).toEqual("blue");
            expect(dataset.getRowProperty("R2", "shape")).toBe(undefined);
            dataset.setRowProperty("R2", "shape", "circle");
            expect(dataset.getRowProperty("R2", "shape")).toEqual("circle");
        });
        it("Properties can be defined for columns", function() {
            expect(dataset.getColumnProperty("C1", "color")).toBe(undefined);
            dataset.setColumnProperty("C1", "color", "red");
            expect(dataset.getColumnProperty("C1", "color")).toEqual("red");
            dataset.setColumnProperty("C1", "color", "blue");
            expect(dataset.getColumnProperty("C1", "color")).toEqual("blue");
            expect(dataset.getColumnProperty("C2", "shape")).toBe(undefined);
            dataset.setColumnProperty("C2", "shape", "circle");
            expect(dataset.getColumnProperty("C2", "shape")).toEqual("circle");
        });
    });

    // some basic validation of the selection mechanism
    describe("Regarding selections", function() {
        beforeEach(function() {
            dataset = new jsfc.KeyedValues2DDataset()
                .add("R1", "C1", 1.0)
                .add("R1", "C2", 2.0)
                .add("R1", "C3", 3.0)
                .add("R2", "C1", 4.0)
                .add("R2", "C2", 5.0)
                .add("R2", "C3", 6.0);
        });

        it("select() will select an item", function() {
            expect(dataset.isSelected("hilite", "R1", "C1")).toBe(false);
            dataset.select("hilite", "R1", "C1");
            expect(dataset.isSelected("hilite", "R1", "C1")).toBe(true);
        });
        
        it("unselect() will unselect an item", function() {
            expect(dataset.isSelected("hilite", "R2", "C2")).toBe(false);
            dataset.select("hilite", "R2", "C2");
            expect(dataset.isSelected("hilite", "R2", "C2")).toBe(true);
            dataset.unselect("hilite", "R2", "C2");
            expect(dataset.isSelected("hilite", "R2", "C2")).toBe(false);
        });
        it("clearSelection(id) with clear all of the items in one selection", function() {
            dataset.select("hilite1", "R2", "C3");
            dataset.select("hilite2", "R2", "C3");
            expect(dataset.isSelected("hilite1", "R2", "C3")).toBe(true);            
            expect(dataset.isSelected("hilite2", "R2", "C3")).toBe(true);
            dataset.clearSelection("hilite2");
            expect(dataset.isSelected("hilite1", "R2", "C3")).toBe(true);            
            expect(dataset.isSelected("hilite2", "R2", "C3")).toBe(false);            
        });
    });

    describe("Regarding the insertRow() method", function() {
        beforeEach(function() {
            dataset = new jsfc.KeyedValues2DDataset();
            dataset.add("R1", "C1", 1.0);
            dataset.add("R2", "C1", 2.0);
            dataset.add("R3", "C1", 3.0);
            dataset.add("R1", "C2", 1.1);
            dataset.add("R2", "C2", 2.2);
            dataset.add("R3", "C2", 3.3);
        });
        it("it is possible to insert a row at the start", function() {
            dataset.insertRow("I1", 0, false);
            expect(dataset.rowKeys()).toEqual(["I1", "R1", "R2", "R3"]);
            expect(dataset.valueByKey("I1", "C1")).toBe(undefined);
            expect(dataset.valueByKey("I1", "C2")).toBe(undefined);
            expect(dataset.rowIndex("I1")).toEqual(0);
        });
        it("it is possible to insert a row in the middle", function() {
            dataset.insertRow("I1", 1, false);
            expect(dataset.rowKeys()).toEqual(["R1", "I1", "R2", "R3"]);
            expect(dataset.valueByKey("I1", "C1")).toBe(undefined);
            expect(dataset.valueByKey("I1", "C2")).toBe(undefined);
            expect(dataset.rowIndex("I1")).toEqual(1);
        });
        it("it is possible to insert a row at the end", function() {
            dataset.insertRow("I1", 3, false);
            expect(dataset.rowKeys()).toEqual(["R1", "R2", "R3", "I1"]);
            expect(dataset.valueByKey("I1", "C1")).toBe(undefined);
            expect(dataset.valueByKey("I1", "C2")).toBe(undefined);
            expect(dataset.rowIndex("I1")).toEqual(3);
        });
    });

});

