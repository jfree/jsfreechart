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

// some tests for the KeyedValueLabels object
if (typeof module === "object" && module.exports) var jsfc = require("../../lib/jsfreechart.js");

describe("KeyedValueLabels", function() {
    
  describe("A default KeyedValueLabels instance", function() {
    var labelGenerator;
    var dataset;
    beforeEach(function() {
      labelGenerator = new jsfc.KeyedValueLabels();
      dataset = new jsfc.KeyedValuesDataset();
      dataset.add("Section A", 1.0);
      dataset.add("Section B", 3.0);
    });
    it("should generate a label with 2 decimal places", function() {
      expect(labelGenerator.itemLabel(dataset, 0)).toEqual("Section A = 1.00");
    });
  });
  
});

