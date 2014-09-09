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

// some tests for the NumberFormat object
if (typeof module === "object" && module.exports) var jsfc = require("../../lib/jsfreechart.js");

describe("NumberFormat", function() {
    
    describe("General", function() {
        it("Formatting numbers", function() {
            var f = new jsfc.NumberFormat(2);
            expect(f.format(2)).toEqual("2.00");
            expect(f.format(-1.9)).toEqual("-1.90");
            var f = new jsfc.NumberFormat(0);
            expect(f.format(2)).toEqual("2");
            expect(f.format(-1.9)).toEqual("-2");
            var f = new jsfc.NumberFormat(3, true);
            expect(f.format(2)).toEqual("2.000e+0");
            expect(f.format(-1.9)).toEqual("-1.900e+0");
        });
    });
    
});