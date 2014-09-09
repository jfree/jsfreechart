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

// some tests for the RefPt2D object
if (typeof module === "object" && module.exports) var jsfc = require("../../lib/jsfreechart.js");

describe("RefPt2D", function() {
    
    describe("Utility functions that determine position", function() {
        it("isLeft()", function() {
            expect(jsfc.RefPt2D.isLeft(jsfc.RefPt2D.TOP_LEFT)).toBe(true);
            expect(jsfc.RefPt2D.isLeft(jsfc.RefPt2D.TOP_CENTER)).toBe(false);
            expect(jsfc.RefPt2D.isLeft(jsfc.RefPt2D.TOP_RIGHT)).toBe(false);
            expect(jsfc.RefPt2D.isLeft(jsfc.RefPt2D.CENTER_LEFT)).toBe(true);
            expect(jsfc.RefPt2D.isLeft(jsfc.RefPt2D.CENTER)).toBe(false);
            expect(jsfc.RefPt2D.isLeft(jsfc.RefPt2D.CENTER_RIGHT)).toBe(false);
            expect(jsfc.RefPt2D.isLeft(jsfc.RefPt2D.BOTTOM_LEFT)).toBe(true);
            expect(jsfc.RefPt2D.isLeft(jsfc.RefPt2D.BOTTOM_CENTER)).toBe(false);
            expect(jsfc.RefPt2D.isLeft(jsfc.RefPt2D.BOTTOM_RIGHT)).toBe(false);
        });
        it("isHorizontalCenter()", function() {
            expect(jsfc.RefPt2D.isHorizontalCenter(jsfc.RefPt2D.TOP_LEFT)).toBe(false);
            expect(jsfc.RefPt2D.isHorizontalCenter(jsfc.RefPt2D.TOP_CENTER)).toBe(true);
            expect(jsfc.RefPt2D.isHorizontalCenter(jsfc.RefPt2D.TOP_RIGHT)).toBe(false);
            expect(jsfc.RefPt2D.isHorizontalCenter(jsfc.RefPt2D.CENTER_LEFT)).toBe(false);
            expect(jsfc.RefPt2D.isHorizontalCenter(jsfc.RefPt2D.CENTER)).toBe(true);
            expect(jsfc.RefPt2D.isHorizontalCenter(jsfc.RefPt2D.CENTER_RIGHT)).toBe(false);
            expect(jsfc.RefPt2D.isHorizontalCenter(jsfc.RefPt2D.BOTTOM_LEFT)).toBe(false);
            expect(jsfc.RefPt2D.isHorizontalCenter(jsfc.RefPt2D.BOTTOM_CENTER)).toBe(true);
            expect(jsfc.RefPt2D.isHorizontalCenter(jsfc.RefPt2D.BOTTOM_RIGHT)).toBe(false);
        });
        it("isRight()", function() {
            expect(jsfc.RefPt2D.isRight(jsfc.RefPt2D.TOP_LEFT)).toBe(false);
            expect(jsfc.RefPt2D.isRight(jsfc.RefPt2D.TOP_CENTER)).toBe(false);
            expect(jsfc.RefPt2D.isRight(jsfc.RefPt2D.TOP_RIGHT)).toBe(true);
            expect(jsfc.RefPt2D.isRight(jsfc.RefPt2D.CENTER_LEFT)).toBe(false);
            expect(jsfc.RefPt2D.isRight(jsfc.RefPt2D.CENTER)).toBe(false);
            expect(jsfc.RefPt2D.isRight(jsfc.RefPt2D.CENTER_RIGHT)).toBe(true);
            expect(jsfc.RefPt2D.isRight(jsfc.RefPt2D.BOTTOM_LEFT)).toBe(false);
            expect(jsfc.RefPt2D.isRight(jsfc.RefPt2D.BOTTOM_CENTER)).toBe(false);
            expect(jsfc.RefPt2D.isRight(jsfc.RefPt2D.BOTTOM_RIGHT)).toBe(true);
        });
        it("isTop()", function() {
            expect(jsfc.RefPt2D.isTop(jsfc.RefPt2D.TOP_LEFT)).toBe(true);
            expect(jsfc.RefPt2D.isTop(jsfc.RefPt2D.TOP_CENTER)).toBe(true);
            expect(jsfc.RefPt2D.isTop(jsfc.RefPt2D.TOP_RIGHT)).toBe(true);
            expect(jsfc.RefPt2D.isTop(jsfc.RefPt2D.CENTER_LEFT)).toBe(false);
            expect(jsfc.RefPt2D.isTop(jsfc.RefPt2D.CENTER)).toBe(false);
            expect(jsfc.RefPt2D.isTop(jsfc.RefPt2D.CENTER_RIGHT)).toBe(false);
            expect(jsfc.RefPt2D.isTop(jsfc.RefPt2D.BOTTOM_LEFT)).toBe(false);
            expect(jsfc.RefPt2D.isTop(jsfc.RefPt2D.BOTTOM_CENTER)).toBe(false);
            expect(jsfc.RefPt2D.isTop(jsfc.RefPt2D.BOTTOM_RIGHT)).toBe(false);
        });
        it("isBottom()", function() {
            expect(jsfc.RefPt2D.isBottom(jsfc.RefPt2D.TOP_LEFT)).toBe(false);
            expect(jsfc.RefPt2D.isBottom(jsfc.RefPt2D.TOP_CENTER)).toBe(false);
            expect(jsfc.RefPt2D.isBottom(jsfc.RefPt2D.TOP_RIGHT)).toBe(false);
            expect(jsfc.RefPt2D.isBottom(jsfc.RefPt2D.CENTER_LEFT)).toBe(false);
            expect(jsfc.RefPt2D.isBottom(jsfc.RefPt2D.CENTER)).toBe(false);
            expect(jsfc.RefPt2D.isBottom(jsfc.RefPt2D.CENTER_RIGHT)).toBe(false);
            expect(jsfc.RefPt2D.isBottom(jsfc.RefPt2D.BOTTOM_LEFT)).toBe(true);
            expect(jsfc.RefPt2D.isBottom(jsfc.RefPt2D.BOTTOM_CENTER)).toBe(true);
            expect(jsfc.RefPt2D.isBottom(jsfc.RefPt2D.BOTTOM_RIGHT)).toBe(true);
        });
        it("isVerticalCenter()", function() {
            expect(jsfc.RefPt2D.isVerticalCenter(jsfc.RefPt2D.TOP_LEFT)).toBe(false);
            expect(jsfc.RefPt2D.isVerticalCenter(jsfc.RefPt2D.TOP_CENTER)).toBe(false);
            expect(jsfc.RefPt2D.isVerticalCenter(jsfc.RefPt2D.TOP_RIGHT)).toBe(false);
            expect(jsfc.RefPt2D.isVerticalCenter(jsfc.RefPt2D.CENTER_LEFT)).toBe(true);
            expect(jsfc.RefPt2D.isVerticalCenter(jsfc.RefPt2D.CENTER)).toBe(true);
            expect(jsfc.RefPt2D.isVerticalCenter(jsfc.RefPt2D.CENTER_RIGHT)).toBe(true);
            expect(jsfc.RefPt2D.isVerticalCenter(jsfc.RefPt2D.BOTTOM_LEFT)).toBe(false);
            expect(jsfc.RefPt2D.isVerticalCenter(jsfc.RefPt2D.BOTTOM_CENTER)).toBe(false);
            expect(jsfc.RefPt2D.isVerticalCenter(jsfc.RefPt2D.BOTTOM_RIGHT)).toBe(false);
        });

    });
    
});