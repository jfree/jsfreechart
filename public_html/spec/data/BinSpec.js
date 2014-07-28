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

// some tests for the Bin object
describe("Bin", function() {
    
    describe("Regarding the constructor", function() {
        it("Check the arguments (including optional ones)", function() {
            var bin = new jsfc.Bin(1.0, 2.0);
            expect(bin.xmin).toEqual(1.0);
            expect(bin.xmax).toEqual(2.0);
            expect(bin.incMin).toBe(true);
            expect(bin.incMax).toBe(true);
            expect(bin.count).toEqual(0.0);
        
            bin = new jsfc.Bin(1.5, 2.5, true, false);
            expect(bin.xmin).toEqual(1.5);
            expect(bin.xmax).toEqual(2.5);
            expect(bin.incMin).toBe(true);
            expect(bin.incMax).toBe(false);
            expect(bin.count).toEqual(0.0);
        });
        
    });

    describe("Regarding overlapping", function() {
        it("Check all combinations for inclusive bin", function() {
            var bin = new jsfc.Bin(1.0, 2.0);
            expect(bin.overlaps(new jsfc.Bin(0.0, 0.5))).toBe(false);
            expect(bin.overlaps(new jsfc.Bin(0.0, 1.0))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(0.0, 1.5))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(0.0, 2.0))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(0.0, 2.5))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.0, 1.5))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.0, 2.0))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.0, 2.5))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.5, 1.7))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.5, 2.0))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.5, 2.5))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(2.0, 2.5))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(2.5, 3.0))).toBe(false);
        });
        
        it("Check all combinations for exclusive bin comared to inclusive", function() {
            var bin = new jsfc.Bin(1.0, 2.0, false, false);
            expect(bin.overlaps(new jsfc.Bin(0.0, 0.5))).toBe(false);
            expect(bin.overlaps(new jsfc.Bin(0.0, 1.0))).toBe(false);
            expect(bin.overlaps(new jsfc.Bin(0.0, 1.5))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(0.0, 2.0))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(0.0, 2.5))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.0, 1.5))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.0, 2.0))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.0, 2.5))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.5, 1.7))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.5, 2.0))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.5, 2.5))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(2.0, 2.5))).toBe(false);
            expect(bin.overlaps(new jsfc.Bin(2.5, 3.0))).toBe(false);
        });

        it("Check all combinations for inclusive bin compared to exclusive", function() {
            var bin = new jsfc.Bin(1.0, 2.0);
            expect(bin.overlaps(new jsfc.Bin(0.0, 0.5, false, false))).toBe(false);
            expect(bin.overlaps(new jsfc.Bin(0.0, 1.0, false, false))).toBe(false);
            expect(bin.overlaps(new jsfc.Bin(0.0, 1.5, false, false))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(0.0, 2.0, false, false))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(0.0, 2.5, false, false))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.0, 1.5, false, false))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.0, 2.0, false, false))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.0, 2.5, false, false))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.5, 1.7, false, false))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.5, 2.0, false, false))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.5, 2.5, false, false))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(2.0, 2.5, false, false))).toBe(false);
            expect(bin.overlaps(new jsfc.Bin(2.5, 3.0, false, false))).toBe(false);
        });

         it("Check all combinations for exclusive bin compared to exclusive", function() {
            var bin = new jsfc.Bin(1.0, 2.0, false, false);
            expect(bin.overlaps(new jsfc.Bin(0.0, 0.5, false, false))).toBe(false);
            expect(bin.overlaps(new jsfc.Bin(0.0, 1.0, false, false))).toBe(false);
            expect(bin.overlaps(new jsfc.Bin(0.0, 1.5, false, false))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(0.0, 2.0, false, false))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(0.0, 2.5, false, false))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.0, 1.5, false, false))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.0, 2.0, false, false))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.0, 2.5, false, false))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.5, 1.7, false, false))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.5, 2.0, false, false))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(1.5, 2.5, false, false))).toBe(true);
            expect(bin.overlaps(new jsfc.Bin(2.0, 2.5, false, false))).toBe(false);
            expect(bin.overlaps(new jsfc.Bin(2.5, 3.0, false, false))).toBe(false);
        });

    });
    
});