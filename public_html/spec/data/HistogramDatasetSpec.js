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

// some tests for the HistogramDataset object
describe("HistogramDataset", function() {
    
    describe("When a new HistogramDataset is created", function() {
        var dataset;
        beforeEach(function() {
            dataset = new jsfc.HistogramDataset();
        });
        it("it should contain zero bins", function() {
            expect(dataset.binCount()).toEqual(0);
        });
        it("it should have the empty status", function() {
            expect(dataset.isEmpty()).toBe(true);
        });
    });
    
    describe("After adding one bin", function() {
       beforeEach(function() {
           dataset = new jsfc.HistogramDataset();
           dataset.addBin(1.0, 2.0);
       });
       it("it is possible to query the bin attributes", function() {
           expect(dataset.binCount()).toEqual(1);
           expect(dataset.binMid(0)).toEqual(1.5);
           expect(dataset.binStart(0)).toEqual(1.0);
           expect(dataset.binEnd(0)).toEqual(2.0);
           expect(dataset.count(0)).toEqual(0.0);
       });
       it("we can add values to the dataset", function() {
           dataset.add(1.0);
           expect(dataset.count(0)).toEqual(1.0);
           expect(dataset.isEmpty()).toBe(false);
           dataset.add(1.5);
           expect(dataset.count(0)).toEqual(2.0);
           dataset.add(2.0);
           expect(dataset.count(0)).toEqual(3.0);
       });
    });
  
});
