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

// some tests for the XYZDataset object
describe("XYZDataset", function() {
    
  describe("When a new XYZDataset is created", function() {
    var dataset;
    beforeEach(function() {
      dataset = new jsfc.XYZDataset();
    });
    it("it should contain zero items", function() {
      expect(dataset.seriesCount()).toEqual(0);
    });
  });
  
  describe("When one item is added", function() {
    beforeEach(function() {
      dataset = new jsfc.XYZDataset();
      dataset.add("Series 1", 1.0, 2.0, 3.0);
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
    it("one can retrieve the z-value by index", function() {
      expect(dataset.z(0, 0)).toEqual(3.0);  
    });
    it("one can retrieve the item by index", function() {
      expect(dataset.item(0, 0)).toEqual({"x": 1.0, "y": 2.0, "z": 3.0, "key": 0});
    });
    it("one can retrieve the index for the series key", function() {
      expect(dataset.seriesIndex("Series 1")).toEqual(0.0);
    })
  });
  
    // some basic validation of the selection mechanism
    describe("Regarding selections", function() {
        beforeEach(function() {
            dataset = new jsfc.XYZDataset()
                .add("S1", 1.0, 9.0, 20.0)
                .add("S1", 2.0, 8.0, 21.0)
                .add("S1", 3.0, 7.0, 22.0)
                .add("S2", 1.0, 6.0, 23.0)
                .add("S2", 2.0, 5.0, 24.0);
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
});