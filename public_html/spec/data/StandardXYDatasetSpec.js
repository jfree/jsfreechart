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

// some tests for the StandardXYDataset object
describe("StandardXYDataset", function() {
    
    describe("When a new StandardXYDataset is created", function() {
        var dataset;
        beforeEach(function() {
            dataset = new jsfc.StandardXYDataset();
        });
        it("it should contain zero items", function() {
            expect(dataset.seriesCount()).toEqual(0);
        });
        it("it should have no dataset-level properties", function() {
            expect(dataset.getPropertyKeys()).toEqual([]);
        });
    });
  
    describe("Adding and removing series", function() {
        var dataset;
        beforeEach(function() {
            dataset = new jsfc.StandardXYDataset();
        });
        it("one can add a new (empty) series", function() {
            dataset.addSeries("S1");
            expect(dataset.seriesIndex("S1")).toEqual(0);
            dataset.addSeries("S2");
            expect(dataset.seriesIndex("S2")).toEqual(1);
        });
        it("one can remove any series", function() {
            dataset.addSeries("S1");
            dataset.addSeries("S2");
            expect(dataset.seriesIndex("S1")).toEqual(0);
            expect(dataset.seriesIndex("S2")).toEqual(1);
            dataset.removeSeries("S1");
            expect(dataset.seriesIndex("S1")).toEqual(-1);
            expect(dataset.seriesIndex("S2")).toEqual(0);
            dataset.removeSeries("S2");
            expect(dataset.seriesIndex("S1")).toEqual(-1);
            expect(dataset.seriesIndex("S2")).toEqual(-1);
        });
        it("one cannot add a series with an existing name", function() {
            dataset.addSeries("S1");
            dataset.addSeries("S2");
            dataset.addSeries("S3");
            var pass = false;
            try {
                dataset.addSeries("S2");
            } catch (e) {
                pass = true;
            }
            expect(pass).toBe(true);
        });
    });

    describe("When one item is added", function() {
        beforeEach(function() {
            dataset = new jsfc.StandardXYDataset();
            dataset.add("Series 1", 1.0, 2.0);
        });
        it("it should contain one series", function() {
            expect(dataset.seriesCount()).toEqual(1);
        });
        it("the series should contain one item", function() {
            expect(dataset.itemCount(0)).toEqual(1);
        });
        it("one can retrieve the x-value by index", function() {
            expect(dataset.x(0, 0)).toEqual(1.0);  
        });
        it("one can retrieve the y-value by index", function() {
            expect(dataset.y(0, 0)).toEqual(2.0);  
        });
        it("one can retrieve the item by index", function() {
            var item = dataset.item(0, 0);
            expect(item.x).toEqual(1.0);
            expect(item.y).toEqual(2.0);
        });
    });
  
    describe("When a dataset has multiple series", function() {
        beforeEach(function() {
            dataset = new jsfc.StandardXYDataset();
            dataset.add("Series 1", 1.0, 2.0);
            dataset.add("Series 1", 2.0, 3.0);
            dataset.add("Series 2", 3.0, 4.0); 
        });
        it("one can retrieve items for any series", function() {
            var indexS1 = dataset.seriesIndex("Series 1");
            var indexS2 = dataset.seriesIndex("Series 2");
            var item1 = dataset.item(indexS1, 0);
            expect(item1.x).toEqual(1.0);
            expect(item1.y).toEqual(2.0);
            var item2 = dataset.item(indexS1, 1);
            expect(item2.x).toEqual(2.0);
            expect(item2.y).toEqual(3.0);
            var item3 = dataset.item(indexS2, 0);
            expect(item3.x).toEqual(3.0);
            expect(item3.y).toEqual(4.0);
            expect(dataset.item(indexS1, 0)).toEqual({"x": 1.0, "y": 2.0, "key": "0"});
            expect(dataset.item(indexS1, 1)).toEqual({"x": 2.0, "y": 3.0, "key": "1"});
            expect(dataset.item(indexS2, 0)).toEqual({"x": 3.0, "y": 4.0, "key": "0"});
        });
        it("one can add a new item to any series", function() {
            dataset.add("Series 1", 4.0, 5.0);
            expect(dataset.item(0, 2)).toEqual({"x": 4.0, "y": 5.0, "key": "2"});
            dataset.add("Series 2", 5.0, 6.0);      
            expect(dataset.item(1, 1)).toEqual({"x": 5.0, "y": 6.0, "key": "1"});
        });
        it("one can retrieve the key for one series", function() {
            expect(dataset.seriesKey(0)).toEqual("Series 1");
            expect(dataset.seriesKey(1)).toEqual("Series 2");
        });
        it("one can retrieve the keys for all series", function() {
            expect(dataset.seriesKeys()).toEqual(["Series 1", "Series 2"]);
        });
    });
  
    describe("Removal of data items", function() {
        beforeEach(function() {
            dataset = new jsfc.StandardXYDataset();
            dataset.addByKey("Series 1", "Item 1", 1.0, 2.0);
            dataset.addByKey("Series 1", "Item 2", 2.0, 3.0);
            dataset.addByKey("Series 1", "Item 3", 3.0, 4.0);
            dataset.addByKey("Series 2", "Item 1", 4.0, 5.0);
            dataset.addByKey("Series 2", "Item 2", 5.0, 6.0);
            dataset.addByKey("Series 2", "Item 3", 6.0, 7.0);
        });
        it("an item can be removed from a series", function() {
            expect(dataset.item(0, 0)).toEqual({"x": 1.0, "y": 2.0, "key": "Item 1"});
            expect(dataset.itemCount(0)).toEqual(3);
            dataset.remove(0, 0);
            expect(dataset.item(0, 0)).toEqual({"x": 2.0, "y": 3.0, "key": "Item 2"});
            expect(dataset.itemCount(0)).toEqual(2);
            expect(dataset.item(1, 1)).toEqual({"x": 5.0, "y": 6.0, "key": "Item 2"});
            expect(dataset.itemCount(1)).toEqual(3);
            dataset.remove(1, 1);
            expect(dataset.item(1, 1)).toEqual({"x": 6.0, "y": 7.0, "key": "Item 3"});
            expect(dataset.itemCount(1)).toEqual(2);
        });
    });

    describe("Regarding the bounds for a dataset", function() {
        beforeEach(function() {
            dataset = new jsfc.StandardXYDataset();
        });
        it("an empty dataset should have no bounds", function() {
            var bounds = dataset.bounds();
            expect(bounds[0] === Number.POSITIVE_INFINITY);
            expect(bounds[1] === Number.NEGATIVE_INFINITY);
            expect(bounds[2] === Number.POSITIVE_INFINITY);
            expect(bounds[3] === Number.NEGATIVE_INFINITY);
        });
        it("one can find the bounds for a dataset with a single item", function() {
            dataset.add("S1", -1.0, 1.0);
            var bounds = dataset.bounds();
            expect(bounds[0] === -1.0);
            expect(bounds[1] === -1.0);
            expect(bounds[2] === 1.0);
            expect(bounds[3] === 1.0);
        });
        it("one can find the bounds for a dataset with a two items", function() {
            dataset.add("S1", -1.0, 1.0);
            dataset.add("S1", -10.0, 10.0);
            var bounds = dataset.bounds();
            expect(bounds[0] === -10.0);
            expect(bounds[1] === -1.0);
            expect(bounds[2] === 1.0);
            expect(bounds[3] === 10.0);
        });
        it("one can find the bounds for a dataset with a null y-value", function() {
            dataset.add("S1", -1.0, 1.0);
            dataset.add("S1", -10.0, null);
            var bounds = dataset.bounds();
            expect(bounds[0] === -10.0);
            expect(bounds[1] === -1.0);
            expect(bounds[2] === 1.0);
            expect(bounds[3] === 1.0);
        });
    });
   
    describe("Regarding direct access to the items for a series", function() {
        beforeEach(function() {
            dataset = new jsfc.StandardXYDataset();
            dataset.add("S1", 1.0, 2.0);
        });
        it("for a series with one item", function() {
            var items = dataset.items(0);
            expect(items[0][0] === 1.0);
            expect(items[0][1] === 2.0);
        });
    });
    
    // some validation of the item key mechanism
    describe("Regarding item keys", function() {
        beforeEach(function() {
            dataset = new jsfc.StandardXYDataset();
        });

        it("an item can be added with an explicit key", function() {
            dataset.addByKey("S1", "Item1", 1.0, 2.0);
            expect(dataset.getItemKey(0, 0)).toBe("Item1");
            expect(dataset.itemIndex("S1", "Item1")).toEqual(0);
        });

        it("re-adding an item with the same key updates the values for the existing item", function() {
            dataset.addByKey("S1", "Item1", 1.0, 2.0);
            expect(dataset.item(0, 0)).toEqual({x: 1.0, y: 2.0, key: "Item1"});
            dataset.addByKey("S1", "Item1", 3.0, 4.0);
            expect(dataset.item(0, 0)).toEqual({x: 3.0, y: 4.0, key: "Item1"});
            expect(dataset.itemCount(0)).toEqual(1);
        });

        it("items can be added with or without an explicit key", function() {
            dataset.addByKey("S1", "Item1", 1.0, 2.0);
            dataset.add("S1", 1.0, 2.0);
            expect(dataset.getItemKey(0, 0)).toBe("Item1");
            expect(dataset.getItemKey(0, 1)).toBe("0");
        });
        
        it("items can be removed by key", function() {
            dataset.addByKey("S1", "Item1", 1.0, 2.0);
            dataset.addByKey("S1", "Item2", 3.0, 4.0);
            dataset.removeByKey("S1", "Item1");
            expect(dataset.itemIndex("S1", "Item1")).toEqual(-1);
            expect(dataset.itemIndex("S1", "Item2")).toEqual(0);
        });
    });
    
    describe("Regarding properties: ", function() {
        var dataset;
        beforeEach(function() {
            dataset = new jsfc.StandardXYDataset()
                    .addByKey("S1", "I1", 1.0, 2.0)
                    .addByKey("S1", "I2", 3.0, 4.0)
                    .addByKey("S2", "I1", 5.0, 6.0)
                    .addByKey("S2", "I2", 7.0, 8.0);
        });
        it("properties can be defined at dataset level", function() {
            expect(dataset.getProperty("P1")).toBe(undefined);
            dataset.setProperty("P1", "abc");
            expect(dataset.getProperty("P1")).toEqual("abc");
            dataset.setProperty("P2", "xyz");
            expect(dataset.getProperty("P2")).toEqual("xyz");
            expect(dataset.getPropertyKeys()).toEqual(["P1", "P2"]);
            dataset.clearProperties();
            expect(dataset.getProperty("P1")).toBe(undefined);
            expect(dataset.getProperty("P2")).toBe(undefined);
            expect(dataset.getPropertyKeys()).toEqual([]);
        });
        it("properties can be defined at series level", function() {
            expect(dataset.getSeriesProperty("S1", "P1")).toBe(undefined);
            dataset.setSeriesProperty("S1", "P1", "abc");
            expect(dataset.getSeriesProperty("S1", "P1")).toEqual("abc");
            expect(dataset.getSeriesProperty("S2", "P1")).toBe(undefined);
            dataset.setSeriesProperty("S2", "P2", "xyz");
            expect(dataset.getSeriesProperty("S2", "P2")).toEqual("xyz");
            dataset.clearSeriesProperties("S1");
            expect(dataset.getSeriesProperty("S1", "P1")).toBe(undefined);
            expect(dataset.getSeriesProperty("S2", "P2")).toEqual("xyz");
            dataset.setSeriesProperty("S2", "P1", "abc");
            expect(dataset.getSeriesProperty("S2", "P1")).toEqual("abc");
            expect(dataset.getSeriesPropertyKeys("S2")).toEqual(["P2", "P1"]);
        });
        it("properties can be defined at item level", function() {
            expect(dataset.getItemProperty("S1", "I1", "color")).toBe(undefined);
            dataset.setItemProperty("S1", "I1", "color", "red");
            expect(dataset.getItemProperty("S1", "I1", "color")).toEqual("red");
            expect(dataset.getItemProperty("S2", "I2", "shape")).toBe(undefined);
            dataset.setItemProperty("S2", "I2", "shape", "circle");
            expect(dataset.getItemProperty("S2", "I2", "shape")).toEqual("circle");
        });
        it("multiple properties are allowed", function() {
            expect(dataset.getItemProperty("S2", "I2", "color")).toBe(undefined);
            dataset.setItemProperty("S2", "I2", "color", "red");
            expect(dataset.getItemProperty("S2", "I2", "color")).toEqual("red");
            expect(dataset.getItemProperty("S2", "I2", "shape")).toBe(undefined);
            dataset.setItemProperty("S2", "I2", "shape", "circle");
            expect(dataset.getItemProperty("S2", "I2", "shape")).toEqual("circle");
        });
        it("properties can be cleared", function() {
            expect(dataset.getItemProperty("S1", "I2", "color")).toBe(undefined);
            dataset.setItemProperty("S1", "I2", "color", "red");
            expect(dataset.getItemProperty("S1", "I2", "color")).toEqual("red");
            expect(dataset.getItemProperty("S1", "I2", "shape")).toBe(undefined);
            dataset.setItemProperty("S1", "I2", "shape", "circle");
            expect(dataset.getItemProperty("S1", "I2", "shape")).toEqual("circle");
            dataset.clearItemProperties("S1", "I2");
            expect(dataset.getItemProperty("S1", "I2", "color")).toBe(undefined);
            expect(dataset.getItemProperty("S1", "I2", "shape")).toBe(undefined);
        });
    });

    // some basic validation of the selection mechanism
    describe("Regarding selections", function() {
        beforeEach(function() {
            dataset = new jsfc.StandardXYDataset()
                .add("S1", 1.0, 9.0)
                .add("S1", 2.0, 8.0)
                .add("S1", 3.0, 7.0)
                .add("S2", 1.0, 6.0)
                .add("S2", 2.0, 5.0);
        });

        it("select() will select an item", function() {
            expect(dataset.isSelected("hilite", "S1", 2)).toBe(false);
            dataset.select("hilite", "S1", 2);
            expect(dataset.isSelected("hilite", "S1", 2)).toBe(true);
        });
        
        it("unselect() will unselect an item", function() {
            expect(dataset.isSelected("hilite", "S1", 2)).toBe(false);
            dataset.select("hilite", "S1", 2);
            expect(dataset.isSelected("hilite", "S1", 2)).toBe(true);
            dataset.unselect("hilite", "S1", 2);
            expect(dataset.isSelected("hilite", "S1", 2)).toBe(false);
        });

        it("clearSelection(id) with clear all of the items in one selection", function() {
            dataset.select("hilite1", "S1", 2);
            dataset.select("hilite2", "S1", 2);
            expect(dataset.isSelected("hilite1", "S1", 2)).toBe(true);            
            expect(dataset.isSelected("hilite2", "S1", 2)).toBe(true);
            dataset.clearSelection("hilite2");
            expect(dataset.isSelected("hilite1", "S1", 2)).toBe(true);            
            expect(dataset.isSelected("hilite2", "S1", 2)).toBe(false);            
        });
    });
    
    describe("A series index can be found from a series key", function() {
        var dataset;
        beforeEach(function() {
            dataset = new jsfc.StandardXYDataset();
        });
        it("when a dataset is empty, the seriesIndex() method will return -1", function() {
            expect(dataset.seriesIndex("ABC")).toEqual(-1);
        });
        it("when a dataset is not empty, one can retrieve the index of any series", function() {
            dataset.add("S1", 1.0, 9.0);
            expect(dataset.seriesIndex("S1")).toEqual(0);
            dataset.add("S2", 2.0, 8.0);
            expect(dataset.seriesIndex("S2")).toEqual(1);
            dataset.add("S3", 3.0, 7.0);
            expect(dataset.seriesIndex("S3")).toEqual(2);
            expect(dataset.seriesIndex("S4")).toEqual(-1);
        });
        it("when a series is deleted, the series indices are correctly updated", function() {
            dataset.add("S1", 1.0, 9.0);
            dataset.add("S2", 2.0, 8.0);
            dataset.add("S3", 3.0, 7.0);
            expect(dataset.seriesIndex("S1")).toEqual(0);
            expect(dataset.seriesIndex("S2")).toEqual(1);
            expect(dataset.seriesIndex("S3")).toEqual(2);
            expect(dataset.seriesIndex("S4")).toEqual(-1);
            dataset.removeSeries("S2");
            expect(dataset.seriesIndex("S1")).toEqual(0);
            expect(dataset.seriesIndex("S2")).toEqual(-1);
            expect(dataset.seriesIndex("S3")).toEqual(1);
            expect(dataset.seriesIndex("S4")).toEqual(-1);
            dataset.removeSeries("S3");
            expect(dataset.seriesIndex("S1")).toEqual(0);
            expect(dataset.seriesIndex("S2")).toEqual(-1);
            expect(dataset.seriesIndex("S3")).toEqual(-1);
            expect(dataset.seriesIndex("S4")).toEqual(-1);
            dataset.removeSeries("S1");
            expect(dataset.seriesIndex("S1")).toEqual(-1);
            expect(dataset.seriesIndex("S2")).toEqual(-1);
            expect(dataset.seriesIndex("S3")).toEqual(-1);
            expect(dataset.seriesIndex("S4")).toEqual(-1);
        });
    });

    describe("An item index can be found from an item key (plus the series key)", function() {
        var dataset;
        beforeEach(function() {
            dataset = new jsfc.StandardXYDataset();
        });
        it("when a series is empty, the itemIndex() method will return -1", function() {
            dataset.addByKey("S1", "I1", 1.0, 2.0);
            expect(dataset.itemIndex("S1", "I1")).toEqual(0);
            dataset.removeByKey("S1", "I1");
            expect(dataset.itemIndex("S1", "I1")).toEqual(-1);
        });
        it("when a series is not empty, one can retrieve the index of any item", function() {
            dataset.addByKey("S1", "I1", 1.0, 9.0);
            expect(dataset.itemIndex("S1", "I1")).toEqual(0);
            dataset.addByKey("S1", "I2", 2.0, 8.0);
            expect(dataset.itemIndex("S1", "I2")).toEqual(1);
            dataset.addByKey("S1", "I3", 3.0, 7.0);
            expect(dataset.itemIndex("S1", "I3")).toEqual(2);
            expect(dataset.itemIndex("S1", "I4")).toEqual(-1);
        });
        it("when an item is deleted, the series indices are correctly updated", function() {
            dataset.addByKey("S1", "I1", 1.0, 9.0);
            dataset.addByKey("S1", "I2", 2.0, 8.0);
            dataset.addByKey("S1", "I3", 3.0, 7.0);
            expect(dataset.itemIndex("S1", "I1")).toEqual(0);
            expect(dataset.itemIndex("S1", "I2")).toEqual(1);
            expect(dataset.itemIndex("S1", "I3")).toEqual(2);
            expect(dataset.itemIndex("S1", "I4")).toEqual(-1);
            dataset.removeByKey("S1", "I2");
            expect(dataset.itemIndex("S1", "I1")).toEqual(0);
            expect(dataset.itemIndex("S1", "I2")).toEqual(-1);
            expect(dataset.itemIndex("S1", "I3")).toEqual(1);
            expect(dataset.itemIndex("S1", "I4")).toEqual(-1);
            dataset.removeByKey("S1", "I3");
            expect(dataset.itemIndex("S1", "I1")).toEqual(0);
            expect(dataset.itemIndex("S1", "I2")).toEqual(-1);
            expect(dataset.itemIndex("S1", "I3")).toEqual(-1);
            expect(dataset.itemIndex("S1", "I4")).toEqual(-1);
            dataset.removeByKey("S1", "I1");
            expect(dataset.itemIndex("S1", "I1")).toEqual(-1);
            expect(dataset.itemIndex("S1", "I2")).toEqual(-1);
            expect(dataset.itemIndex("S1", "I3")).toEqual(-1);
            expect(dataset.itemIndex("S1", "I4")).toEqual(-1);
        });
    });
  
});