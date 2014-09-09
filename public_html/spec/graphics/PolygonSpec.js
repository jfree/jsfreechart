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

/**
 * Some tests for the Polygon object.
 */
if (typeof module === "object" && module.exports) var jsfc = require("../../lib/jsfreechart.js");

describe("Polygon", function() {
    
    describe("One can check if a point is contained within a polygon", function() {
        it("It should", function() {
            var p = new jsfc.Polygon();
            p.add(new jsfc.Point2D(10, 10));
            p.add(new jsfc.Point2D(20, 10));
            p.add(new jsfc.Point2D(20, 20));
            p.add(new jsfc.Point2D(10, 20));
            expect(p.contains(new jsfc.Point2D(15, 15))).toBe(true);
        });
    });    
    
});