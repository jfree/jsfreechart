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

// some tests for the DatasetUtils object
describe("DatasetUtils", function() {
      
    describe("Generally for DatasetUtils.extractStackBaseValues()", function() {
        beforeEach(function() {
            dataset = new jsfc.KeyedValues2DDataset();
            dataset.add("R1", "C1", 1.0);
            dataset.add("R1", "C2", -1.0);
            dataset.add("R1", "C3", 1.0);
            dataset.add("R2", "C1", 0.0);
            dataset.add("R2", "C2", -2.0);  
            dataset.add("R2", "C3", -3.0);
            baseValues = jsfc.DatasetUtils.extractStackBaseValues(dataset);
        });
    
        it("one can retrieve the base values", function() {
            expect(baseValues.valueByKey("R1", "C1")).toEqual(0.0);
            expect(baseValues.valueByKey("R1", "C2")).toEqual(0.0);
            expect(baseValues.valueByKey("R1", "C3")).toEqual(0.0);
            expect(baseValues.valueByKey("R2", "C1")).toEqual(1.0);
            expect(baseValues.valueByKey("R2", "C2")).toEqual(-1.0);
            expect(baseValues.valueByKey("R2", "C3")).toEqual(0.0);
        });
    });  
    
    describe("Tests for extractXYDatasetFromColumns2D()", function() {
        beforeEach(function() {
            dataset = new jsfc.KeyedValues2DDataset();
            dataset.add("R1", "C1", 1.0);
            dataset.add("R1", "C2", 2.0);
            dataset.add("R2", "C1", 3.0);
            dataset.add("R2", "C2", 4.0);
        });
        
        it("Test basic data extraction", function() {
            var d = jsfc.DatasetUtils.extractXYDatasetFromColumns2D(dataset, 
                    "C2", "C1", "S1");
            expect(d.seriesCount()).toEqual(1);
            expect(d.itemCount(0)).toEqual(2);
            expect(d.x(0, 0)).toEqual(2.0);
            expect(d.y(0, 0)).toEqual(1.0);
            expect(d.x(0, 1)).toEqual(4.0);
            expect(d.y(0, 1)).toEqual(3.0);
        });
        
        it("Verify that properties are extracted also", function() {
            dataset.setItemProperty("R1", "C2", "color", "red");
            dataset.setItemProperty("R1", "C1", "color", "blue");
            dataset.setItemProperty("R2", "C2", "color", "green");
            dataset.setItemProperty("R2", "C1", "size", 99);
            var d = jsfc.DatasetUtils.extractXYDatasetFromColumns2D(dataset, 
                    "C2", "C1", "S1");
            var itemKey1 = d.getItemKey(0, 0);
            var itemKey2 = d.getItemKey(0, 1);
            expect(d.getItemProperty("S1", itemKey1, "color")).toEqual("blue");
            expect(d.getItemProperty("S1", itemKey2, "color")).toEqual("green");
            expect(d.getItemProperty("S1", itemKey2, "size")).toEqual(99);
        });
    });
    
    describe("Tests for extractXYDatasetFromRows2D()", function() {
        beforeEach(function() {
            dataset = new jsfc.KeyedValues2DDataset();
            dataset.add("R1", "C1", 1.0);
            dataset.add("R1", "C2", 2.0);
            dataset.add("R2", "C1", 3.0);
            dataset.add("R2", "C2", 4.0);
        });
        
        it("Test basic data extraction", function() {
            var d = jsfc.DatasetUtils.extractXYDatasetFromRows2D(dataset, 
                    "R2", "R1", "S1");
            expect(d.seriesCount()).toEqual(1);
            expect(d.itemCount(0)).toEqual(2);
            expect(d.x(0, 0)).toEqual(3.0);
            expect(d.y(0, 0)).toEqual(1.0);
            expect(d.x(0, 1)).toEqual(4.0);
            expect(d.y(0, 1)).toEqual(2.0);
        });
        
        it("Verify that properties are extracted also", function() {
            dataset.setItemProperty("R1", "C2", "color", "red");
            dataset.setItemProperty("R1", "C1", "color", "blue");
            dataset.setItemProperty("R2", "C2", "color", "green");
            dataset.setItemProperty("R2", "C1", "size", 99);
            var d = jsfc.DatasetUtils.extractXYDatasetFromRows2D(dataset, 
                    "R2", "R1", "S1");
            var itemKey1 = d.getItemKey(0, 0);
            var itemKey2 = d.getItemKey(0, 1);
            expect(d.getItemProperty("S1", itemKey1, "color")).toEqual("blue");
            expect(d.getItemProperty("S1", itemKey2, "color")).toEqual("red");
            expect(d.getItemProperty("S1", itemKey1, "size")).toEqual(99);
        });
    });    
 
    describe("Tests for extractXYDatasetFromColumns()", function() {
        beforeEach(function() {
            dataset = new jsfc.KeyedValues3DDataset();
            dataset.add("S1", "R1", "C1", 1.0);
            dataset.add("S1", "R1", "C2", 2.0);
            dataset.add("S1", "R2", "C1", 3.0);
            dataset.add("S1", "R2", "C2", 4.0);
            dataset.add("S2", "R1", "C1", 5.0);
            dataset.add("S2", "R1", "C2", 6.0);
            dataset.add("S2", "R2", "C1", 7.0);
            dataset.add("S2", "R2", "C2", 8.0);
        });
        
        it("Test basic data extraction", function() {
            var d = jsfc.DatasetUtils.extractXYDatasetFromColumns(dataset, 
                    "C2", "C1");
            expect(d.seriesCount()).toEqual(2);
            expect(d.x(0, 0)).toEqual(2.0);
            expect(d.y(0, 0)).toEqual(1.0);
            expect(d.x(0, 1)).toEqual(4.0);
            expect(d.y(0, 1)).toEqual(3.0);
            expect(d.x(1, 0)).toEqual(6.0);
            expect(d.y(1, 0)).toEqual(5.0);
            expect(d.x(1, 1)).toEqual(8.0);
            expect(d.y(1, 1)).toEqual(7.0);
        });
        
        it("Verify that properties are extracted also", function() {
            dataset.setProperty("S1", "R1", "C2", "color", "red");
            dataset.setProperty("S2", "R1", "C1", "color", "blue");
            dataset.setProperty("S2", "R1", "C2", "color", "red");
            var d = jsfc.DatasetUtils.extractXYDatasetFromColumns(dataset, 
                    "C2", "C1");
            var itemKey1 = d.getItemKey(0, 0);
            var itemKey2 = d.getItemKey(1, 0);
            expect(d.getItemProperty("S1", itemKey1, "color")).toEqual("red");
            expect(d.getItemProperty("S2", itemKey2, "color")).toEqual("blue");
        });
    });

});
