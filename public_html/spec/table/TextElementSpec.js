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

// some tests for the TextElement object
if (typeof module === "object" && module.exports) var jsfc = require("../../lib/jsfreechart.js");

describe("TextElement", function() {
    
    describe("Creating a new instance", function() {
        it("Check the arguments (including optional ones)", function() {
            var element = new jsfc.TextElement("ABC");
            expect(element.getText()).toEqual("ABC");
            var insets = element.getInsets();
            expect(insets.top()).toEqual(2);
            expect(insets.left()).toEqual(2);
            expect(insets.bottom()).toEqual(2);
            expect(insets.right()).toEqual(2);
            expect(element.refPt()).toEqual(jsfc.RefPt2D.CENTER);
        });
    });

    describe("Using chained methods", function() {
        it("Try some methods", function() {
            var element = new jsfc.TextElement("ABC");
        });

    });
    
//    describe("Measuring", function() {
//        it("We can measure the text", function() {
//            var element = new jsfc.TextElement("This is a text element");
//            var context = new jsfc.SVGContext2D();
//            context.setFont(new jsfc.Font("sans-serif", 16));
//            var dim = context.textDim("123456");
//            expect(dim.width()).toEqual(54.0);
//            expect(dim.height()).toEqual(18.015625);
//        });
//    });
    
});