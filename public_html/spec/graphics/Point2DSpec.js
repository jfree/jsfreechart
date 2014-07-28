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
 * Some tests for the Point2D object.
 */
describe("Point2D", function() {
    
    describe("Creating a new instance", function() {
        it("Check the arguments when creating the object", function() {
            var p = new jsfc.Point2D(1, 2);
            expect(p.x()).toEqual(1);
            expect(p.y()).toEqual(2);
            // dim is frozen
            p._x = 99;
            p._y = 98;
            expect(p.x()).toEqual(1);
            expect(p.y()).toEqual(2);
        });
    });    
    
});