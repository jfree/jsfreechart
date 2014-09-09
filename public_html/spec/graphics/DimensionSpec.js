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
 * Some tests for the Dimension object.
 */
if (typeof module === "object" && module.exports) var jsfc = require("../../lib/jsfreechart.js");
 
describe("Dimension", function() {
    
    describe("Creating a new instance", function() {
        it("Check the arguments when creating the function/object", function() {
            var dim = new jsfc.Dimension(1, 2);
            expect(dim.width()).toEqual(1);
            expect(dim.height()).toEqual(2);
            // dim is frozen
            dim._width = 99;
            dim._height = 98;
            expect(dim.width()).toEqual(1);
            expect(dim.height()).toEqual(2);
        });
    });    
    
});