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

// some tests for the KeyedValuesDataset object
if (typeof module === "object" && module.exports) var jsfc = require("../../lib/jsfreechart.js");

describe("KeyedValuesDataset", function() {
    
    describe("When a new KeyedValuesDataset is created", function() {
        var dataset;
        beforeEach(function() {
            dataset = new jsfc.KeyedValuesDataset();
        });
        it("it should contain zero items", function() {
            expect(dataset.itemCount()).toEqual(0);
        });
    });
  
    describe("When one item is added", function() {
        beforeEach(function() {
            dataset = new jsfc.KeyedValuesDataset();
            dataset.add("Section A", 1.0);
        });
        it("it should contain one item", function() {
            expect(dataset.itemCount()).toEqual(1);
        });
        it("one can retrieve its key", function() {
            expect(dataset.key(0)).toEqual("Section A"); 
        });
        it("one can retrieve its value by index", function() {
            expect(dataset.valueByIndex(0)).toEqual(1.0);  
        });
        it("one can retrieve its value by key", function() {
            expect(dataset.valueByKey("Section A")).toEqual(1.0);
        });
    });
  
    describe("More generally", function() {
        beforeEach(function() {
            dataset = new jsfc.KeyedValuesDataset();
            dataset.add("Section A", 1.0);
            dataset.add("Section B", 2.0);
            dataset.add("Section C", 3.0);
        });
        it("one can retrieve the values that were added to the dataset", function() {
            expect(dataset.valueByKey("Section A")).toEqual(1.0);
            expect(dataset.valueByKey("Section B")).toEqual(2.0);
            expect(dataset.valueByKey("Section C")).toEqual(3.0);
        });
        it("one can retrieve the key for the item with a given index", function() {
            expect(dataset.key(2)).toEqual("Section C");
        });
        it("one can retrieve the index for the item with a given key", function() {
            expect(dataset.indexOf("Section B")).toEqual(1);
            expect(dataset.indexOf("XXXXXXXXX")).toEqual(-1);
        });
        it("one can retrieve a list of all keys", function() {
            expect(dataset.keys()).toEqual(["Section A", "Section B", "Section C"]);
        });
        it("items can be removed by index", function() {
            dataset.removeByIndex(0);
            expect(dataset.itemCount()).toEqual(2);
            expect(dataset.valueByKey("Section A")).toBe(null);
            expect(dataset.valueByIndex(0)).toEqual(2.0);
        });
        it("items can be removed by key", function() {
            dataset.remove("Section B");
            expect(dataset.itemCount()).toEqual(2);
            expect(dataset.valueByKey("Section B")).toBe(null);
            expect(dataset.valueByIndex(1)).toEqual(3.0);
        });
        it("fetching the value for a key that does not exist will return null", function() {
            expect(dataset.valueByKey("WRONG_KEY")).toBe(null);
        });
        it("adding an item with an existing key will update the existing value", function() {
            dataset.add("Section A", 9.9);
            expect(dataset.valueByKey("Section A")).toEqual(9.9);
            expect(dataset.itemCount()).toEqual(3);
        });
    });

    describe("When the parse() method is used", function() {
        beforeEach(function() {
            dataset = new jsfc.KeyedValuesDataset();
        });
        it("[] represents an empty dataset", function() {
            dataset.parse("[]");
            expect(dataset.isEmpty()).toBe(true);
        });
        it("[[\"A\", 1.0]] is a dataset with one item that can be retrieved", function() {
            dataset.parse("[{\"key\": \"A\", \"value\": 1.0}]");
            expect(dataset.isEmpty()).toBe(false);
            expect(dataset.itemCount()).toEqual(1.0);
            expect(dataset.key(0)).toEqual("A");
            expect(dataset.valueByIndex(0)).toEqual(1.0);
            expect(dataset.valueByKey("A")).toEqual(1.0);
        });
        it("[{\"key\": \"A\", \"value\": 1.0}, {\"key\": \"B\", \"value\": 2.0}] is a dataset with two items that can be retrieved", function() {
            dataset.parse("[{\"key\": \"A\", \"value\": 1.0}, {\"key\": \"B\", \"value\": 2.0}]");
            expect(dataset.isEmpty()).toBe(false);
            expect(dataset.itemCount()).toEqual(2.0);
            expect(dataset.key(0)).toEqual("A");
            expect(dataset.key(1)).toEqual("B");
            expect(dataset.valueByIndex(0)).toEqual(1.0);
            expect(dataset.valueByIndex(1)).toEqual(2.0);
            expect(dataset.valueByKey("A")).toEqual(1.0);
            expect(dataset.valueByKey("B")).toEqual(2.0);
        });
    });

    describe("Regarding properties", function() {
        var dataset;
        beforeEach(function() {
            dataset = new jsfc.KeyedValuesDataset()
                    .add("A", 1.0)
                    .add("B", 2.0)
                    .add("C", 3.0);
        });
        it("Properties can be defined for individual data items", function() {
            expect(dataset.getProperty("A", "color")).toBe(undefined);
            dataset.setProperty("A", "color", "red");
            expect(dataset.getProperty("A", "color")).toEqual("red");
            expect(dataset.getProperty("B", "shape")).toBe(undefined);
            dataset.setProperty("B", "shape", "circle");
            expect(dataset.getProperty("B", "shape")).toEqual("circle");
        });
        it("Multiple properties are allowed", function() {
            expect(dataset.getProperty("A", "color")).toBe(undefined);
            dataset.setProperty("A", "color", "red");
            expect(dataset.getProperty("A", "color")).toEqual("red");
            expect(dataset.getProperty("A", "shape")).toBe(undefined);
            dataset.setProperty("A", "shape", "circle");
            expect(dataset.getProperty("A", "shape")).toEqual("circle");
        });
        it("One can retrieve a list of property keys for a data item", function() {
            dataset.setProperty("A", "color", "red");
            dataset.setProperty("A", "shape", "circle");
            expect(dataset.propertyKeys("A")).toEqual(["color", "shape"]);
            expect(dataset.propertyKeys("B")).toEqual([]);
            expect(dataset.propertyKeys("C")).toEqual([]);
        });
    });
    
    describe("Regarding selections", function() {
        var dataset;
        beforeEach(function() {
            dataset = new jsfc.KeyedValuesDataset()
                    .add("A", 1.0)
                    .add("B", 2.0)
                    .add("C", 3.0);
         
        });
        it("select() will select an item", function() {
            expect(dataset.isSelected("hilite", "A")).toBe(false);
            dataset.select("hilite", "A");
            expect(dataset.isSelected("hilite", "A")).toBe(true);
            dataset.select("selection1", "C");
            expect(dataset.isSelected("hilite", "C")).toBe(false);            
            expect(dataset.isSelected("selection1", "C")).toBe(true);            
        });
        it("unselect() will unselect items", function() {
            expect(dataset.isSelected("hilite", "A")).toBe(false);
            dataset.select("hilite", "A");
            expect(dataset.isSelected("hilite", "A")).toBe(true);
            dataset.unselect("hilite", "A");
            expect(dataset.isSelected("hilite", "A")).toBe(false);
            
            dataset.select("selection1", "C");
            expect(dataset.isSelected("hilite", "C")).toBe(false);            
            expect(dataset.isSelected("selection1", "C")).toBe(true);            
        });
        it("clearSelection() will clear an entire selection", function() {
            dataset.select("hilite", "A");
            dataset.select("hilite", "B");
            dataset.clearSelection("hilite");
            expect(dataset.isSelected("hilite", "A")).toBe(false);
            expect(dataset.isSelected("hilite", "B")).toBe(false);
            dataset.select("selection1", "C");
            dataset.clearSelection("hilite");
            expect(dataset.isSelected("hilite", "C")).toBe(false);            
            expect(dataset.isSelected("selection1", "C")).toBe(true);            
        });
    });

});
