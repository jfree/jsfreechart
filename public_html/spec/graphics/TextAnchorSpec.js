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
describe("TextAnchor", function() {
    
    describe("Utility functions that determine position", function() {
        it("isLeft()", function() {
            expect(jsfc.TextAnchor.isLeft(jsfc.TextAnchor.TOP_LEFT)).toBe(true);
            expect(jsfc.TextAnchor.isLeft(jsfc.TextAnchor.TOP_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isLeft(jsfc.TextAnchor.TOP_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isLeft(jsfc.TextAnchor.HALF_ASCENT_LEFT)).toBe(true);
            expect(jsfc.TextAnchor.isLeft(jsfc.TextAnchor.HALF_ASCENT_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isLeft(jsfc.TextAnchor.HALF_ASCENT_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isLeft(jsfc.TextAnchor.CENTER_LEFT)).toBe(true);
            expect(jsfc.TextAnchor.isLeft(jsfc.TextAnchor.CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isLeft(jsfc.TextAnchor.CENTER_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isLeft(jsfc.TextAnchor.BASELINE_LEFT)).toBe(true);
            expect(jsfc.TextAnchor.isLeft(jsfc.TextAnchor.BASELINE_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isLeft(jsfc.TextAnchor.BASELINE_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isLeft(jsfc.TextAnchor.BOTTOM_LEFT)).toBe(true);
            expect(jsfc.TextAnchor.isLeft(jsfc.TextAnchor.BOTTOM_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isLeft(jsfc.TextAnchor.BOTTOM_RIGHT)).toBe(false);
        });
        it("isHorizontalCenter()", function() {
            expect(jsfc.TextAnchor.isHorizontalCenter(jsfc.TextAnchor.TOP_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isHorizontalCenter(jsfc.TextAnchor.TOP_CENTER)).toBe(true);
            expect(jsfc.TextAnchor.isHorizontalCenter(jsfc.TextAnchor.TOP_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isHorizontalCenter(jsfc.TextAnchor.HALF_ASCENT_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isHorizontalCenter(jsfc.TextAnchor.HALF_ASCENT_CENTER)).toBe(true);
            expect(jsfc.TextAnchor.isHorizontalCenter(jsfc.TextAnchor.HALF_ASCENT_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isHorizontalCenter(jsfc.TextAnchor.CENTER_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isHorizontalCenter(jsfc.TextAnchor.CENTER)).toBe(true);
            expect(jsfc.TextAnchor.isHorizontalCenter(jsfc.TextAnchor.CENTER_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isHorizontalCenter(jsfc.TextAnchor.BASELINE_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isHorizontalCenter(jsfc.TextAnchor.BASELINE_CENTER)).toBe(true);
            expect(jsfc.TextAnchor.isHorizontalCenter(jsfc.TextAnchor.BASELINE_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isHorizontalCenter(jsfc.TextAnchor.BOTTOM_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isHorizontalCenter(jsfc.TextAnchor.BOTTOM_CENTER)).toBe(true);
            expect(jsfc.TextAnchor.isHorizontalCenter(jsfc.TextAnchor.BOTTOM_RIGHT)).toBe(false);
        });
        it("isRight()", function() {
            expect(jsfc.TextAnchor.isRight(jsfc.TextAnchor.TOP_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isRight(jsfc.TextAnchor.TOP_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isRight(jsfc.TextAnchor.TOP_RIGHT)).toBe(true);
            expect(jsfc.TextAnchor.isRight(jsfc.TextAnchor.HALF_ASCENT_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isRight(jsfc.TextAnchor.HALF_ASCENT_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isRight(jsfc.TextAnchor.HALF_ASCENT_RIGHT)).toBe(true);
            expect(jsfc.TextAnchor.isRight(jsfc.TextAnchor.CENTER_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isRight(jsfc.TextAnchor.CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isRight(jsfc.TextAnchor.CENTER_RIGHT)).toBe(true);
            expect(jsfc.TextAnchor.isRight(jsfc.TextAnchor.BASELINE_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isRight(jsfc.TextAnchor.BASELINE_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isRight(jsfc.TextAnchor.BASELINE_RIGHT)).toBe(true);
            expect(jsfc.TextAnchor.isRight(jsfc.TextAnchor.BOTTOM_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isRight(jsfc.TextAnchor.BOTTOM_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isRight(jsfc.TextAnchor.BOTTOM_RIGHT)).toBe(true);
        });
        it("isTop()", function() {
            expect(jsfc.TextAnchor.isTop(jsfc.TextAnchor.TOP_LEFT)).toBe(true);
            expect(jsfc.TextAnchor.isTop(jsfc.TextAnchor.TOP_CENTER)).toBe(true);
            expect(jsfc.TextAnchor.isTop(jsfc.TextAnchor.TOP_RIGHT)).toBe(true);
            expect(jsfc.TextAnchor.isTop(jsfc.TextAnchor.HALF_ASCENT_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isTop(jsfc.TextAnchor.HALF_ASCENT_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isTop(jsfc.TextAnchor.HALF_ASCENT_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isTop(jsfc.TextAnchor.CENTER_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isTop(jsfc.TextAnchor.CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isTop(jsfc.TextAnchor.CENTER_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isTop(jsfc.TextAnchor.BASELINE_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isTop(jsfc.TextAnchor.BASELINE_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isTop(jsfc.TextAnchor.BASELINE_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isTop(jsfc.TextAnchor.BOTTOM_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isTop(jsfc.TextAnchor.BOTTOM_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isTop(jsfc.TextAnchor.BOTTOM_RIGHT)).toBe(false);
        });
        it("isBottom()", function() {
            expect(jsfc.TextAnchor.isBottom(jsfc.TextAnchor.TOP_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isBottom(jsfc.TextAnchor.TOP_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isBottom(jsfc.TextAnchor.TOP_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isBottom(jsfc.TextAnchor.HALF_ASCENT_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isBottom(jsfc.TextAnchor.HALF_ASCENT_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isBottom(jsfc.TextAnchor.HALF_ASCENT_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isBottom(jsfc.TextAnchor.CENTER_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isBottom(jsfc.TextAnchor.CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isBottom(jsfc.TextAnchor.CENTER_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isBottom(jsfc.TextAnchor.BASELINE_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isBottom(jsfc.TextAnchor.BASELINE_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isBottom(jsfc.TextAnchor.BASELINE_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isBottom(jsfc.TextAnchor.BOTTOM_LEFT)).toBe(true);
            expect(jsfc.TextAnchor.isBottom(jsfc.TextAnchor.BOTTOM_CENTER)).toBe(true);
            expect(jsfc.TextAnchor.isBottom(jsfc.TextAnchor.BOTTOM_RIGHT)).toBe(true);
        });
        it("isHalfAscent()", function() {
            expect(jsfc.TextAnchor.isHalfAscent(jsfc.TextAnchor.TOP_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isHalfAscent(jsfc.TextAnchor.TOP_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isHalfAscent(jsfc.TextAnchor.TOP_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isHalfAscent(jsfc.TextAnchor.HALF_ASCENT_LEFT)).toBe(true);
            expect(jsfc.TextAnchor.isHalfAscent(jsfc.TextAnchor.HALF_ASCENT_CENTER)).toBe(true);
            expect(jsfc.TextAnchor.isHalfAscent(jsfc.TextAnchor.HALF_ASCENT_RIGHT)).toBe(true);
            expect(jsfc.TextAnchor.isHalfAscent(jsfc.TextAnchor.CENTER_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isHalfAscent(jsfc.TextAnchor.CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isHalfAscent(jsfc.TextAnchor.CENTER_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isHalfAscent(jsfc.TextAnchor.BASELINE_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isHalfAscent(jsfc.TextAnchor.BASELINE_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isHalfAscent(jsfc.TextAnchor.BASELINE_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isHalfAscent(jsfc.TextAnchor.BOTTOM_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isHalfAscent(jsfc.TextAnchor.BOTTOM_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isHalfAscent(jsfc.TextAnchor.BOTTOM_RIGHT)).toBe(false);
        });
        it("isBaseline()", function() {
            expect(jsfc.TextAnchor.isBaseline(jsfc.TextAnchor.TOP_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isBaseline(jsfc.TextAnchor.TOP_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isBaseline(jsfc.TextAnchor.TOP_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isBaseline(jsfc.TextAnchor.HALF_ASCENT_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isBaseline(jsfc.TextAnchor.HALF_ASCENT_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isBaseline(jsfc.TextAnchor.HALF_ASCENT_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isBaseline(jsfc.TextAnchor.CENTER_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isBaseline(jsfc.TextAnchor.CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isBaseline(jsfc.TextAnchor.CENTER_RIGHT)).toBe(false);
            expect(jsfc.TextAnchor.isBaseline(jsfc.TextAnchor.BASELINE_LEFT)).toBe(true);
            expect(jsfc.TextAnchor.isBaseline(jsfc.TextAnchor.BASELINE_CENTER)).toBe(true);
            expect(jsfc.TextAnchor.isBaseline(jsfc.TextAnchor.BASELINE_RIGHT)).toBe(true);
            expect(jsfc.TextAnchor.isBaseline(jsfc.TextAnchor.BOTTOM_LEFT)).toBe(false);
            expect(jsfc.TextAnchor.isBaseline(jsfc.TextAnchor.BOTTOM_CENTER)).toBe(false);
            expect(jsfc.TextAnchor.isBaseline(jsfc.TextAnchor.BOTTOM_RIGHT)).toBe(false);
        });

    });
    
});