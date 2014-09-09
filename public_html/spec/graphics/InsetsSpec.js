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
 * Some tests for the Insets object.
 */
if (typeof module === "object" && module.exports) var jsfc = require("../../lib/jsfreechart.js");
 
describe("Insets", function() {
    
    describe("Creating a new instance", function() {
        it("Check the arguments when creating the function/object", function() {
            var ins = new jsfc.Insets(1, 2, 3, 4);
            expect(ins.top()).toEqual(1);
            expect(ins.left()).toEqual(2);
            expect(ins.bottom()).toEqual(3);
            expect(ins.right()).toEqual(4);
            // ins is frozen
            ins._top = 99;
            ins._left = 98;
            ins._bottom = 97;
            ins._right = 96;
            expect(ins.top()).toEqual(1);
            expect(ins.left()).toEqual(2);
            expect(ins.bottom()).toEqual(3);
            expect(ins.right()).toEqual(4);
        });
    });    
    
});