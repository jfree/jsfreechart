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

"use strict";

// Here we can create an API that matches the Canvas Context2D API, and
// generate SVG using the same code that we would use to draw to the Canvas.
// 
// The Canvas API:
//
// ctx.fillRect(x, y, width, height);
// ctx.clearRect(x, y, width, height);
// ctx.strokeRect(x, y, width, height);
// 
// PATHS:
// ctx.beginPath();
// ctx.moveTo(0,75);
// ctx.lineTo(250,75);
// ctx.stroke(); // Draw it
// ctx.rect(x, y, width, height)*
// ctx.quadraticCurveTo(cpx, cpy, x, y)
// ctx.bezierCurveTo(cp1x, cp2y, cp2x, cp2y, x, y)
// ctx.arc(x,y,r,sAngle,eAngle,counterclockwise);
// ctx.arcTo(x1, y1, x2, y2, radius)
// ctx.closePath()

// ctx.fillText(text, x, y, maxWidth);

/**
 * Creates a new SVGContext2D instance that can be used to render SVG output.
 * 
 * @constructor
 * @implements {jsfc.Context2D}
 *
 * @returns {undefined}
 */
jsfc.SVGContext2D = function(svg) {
    if (!(this instanceof jsfc.SVGContext2D)) {
        throw new Error("Use 'new' with constructor.");
    }
    
    jsfc.BaseContext2D.init(this);
    
    this.svg = svg;

    // create an empty 'defs' element - the defs for each layer will be
    // appended within their own group inside this element
    this._defs = this.element("defs");
    this.svg.appendChild(this._defs);

    this._defaultLayer = new jsfc.SVGLayer("default");
    this.svg.appendChild(this._defaultLayer.getContainer());
    this._defs.appendChild(this._defaultLayer.getDefsContainer());
    
    this._layers = [ this._defaultLayer ];
    
    // all default layer content is put in a top-level group so that it can be 
    // removed easily. we keep a stack of groups and content is added to the 
    // group at the top of the stack.  The caller can add another group using 
    // beginGroup() and close it with endGroup().  The stack permits nesting 
    // groups.

    this._currentLayer = this._defaultLayer;
    this._pathStr = "";
    
    this.textAlign = "start";
    this.textBaseline = "alphabetic";
    
    this._transform = new jsfc.Transform();

    // an SVG element that is hidden - we can add text elements to this hidden
    // element then measure the text bounds
    this._hiddenGroup = this.svg.getElementById("hiddenGroup");
    if (!this._hiddenGroup) {
        this._hiddenGroup = document.createElementNS("http://www.w3.org/2000/svg", 
                "g");
        this._hiddenGroup.setAttribute("id", "hiddenGroup");
        this._hiddenGroup.setAttribute("width", 60);
        this._hiddenGroup.setAttribute("height", 60);
        this._hiddenGroup.setAttribute("visibility", "hidden");
        this.svg.appendChild(this._hiddenGroup);
    }
};

// extends BaseContext2D - see also the init() call in the constructor
jsfc.SVGContext2D.prototype = new jsfc.BaseContext2D();

/**
 * Sets a rendering hint.
 * 
 * @param {!string} key  the hint key.
 * @param {*} value  the hint value.
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.setHint = function(key, value) {
    if (key === "layer") {
        var layer = this._findLayer(value);
        if (!layer) {
            layer = new jsfc.SVGLayer(value + "");
            this._addLayer(layer);
        } 
        this._currentLayer = layer;
        return;
    }
    this._hints[key] = value;  
};

/**
 * Adds a new layer to the SVG.  Having separate layers allows some content
 * to be cleared and redrawn independently of the rest (this is used for
 * drawing crosshairs over a chart, for example).
 * 
 * @param {!jsfc.SVGLayer} layer  the layer.
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype._addLayer = function(layer) {
    this._defs.appendChild(layer.getDefsContainer());
    this.svg.appendChild(layer.getContainer());
    this._layers.push(layer);
};

/**
 * Removes a layer from the SVG.
 * 
 * @param {!jsfc.SVGLayer} layer  the layer.
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype._removeLayer = function(layer) {
    var index = this._indexOfLayer(layer);
    if (index < 0) {
        throw new Error("The layer is not present in this SVGContext2D.");
    }
    this._layers.splice(index, 1);
    this._defs.removeChild(layer.getDefsContainer());
    this.svg.removeChild(layer.getContainer());
};

/**
 * Returns the index of a layer.
 * 
 * @param {!jsfc.SVGLayer} layer
 * @returns {!number} The layer index or -1.
 */
jsfc.SVGContext2D.prototype._indexOfLayer = function(layer) {
    for (var i = 0; i < this._layers.length; i++) {
        if (this._layers[i] === layer) {
            return i;
        }
    } 
    return -1;
};

/**
 * Finds the layer with the specified id.  There is always a layer with the
 * ID "default".
 * 
 * @param {!string} id  the layer id.
 * @returns {jsfc.SVGLayer|undefined}
 */
jsfc.SVGContext2D.prototype._findLayer = function(id) {
    for (var i = 0; i < this._layers.length; i++) {
        if (this._layers[i].getID() === id) {
            return this._layers[i];
        }
    } 
    return undefined;      
};

/**
 * Creates an SVG element with the specified type.
 * 
 * @param {string} elementType  the type (for example, "text" or "rect").
 * 
 * @returns {Element} The element.
 */
jsfc.SVGContext2D.prototype.element = function(elementType) {
    return document.createElementNS("http://www.w3.org/2000/svg", elementType);
};

/**
 * Appends an element to the container element at the top of the stack for the 
 * current layer.  Rendering hints are used to change the layer.
 * 
 * @param {Element} element  the child element.
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.append = function(element) {
    var stack = this._currentLayer.getStack();
    stack[stack.length - 1].appendChild(element);
};

/**
 * Begins a group with the specified class.  A rendering hint can be used
 * to specify a clipping rectangle for the group.
 * 
 * @param {string} classStr  the class.
 *
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.beginGroup = function(classStr) {
    var g = this.element("g");
    g.setAttribute("class", classStr);
    var cursor = this.getHint("cursor");
    if (cursor) {
        g.setAttribute("cursor", cursor);
        this.setHint("cursor", null);
    }
    var clip = this.getHint("clip");
    if (clip) {
        var clipPath = this.element("clipPath");
        clipPath.setAttribute("id", "clip-1");
        var rect = this._createRectElement(clip);
        clipPath.appendChild(rect);
        this._currentLayer.getDefsContent().appendChild(clipPath);
        g.setAttribute("clip-path", "url(#clip-1)");
        this.setHint("clip", null);
    };
    var glass = this.getHint("glass");
    if (glass) {
        var rect = this._createRectElement(clip);
        rect.setAttribute("fill", "rgba(0, 0, 0, 0)");
        g.appendChild(rect);
    }
    this.append(g);
    this._currentLayer.getStack().push(g);
};

/**
 * Ends a group.
 * 
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.endGroup = function() {
    var stack = this._currentLayer.getStack();
    if (stack.length === 1) {
        throw new Error("endGroup() does not have a matching beginGroup().");
    }
    stack.pop();
};

/**
 * Clears all the content of the SVG element.
 * 
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.clear = function() {
    this._currentLayer.clear();
};

/**
 * Draws a line from (x0, y0) to (x1, y1) using the current line stroke and
 * color.
 * 
 * @param {!number} x0  the x-coordinate for the start point.
 * @param {!number} y0  the y-coordinate for the start point.
 * @param {!number} x1  the x-coordinate for the end point.
 * @param {!number} y1  the y-coordinate for the end point.
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.drawLine = function(x0, y0, x1, y1) {
    var t = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    t.setAttribute("stroke", this._lineColor.rgbaStr());
    //t.setAttribute("stroke-width", this._stroke.lineWidth);
    t.setAttribute("x1", this._geomDP(x0));
    t.setAttribute("y1", this._geomDP(y0));
    t.setAttribute("x2", this._geomDP(x1));
    t.setAttribute("y2", this._geomDP(y1));
    t.setAttribute("style", this._stroke.getStyleStr());
    t.setAttribute("transform", this._svgTransformStr());
    this._setAttributesFromHints(t);
    this.append(t);    
};

/**
 * Fills a rectangle with the current color.
 * 
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @param {!number} width  the width.
 * @param {!number} height  the height.
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.fillRect = function(x, y, width, height) {
    var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("fill", this._fillColor.rgbaStr());
    this.append(rect);
};

/**
 * Draws a rectangle with the current line stroke.
 * 
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @param {!number} w  the width.
 * @param {!number} h  the height.
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.drawRect = function(x, y, w, h) {
    var t = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    t.setAttribute("stroke", this._lineColor.rgbaStr());
    t.setAttribute("fill", this._fillColor.rgbaStr());
    t.setAttribute("x", this._geomDP(x));
    t.setAttribute("y", this._geomDP(y));
    t.setAttribute("width", this._geomDP(w));
    t.setAttribute("height", this._geomDP(h));
    t.setAttribute("style", this._stroke.getStyleStr());
    t.setAttribute("transform", this._svgTransformStr());
    this.append(t);    
};

/**
 * Draws a circle.
 * 
 * @param {!number} cx  the x-coordinate for the center point.
 * @param {!number} cy  the y-coordinate for the center point.
 * @param {!number} r  the radius.
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.drawCircle = function(cx, cy, r) {
    var t = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    t.setAttribute("stroke", this._lineColor.rgbaStr());
    t.setAttribute("stroke-width", this._stroke.lineWidth);
    t.setAttribute("fill", this._fillColor.rgbaStr());
    t.setAttribute("cx", cx);
    t.setAttribute("cy", cy);
    t.setAttribute("r", r);
    var ref = this.getHint("ref");
    if (ref) {
        t.setAttribute("jfree:ref", JSON.stringify(ref));
        this.setHint("ref", null);
    }
    this.append(t);        
};

/**
 * Draws a string in the current font with the left baseline aligned with the 
 * point (x, y).  The color of the text is determined by the current fill color.
 * 
 * @param {!string} text  the string.
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.drawString = function(text, x, y) {
    this.fillText(text, x, y);
};

/**
 * Draws the text.
 * 
 * @param {!string} text  the text.
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @param {number} [maxWidth] ignored for now.
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.fillText = function(text, x, y, maxWidth) {
    var t = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    t.setAttribute("x", x);
    t.setAttribute("y", y);
    t.setAttribute("style", this._font.styleStr());
    t.textContent = text;
    this.append(t);    
};

/**
 * Draws a string anchored to a point (x, y).
 * 
 * @param {!string} text  the text.
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @param {!number} anchor  the anchor point (see jsfc.TextAnchor).
 * @returns {jsfc.Dimension} The dimensions of the string.
 */
jsfc.SVGContext2D.prototype.drawAlignedString = function(text, x, y, anchor) {
    var t = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    t.setAttribute("x", this._geomDP(x));
    t.setAttribute("style", this._font.styleStr());
    t.setAttribute("fill", this._fillColor.rgbaStr());
    t.setAttribute("transform", this._svgTransformStr());
    t.textContent = text;

    var anchorStr = "start";
    if (jsfc.TextAnchor.isHorizontalCenter(anchor)) {
        anchorStr = "middle";
    }
    if (jsfc.TextAnchor.isRight(anchor)) {
        anchorStr = "end";
    }
    t.setAttribute("text-anchor", anchorStr);
    var adj = this._font.size;
    if (jsfc.TextAnchor.isBottom(anchor)) {
        adj = 0;
    } else if (jsfc.TextAnchor.isHalfHeight(anchor)) {
        adj = this._font.size / 2;
    }
    t.setAttribute("y", this._geomDP(y + adj));
    this.append(t);
    return this.textDim(text);
};

/**
 * Draws a string at (x, y) rotated by 'angle' radians.
 * 
 * @param {!string} text  the text to draw (null not permitted).
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @param {!number} anchor  the text anchor point (null not permitted).
 * @param {!number} angle  the rotation angle (in radians).
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.drawRotatedString = function(text, x, y, anchor, 
        angle) {
    //context.save(); TODO save and restore
    this.translate(x, y);
    this.rotate(angle);
    this.drawAlignedString(text, 0, 0, anchor);
    this.rotate(-angle);
    this.translate(-x, -y);
    //context.restore();
};

jsfc.SVGContext2D.prototype._geomDP = function(x) {
    return x.toFixed(3);
};

/**
 * Begins a new path.  The path can be defined using moveTo(), lineTo(), arc(),
 * arcTo() and closePath().  A defined path can be filled (see the fill()
 * method) or stroked (see the stroke() method).
 * 
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.beginPath = function() {
    this._pathStr = "";
};

/**
 * Closes the current path.
 * 
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.closePath = function() {
    this._pathStr = this._pathStr + "Z";  
};

/**
 * Moves to the point (x, y).
 * 
 * @param {!number} x  the x-coordinate of the destination point.
 * @param {!number} y  the y-coordinate of the destination point.
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.moveTo = function(x, y) {
    this._pathStr = this._pathStr + "M " + this._geomDP(x) + " " 
            + this._geomDP(y);
};

/**
 * Adds a line to the current path connecting the most recent point in the 
 * path to the destination point (x, y).
 * 
 * @param {!number} x  the x-coordinate of the destination point.
 * @param {!number} y  the y-coordinate of the destination point.
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.lineTo = function(x, y) {
    this._pathStr = this._pathStr + "L " + this._geomDP(x) + " " 
            + this._geomDP(y);
};

/**
 * Adds an arc to the path.
 * 
 * @param {!number} cx
 * @param {!number} cy
 * @param {!number} r
 * @param {!number} startAngle
 * @param {!number} endAngle
 * @param {!number} counterclockwise
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.arc = function(cx, cy, r, startAngle, endAngle, 
        counterclockwise) {
  // move to arc start point
  // arc
};

/**
 * 
 * @param {!number} x1
 * @param {!number} y1
 * @param {!number} x2
 * @param {!number} y2
 * @param {!number} radius
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.arcTo = function(x1, y1, x2, y2, radius) {
    // x0, y0 is implicitly the current point
};

/**
 * Fills the current path with the current fill color.
 * 
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.fill = function() {
    // TODO fill the current path    
};

/**
 * Draws an outline of the current path.
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.stroke = function() {
    var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    path.setAttribute("style", this._stroke.getStyleStr());
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "red");
    path.setAttribute("d", this._pathStr);
    this.append(path);
};

/**
 * Applies a translation.
 * 
 * @param {!number} dx  the translation along the x-axis.
 * @param {!number} dy  the translation along the y-axis.
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.translate = function(dx, dy) {
    this._transform.translate(dx, dy);
};

/**
 * Applies a rotation about (0, 0).
 * @param {!number} radians  the rotation angle in radians.
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype.rotate = function(radians) {
    this._transform.rotate(radians);
};

/**
 * Returns an SVG transform string for the current transform.
 * @returns {string}
 */
jsfc.SVGContext2D.prototype._svgTransformStr = function() {
    var t = this._transform;
    var s = "matrix(" + this._geomDP(t.scaleX) + "," 
            + this._geomDP(t.shearY) + "," 
            + this._geomDP(t.shearX) + "," 
            + this._geomDP(t.scaleY) + "," 
            + this._geomDP(t.translateX) + "," 
            + this._geomDP(t.translateY) + ")";
    return s;
};

/**
 * Returns the dimensions of the specified text in the current font.  To 
 * find this, the text is added to a hidden element in the DOM.
 * 
 * @param {!string} text  the text.
 * @returns {!jsfc.Dimension}
 */
jsfc.SVGContext2D.prototype.textDim = function(text) {
    if (arguments.length !== 1) {
        throw new Error("Too many arguments.");
    }
    var svgText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    svgText.setAttribute('style', this._font.styleStr());
    svgText.textContent = text;
    this._hiddenGroup.appendChild(svgText);
    var bbox = svgText.getBBox();
    var dim = new jsfc.Dimension(bbox.width, bbox.height);
    if (bbox.width == 0 && bbox.height == 0 && text.length > 0) {
    	//IE bug, try to get dimensions differently
    	var h = svgText.scrollHeight;
    	if (h == 0) {
    		h = this.font.size;
    	}
    	dim = new jsfc.Dimension(svgText.scrollWidth, h);
    }
    this._hiddenGroup.removeChild(svgText);
    return dim;  
};

/**
 * Returns an SVG rect element (dimensions only, no styling).
 * 
 * @param {!jsfc.Rectangle} rect  the rectangle (null not permitted).
 * 
 * @returns {Element} The new rect element.
 */
jsfc.SVGContext2D.prototype._createRectElement = function(rect) {
   jsfc.Args.require(rect, "rect");
   var r = this.element("rect");
   r.setAttribute("x", rect.minX());
   r.setAttribute("y", rect.minY());
   r.setAttribute("width", rect.width());
   r.setAttribute("height", rect.height());
   return r;
};

/**
 * Sets the attributes for the specified element based on the current hint
 * settings.
 * 
 * @param {Element} element
 * @returns {undefined}
 */
jsfc.SVGContext2D.prototype._setAttributesFromHints = function(element) {
    var pe = this.getHint("pointer-events");
    if (pe) {
        element.setAttribute("pointer-events", pe);
    }
};

    