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

// some tests for the KeyedValue2DLabels object
if (typeof module === "object" && module.exports) var jsfc = require("../../lib/jsfreechart.js");

describe("KeyedValue2DLabels", function() {
    
  describe("A default KeyedValue2DLabels instance", function() {
    var labelGenerator;
    var dataset;
    beforeEach(function() {
      labelGenerator = new jsfc.KeyedValue2DLabels();
      dataset = new jsfc.KeyedValues2DDataset();
      dataset.add("R1", "C1", 1.0);
      dataset.add("R1", "C2", 2.0);
      dataset.add("R1", "C3", 3.0);
      dataset.add("R2", "C1", 4.0);
      dataset.add("R2", "C2", 5.0);
      dataset.add("R2", "C3", 6.0);
    });
    it("should generate a label with 2 decimal places", function() {
      expect(labelGenerator.itemLabel(dataset, 0, 0)).toEqual("R1, C1 = 1.00");
    });
  });
  
});


