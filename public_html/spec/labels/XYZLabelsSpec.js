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

// some tests for the XYZLabels object
describe("XYZLabels", function() {
    
  describe("A default XYZLabels instance", function() {
    var labelGenerator;
    var dataset;
    beforeEach(function() {
      labelGenerator = new jsfc.XYZLabels();
      dataset = new jsfc.XYZDataset();
      dataset.add("S1", 1.0, 2.0, 3.0);
      dataset.add("S1", 4.0, 5.0, 6.0);
      dataset.add("S1", 7.0, 8.0, 9.0);
      dataset.add("S2", 10.0, 11.0, 12.0);
      dataset.add("S2", 13.0, 14.0, 15.0);
    });
    it("should generate a label with 2 decimal places", function() {
      expect(labelGenerator.itemLabel(dataset, "S2", 0)).toEqual("10.00, 11.00, 12.00 / S2");
    });
  });
  
});

