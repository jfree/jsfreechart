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
 * Some tests for the Anchor2D object.
 * @returns {undefined}
 */
if (typeof module === "object" && module.exports) var jsfc = require("../../lib/jsfreechart.js");
 
describe("Anchor2D", function() {
    
    describe("Creating a new instance", function() {
        it("Check the arguments when creating the function/object", function() {
            var anchor = new jsfc.Anchor2D(jsfc.RefPt2D.TOP_LEFT, 
                new jsfc.Offset2D(1, 2));
            expect(anchor.refPt()).toEqual(jsfc.RefPt2D.TOP_LEFT);
            expect(anchor.offset().dx()).toEqual(1);
            expect(anchor.offset().dy()).toEqual(2);
        });
        it("The second argument is optional and defaults to a zero offset", function() {
            var anchor = new jsfc.Anchor2D(jsfc.RefPt2D.TOP_CENTER);
            expect(anchor.refPt()).toEqual(jsfc.RefPt2D.TOP_CENTER);
            expect(anchor.offset().dx()).toEqual(0);
            expect(anchor.offset().dy()).toEqual(0);
        });
    });
    
    describe("Resolving anchor points", function() {
        it("Test without offsets", function() {            
            var rect = new jsfc.Rectangle(5, 10, 50, 30);
            var anchor = new jsfc.Anchor2D(jsfc.RefPt2D.TOP_LEFT);
            var pt = anchor.anchorPoint(rect);
            expect(pt.x()).toEqual(5);
            expect(pt.y()).toEqual(10);

            anchor = new jsfc.Anchor2D(jsfc.RefPt2D.TOP_CENTER);
            pt = anchor.anchorPoint(rect);
            expect(pt.x()).toEqual(30);
            expect(pt.y()).toEqual(10);

            anchor = new jsfc.Anchor2D(jsfc.RefPt2D.TOP_RIGHT);
            pt = anchor.anchorPoint(rect);
            expect(pt.x()).toEqual(55);
            expect(pt.y()).toEqual(10);

            anchor = new jsfc.Anchor2D(jsfc.RefPt2D.CENTER_LEFT);
            pt = anchor.anchorPoint(rect);
            expect(pt.x()).toEqual(5);
            expect(pt.y()).toEqual(25);

            anchor = new jsfc.Anchor2D(jsfc.RefPt2D.CENTER);
            pt = anchor.anchorPoint(rect);
            expect(pt.x()).toEqual(30);
            expect(pt.y()).toEqual(25);

            anchor = new jsfc.Anchor2D(jsfc.RefPt2D.CENTER_RIGHT);
            pt = anchor.anchorPoint(rect);
            expect(pt.x()).toEqual(55);
            expect(pt.y()).toEqual(25);

            anchor = new jsfc.Anchor2D(jsfc.RefPt2D.BOTTOM_LEFT);
            pt = anchor.anchorPoint(rect);
            expect(pt.x()).toEqual(5);
            expect(pt.y()).toEqual(40);

            anchor = new jsfc.Anchor2D(jsfc.RefPt2D.BOTTOM_CENTER);
            pt = anchor.anchorPoint(rect);
            expect(pt.x()).toEqual(30);
            expect(pt.y()).toEqual(40);

            anchor = new jsfc.Anchor2D(jsfc.RefPt2D.BOTTOM_RIGHT);
            pt = anchor.anchorPoint(rect);
            expect(pt.x()).toEqual(55);
            expect(pt.y()).toEqual(40);
        });
    });
    
    
});