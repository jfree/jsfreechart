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
 * Some tests for the Fit2D object.
 * @returns {undefined}
 */
describe("Fit2D", function() {
    
    describe("Creating a new instance", function() {
        it("Check the arguments when creating the function/object", function() {
            var fitter = new jsfc.Fit2D(new jsfc.Anchor2D(
                    jsfc.RefPt2D.CENTER), jsfc.Scale2D.SCALE_HORIZONTAL);
            var anchor = fitter.anchor();
            expect(anchor.refPt()).toEqual(jsfc.RefPt2D.CENTER);
            expect(fitter.scale()).toEqual(jsfc.Scale2D.SCALE_HORIZONTAL);
        });
        it("The second argument is optional and defaults to Scale2D.NONE", function() {
            var fitter = new jsfc.Fit2D(new jsfc.Anchor2D(
                    jsfc.RefPt2D.CENTER));
            var anchor = fitter.anchor();
            expect(anchor.refPt()).toEqual(jsfc.RefPt2D.CENTER);
            expect(fitter.scale()).toEqual(jsfc.Scale2D.NONE);
        });
    });
    
    describe("Fitting rectangles", function() {
        it("Test without scaling", function() {            
            var fitter = new jsfc.Fit2D(new jsfc.Anchor2D(
                    jsfc.RefPt2D.CENTER));
            var target = new jsfc.Rectangle(5, 10, 100, 60);
            var rect = fitter.fit(new jsfc.Dimension(6, 4), target);
            expect(rect.x()).toEqual(52);
        });
        it("Test with horizontal scaling", function() {            
            var fitter = new jsfc.Fit2D(new jsfc.Anchor2D(
                    jsfc.RefPt2D.CENTER), jsfc.Scale2D.SCALE_HORIZONTAL);
            var target = new jsfc.Rectangle(5, 10, 100, 60);
            var rect = fitter.fit(new jsfc.Dimension(6, 4), target);
            expect(rect.x()).toEqual(5);
            expect(rect.y()).toEqual(38);
            expect(rect.width()).toEqual(100);
            expect(rect.height()).toEqual(4);
        });
    });
    
    
});