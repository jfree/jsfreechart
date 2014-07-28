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

// some tests for the Map object
describe("Map", function() {
    
    describe("Regarding the constructor", function() {
        it("a new instance is empty.", function() {
            var map = new jsfc.Map();
            expect(map.keys().length).toEqual(0.0);
            expect(map.get("ABC")).toBe(undefined);
        }); 
        it("some special cases for the get() method.", function() {
            var map = new jsfc.Map();
            expect(map.get("toString")).toBe(undefined);
            expect(map.get("__proto__")).toBe(undefined);
        }); 
    });

    describe("Items can be stored in the map", function() {
        it("simple checks for the put() method", function() {
            var map = new jsfc.Map();
            map.put("ABC", 123);
            map.put("XYZ", 456);
            expect(map.get("ABC")).toEqual(123);
            expect(map.contains("ABC")).toBe(true);
            expect(map.get("DEF")).toBe(undefined);
            expect(map.contains("DEF")).toBe(false);
            expect(map.get("XYZ")).toEqual(456);
            expect(map.contains("XYZ")).toBe(true);
            map.put("XYZ", 987);
            expect(map.get("XYZ")).toEqual(987);
        }); 
        it("special cases for the put() method", function() {
            var map = new jsfc.Map();
            map.put("toString", 123);
            expect(map.get("toString")).toEqual(123);
        }); 
    });
    
    describe("Items can be removed from the map", function() {
        it("simple checks for the remove() method", function() {
            var map = new jsfc.Map();
            map.put("ABC", 123);
            map.put("XYZ", 456);
            expect(map.get("ABC")).toEqual(123);
            expect(map.get("XYZ")).toEqual(456);
            map.remove("XYZ");
            expect(map.get("XYZ")).toBe(undefined);
            expect(map.contains("XYZ")).toBe(false);
        }); 

    });

    describe("One can access the keys for the items defined in the map", function() {
        it("Simple checks for the keys() method", function() {
            var map = new jsfc.Map();
            map.put("ABC", 123);
            map.put("XYZ", 456);
            expect(map.keys()).toEqual(["ABC", "XYZ"]);
        }); 

    });

});