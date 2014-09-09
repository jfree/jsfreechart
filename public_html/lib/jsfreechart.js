"use strict";

/**
 * @namespace
 */
var jsfc = {};

jsfc.JSFreeChart = { version: "0.5" };

/**
 * General utility functions.
 * @namespace
 */
jsfc.Utils = {};

/**
 * Creates an array of the specified length, with each element in the array
 * initialised to the specified value.
 * 
 * @param {*} value
 * @param {number} length
 * @returns {Array}
 */
jsfc.Utils.makeArrayOf = function(value, length) {
    var arr = [], i = length;
    while (i--) {
        arr[i] = value;
    }
    return arr;
};

/**
 * Returns the index of the first item in array for which the matcher function
 * returns true, or -1 if there is no match.
 * 
 * @param {Array} items  an array
 * @param {function(*, number)} matcher  a matching function (receives the array item and the array index as parameters), should return true or false.

 * @returns {number}  The index of the first item that matches, or -1.
 */
jsfc.Utils.findInArray = function(items, matcher) {
    var length = items.length;
    for (var i = 0; i < length; i++) {
        if (matcher(items[i], i)) {
            return i;
        }
    }
    return -1;
};

/**
 * Returns the index of an item within an array.
 * 
 * @param {*} item  the item.
 * @param {Array} arr  the array.
 * @returns {!number} The index of the item, or -1 if the item is not present
 *     in the array.
 */
jsfc.Utils.findItemInArray = function(item, arr) {
    return jsfc.Utils.findInArray(arr, function(x, i) {
        return x === item; 
    });
};


/**
 * A set of functions used to perform general argument checking.
 * @namespace
 */
jsfc.Args = {};

/**
 * Throws an error if the argument is undefined.
 * 
 * @param {*} arg  the argument.
 * @param {string} label  the argument name (displayed in the error message).
 * @returns {Object} This object (for chaining method calls).
 */
jsfc.Args.require = function(arg, label) {
    if (arg === null) {
        throw new Error("Require argument '" + label + "' to be specified.");
    }
    return jsfc.Args;
};

/**
 * Throws an error if the argument is not a number.
 * 
 * @param {*} arg  the argument.
 * @param {string} label  the argument name (displayed in the error message).
 * @returns {Object} This object (for chaining method calls).
 */
jsfc.Args.requireNumber = function(arg, label) {
    if (typeof arg !== "number") {
        throw new Error("Require '" + label + "' to be a number.");
    }
    return jsfc.Args;
};

/**
 * Throws an error if the argument is not a finite positive number.
 * 
 * @param {*} arg  the argument.
 * @param {string} label  the argument name (displayed in the error message).
 * @returns {Object} This object (for chaining method calls).
 */
jsfc.Args.requireFinitePositiveNumber = function(arg, label) {
    if (typeof arg !== "number" || arg <= 0) {
        throw new Error("Require '" + label + "' to be a positive number.");
    }
    return jsfc.Args;
};

/**
 * Checks that a number is in a required range (inclusive of the end points).
 * 
 * @param {!number} arg  the argument.
 * @param {!string} label  the label (used for the error message, if required).
 * @param {!number} min  the minimum permitted value.
 * @param {!number} max  the maximum permitted value.
 * @returns This object for chaining function calls.
 */
jsfc.Args.requireInRange = function(arg, label, min, max) {
    jsfc.Args.requireNumber(arg, label);
    if (arg < min || arg > max) {
        throw new Error("Require '" + label + "' to be in the range " + min 
                + " to " + max);
    }
    return jsfc.Args;
};

/**
 * Throws an error if the argument is not a string.
 * 
 * @param {*} arg  the argument.
 * @param {string} label  the argument name (displayed in the error message).
 * @returns {Object} This object (for chaining method calls).
 */
jsfc.Args.requireString = function(arg, label) {
    if (typeof arg !== "string") {
        throw new Error("Require '" + label + "' to be a string.");
    }
    return jsfc.Args;
};

/**
 * Throws an error if the argument is not a KeyedValuesDataset.
 * @param {*} arg  the argument.
 * @param {string} label  the argument name (used in the error message).
 * @returns {Object} This object (for chaining method calls).
 */
jsfc.Args.requireKeyedValuesDataset = function(arg, label) {
    if (!(arg instanceof jsfc.KeyedValuesDataset)) {
        throw new Error("Require '" + label 
                + "' to be an requireKeyedValuesDataset.");
    }
    return jsfc.Args;
};

/**
 * Throws an error if the argument is not a KeyedValues2DDataset.
 * @param {*} arg  the argument.
 * @param {string} label  the argument name (used in the error message).
 * @returns {Object} This object (for chaining method calls).
 */
jsfc.Args.requireKeyedValues2DDataset = function(arg, label) {
    if (!(arg instanceof jsfc.KeyedValues2DDataset)) {
        throw new Error("Require '" + label + "' to be a KeyedValues2DDataset.");
    }
    return jsfc.Args;
};

/**
 * Throws an error if the argument is not an XYDataset.
 * @param {*} arg
 * @param {string} label
 * @returns {Object} This object (for chaining method calls).
 */
jsfc.Args.requireXYDataset = function(arg, label) {
    //    FIXME: we'll support arbitrary implementations of the XYDataset interface
    //    so we need a way to test that the argument is really implementing this
    //    (or maybe give up trying to validate this)
//    if (!(arg instanceof jsfc.XYDataset)) {
//        throw new Error("Require '" + label + "' to be an XYDataset.");
//    }
    return jsfc.Args;
};

/**
 * Creates a new instance.
 * @class A formatter that converts a number into a string that shows the
 * date/time, based on the assumption that the numerical value is a count of 
 * the milliseconds elapsed since 1-Jan-1970.  The current implementation is
 * "quick and dirty". 
 * 
 * @constructor
 * @implements {jsfc.Format}
 * @param {string} [style] the format style (optional, defaults to 
 *     'd-mmm-yyyy').
 * @returns {jsfc.DateFormat} The new formatter.
 */
jsfc.DateFormat = function(style) {
    this._date = new Date();
    this._style = style || "d-mmm-yyyy";
    this._months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", 
            "Sep", "Oct", "Nov", "Dec"];
};

/**
 * Returns a formatted version of the supplied number based on the current
 * configuration of this instance.
 * 
 * @param {number} n  the number to format.
 * @returns {!string} A string containing the formatted number.
 */
jsfc.DateFormat.prototype.format = function(n) {
    jsfc.Args.requireNumber(n, "n");
    this._date.setTime(n);
    if (this._style === "yyyy") {
        return this._dateToYYYY(this._date);
    }
    if (this._style === "mmm-yyyy") {
        return this._dateToMMMYYYY(this._date);
    }
    return this._date.toDateString();  
};

/**
 * Returns the full year for the specified date.
 * 
 * @param {!Date} date  the date (null not permitted).
 * @returns {!string}
 */
jsfc.DateFormat.prototype._dateToYYYY = function(date) {
    var y = date.getFullYear();
    return y + "";
};

/**
 * Returns a mmm-YYYY string for the specified date.
 * 
 * @param {!Date} date  the date (null not permitted).
 * @returns {!string}
 */
jsfc.DateFormat.prototype._dateToMMMYYYY = function(date) {
    var m = date.getMonth();
    var y = date.getFullYear();
    return this._months[m] + "-" + y;
};
/**
 * @interface
 */
jsfc.Format = function() {
    throw new Error("Documents an interface only.");
};

/**
 * Returns a formatted version of the supplied number.
 * 
 * @param {!number} n  the number to format.
 * @returns {!string} A string representing the formatted number.
 */
jsfc.Format.prototype.format = function(n) {
};


/**
 * @constructor
 * @implements {jsfc.Format}
 * @param {base} base  the log base.
 * @param {string} [baseStr]  a string to show in place of the base value.
 * @returns {!jsfc.LogFormat}
 */
jsfc.LogFormat = function(base, baseStr) {
    if (!(this instanceof jsfc.LogFormat)) {
        throw new Error("Use 'new' for construction.");
    }    
    this._base = base;
    this._baseStr = baseStr || base + "";
};

/**
 * Returns a formatted version of the supplied number based on the current
 * configuration of this instance.
 * 
 * @param {number} n  the number to format.
 * @returns {!string} A string containing the formatted number.
 */
jsfc.LogFormat.prototype.format = function(n) {
    jsfc.Args.requireNumber(n, "n");
    var log = Math.log(n) / Math.log(this._base);
    return this._baseStr + "^" + log.toFixed(2);
};

/**
 * Creates a new number formatter.
 * 
 * @constructor
 * @implements {jsfc.Format}
 * @param {!number} dp  the number of decimal places.
 * @param {boolean} [exponential]  show in exponential format (defaults to 
 *         false).
 * @returns {!jsfc.NumberFormat}
 */
jsfc.NumberFormat = function(dp, exponential) {
    if (!(this instanceof jsfc.NumberFormat)) {
        throw new Error("Use 'new' for construction.");
    }    
    this._dp = dp;
    this._exponential = exponential || false;
};

/**
 * Returns a formatted version of the supplied number based on the current
 * configuration of this instance.
 * 
 * @param {!number} n  the number to format.
 * @returns {!string} A string representing the formatted number.
 */
jsfc.NumberFormat.prototype.format = function(n) {
    jsfc.Args.requireNumber(n, "n");
    if (this._exponential) {
        return n.toExponential(this._dp);
    }
    if (this._dp === Number.POSITIVE_INFINITY) {
        return n.toString();
    }
    return n.toFixed(this._dp);  
};

/**
 * An enumeration of the standard reference points for a rectangle.
 * @type Object
 */
jsfc.RefPt2D = {
    
    TOP_LEFT: 1,
  
    /** The middle of a rectangle at the top. */
    TOP_CENTER: 2,
  
    /** The top-right corner of a rectangle. */
    TOP_RIGHT: 3,
  
    /** The middle of a rectangle at the left side. */
    CENTER_LEFT: 4,
  
    /** The center of a rectangle. */
    CENTER: 5,
  
    /** The middle of a rectangle at the right side. */
    CENTER_RIGHT: 6,
  
    /** The bottom-left corner of a rectangle. */
    BOTTOM_LEFT: 7, 
  
    /** The middle of a rectangle at the bottom. */
    BOTTOM_CENTER: 8,
  
    /** The bottom-right corner of a rectangle. */
    BOTTOM_RIGHT : 9,

    /**
     * Returns true if refpt is one of the left-side points and false otherwise.
     * 
     * @param {!number} refpt  the reference point.
     * @returns {boolean}
     */
    isLeft: function(refpt) {
        return refpt === jsfc.RefPt2D.TOP_LEFT 
                || refpt === jsfc.RefPt2D.CENTER_LEFT 
                || refpt === jsfc.RefPt2D.BOTTOM_LEFT;
    },
    
    /**
     * Returns true if refpt is one of the right-side points and false otherwise.
     * 
     * @param {!number} refpt  the reference point.
     * @returns {boolean}
     */
    isRight: function(refpt) {
        return refpt === jsfc.RefPt2D.TOP_RIGHT 
                || refpt === jsfc.RefPt2D.CENTER_RIGHT 
                || refpt === jsfc.RefPt2D.BOTTOM_RIGHT;
    },
    
    /**
     * Returns true if refpt is one of the top points and false otherwise.
     * 
     * @param {!number} refpt  the reference point.
     * @returns {boolean}
     */
    isTop: function(refpt) {
        return refpt === jsfc.RefPt2D.TOP_LEFT 
                || refpt === jsfc.RefPt2D.TOP_CENTER 
                || refpt === jsfc.RefPt2D.TOP_RIGHT;
    },
    
    /**
     * Returns true if refpt is one of the bottom points and false otherwise.
     * 
     * @param {!number} refpt  the reference point.
     * @returns {boolean}
     */
    isBottom: function(refpt) {
        return refpt === jsfc.RefPt2D.BOTTOM_LEFT 
                || refpt === jsfc.RefPt2D.BOTTOM_CENTER 
                || refpt === jsfc.RefPt2D.BOTTOM_RIGHT;
    },

    /**
     * Returns true if refpt is one of the center (horizontally) points and 
     * false otherwise.
     * 
     * @param {!number} refpt  the reference point.
     * @returns {boolean}
     */
    isHorizontalCenter: function(refpt) {
        return refpt === jsfc.RefPt2D.TOP_CENTER 
                || refpt === jsfc.RefPt2D.CENTER 
                || refpt === jsfc.RefPt2D.BOTTOM_CENTER;  
    },
    
    /**
     * Returns true if refpt is one of the center (vertically) points and 
     * false otherwise.
     * 
     * @param {!number} refpt  the reference point.
     * @returns {boolean}
     */
    isVerticalCenter: function(refpt) {
        return refpt === jsfc.RefPt2D.CENTER_LEFT 
                || refpt === jsfc.RefPt2D.CENTER 
                || refpt === jsfc.RefPt2D.CENTER_RIGHT;
    }
};

if (Object.freeze) {
    Object.freeze(jsfc.RefPt2D);
}
/**
 * Creates a new anchor.
 * 
 * @class An anchor point defined relative to a rectangle in two-dimensional 
 * space (the point coordinates can be resolved once a concrete rectangle is 
 * provided).
 * @constructor 
 * @param {!number} refpt  the reference point on the rectangle.
 * @param {jsfc.Offset2D} [offset]  the offset to the rectangle (positive 
 *     deltas move to the interior of the rectangle).  If this argument is
 *     not supplied, it defaults to a zero offset.
 * @returns {jsfc.Anchor2D}
 */
jsfc.Anchor2D = function(refpt, offset) {
    if (!(this instanceof jsfc.Anchor2D)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.Args.requireNumber(refpt, "refpt"); 
    this._refpt = refpt;
    this._offset = offset || new jsfc.Offset2D(0, 0);
};

/**
 * Returns the reference point for the anchor (one of the numerical 
 * constants defined in jsfc.RefPt2D).
 * 
 * @return {number}
 */
jsfc.Anchor2D.prototype.refPt = function() {
    return this._refpt;
};
    
/**
 * Returns the offset for the anchor.
 * 
 * @returns {jsfc.Offset2D}
 */
jsfc.Anchor2D.prototype.offset = function() {
    return this._offset;
};

/**
 * Returns a Point2D that is the anchor point for the supplied rectangle.
 * @param {jsfc.Rectangle} rect  the reference rectangle.
 * @returns {jsfc.Point2D}
 */
jsfc.Anchor2D.prototype.anchorPoint = function(rect) {
    var x = 0.0;
    var y = 0.0;
    if (jsfc.RefPt2D.isLeft(this._refpt)) {
        x = rect.x() + this._offset.dx();
    } else if (jsfc.RefPt2D.isHorizontalCenter(this._refpt)) {
        x = rect.centerX();
    } else if (jsfc.RefPt2D.isRight(this._refpt)) {
        x = rect.maxX() - this._offset.dx();
    }
    if (jsfc.RefPt2D.isTop(this._refpt)) {
        y = rect.minY() + this._offset.dy();
    } else if (jsfc.RefPt2D.isVerticalCenter(this._refpt)) {
        y = rect.centerY();
    } else if (jsfc.RefPt2D.isBottom(this._refpt)) {
        y = rect.maxY() - this._offset.dy();
    }
    return new jsfc.Point2D(x, y);
};
"use strict";

/**
 * Creates a new shape.  The Shape class should provide a mechanism for drawing
 * to a 2D context (and in addition it should detect the SVGContext2D and 
 * add circle elements for circles).
 * @interface
 */
jsfc.Shape = function() {
};

/**
 * Returns the bounds for this shape.
 * 
 * @returns {jsfc.Rectangle} The bounds.
 */
jsfc.Shape.prototype.bounds = function() {
};


"use strict";

/**
 * Creates a new circle.
 * @constructor 
 * @implements {jsfc.Shape}
 * @param {number} x  the x-coordinate.
 * @param {number} y  the y-coordinate.
 * @param {number} radius  the radius.
 * @returns {jsfc.Circle}
 * 
 * @class Represents a circle shape.
 */
jsfc.Circle = function(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
};

/**
 * Returns the bounds for this shape.
 * 
 * @returns {jsfc.Rectangle} The bounds.
 */
jsfc.Circle.prototype.bounds = function() {
    return new jsfc.Rectangle(this.x - this.radius, this.y - this.radius, 
        this.radius * 2, this.radius * 2);
};
"use strict";

/**
 * Creates a new color.
 * @class Represents a color with red, green, blue and alpha components.
 * Color instances are intended to be immutable so that they can be shared
 * (for example, the jsfc.Colors class contains some predefined colors) - do 
 * not modify existing instances.
 * 
 * @constructor
 * @param {number} red  the red component (0-255).
 * @param {number} green  the green component (0-255).
 * @param {number} blue  the blue component (0-255).
 * @param {number} [alpha]  the alpha component (0-255), defaults to 255.
 * 
 * @returns {undefined}
 */
jsfc.Color = function(red, green, blue, alpha) {
    if (!(this instanceof jsfc.Color)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.Args.requireInRange(red, "red", 0, 255);
    this._red = red;
    this._green = green;
    this._blue = blue;
    this._alpha = alpha === 0 ? 0 : alpha || 255;
};

/**
 * Returns the red component for the color.
 * @returns {number} The red component (in the range 0 to 255). 
 */
jsfc.Color.prototype.getRed = function() {
    return this._red;
};

/**
 * Returns the green component for the color.
 * @returns {number} The green component (in the range 0 to 255).
 */
jsfc.Color.prototype.getGreen = function() {
    return this._green;
};

/**
 * Returns the blue component for the color.
 * @returns {number} The blue component (in the range 0 to 255).
 */
jsfc.Color.prototype.getBlue = function() {
    return this._blue;
};

/**
 * Returns the alpha (transparency) component for the color.
 * @returns {number} The alpha component (in the range 0 to 255).
 */
jsfc.Color.prototype.getAlpha = function() {
    return this._alpha;
};

/**
 * Creates a new color instance from a string.
 * @param {!string} s  the string.
 * @returns {jsfc.Color|undefined}
 */
jsfc.Color.fromStr = function(s) {
    if (s.length === 4) {
        // #RGB
        var rr = s[1] + s[1];
        var gg = s[2] + s[2];
        var bb = s[3] + s[3];
        var r = parseInt(rr, 16);
        var g = parseInt(gg, 16);
        var b = parseInt(bb, 16);
        return new jsfc.Color(r, g, b);
    } 
    if (s.length === 7) {
        // #RRGGBB 
        var rr = s[1] + s[2];
        var gg = s[3] + s[4];
        var bb = s[5] + s[6];
        var r = parseInt(rr, 16);
        var g = parseInt(gg, 16);
        var b = parseInt(bb, 16);
        return new jsfc.Color(r, g, b);
    }
    return undefined;
};

/**
 * Returns a string in the form 'rgba(RGBA)' that represents this color.
 * 
 * @returns {!string}
 */
jsfc.Color.prototype.rgbaStr = function() {
    var alphaPercent = this._alpha / 255;
    return "rgba(" + this._red + "," + this._green + "," + this._blue
        + "," + alphaPercent.toFixed(2) + ")";    
};

/**
 * Returns a string in the form 'rgba(RGBA)' that represents this color.
 * 
 * @returns {!string}
 */
jsfc.Color.prototype.rgbStr = function() {
    return "rgb(" + this._red + "," + this._green + "," + this._blue + ")";    
};

/** 
 * Creates a new font instance.
 * 
 * @classdesc A font represents the font style used to draw text.
 * 
 * @constructor
 * @param {!string} family  the font family.
 * @param {!number} size  the size.
 * @param {boolean} [bold]  bold?
 * @param {boolean} [italic]  italic?
 * @returns {jsfc.Font} The new instance.
 */
jsfc.Font = function(family, size, bold, italic) {
    if (!(this instanceof jsfc.Font)) {
        throw new Error("Use 'new' for constructors.");
    }
    this.family = family;
    this.size = size;
    this.bold = bold || false;
    this.italic = italic || false;
};

/**
 * Returns a font style string derived from this font's settings.
 * 
 * @returns {string} The style string.
 */
jsfc.Font.prototype.styleStr = function() {
    var s = "font-family: " + this.family + "; ";
    s += "font-weight: " + (this.bold ? "bold" : "normal") + "; ";
    s += "font-style: " + (this.italic ? "italic" : "normal") + "; ";
    s += "font-size: " + this.size + "px";
    return s;
};

/**
 * Returns a font style string for use with an HTML5 Canvas context.
 * 
 * @returns {!string} The style string.
 */
jsfc.Font.prototype.canvasFontStr = function() {
    return this.size + "px " + this.family;
};
/**
 * @classdesc A base class for graphics context implementations.
 * @constructor
 * @param {jsfc.BaseContext2D} [instance] The instance object (optional).
 */
jsfc.BaseContext2D = function(instance) {
    if (!(this instanceof jsfc.BaseContext2D)) {
        throw new Error("Use 'new' for construction.");
    }
    if (!instance) {
        instance = this;
    }
    jsfc.BaseContext2D.init(instance);
};

/**
 * Initialises the attributes for an instance.
 * 
 * @param {!jsfc.BaseContext2D} instance  the instance.
 * @returns {undefined}
 */
jsfc.BaseContext2D.init = function(instance) {
    instance._hints = {};
    instance._lineColor = new jsfc.Color(255, 255, 255);
    instance._fillColor = new jsfc.Color(255, 0, 0);
    instance._font = new jsfc.Font("serif", 12);
};

/**
 * Returns the value of the rendering hint with the specified key.
 * @param {!string} key  the hint key.
 * @returns {*} The hint value.
 */
jsfc.BaseContext2D.prototype.getHint = function(key) {
    return this._hints[key];
};

/**
 * Sets a rendering hint.
 * 
 * @param {!string} key  the hint key.
 * @param {*} value  the hint value.
 * @returns {undefined}
 */
jsfc.BaseContext2D.prototype.setHint = function(key, value) {
    this._hints[key] = value;  
};

/**
 * Clears the rendering hints.
 * 
 * @returns {undefined}
 */
jsfc.BaseContext2D.prototype.clearHints = function() {
    this._hints = {};
};

/**
 * Sets the line stroke.
 * 
 * @param {!jsfc.Stroke} stroke  the line stroke.
 * @returns {undefined}
 */
jsfc.BaseContext2D.prototype.setLineStroke = function(stroke) {
    jsfc.Args.require(stroke, "stroke");
    this._stroke = stroke;  
};

/**
 * Sets the line color.
 * 
 * @param {!jsfc.Color} color  the color.
 * @returns {undefined}
 */
jsfc.BaseContext2D.prototype.setLineColor = function(color) {
    jsfc.Args.require(color, "color");
    this._lineColor = color;
};

/**
 * Sets the fill color.
 * 
 * @param {!jsfc.Color} color  the fill color (null not permitted).
 * @returns {undefined}
 */
jsfc.BaseContext2D.prototype.setFillColor = function(color) {
    jsfc.Args.require(color, "color");
    this._fillColor = color;
};

/**
 * Returns the font.  The default value is jsfc.Font("serif", 12).

 * @returns {jsfc.Font|!jsfc.Font}
 */
jsfc.BaseContext2D.prototype.getFont = function() {
    return this._font;    
};

/**
 * Sets the font used for text rendering.
 * 
 * @param {!jsfc.Font} font  the font.
 * @returns {undefined}
 */
jsfc.BaseContext2D.prototype.setFont = function(font) {
    this._font = font;
};

/**
 * Sets the clip.
 * @returns {undefined}
 */
jsfc.BaseContext2D.prototype.setClip = function(rect) {  
    // not currently supported
};

jsfc.BaseContext2D.prototype.save = function() {  
    // not currently supported
};

jsfc.BaseContext2D.prototype.restore = function() {  
    // not currently supported
};


/**
 * Creates a new graphics context that targets the HTML5 canvas element.
 * @constructor
 * @implements {jsfc.Context2D}
 * @param {Element} canvas
 * @returns {jsfc.CanvasContext2D}
 */
jsfc.CanvasContext2D = function(canvas) {
    if (!(this instanceof jsfc.CanvasContext2D)) {
        throw new Error("Use 'new' with constructor.");
    }
    jsfc.BaseContext2D.init(this);
    this._canvas = canvas;
    this._ctx = canvas.getContext("2d");
};

jsfc.CanvasContext2D.prototype = new jsfc.BaseContext2D();

jsfc.CanvasContext2D.prototype.clear = function() {
    var w = this._canvas.width;
    var h = this._canvas.height;
    //this._ctx.fillStyle = "#FFFFFF";
    this._ctx.clearRect(0, 0, w, h);
};

/**
 * Sets the fill color.
 * 
 * @param {!jsfc.Color} color  the fill color (null not permitted).
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.setFillColor = function(color) {
    jsfc.BaseContext2D.prototype.setFillColor.call(this, color);
    this._ctx.fillStyle = color.rgbaStr();
};

/**
 * Sets the line color.
 * 
 * @param {!jsfc.Color} color  the line color.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.setLineColor = function(color) {
    jsfc.BaseContext2D.prototype.setLineColor.call(this, color);
    this._ctx.lineStyle = color.rgbaStr();
};

/**
 * Sets the line stroke.
 * 
 * @param {!jsfc.Stroke} stroke  the line stroke.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.setLineStroke = function(stroke) {
    jsfc.BaseContext2D.prototype.setLineStroke.call(this, stroke);
    this._ctx.lineWidth = stroke.lineWidth;  
    this._ctx.lineCap = stroke.lineCap;
    this._ctx.lineJoin = stroke.lineJoin;
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
jsfc.CanvasContext2D.prototype.drawLine = function(x0, y0, x1, y1) {
    this._ctx.beginPath();
    this._ctx.moveTo(x0, y0);
    this._ctx.lineTo(x1, y1);
    this._ctx.stroke();
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
jsfc.CanvasContext2D.prototype.drawRect = function(x, y, w, h) {
    this._ctx.fillRect(x, y, w, h);
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
jsfc.CanvasContext2D.prototype.fillRect = function(x, y, width, height) {
    this._ctx.fillRect(x, y, width, height);
};

/**
 * Draws a circle.
 * 
 * @param {!number} cx  the x-coordinate for the center point.
 * @param {!number} cy  the y-coordinate for the center point.
 * @param {!number} r  the radius.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.drawCircle = function(cx, cy, r) {
    this._ctx.beginPath();
    this._ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this._ctx.fill();
    this._ctx.stroke();
};

/**
 * Begins a new path.  The path can be defined using moveTo(), lineTo(), arc(),
 * arcTo() and closePath().  A defined path can be filled (see the fill()
 * method) or stroked (see the stroke() method).
 * 
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.beginPath = function() {
    this._ctx.beginPath();
};

/**
 * Closes the current path.
 * 
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.closePath = function() {
    this._ctx.closePath();
};

/**
 * Moves to the point (x, y).
 * 
 * @param {!number} x  the x-coordinate of the destination point.
 * @param {!number} y  the y-coordinate of the destination point.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.moveTo = function(x, y) {
    this._ctx.moveTo(x, y);
};

/**
 * Adds a line to the current path connecting the most recent point in the 
 * path to the destination point (x, y).
 * 
 * @param {!number} x  the x-coordinate of the destination point.
 * @param {!number} y  the y-coordinate of the destination point.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.lineTo = function(x, y) {
    this._ctx.lineTo(x, y);
};

// FIXME: arc methods

/**
 * Fills the current path with the current fill color.
 * 
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.fill = function() {
    this._ctx.fill();
};

/**
 * Draws an outline of the current path.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.stroke = function() {
    this._ctx.stroke();
};

/**
 * Sets the font used for text rendering.
 * 
 * @param {!jsfc.Font} font  the font.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.setFont = function(font) {
    this._font = font;
    this._ctx.font = font.canvasFontStr();
};

/**
 * Returns the dimensions of the specified text in the current font.
 * 
 * @param {!string} text  the text.
 * @returns {!jsfc.Dimension} The dimensions of the bounding rectangle for the 
 *     text.
 */
jsfc.CanvasContext2D.prototype.textDim = function(text) {
    var w = this._ctx.measureText(text).width;
    return new jsfc.Dimension(w, this._font.size); 
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
jsfc.CanvasContext2D.prototype.drawString = function(text, x, y) {
    this._ctx.fillText(text, x, y);
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
jsfc.CanvasContext2D.prototype.drawAlignedString = function(text, x, y, anchor) {
    var dim = this.textDim(text);
    var xadj = 0;
    var yadj = this._font.size;
    if (jsfc.TextAnchor.isHorizontalCenter(anchor)) {
        xadj = -dim.width() / 2;
    } else if (jsfc.TextAnchor.isRight(anchor)) {
        xadj = -dim.width();
    }
    if (jsfc.TextAnchor.isBottom(anchor)) {
        yadj = 0;
    } else if (jsfc.TextAnchor.isHalfHeight(anchor)) {
        yadj = this._font.size / 2;
    }
    this._ctx.fillText(text, x + xadj, y + yadj);
    return dim;
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
jsfc.CanvasContext2D.prototype.drawRotatedString = function(text, x, y, anchor, 
        angle) {
    this.translate(x, y);
    this.rotate(angle);
    this.drawAlignedString(text, 0, 0, anchor);
    this.rotate(-angle);
    this.translate(-x, -y);
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
jsfc.CanvasContext2D.prototype.fillText = function(text, x, y, maxWidth) {
    this._ctx.fillText(text, x, y);
};


jsfc.CanvasContext2D.prototype.beginGroup = function(classStr) {
    
};

jsfc.CanvasContext2D.prototype.endGroup = function() {
    
};

/**
 * Applies a translation.
 * 
 * @param {!number} dx  the translation along the x-axis.
 * @param {!number} dy  the translation along the y-axis.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.translate = function(dx, dy) {
    this._ctx.translate(dx, dy);
};

/**
 * Applies a rotation about (0, 0).
 * @param {!number} radians  the rotation angle in radians.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.rotate = function(radians) {
    this._ctx.rotate(radians);
};

/**
 * Sets the clip.
 * @returns {undefined}
 */
jsfc.CanvasContext2D.prototype.setClip = function(rect) {  
    this._ctx.beginPath();
    this._ctx.rect(rect.x(), rect.y(), rect.width(), rect.height());
    this._ctx.clip();
};

jsfc.CanvasContext2D.prototype.save = function() {  
    this._ctx.save();
};

jsfc.CanvasContext2D.prototype.restore = function() {  
    this._ctx.restore();
};
"use strict";

/**
 * @interface
 */
jsfc.Context2D = function() {
};

/**
 * Returns the value of the rendering hint with the specified key.
 * @param {!string} key  the hint key.
 * @returns {*} The hint value.
 */
jsfc.Context2D.prototype.getHint = function(key) {
};

/**
 * Sets a rendering hint.
 * 
 * @param {!string} key  the hint key.
 * @param {*} value  the hint value.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.setHint = function(key, value) {    
};

/**
 * Clears all rendering hints.
 * 
 * @returns {undefined}
 */
jsfc.Context2D.prototype.clearHints = function() {
};

/**
 * Sets the line stroke.
 * 
 * @param {!jsfc.Stroke} stroke  the line stroke.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.setLineStroke = function(stroke) {
};

/**
 * Sets the line color.
 * 
 * @param {!jsfc.Color} color  the color.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.setLineColor = function(color) {
};

/**
 * Sets the fill color.
 * 
 * @param {!jsfc.Color} color  the fill color (null not permitted).
 * @returns {undefined}
 */
jsfc.Context2D.prototype.setFillColor = function(color) {
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
jsfc.Context2D.prototype.drawLine = function(x0, y0, x1, y1) {
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
jsfc.Context2D.prototype.drawRect = function(x, y, w, h) {
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
jsfc.Context2D.prototype.fillRect = function(x, y, width, height) {
};

/**
 * Draws a circle.
 * 
 * @param {!number} cx  the x-coordinate for the center point.
 * @param {!number} cy  the y-coordinate for the center point.
 * @param {!number} r  the radius.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.drawCircle = function(cx, cy, r) {
};

/**
 * Begins a new path.  The path can be defined using moveTo(), lineTo(), arc(),
 * arcTo() and closePath().  A defined path can be filled (see the fill()
 * method) or stroked (see the stroke() method).
 * 
 * @returns {undefined}
 */
jsfc.Context2D.prototype.beginPath = function() {
};

/**
 * Closes the current path.
 * 
 * @returns {undefined}
 */
jsfc.Context2D.prototype.closePath = function() {
};

/**
 * Moves to the point (x, y).
 * 
 * @param {!number} x  the x-coordinate of the destination point.
 * @param {!number} y  the y-coordinate of the destination point.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.moveTo = function(x, y) {
};

/**
 * Adds a line to the current path connecting the most recent point in the 
 * path to the destination point (x, y).
 * 
 * @param {!number} x  the x-coordinate of the destination point.
 * @param {!number} y  the y-coordinate of the destination point.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.lineTo = function(x, y) {
};

// FIXME: arc methods

/**
 * Fills the current path with the current fill color.
 * 
 * @returns {undefined}
 */
jsfc.Context2D.prototype.fill = function() {
};

/**
 * Draws an outline of the current path.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.stroke = function() {
};

/**
 * Returns the font.  The default value is jsfc.Font("serif", 12).
 *
 * @returns {jsfc.Font|!jsfc.Font}
 */
jsfc.Context2D.prototype.getFont = function() { 
};

/**
 * Sets the font used for text rendering.
 * 
 * @param {!jsfc.Font} font  the font.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.setFont = function(font) {
};

/**
 * Returns the dimensions of the specified text in the current font.
 * 
 * @param {!string} text  the text.
 * @returns {!jsfc.Dimension} The dimensions of the bounding rectangle for the 
 *     text.
 */
jsfc.Context2D.prototype.textDim = function(text) {  
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
jsfc.Context2D.prototype.drawString = function(text, x, y) {
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
jsfc.Context2D.prototype.drawAlignedString = function(text, x, y, anchor) {
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
jsfc.Context2D.prototype.fillText = function(text, x, y, maxWidth) {
};

/**
 * Applies a translation.
 * 
 * @param {!number} dx  the translation along the x-axis.
 * @param {!number} dy  the translation along the y-axis.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.translate = function(dx, dy) {
};

/**
 * Applies a rotation about (0, 0).
 * @param {!number} radians  the rotation angle in radians.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.rotate = function(radians) {
};

/**
 * Begins a group with the specified class and (optional) clipping rectangle.
 * The caller is responsible for closing the group with a subsequent call to
 * endGroup().
 * 
 * @param {string} classStr  the class.
 *
 * @returns {undefined}
 */
jsfc.Context2D.prototype.beginGroup = function(classStr) {
};

/**
 * Ends a group that was previously started with a call to beginGroup().
 * @returns {undefined}
 */
jsfc.Context2D.prototype.endGroup = function() {
};

/**
 * Sets the clip.
 * @returns {undefined}
 */
jsfc.Context2D.prototype.setClip = function(rect) {  
};

jsfc.Context2D.prototype.save = function() {  
};

jsfc.Context2D.prototype.restore = function() {
};

"use strict";

/** 
 * Creates a new object representing the dimensions of a shape in 2D space.
 * Instances of this class are immutable.
 * 
 * @constructor 
 * @classdesc The dimensions of a shape in 2D space.  Instances are immutable.
 * @param {!number} w  the width.
 * @param {!number} h  the height.
 * @returns {jsfc.Dimension} The new instance.
 */
jsfc.Dimension = function(w, h) {
    if (!(this instanceof jsfc.Dimension)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.Args.requireNumber(w, "w");
    jsfc.Args.requireNumber(h, "h");
    this._width = w;
    this._height = h;
    Object.freeze(this);
};
    
/**
 * Returns the width that was set in the constructor.
 * 
 * @returns {!number} The width.
 */
jsfc.Dimension.prototype.width = function() {
    return this._width;
};
    
/**
 * Returns the height that was set in the constructor.
 * 
 * @returns {!number} The height.
 */
jsfc.Dimension.prototype.height = function() {
    return this._height;
};

/**
 * @class A utility object that fits a source rectangle into a target 
 *     rectangle with optional scaling.
 * 
 * @constructor
 * @param {jsfc.Anchor2D} anchor  the anchor point.
 * @param {number} [scale]  the scaling type (optional, defaults to NONE).
 * 
 * @returns {jsfc.Fit2D}
 */
jsfc.Fit2D = function(anchor, scale) {
    if (!(this instanceof jsfc.Fit2D)) {
        throw new Error("Use 'new' for constructor.");
    }
    this._anchor = anchor;
    this._scale = scale || jsfc.Scale2D.NONE;
};
    
/**
 * Returns the anchor used for the fitting.
 * 
 * @returns {jsfc.Anchor2D}
 */
jsfc.Fit2D.prototype.anchor = function() {
    return this._anchor;
};
   
/**
 * Returns the scaling type (constants defined in jsfc.Scale2D).
 * 
 * @returns {number}
 */
jsfc.Fit2D.prototype.scale = function() {
    return this._scale;
};
    
/**
 * Returns a new rectangle that is fitted to the target according to the
 * anchor and scale attributes of this fitter.
 * 
 * @param {!jsfc.Dimension} srcDim  the dimensions of the source rectangle.
 * @param {!jsfc.Rectangle} target  the target rectangle.
 * @returns {!jsfc.Rectangle} The rectangle.
 */
jsfc.Fit2D.prototype.fit = function(srcDim, target) {
    if (this._scale === jsfc.Scale2D.SCALE_BOTH) {
        return jsfc.Rectangle.copy(target);
    }
    var w = srcDim.width();
    if (this._scale === jsfc.Scale2D.SCALE_HORIZONTAL) {
        w = target.width();
        if (!jsfc.RefPt2D.isHorizontalCenter(this._anchor.refPt())) {
            w -= 2 * this._anchor.offset().dx();
        }
    }
    var h = srcDim.height();
    if (this._scale === jsfc.Scale2D.SCALE_VERTICAL) {
        h = target.height();
        if (!jsfc.RefPt2D.isVerticalCenter(this._anchor.refPt())) {
            h -= 2 * this._anchor.offset().dy();
        }
    }
    var pt = this._anchor.anchorPoint(target);
    var x = Number.NaN; 
    if (jsfc.RefPt2D.isLeft(this._anchor.refPt())) {
        x = pt.x();
    } else if (jsfc.RefPt2D.isHorizontalCenter(this._anchor.refPt())) {
        x = target.centerX() - w / 2;
    } else if (jsfc.RefPt2D.isRight(this._anchor.refPt())) {
        x = pt.x() - w;
    }
    var y = Number.NaN;
    if (jsfc.RefPt2D.isTop(this._anchor.refPt())) {
        y = pt.y();
    } else if (jsfc.RefPt2D.isVerticalCenter(this._anchor.refPt())) {
        y = target.centerY() - h / 2;
    } else if (jsfc.RefPt2D.isBottom(this._anchor.refPt())) {
        y = pt.y() - h;
    }
    return new jsfc.Rectangle(x, y, w, h);    
};

/**
 * Creates an returns a fitter that performs no scaling and fits a rectangle
 * to the given anchor point.
 * 
 * @param {!jsfc.RefPt2D} refPt  the anchor.
 * @returns {!jsfc.Fit2D} The fitter.
 */
jsfc.Fit2D.prototype.noScalingFitter = function(refPt) {
    var anchor = new jsfc.Anchor2D(refPt, new jsfc.Offset2D(0, 0));
    return new jsfc.Fit2D(anchor, jsfc.Scale2D.NONE);
};
jsfc.HAlign = {
    
    LEFT: 1,
    
    CENTER: 2,
    
    RIGHT: 3

};

if (Object.freeze) {
    Object.freeze(jsfc.HAlign);
}
"use strict";

/**
 * Creates a new object representing the insets for a rectangular 
 *         shape.
 *         
 * @classdesc The insets for a rectangular shape in 2D space.  Instances are
 *         immutable.
 * 
 * @constructor 
 * @param {!number} top  the insets for the top edge.
 * @param {!number} left  the insets for the left edge.
 * @param {!number} bottom  the insets for the bottom edge.
 * @param {!number} right  the insets for the right edge.
 * @returns {jsfc.Insets} The new instance.
 */
jsfc.Insets = function(top, left, bottom, right) {
    if (!(this instanceof jsfc.Insets)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.Args.requireNumber(top, "top");
    jsfc.Args.requireNumber(left, "left");
    jsfc.Args.requireNumber(bottom, "bottom");
    jsfc.Args.requireNumber(right, "right");
    this._top = top;
    this._left = left;
    this._bottom = bottom;
    this._right = right;
    Object.freeze(this);
};

/**
 * Returns the insets for the top edge.
 * @returns {!number} The top insets.
 */
jsfc.Insets.prototype.top = function() {
    return this._top;
};

/**
 * Returns the insets for the left edge.
 * @returns {!number} The left insets.
 */
jsfc.Insets.prototype.left = function() {
    return this._left;
};

/**
 * Returns the insets for the bottom edge.
 * @returns {!number} The bottom insets.
 */
jsfc.Insets.prototype.bottom = function() {
    return this._bottom;
};

/**
 * Returns the insets for the right edge.
 * @returns {!number} The right insets.
 */
jsfc.Insets.prototype.right = function() {
    return this._right;
};

/**
 * Returns the insets value for the specified edge (specified using the 
 * constants defined in jsfc.RectangleEdge).
 * 
 * @param {String} edge
 * @returns {!number} The insets value.
 */
jsfc.Insets.prototype.value = function(edge) {
    if (edge === jsfc.RectangleEdge.TOP) {
        return this._top;
    }
    if (edge === jsfc.RectangleEdge.BOTTOM) {
        return this._bottom;
    }
    if (edge === jsfc.RectangleEdge.LEFT) {
        return this._left;
    }
    if (edge === jsfc.RectangleEdge.RIGHT) {
        return this._right;
    }
    throw new Error("Unrecognised edge code: " + edge);
};

jsfc.LineCap = {
    
    BUTT: "butt",
    
    ROUND: "round",
    
    SQUARE: "square"

};

if (Object.freeze) {
    Object.freeze(jsfc.LineCap);
}
jsfc.LineJoin = {
    
    ROUND: "round",
    
    BEVEL: "bevel",
    
    MITER: "miter"

};

if (Object.freeze) {
    Object.freeze(jsfc.LineJoin);
}

"use strict";

/** 
 * Creates a new object representing an offset in 2D space. Instances are 
 * immutable.
 * 
 * @constructor 
 * @classdesc An offset in 2D space.  Instances are immutable.
 * @param {number} dx  the x-offset.
 * @param {number} dy  the y-offset.
 * @returns {jsfc.Offset2D} The new instance.
 */
jsfc.Offset2D = function(dx, dy) {
    if (!(this instanceof jsfc.Offset2D)) {
        throw new Error("Use 'new' for constructors.");
    }
    jsfc.Args.requireNumber(dx, "dx");
    jsfc.Args.requireNumber(dy, "dy");
    this._dx = dx;
    this._dy = dy;
    Object.freeze(this);
};
    
/**
 * Returns the x-offset that was set in the constructor.
 * 
 * @returns {number} The width.
 */
jsfc.Offset2D.prototype.dx = function() {
    return this._dx;
};
    
/**
 * Returns the y-offset that was set in the constructor.
 * 
 * @returns {number} The y-offset.
 */
jsfc.Offset2D.prototype.dy = function() {
    return this._dy;
};

"use strict";

/**
 * Creates a new instance.
 * @class Represents a point in two dimensional space.  Instances are immutable.
 * 
 * @constructor
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @returns {jsfc.Point2D}
 */
jsfc.Point2D = function(x, y) {
    if (!(this instanceof jsfc.Point2D)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.Args.requireNumber(x, "x");
    jsfc.Args.requireNumber(y, "y");
    this._x = x;
    this._y = y;
    Object.freeze(this);
};
    
/**
 * Returns the x-coordinate for this point.
 * 
 * @returns {number} The x-coordinate.
 */
jsfc.Point2D.prototype.x = function() {
    return this._x;
};
    
/**
 * Returns the y-coordinate for this point.
 * 
 * @returns {number} The y-coordinate.
 */
jsfc.Point2D.prototype.y = function() {
    return this._y;
};

/**
 * Returns the distance between this point and the point (x, y).
 * 
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @returns {!number} The distance.
 */
jsfc.Point2D.prototype.distance = function(x, y) {
    var dx = x - this._x;
    var dy = y - this._y;
    return Math.sqrt(dx * dx + dy * dy);
};

"use strict";

/**
 * Creates a new instance, initially with no vertices.
 * @class Represents a polygon in two dimensional space.  Note that this
 * object doesn't actually represent a polygon until at least three points
 * have been added.
 * 
 * @constructor
 * @returns {jsfc.Polygon}
 */
jsfc.Polygon = function() {
    if (!(this instanceof jsfc.Polygon)) {
        throw new Error("Use 'new' for constructor.");
    }
    this._vertices = [];
};

/**
 * Adds a vertex to the polygon.
 * @param {!jsfc.Point2D} pt  the new point.
 * @returns This polygon for method call chaining.
 */
jsfc.Polygon.prototype.add = function(pt) {
    this._vertices.push(pt);
    return this;
};

/**
 * Returns the number of vertices that have been added to the polygon.
 * 
 * @returns {!number} The vertex count.
 */
jsfc.Polygon.prototype.getVertexCount = function() {
    return this._vertices.length;
};

/**
 * Returns the vertex with the specified index. 
 * 
 * @param {!number} index  the index.
 * @returns {jsfc.Point2D} The vertex.
 */
jsfc.Polygon.prototype.getVertex = function(index) {
    return this._vertices[index];
};

/**
 * Returns the first vertex for the polygon (this is a convenience method).
 * 
 * @returns {jsfc.Point2D}
 */
jsfc.Polygon.prototype.getFirstVertex = function() {
    if (this._vertices.length > 0) {
        return this._vertices[0];
    }
    return null;
};

/**
 * Returns the last vertex for the polygon (this is a convenience method).
 * 
 * @returns {jsfc.Point2D}
 */
jsfc.Polygon.prototype.getLastVertex = function() {
    var c = this._vertices.length;
    if (c > 0) {
        return this._vertices[c - 1];
    }
    return null;
};

/**
 * Returns true if the polygon contains the specified point, and false
 * otherwise.
 * 
 * @param {!jsfc.Point2D} p  the point.
 * @returns {!boolean} A boolean.
 */
jsfc.Polygon.prototype.contains = function(p) {
    var n = this.getVertexCount();
    var j = n - 1;
    var y = p.y();
    var result = false;
    for (var i = 0; i < n; i++) {
        var pi = this._vertices[i];
        var pj = this._vertices[j];
        if ((pj.y() <= y && y < pi.y() && jsfc.Utils2D.area2(pj, pi, p) > 0)
                || (pi.y() <= y && y < pj.y() && jsfc.Utils2D.area2(pi, pj, p) > 0)) {
            result = !result;
        };
        j = i;
    }
    return result;
};
"use strict";

/**
 * @class Represents a rectangle in 2D space.
 * 
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @param {!number} width  the width.
 * @param {!number} height  the height.
 * @constructor
 */
jsfc.Rectangle = function(x, y, width, height) {
    if (!(this instanceof jsfc.Rectangle)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.Args.requireNumber(x, "x");
    jsfc.Args.requireNumber(y, "y");
    jsfc.Args.requireNumber(width, "width");
    jsfc.Args.requireNumber(height, "height");
    
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
};

/**
 * Creates a new rectangle with the same coordinates and dimensions as the 
 * specified rectangle.
 * 
 * @param {jsfc.Rectangle} rect  the rectangle to copy.
 * 
 * @returns {!jsfc.Rectangle} The new rectangle.
 */
jsfc.Rectangle.copy = function(rect) {
    return new jsfc.Rectangle(rect.x(), rect.y(), rect.width(), 
            rect.height());
};

/**
 * Returns the x-coordinate.
 *
 * @returns {number}
 */
jsfc.Rectangle.prototype.x = function() {
    return this._x;
};
    
/**
 * Returns the y-coordinate.
 *
 * @returns {number}
 */
jsfc.Rectangle.prototype.y = function() {
    return this._y;
};
    
/**
 * Returns the width.
 *
 * @returns {number}
 */
jsfc.Rectangle.prototype.width = function() {
    return this._width;
};
    
/**
 * Returns the height.
 * 
 * @returns {number}
 */
jsfc.Rectangle.prototype.height = function() {
    return this._height;
};

/**
 * Returns the length of one side of the rectangle.
 * 
 * @param {!string} edge  the edge ("TOP", "LEFT", "BOTTOM" or "RIGHT").
 * 
 * @returns {number}
 */
jsfc.Rectangle.prototype.length = function(edge) {
    if (edge === jsfc.RectangleEdge.TOP 
            || edge === jsfc.RectangleEdge.BOTTOM) {
        return this._width;
    } else if (edge === jsfc.RectangleEdge.LEFT 
            || edge === jsfc.RectangleEdge.RIGHT) {
        return this._height;
    }
    throw new Error("Unrecognised 'edge' value: " + edge);
};
    
/**
 * Returns the x-coordinate for the center point of the rectangle.
 * 
 * @returns {number} The central x-coordinate.
 */
jsfc.Rectangle.prototype.centerX = function() {
    return this._x + (this._width / 2);
};

/**
 * Returns the minimum x-value for the rectangle.
 * 
 * @returns {number} The minimum x-value.
 */
jsfc.Rectangle.prototype.minX = function() {
    return Math.min(this._x, this._x + this._width);    
};
    
/**
 * Returns the maximum x-value for the rectangle.
 * 
 * @returns {number} The maximum x-value.
 */
jsfc.Rectangle.prototype.maxX = function() {
    return Math.max(this._x, this._x + this._width);
};

/**
 * Returns the y-coordinate for the center point of the rectangle.
 * 
 * @returns {number} The central y-coordinate.
 */
jsfc.Rectangle.prototype.centerY = function() {
    return this._y + (this._height / 2);
};
    
/**
 * Returns the minimum y-value for the rectangle.
 * 
 * @returns {number} The minimum y-value.
 */
jsfc.Rectangle.prototype.minY = function() {
    return Math.min(this._y, this._y + this._height);
};
    
/**
 * Returns the maximum y-value for the rectangle.
 * 
 * @returns {number} The maximum y-value.
 */
jsfc.Rectangle.prototype.maxY = function() {
    return Math.max(this._y, this._y + this._height);
};
    
/**
 * Returns the bounds for this shape.
 * 
 * @returns {jsfc.Rectangle} The bounds.
 */
jsfc.Rectangle.prototype.bounds = function() {
    return new jsfc.Rectangle(this._x, this._y, this._width, this._height);
};

/**
 * Updates the coordinates and dimensions for the rectangle.
 * 
 * @param {number} x  the new x-coordinate.
 * @param {number} y  the new y-coordinate.
 * @param {number} w  the new width.
 * @param {number} h  the new height.
 * @returns {jsfc.Rectangle} Returns this rectangle (for chaining method calls).
 */
jsfc.Rectangle.prototype.set = function(x, y, w, h) {
    this._x = x;
    this._y = y;
    this._width = w;
    this._height = h;
    return this;
};
    
/**
 * Returns the closest point on or inside the rectangle to the specified 
 * point (x, y).
 * 
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @returns {!jsfc.Point2D} A new point.
 */
jsfc.Rectangle.prototype.constrainedPoint = function(x, y) {
    jsfc.Args.requireNumber(x, "x");
    jsfc.Args.requireNumber(y, "y");
    var xx = Math.max(this.minX(), Math.min(x, this.maxX()));
    var yy = Math.max(this.minY(), Math.min(y, this.maxY()));
    return new jsfc.Point2D(xx, yy);  
};

/**
 * Returns true if the specified point falls on or inside the rectangle,
 * and false otherwise.
 * 
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @returns {!boolean} A boolean.
 */
jsfc.Rectangle.prototype.contains = function(x, y) {
    return x >= this._x && x <= this._x + this._width 
            && y >= this._y && y <= this._y + this._height;
};

/**
 * Returns true if the specified rectangle 'r' is contained within the bounds 
 * of this rectangle.
 * 
 * @param {!jsfc.Rectangle} r  the rectangle.
 * @returns {!boolean} A boolean.
 */
jsfc.Rectangle.prototype.containsRect = function(r) {
    return this.contains(r.minX(), r.minY()) 
            && this.contains(r.maxX(), r.maxY());  
};
/**
 * An enumeration of the four edges of a rectangle (TOP, BOTTOM, LEFT and 
 * RIGHT).
 */
jsfc.RectangleEdge = {
    
    TOP: "TOP",
    
    BOTTOM: "BOTTOM",
    
    LEFT: "LEFT",
    
    RIGHT: "RIGHT"

};

/**
 * Returns true if the specified edge is TOP or BOTTOM, and false otherwise.
 * 
 * @param {!string} edge  the edge.
 * @returns {!boolean} A boolean.
 */
jsfc.RectangleEdge.isTopOrBottom = function(edge) {
    jsfc.Args.requireString(edge, "edge");
    if (edge === jsfc.RectangleEdge.TOP 
            || edge === jsfc.RectangleEdge.BOTTOM) {
        return true;
    }
    return false;
};

/**
 * Returns true if the specified edge is "LEFT" or "RIGHT", and false otherwise.
 * 
 * @param {!string} edge  the edge code.
 * @returns {!boolean} A boolean.
 */
jsfc.RectangleEdge.isLeftOrRight = function(edge) {
    jsfc.Args.requireString(edge, "edge");
    if (edge === jsfc.RectangleEdge.LEFT || edge === jsfc.RectangleEdge.RIGHT) {
        return true;
    }
    return false;
};

if (Object.freeze) {
    Object.freeze(jsfc.RectangleEdge);
}
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
    path.setAttribute("stroke", this._lineColor.rgbaStr());
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

    
"use strict";

/**
 * @constructor
 * @param {string} id
 * @returns {undefined}
 */
jsfc.SVGLayer = function(id) {
    if (!(this instanceof jsfc.SVGLayer)) {
        throw new Error("Use 'new' for constructors.");
    }
    this._id = id;
    this._container = this.createElement("g");
    this._content = this.createElement("g");
    this._container.appendChild(this._content);
    this._stack = [ this._content ];
    this._defsContainer = this.createElement("g");
    this._defsContent = this.createElement("g");
    this._defsContainer.appendChild(this._defsContent);
};

/**
 * Returns the id.
 * @returns {string}
 */
jsfc.SVGLayer.prototype.getID = function() {
    return this._id;
};

/**
 * Returns the group element that is the container for this layer.  This
 * container will have a single child, another group element, that holds the
 * actual content.
 * 
 * @returns {Node}
 */
jsfc.SVGLayer.prototype.getContainer = function() {
    return this._container;
};

/**
 * Returns the group containing the content for the layer.  This group sits 
 * within the layer's container, and can be discarded and recreated (the
 * layer's container remains and preserves the layer rendering order).
 * 
 * @returns {Node}
 */
jsfc.SVGLayer.prototype.getContent = function() {
    return this._content;
};

/**
 * A stack of group elements with the content group at the bottom.  The
 * beginGroup() and endGroup() methods will push and pop groups from the
 * stack.
 * 
 * @returns {Array}
 */
jsfc.SVGLayer.prototype.getStack = function() {
    return this._stack;
};

/**
 * Returns the group that is present in the SVG 'defs' element to represent
 * this layer.  The group contains a single child group (see getDefsContent())
 * that holds the actual defs.
 * 
 * @returns {Node}
 */
jsfc.SVGLayer.prototype.getDefsContainer = function() {
    return this._defsContainer;    
};

/**
 * Returns the group containing the defs content for this layer.  This
 * group can be removed and replaced.
 * 
 * @returns {Node}
 */
jsfc.SVGLayer.prototype.getDefsContent = function() {
    return this._defsContent;
};

/**
 * Clears the content for this layer.
 * 
 * @returns {undefined}
 */
jsfc.SVGLayer.prototype.clear = function() {
    this._container.removeChild(this._content);
    this._defsContainer.removeChild(this._defsContent);
    this._content = this.createElement("g");
    this._container.appendChild(this._content);
    this._stack = [ this._content ];
    this._defsContent = this.createElement("g");
    this._defsContainer.appendChild(this._defsContent);
};

/**
 * Creates a new element of the specified type.
 * 
 * @param {!string} elementType  the element type.
 * @returns {Element}
 */
jsfc.SVGLayer.prototype.createElement = function(elementType) {
    return document.createElementNS("http://www.w3.org/2000/svg", elementType);
};


/**
 * An enumeration of the scaling options for a rectangular shape being fitted 
 * within 2D bounds.
 * 
 * @type Object
 */
jsfc.Scale2D = {
    
    /** No scaling. */
    NONE: 1,
    
    /** Scale horizontally (but not vertically). */
    SCALE_HORIZONTAL: 2,
    
    /** Scale vertically (but not horizontally). */
    SCALE_VERTICAL: 3, 
    
    /** Scale both horizontally and vertically. */
    SCALE_BOTH: 4

};

if (Object.freeze) {
    Object.freeze(jsfc.Scale2D);
}
"use strict";

/** 
 * Creates a new stroke instance with default attributes.
 * 
 * @classdesc A stroke represents the style used to draw a line or path.
 * 
 * @constructor 
 * @param {number} [lineWidth]  the line width (defaults to 1.0).
 * @returns {jsfc.Stroke} The new instance.
 */
jsfc.Stroke = function(lineWidth) {
    if (!(this instanceof jsfc.Stroke)) {
        throw new Error("Use 'new' for constructors.");
    }
    this.lineWidth = lineWidth || 1.0;
    this.lineCap = jsfc.LineCap.ROUND;
    this.lineJoin = jsfc.LineJoin.ROUND;
    this.miterLimit = 1.0;
    this.lineDash = [1.0];
    this.lineDashOffset = 0.0; 
};

jsfc.Stroke.prototype.setLineDash = function(dash) {
    this.lineDash = dash;
};

/**
 * Returns a string containing the SVG style string representing this stroke.
 * 
 * @returns {!string} The SVG style string.
 */
jsfc.Stroke.prototype.getStyleStr = function() {
    var s = "stroke-width: " + this.lineWidth + "; ";
    if (this.lineCap !== "butt") {
        s = s + "stroke-linecap: " + this.lineCap + "; ";
    }
    s = s + "stroke-linejoin: " + this.lineJoin + "; ";
    if (this.lineDash.length > 1) {
        s = s + "stroke-dasharray: " + "3, 3" + "; ";
    }
    return s;
};
/**
 * An enumeration of the standard reference points for a single line text item.
 * @type Object
 */
jsfc.TextAnchor = {
    
    /** The top left corner of the text bounds. */
    TOP_LEFT: 0,

    /** The center of the top edge of the text bounds. */
    TOP_CENTER: 1,

    /** The top right corner of the text bounds. */
    TOP_RIGHT: 2,

    /**
     * The left edge of a horizontal line through the midpoint of the font's
     * ascent.
     */
    HALF_ASCENT_LEFT: 3,

    /**
     * The center point of a horizontal line through the midpoint of the font's
     * ascent.
     */
    HALF_ASCENT_CENTER: 4,

    /**
     * The right edge of a horizontal line through the midpoint of the font's
     * ascent.
     */
    HALF_ASCENT_RIGHT: 5,

    /** The mid-point of the left edge of the text bounding box. */
    CENTER_LEFT: 6,

    /** The center of the text bounding box. */
    CENTER: 7,

    /** The mid-point of the right edge of the text bounding box. */
    CENTER_RIGHT: 8,

    /** The left edge of the text baseline. */
    BASELINE_LEFT: 9,

    /** The mid-point of the text baseline. */
    BASELINE_CENTER: 10,

    /** The right edge of the text baseline. */
    BASELINE_RIGHT: 11,

    /** The bottom left corner of the text bounds. */
    BOTTOM_LEFT: 12,

    /** The center of the bottom edge of the text bounds. */
    BOTTOM_CENTER: 13,

    /** The bottom right corner of the text bounds. */
    BOTTOM_RIGHT: 14,

    /**
     * Returns true if the specified anchor is a "left" anchor, and false 
     * otherwise.
     * 
     * @param {!number} anchor  the anchor.
     * @returns {!boolean}
     */
    isLeft: function(anchor) {
        return anchor === jsfc.TextAnchor.TOP_LEFT 
                || anchor === jsfc.TextAnchor.CENTER_LEFT
                || anchor === jsfc.TextAnchor.HALF_ASCENT_LEFT 
                || anchor === jsfc.TextAnchor.BASELINE_LEFT
                || anchor === jsfc.TextAnchor.BOTTOM_LEFT;
    },

    /**
     * Returns true if the specified anchor is a "center" anchor, and false 
     * otherwise.
     * 
     * @param {!number} anchor  the anchor.
     * @returns {!boolean}
     */
    isHorizontalCenter: function(anchor) {
        return anchor === jsfc.TextAnchor.TOP_CENTER 
                || anchor === jsfc.TextAnchor.CENTER
                || anchor === jsfc.TextAnchor.HALF_ASCENT_CENTER 
                || anchor === jsfc.TextAnchor.BASELINE_CENTER
                || anchor === jsfc.TextAnchor.BOTTOM_CENTER;
    },

    /**
     * Returns true if the specified anchor is a "right" anchor, and false 
     * otherwise.
     * 
     * @param {!number} anchor  the anchor.
     * @returns {!boolean}
     */
    isRight: function(anchor) {
        return anchor === jsfc.TextAnchor.TOP_RIGHT 
                || anchor === jsfc.TextAnchor.CENTER_RIGHT
                || anchor === jsfc.TextAnchor.HALF_ASCENT_RIGHT 
                || anchor === jsfc.TextAnchor.BASELINE_RIGHT
                || anchor === jsfc.TextAnchor.BOTTOM_RIGHT;
    },

    /**
     * Returns true if the specified anchor is a "top" anchor, and false 
     * otherwise.
     * 
     * @param {!number} anchor  the anchor.
     * @returns {!boolean}
     */
    isTop: function(anchor) {
        return anchor === jsfc.TextAnchor.TOP_LEFT 
                || anchor === jsfc.TextAnchor.TOP_CENTER 
                || anchor === jsfc.TextAnchor.TOP_RIGHT;
    },

    /**
     * Returns true if the specified anchor is a "half ascent" anchor, and 
     * false otherwise.
     * 
     * @param {!number} anchor  the anchor.
     * @returns {!boolean}
     */
    isHalfAscent: function(anchor) {
        return anchor === jsfc.TextAnchor.HALF_ASCENT_LEFT 
                || anchor === jsfc.TextAnchor.HALF_ASCENT_CENTER
                || anchor === jsfc.TextAnchor.HALF_ASCENT_RIGHT;
    },

    /**
     * Returns true if the specified anchor is a "center" anchor (vertically), 
     * and false otherwise.
     * 
     * @param {!number} anchor  the anchor.
     * @returns {!boolean}
     */
    isHalfHeight: function(anchor) {
        return anchor === jsfc.TextAnchor.CENTER_LEFT 
                || anchor === jsfc.TextAnchor.CENTER 
                || anchor === jsfc.TextAnchor.CENTER_RIGHT;
    },

    /**
     * Returns true if the specified anchor is a "baseline" anchor (vertically), 
     * and false otherwise.
     * 
     * @param {!number} anchor  the anchor.
     * @returns {!boolean}
     */
    isBaseline: function(anchor) {
        return anchor === jsfc.TextAnchor.BASELINE_LEFT 
                || anchor === jsfc.TextAnchor.BASELINE_CENTER
                || anchor === jsfc.TextAnchor.BASELINE_RIGHT;
    },

    /**
     * Returns true if the specified anchor is a "bottom" anchor, 
     * and false otherwise.
     * 
     * @param {!number} anchor  the anchor.
     * @returns {!boolean}
     */
    isBottom: function(anchor) {
        return anchor === jsfc.TextAnchor.BOTTOM_LEFT 
                || anchor === jsfc.TextAnchor.BOTTOM_CENTER
                || anchor === jsfc.TextAnchor.BOTTOM_RIGHT;
    }
};

if (Object.freeze) {
    Object.freeze(jsfc.TextAnchor);
}
/**
 * A set of functions used for text.
 * 
 * @namespace
 */
jsfc.TextUtils = {};

/**
 * Calculates an returns the bounds of a string drawn to the specified
 * graphics context (using the font settings from that context) and anchored
 * to a specific location.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!string} str  the string.
 * @param {!number} x  the x-coordinate.
 * @param {!number} y  the y-coordinate.
 * @param {!number} anchor  the text anchor (defined in jsfc.TextAnchor).
 * @returns {!jsfc.Rectangle}
 */
jsfc.TextUtils.bounds = function(ctx, str, x, y, anchor) {
    var dim = ctx.textDim(str);
    var w = dim.width();
    var h = dim.height();
    var xadj = 0;
    if (jsfc.TextAnchor.isHorizontalCenter(anchor)) {
        xadj = -w / 2;
    } else if (jsfc.TextAnchor.isRight(anchor)) {
        xadj = -w;
    }
    // the y-adjustment is not so easy since we don't have a lot of detailed
    // font metrics...we use best efforts for now
    var yadj = 0; // baseline
    if (jsfc.TextAnchor.isBottom()) {
        yadj = 0; // FIXME
    } else if (jsfc.TextAnchor.isHalfAscent(anchor) 
            || jsfc.TextAnchor.isHalfHeight(anchor)) {
        yadj = -h / 2;    
    } else if (jsfc.TextAnchor.isTop(anchor)) {
        yadj = -h;
    }
    return new jsfc.Rectangle(x + xadj, y + yadj, w, h);
};

"use strict";

/** 
 * Creates a new transform.
 * 
 * @constructor 
 * @classdesc A transform (only supporting translate and rotate which are the
 *     options we require for text positioning).
 * @returns {jsfc.Transform} The new instance.
 */
jsfc.Transform = function() {
    if (!(this instanceof jsfc.Transform)) {
        throw new Error("Use 'new' for constructors.");
    }
    this.scaleX = 1.0; // m00
    this.scaleY = 1.0; // m11
    this.translateX = 0.0;
    this.translateY = 0.0;
    this.shearX = 0.0; // m01
    this.shearY = 0.0; // m10
};

/**
 * Applies a translation (dx, dy) to the transform.
 * @param {!number} dx
 * @param {!number} dy
 * @returns {undefined}
 */
jsfc.Transform.prototype.translate = function(dx, dy) {
    this.translateX = this.translateX + dx;
    this.translateY = this.translateY + dy;
};

/**
 * Applies a rotation of theta to the transform.
 * @param {!number} theta
 * @returns {undefined}
 */
jsfc.Transform.prototype.rotate = function(theta) {
    var c = Math.cos(theta);
    var s = Math.sin(theta);
    var n00 = this.scaleX * c + this.shearX * s;
    var n01 = this.scaleX * -s + this.shearX * c;
    var n10 = this.shearY * c + this.scaleY * s;
    var n11 = this.shearY * -s + this.scaleY * c;
    this.scaleX = n00;
    this.shearX = n01;
    this.shearY = n10;
    this.scaleY = n11;
};
/**
 * Utility functions for 2D graphics.
 * 
 * @namespace
 */
jsfc.Utils2D = {};

/**
 * Returns the area of a triangle designated by the points a, b and c, 
 * multiplied by 2 if a, b and c appear in clockwise order, and -2 if they
 * appear in anticlockwise order.
 * 
 * @param {!jsfc.Point2D} a  point A.
 * @param {!jsfc.Point2D} b  point B.
 * @param {!jsfc.Point2D} c  point C.
 * @returns {!number}
 */
jsfc.Utils2D.area2 = function(a, b, c) {
    return (a.x() - c.x()) * (b.y() - c.y()) 
            - (a.y() - c.y()) * (b.x() - c.x());
};

jsfc.Colors = {};

/** The color white. */
jsfc.Colors.WHITE = new jsfc.Color(255, 255, 255);

/** The color black. */
jsfc.Colors.BLACK = new jsfc.Color(0, 0, 0);

/** The color red. */
jsfc.Colors.RED = new jsfc.Color(255, 0, 0);

/** The color green. */
jsfc.Colors.GREEN = new jsfc.Color(0, 255, 0);

/** The color blue. */
jsfc.Colors.BLUE = new jsfc.Color(0, 0, 255);

/** The color yellow. */
jsfc.Colors.YELLOW = new jsfc.Color(255, 255, 0);

/** The color light gray. */
jsfc.Colors.LIGHT_GRAY = new jsfc.Color(192, 192, 192);

/**
 * Creates and returns an array of color strings.
 * 
 * @returns {Array} An array of color strings.
 */
jsfc.Colors.fancyLight = function() {
    return ["#64E1D5", "#E2D75E", "#F0A4B5", "#E7B16D", "#C2D58D", "#CCBDE4",
            "#6DE4A8", "#93D2E2", "#AEE377", "#A0D6B5"];
};

/**
 * Creates and returns an array of color strings.
 * 
 * @returns {Array} An array of color strings.
 */
jsfc.Colors.fancyDark = function() {
    return ["#3A6163", "#8A553A", "#4A6636", "#814C57", "#675A6F", "#384027",
            "#373B43", "#59372C", "#306950", "#665D31"];
};

/**
 * Creates and returns an array of color strings.
 * 
 * @returns {Array} An array of color strings.
 */
jsfc.Colors.iceCube = function() {
    return ["#4CE4B7", "#45756F", "#C2D9BF", "#58ADAF", "#4EE9E1", "#839C89",
            "#3E8F74", "#92E5C1", "#99E5E0", "#57BDAB"];
};

/**
 * Creates and returns an array of color strings.
 * 
 * @returns {Array} An array of color strings.
 */
jsfc.Colors.blueOcean = function() {
    return ["#6E7094", "#4F76DF", "#292E39", "#2E4476", "#696A72",  "#4367A6",
            "#5E62B7", "#42759A", "#2E3A59", "#4278CA"];
};

/**
 * Converts an array of color strings into an array of the corresponding
 * Color objects.
 * 
 * @param {Array} colors  the array of color strings.
 * 
 * @returns {Array} An array of color objects.
 */
jsfc.Colors.colorsAsObjects = function(colors) {
    return colors.map(function(s) {
        return jsfc.Color.fromStr(s);
    });    
};

"use strict";

/**
 * A base object for a table element.
 * @param {jsfc.BaseElement} [instance]  the object where the element's 
 *         attributes will be stored (defaults to 'this').
 * @constructor 
 * @classdesc A base table element. 
 * @returns {jsfc.BaseElement} The new instance.
 */
jsfc.BaseElement = function(instance) {
    if (!(this instanceof jsfc.BaseElement)) {
        throw new Error("Use 'new' for construction.");
    }
    if (!instance) {
        instance = this;
    }
    jsfc.BaseElement.init(instance);
};

/**
 * Initialises the attributes requires by this base class, in the supplied
 * instance object.
 * 
 * @param {jsfc.BaseElement} instance  the instance.
 * @returns {undefined}
 */
jsfc.BaseElement.init = function(instance) {
    instance._insets = new jsfc.Insets(2, 2, 2, 2);
    instance._refPt = jsfc.RefPt2D.CENTER;
    instance._backgroundPainter = null;    
};

/**
 * Returns the insets.
 * 
 * @returns {jsfc.Insets} The insets.
 */
jsfc.BaseElement.prototype.getInsets = function() {
    return this._insets;
};

/**
 * Sets the insets.
 * 
 * @param {!jsfc.Insets} insets  the new insets.
 * @returns {undefined}
 */
jsfc.BaseElement.prototype.setInsets = function(insets) {
    this._insets = insets;
};

/**
 * Gets/sets the reference point for the element.
 * @param {number} [value]
 * @returns {number|jsfc.BaseElement}
 */
jsfc.BaseElement.prototype.refPt = function(value) {
    if (!arguments.length) {
        return this._refPt;
    }
    this._refPt = value;
    return this;
};

/**
 * Gets/sets the background painter.
 * 
 * @param {Object} [painter] the new painter (optional, if not specified the
 *     function returns the current painter).
 * @returns {Object|jsfc.BaseElement}
 */
jsfc.BaseElement.prototype.backgroundPainter = function(painter) {
    if (!arguments.length) {
        return this._backgroundPainter;
    }
    this._backgroundPainter = painter;
    return this;    
};

/**
 * Receives a visitor.
 * 
 * @param {!Function} visitor  the visitor function.
 * @returns {undefined}
 */
jsfc.BaseElement.prototype.receive = function(visitor) {
    // in the default case, call the visitor function just passing this element
    visitor(this);
};
"use strict";

/**
 * Creates a new instance.
 * 
 * @class A container element that lays out its children in a horizontal 
 * flow layout running from left to right (wrapping to a new line when 
 * necessary).
 * 
 * @constructor 
 * @implements {jsfc.TableElement}
 * @returns {jsfc.FlowElement}
 */
jsfc.FlowElement = function() {
    if (!(this instanceof jsfc.FlowElement)) {
        throw Error("Use 'new' for constructor.");
    }
    jsfc.BaseElement.init(this); // inherit attributes from BaseElement
    this._elements = [];
    this._halign = jsfc.HAlign.LEFT;
    this._hgap = 2;
};

jsfc.FlowElement.prototype = new jsfc.BaseElement();
    
/**
 * Gets/sets the horizontal alignment of the elements.
 * 
 * @param {number} align  the new alignment.
 * 
 * @returns {number|jsfc.FlowElement}
 */
jsfc.FlowElement.prototype.halign = function(align) {
    if (!arguments.length) {
        return this._halign;
    }
    this._halign = align;
    return this;
};

/**
 * Gets or sets the gap between items in the flowlayout (when no argument
 * is supplied, the function returns the current value). 
 * 
 * @param {number} [value]  the new value.
 * @returns {number|jsfc.FlowElement}
 */
jsfc.FlowElement.prototype.hgap = function(value) {
    if (!arguments.length) {
        return this._hgap;
    }
    this._hgap = value;
    return this;
};

/**
 * Adds an element to the flow layout.
 * 
 * @param {Object} element  the element.
 * @returns {undefined}
 */
jsfc.FlowElement.prototype.add = function(element) {
    this._elements.push(element);
    return this;
};
    
jsfc.FlowElement.prototype.receive = function(visitor) {
    this._elements.forEach(function(child) { child.receive(visitor); });    
};
    
/**
 * Returns the preferred dimensions for this element.
 * 
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} bounds  the drawing bounds.
 * 
 * @returns {jsfc.Dimension} The preferred dimensions for the text.
 */
jsfc.FlowElement.prototype.preferredSize = function(ctx, bounds) {
    // split the children into rows and measure the rows
    var insets = this.getInsets();
    var w = insets.left() + insets.right();
    var h = insets.top() + insets.bottom();
    var maxRowWidth = 0.0;
    var elementCount = this._elements.length;
    var i = 0;
    while (i < elementCount) {
        // get one row of elements...
        var elementsInRow = this._rowOfElements(i, ctx, bounds);
        var rowHeight = this._calcRowHeight(elementsInRow);
        var rowWidth = this._calcRowWidth(elementsInRow, this._hgap);
        maxRowWidth = Math.max(rowWidth, maxRowWidth);
        h += rowHeight;
        i = i + elementsInRow.length;
    }
    w += maxRowWidth;
    return new jsfc.Dimension(insets.left() + w + insets.right(), 
            insets.top() + h + insets.bottom());
};
    
/**
 * Returns a row of elements starting with the specified element and
 * respecting the width of the supplied bounds.
 * 
 * @param {number} first  the index of the first element to include.
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} bounds  the bounds.
 * 
 * @returns {Array}
 */
jsfc.FlowElement.prototype._rowOfElements = function(first, ctx, bounds) {
    var result = [];
    var index = first;
    var full = false;
    var insets = this.getInsets();
    var w = insets.left() + insets.right();
    while (index < this._elements.length && !full) {
        var element = this._elements[index];
        var dim = element.preferredSize(ctx, bounds);
        if (w + dim.width() < bounds.width() || index === first) {
            result.push({ "element": element, "dim": dim });
            w += dim.width() + this._hgap;
            index++;
        } else {
            full = true;
        }
    }
    return result;
};
    
jsfc.FlowElement.prototype._calcRowHeight = function(elements) {
    var height = 0.0;
    for (var i = 0; i < elements.length; i++) {
        height = Math.max(height, elements[i].dim.height());
    }    
    return height;
};
    
jsfc.FlowElement.prototype._calcRowWidth = function(elements) {
    var width = 0.0;
    var count = elements.length;
    for (var i = 0; i < elements.length; i++) {
        width += elements[i].dim.width();
    }
    if (count > 1) {
        width += (count - 1) * this._hgap;
    }
    return width;
};
    
jsfc.FlowElement.prototype.layoutElements = function(context, bounds) {
    var result = []; // a list of jsfc.Rectangle objects
    var i = 0;
    var insets = this.getInsets();
    var x = bounds.x() + insets.left();
    var y = bounds.y() + insets.top();
    while (i < this._elements.length) {
        var elementsInRow = this._rowOfElements(i, context, bounds);
        var h = this._calcRowHeight(elementsInRow);
        var w = this._calcRowWidth(elementsInRow);  
        if (this._halign === jsfc.HAlign.CENTER) {
            x = bounds.centerX() - (w / 2);
        } else if (this._halign === jsfc.HAlign.RIGHT) {
            x = bounds.maxX() - insets.right() - w;
        }
        for (var j = 0; j < elementsInRow.length; j++) {
            //Dimension2D dim = elementInfo.getDimension();
            var position = new jsfc.Rectangle(x, y, 
                elementsInRow[j].dim.width(), h);
            result.push(position);
            x += position.width() + this._hgap;
        }
        i = i + elementsInRow.length;
        x = bounds.x() + insets.left();
        y += h;        
    }
    return result;
};
    
jsfc.FlowElement.prototype.draw = function(context, bounds) {
    var dim = this.preferredSize(context, bounds);
    var fitter = new jsfc.Fit2D(new jsfc.Anchor2D(this.refPt()), 
        jsfc.Scale2D.NONE);
    var dest = fitter.fit(dim, bounds);
    var layoutInfo = this.layoutElements(context, dest);
    for (var i = 0; i < this._elements.length; i++) {
        var rect = layoutInfo[i];
        var element = this._elements[i];
        element.draw(context, rect);
    }
};

"use strict";

/**
 * @class A table element that is a grid of sub-elements.
 * 
 * @constructor
 * @implements {jsfc.TableElement}
 */
jsfc.GridElement = function() {
    if (!(this instanceof jsfc.GridElement)) {
        throw new Error("Use 'new' for construction.");
    }    
    jsfc.BaseElement.init(this); // inherit attributes from BaseElement
    this._elements = new jsfc.KeyedValues2DDataset();
};
 
// inherit from BaseElement (see also the init() call in the constructor)
jsfc.GridElement.prototype = new jsfc.BaseElement();
    
/**
 * Adds an element to the grid (or, if the keys are already defined, 
 * replaces an existing element).
 * 
 * @param {jsfc.TableElement} element  the table element to add.
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @returns {jsfc.GridElement} This object (for chaining method calls).
 */
jsfc.GridElement.prototype.add = function(element, rowKey, columnKey) {
    this._elements.add(rowKey, columnKey, element);
    return this;
};

// private method
jsfc.GridElement.prototype._findCellDims = function(context, bounds) {
    var widths = jsfc.Utils.makeArrayOf(0, this._elements.columnCount());
    var heights = jsfc.Utils.makeArrayOf(0, this._elements.rowCount());
    for (var r = 0; r < this._elements.rowCount(); r++) {
        for (var c = 0; c < this._elements.columnCount(); c++) {
            var element = this._elements.valueByIndex(r, c);
            if (!element) {
                continue;
            }
            var dim = element.preferredSize(context, bounds);
            widths[c] = Math.max(widths[c], dim.width());
            heights[r] = Math.max(heights[r], dim.height());
        }
    }
    return { "widths": widths, "heights": heights };
};
    
/**
 * Returns the preferred dimensions for this element.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} bounds  the drawing bounds.
 * 
 * @returns {jsfc.Dimension} The preferred dimensions for the text.
 */
jsfc.GridElement.prototype.preferredSize = function(ctx, bounds) {
    var me = this;
    var insets = this.getInsets();
    var cellDims = this._findCellDims(ctx, bounds);
    var w = insets.left() + insets.right();
    for (var i = 0; i < cellDims.widths.length; i++) {
        w = w + cellDims.widths[i];
    }
    var h = insets.top() + insets.bottom();
    for (var i = 0; i < cellDims.heights.length; i++) {
        h = h + cellDims.heights[i];
    }
    return new jsfc.Dimension(w, h);
};
    
/**
 * Performs a layout of the grid, returning an array with the positions of
 * the elements in the grid.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} bounds  the area available for drawing the grid.
 * 
 * @returns {Array}
 */
jsfc.GridElement.prototype.layoutElements = function(ctx, bounds) {
    var insets = this.getInsets();        
    var cellDims = this._findCellDims(ctx, bounds);
    var positions = [];
    var y = bounds.y() + insets.top();
    for (var r = 0; r < this._elements.rowCount(); r++) {
        var x = bounds.x() + insets.left();
        for (var c = 0; c < this._elements.columnCount(); c++) {
            positions.push(new jsfc.Rectangle(x, y, cellDims.widths[c], 
                cellDims.heights[r]));
            x += cellDims.widths[c];
        }
        y = y + cellDims.heights[r];
    }
    return positions;
};
 
/**
 * Draws the element within the specified bounds.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} bounds
 * @returns {undefined}
 */
jsfc.GridElement.prototype.draw = function(ctx, bounds) {
    var positions = this.layoutElements(ctx, bounds);
    for (var r = 0; r < this._elements.rowCount(); r++) {
        for (var c = 0; c < this._elements.columnCount(); c++) {
            var element = this._elements.valueByIndex(r, c);
            if (!element) {
                continue;
            }
            var pos = positions[r * this._elements.columnCount() + c];
            element.draw(ctx, pos);
        }
    }
};

jsfc.GridElement.prototype.receive = function(visitor) {
    for (var r = 0; r < this._elements.rowCount(); r++) {
        for (var c = 0; c < this._elements.columnCount(); c++) {
            var element = this._elements.valueByIndex(r, c);
            if (element === null) {
                continue;
            }
            element.receive(visitor);
        }
    }
};


"use strict";

/**
 * @class A table element that contains a rectangle (centered within the 
 * element).
 * @constructor
 * @param {number} width  the rectangle width.
 * @param {number} height  the rectangle height.
 * @returns {jsfc.RectangleElement}
 */
jsfc.RectangleElement = function(width, height) {
    if (!(this instanceof jsfc.RectangleElement)) {
        throw new Error("Use 'new' for construction.");
    }
    jsfc.BaseElement.init(this); // inherit attributes from BaseElement
    this._width = width;
    this._height = height;
    this._fillColor = new jsfc.Color(255, 255, 255);

    // the following field overrides the default from BaseElement
    this._backgroundPainter = new jsfc.StandardRectanglePainter(
            new jsfc.Color(255,255,255,0.3), new jsfc.Color(0,0,0,0));
};

jsfc.RectangleElement.prototype = new jsfc.BaseElement();

/**
 * Gets/sets the rectangle width.
 * 
 * @param {number} [value]  the new width.
 * @returns {number|jsfc.RectangleElement} 
 */
jsfc.RectangleElement.prototype.width = function(value) {
    if (!arguments.length) {
        return this._width;
    }
    this._width = value;
    return this;
};

/**
 * Gets/sets the rectangle height.
 * 
 * @param {number} [value]  the new height.
 * @returns {jsfc.RectangleElement|number}
 */
jsfc.RectangleElement.prototype.height = function(value) {
    if (!arguments.length) {
        return this._height;
    }
    this._height = value;
    return this;
};

jsfc.RectangleElement.prototype.getFillColor = function() {
    return this._fillColor;
};

jsfc.RectangleElement.prototype.setFillColor = function(color) {
    if (typeof color === "string") {
        throw new Error("needs to be a color");
    }
    this._fillColor = color;
    return this;
};

/**
 * Returns the preferred dimensions for this element, which is the 
 * size of the rectangle plus the insets.
 * 
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} bounds  the drawing bounds.
 * 
 * @returns {jsfc.Dimension} The preferred dimensions for the text.
 */
jsfc.RectangleElement.prototype.preferredSize = function(ctx, bounds) {
    var insets = this.getInsets();
    var w = insets.left() + this._width + insets.right();
    var h = insets.top() + this._height + insets.bottom();
    var bw = bounds.width();
    var bh = bounds.height();
    return new jsfc.Dimension(Math.min(w, bw), Math.min(h, bh));
};
    
/**
 * Performs a layout of the element.
 * 
 * @param {jsfc.Context2D} ctx  the SVG context.
 * @param {jsfc.Rectangle} bounds  the bounds.
 * @returns {Array}
 */
jsfc.RectangleElement.prototype.layoutElements = function(ctx, bounds) {
    var insets = this.getInsets();
    var w = Math.min(insets.left() + this._width + insets.right(), 
            bounds.width());
    var h = Math.min(insets.top() + this._height + insets.bottom(), 
            bounds.height());
    var pos = new jsfc.Rectangle(bounds.centerX() - w / 2, 
            bounds.centerY() - h / 2, w, h);
    return [pos];
};

/**
 * Draws the element.
 * 
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} bounds  the bounds.
 * @returns {undefined}
 */
jsfc.RectangleElement.prototype.draw = function(ctx, bounds) {
    var backgroundPainter = this.backgroundPainter();
    if (backgroundPainter) {
        backgroundPainter.paint(ctx, bounds);
    }
    // create a new rectangle element
    var insets = this.getInsets();
    var ww = Math.max(bounds.width() - insets.left() - insets.right(), 0);
    var hh = Math.max(bounds.height() - insets.top() - insets.bottom(), 0);
    var w = Math.min(this._width, ww);
    var h = Math.min(this._height, hh);
    ctx.setFillColor(this._fillColor);
    ctx.fillRect(bounds.centerX() - w / 2, bounds.centerY() - h / 2, w, h);
};

"use strict";

/**
 * @interface
 */
jsfc.RectanglePainter = function() {
};

/**
 * Paints the background within the specified bounds.
 * 
 * @param {!jsfc.Context2D} ctx  the context.
 * @param {!jsfc.Rectangle} bounds  the bounds.
 * @returns {undefined}
 */
jsfc.RectanglePainter.prototype.paint = function(ctx, bounds) {
};


"use strict";

/**
 * Creates a new table element that displays a shape (for example,
 *     a rectangle).
 *     
 * @class A shape element.
 * 
 * @constructor 
 * @param {jsfc.Shape} shape
 * @param {jsfc.Color} color  a color.
 * @returns {undefined}
 */
jsfc.ShapeElement = function(shape, color) {
    jsfc.BaseElement.init(this); // inherit attributes from BaseElement
    this.shape = shape;
    this.color = color;
};

jsfc.ShapeElement.prototype = new jsfc.BaseElement();

/**
 * Returns the preferred size of this element.
 * 
 * @param {jsfc.SVGContext2D} ctx  the graphics target.
 * @param {jsfc.Rectangle} bounds  the bounds.
 * @param {Object} [constraints]  the layout constraints if any (can be null).
 * 
 * @returns {jsfc.Dimension} The preferred size for this element.
 */
jsfc.ShapeElement.prototype.preferredSize = function(ctx, bounds, constraints) {
    var shapeBounds = this.shape.bounds();
    var insets = this.getInsets();
    var w = Math.min(bounds.width, shapeBounds.width + insets.left + insets.right);
    var h = Math.min(bounds.height, shapeBounds.height + insets.top + insets.bottom);
    return new jsfc.Dimension(w, h);   
};

/**
 * Performs a layout and returns a list of bounding rectangles for the 
 * element and its children (this object has no children, so the returned 
 * array contains one element only).
 * 
 * @param {jsfc.SVGContext2D} ctx  the graphics target.
 * @param {jsfc.Rectangle} bounds  the drawing bounds.
 * @param {Object} [constraints]  optional constraints.
 * 
 * @returns {Array} An array containing the bounds for the shape (one element).
 */
jsfc.ShapeElement.prototype.layoutElements = function(ctx, bounds, constraints) {
    var dim = this.preferredSize(ctx, bounds, constraints);
    var pos = new jsfc.Rectangle(bounds.centerX() - dim.width() / 2.0,
                bounds.centerY() - dim.height() / 2.0, dim.width(), 
                dim.height());
    return [pos];
};

jsfc.ShapeElement.prototype.draw = function(ctx, bounds) {
    // fill the background
    // fill the shape
};
"use strict";

/**
 * Creates a new painter.
 * @class A painter that fills a rectangle with a color.
 * @constructor
 * @implements {jsfc.RectanglePainter}
 * @param {jsfc.Color} fillColor  the fill color (null permitted).
 * @param {jsfc.Color} [strokeColor]  the stroke color (null permitted).
 * @returns {undefined}
 */
jsfc.StandardRectanglePainter = function(fillColor, strokeColor) {
    if (!(this instanceof jsfc.StandardRectanglePainter)) {
        throw new Error("Use 'new' for construction.");
    }
    this._fillColor = fillColor;
    this._strokeColor = strokeColor;
};

/**
 * Paints the background within the specified bounds.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context (null not permitted).
 * @param {!jsfc.Rectangle} bounds  the bounds (null not permitted).
 * @returns {undefined}
 */
jsfc.StandardRectanglePainter.prototype.paint = function(ctx, bounds) {
    if (this._fillColor) {
        ctx.setFillColor(this._fillColor);
        ctx.fillRect(bounds.x(), bounds.y(), bounds.width(), bounds.height());
    }
    if (this._strokeColor) {
        ctx.setLineColor(this._strokeColor);
    }
};

"use strict";

/**
 * @classdesc A table element is a rectangular element that is either a 
 *     container for other table elements, or has some visual representation.
 *     These elements can be composed into table-like structures in a general
 *     way (here they are used primarily to construct chart legends).
 *     
 * @interface
 */
jsfc.TableElement = function() {
};

/**
 * Returns the preferred dimensions for this element.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} bounds  the drawing bounds.
 * 
 * @returns {jsfc.Dimension} The preferred dimensions for the text.
 */
jsfc.TableElement.prototype.preferredSize = function(ctx, bounds) {
};
    
/**
 * Calculates the layout for the element subject to the specified bounds.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} bounds  the available space for the layout.
 * @returns {Array} An array containing a jsfc.Rectangle that is the location
 *     of the text element.
 */
jsfc.TableElement.prototype.layoutElements = function(ctx, bounds) {
};

/**
 * Draws the text element within the specified bounds by creating the 
 * required SVG text element and setting the attributes.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} bounds  the bounds.
 * @returns {undefined}
 */
jsfc.TableElement.prototype.draw = function(ctx, bounds) {
};

/**
 * Receives a table element visitor.
 * 
 * @param {!Function} visitor  the visitor (a function that receives a table 
 *         element as its only argument).
 * @returns {undefined}
 */
jsfc.TableElement.prototype.receive = function(visitor) {
};
"use strict";

/**
 * @classdesc A table element that displays a text string on a single line.
 * @implements jsfc.TableElement
 * 
 * @param {!string} textStr  the element text.
 * @returns {jsfc.TextElement}
 * @constructor
 */
jsfc.TextElement = function(textStr) {
    if (!(this instanceof jsfc.TextElement)) {
        throw new Error("Use 'new' for construction.");
    };
    jsfc.BaseElement.init(this); // inherit attributes from BaseElement
    this._text = textStr;
    this._font = new jsfc.Font("Palatino, serif", 16);
    this._color = new jsfc.Color(0, 0, 0);
    this._halign = jsfc.HAlign.LEFT;
    // the following field overrides the default from BaseElement
    this._backgroundPainter = new jsfc.StandardRectanglePainter(
            new jsfc.Color(255,255,255,0.3), new jsfc.Color(0,0,0,0));
};

// inherit from BaseElement (see also the init() call in the constructor)
jsfc.TextElement.prototype = new jsfc.BaseElement();
    
/**
 * Returns the text displayed by this element.
 * 
 * @returns {!string} The text.
 */
jsfc.TextElement.prototype.getText = function() {
    return this._text;
};

/**
 * Sets the text to be displayed by this element.
 * 
 * @param {!string} text  the text.
 * @returns {jsfc.TextElement}
 */
jsfc.TextElement.prototype.setText = function(text) {
    this._text = text;
    return this;
};

jsfc.TextElement.prototype.getFont = function() {
    return this._font;
};

jsfc.TextElement.prototype.setFont = function(font) {
    this._font = font;
    return this;
};

jsfc.TextElement.prototype.getColor = function() {
    return this._color;
};

jsfc.TextElement.prototype.setColor = function(color) {
    this._color = color;
    return this;
};

/**
 * Gets/sets the text to be displayed by this element.
 * 
 * @param {string} str  the string.
 * 
 * @returns {string|jsfc.TextElement}
 */
jsfc.TextElement.prototype.text = function(str) {
    throw new Error("Use get/setText()");
};

/**
 * Gets/sets the color for the text.
 * 
 * @param {string} str  the color string.
 * @returns {jsfc.Color|jsfc.TextElement}
 */
jsfc.TextElement.prototype.color = function(str) {
    throw new Error("Use get/setColor()");
};

/**
 * Gets/sets the font.
 * 
 * @param {jsfc.Font} font  the new font.
 * 
 * @returns {jsfc.Font|jsfc.TextElement}
 */
jsfc.TextElement.prototype.font = function(font) {
    throw new Error("Use get/setFont().");
};
    
/**
 * Gets/sets the horizontal alignment.
 * 
 * @param {number} align  the new alignment.
 * @returns {number|jsfc.TextElement}
 */
jsfc.TextElement.prototype.halign = function(align) {
    if (!arguments.length) {
        return this._halign;
    }
    this._halign = align;
    return this;
};

/**
 * Returns the preferred dimensions for this element.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} bounds  the drawing bounds.
 * 
 * @returns {jsfc.Dimension} The preferred dimensions for the text.
 */
jsfc.TextElement.prototype.preferredSize = function(ctx, bounds) {
    var insets = this.getInsets();
    ctx.setFont(this._font);
    var dim = ctx.textDim(this._text);
    return new jsfc.Dimension(insets.left() + dim.width() + insets.right(), 
            insets.top() + dim.height() + insets.bottom());
};
    
/**
 * Calculates the layout for the element subject to the specified bounds.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} bounds  the available space for the layout.
 * @returns {Array} An array containing a jsfc.Rectangle that is the location
 *     of the text element.
 */
jsfc.TextElement.prototype.layoutElements = function(ctx, bounds) {
    var insets = this.getInsets();
    ctx.setFont(this._font);
    var dim = ctx.textDim(this._text);
    var w = dim.width() + insets.left() + insets.right();
    var x = bounds.x();
    switch(this._halign) {
        case jsfc.HAlign.LEFT : 
            x = bounds.x();
            break;
        case jsfc.HAlign.CENTER :
            x = bounds.centerX() - w / 2;
            break;
        case jsfc.HAlign.RIGHT :
            x = bounds.maxX() - w;
            break;
    }
    var y = bounds.y();
    var h = Math.min(dim.height() + insets.top() + insets.bottom(), 
        bounds.height());
    return [new jsfc.Rectangle(x, y, w, h)];
};

/**
 * Draws the text element within the specified bounds by creating the 
 * required SVG text element and setting the attributes.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} bounds
 * @returns {undefined}
 */
jsfc.TextElement.prototype.draw = function(ctx, bounds) {
    var backgroundPainter = this.backgroundPainter();
    if (backgroundPainter) {
        backgroundPainter.paint(ctx, bounds);
    }
    var insets = this.getInsets();
    var pos = this.layoutElements(ctx, bounds)[0];

    ctx.setFillColor(this._color);
    ctx.setFont(this._font);
    var upper = pos.y() + insets.top();
    var lower = pos.maxY() - insets.bottom();
    var span = lower - upper; 
    var base = lower - 0.18 * span;
    ctx.drawString(this._text, pos.x() + insets.left(), base);
};
"use strict";

/**
 * Constructor for a new bin for use in a HistogramDataset.
 * 
 * @param {number} xmin  the lower bound for the bin.
 * @param {number} xmax  the upper bound for the bin.
 * @param {boolean} [incmin]  is the bin range inclusive of the minimum value 
 *     (optional, defaults to true).
 * @param {boolean} [incmax]  is the bin range inclusive of the maximum value 
 *     (optional, defaults to true).
 * @constructor
 * @classdesc A bin for a HistogramDataset.
 */
jsfc.Bin = function(xmin, xmax, incmin, incmax) {
    this.xmin = xmin;
    this.xmax = xmax;
    this.incMin = (incmin !== false);
    this.incMax = (incmax !== false);
    this.count = 0.0;
};

/**
 * Returns true if the value falls within the bin range, and false otherwise.
 * 
 * @param {!number} value  the value.
 * 
 * @returns {boolean} A boolean.
 */
jsfc.Bin.prototype.includes = function(value) {
    if (value < this.xmin) {
        return false;
    }
    if (value === this.xmin) {
        return this.incMin;
    }
    if (value > this.xmax) {
        return false;
    }
    if (value === this.xmax) {
        return this.incMax;
    }
    return true;
};

/**
 * Returns true if this bin overlaps the specified bin, and false otherwise.
 * 
 * @param {jsfc.Bin} bin  the bin to check.
 * 
 * @returns {boolean} A boolean.
 */
jsfc.Bin.prototype.overlaps = function(bin) {
    if (this.xmax < bin.xmin) {
        return false;
    }
    if (this.xmin > bin.xmax) {
        return false;
    }
    if (this.xmax === bin.xmin) {
        if (!(this.incMax && bin.incMin)) {
            return false;
        }
    }
    if (this.xmin === bin.xmax) {
        if (!(this.incMin && bin.incMax)) {
            return false;
        }
    }
    return true;
};

/**
 * A collection of utility functions for working with datasets.
 * @namespace
 */
jsfc.DatasetUtils = {};

/**
 * Creates and returns a new dataset containing the base values that are
 * required to create a stacked bar or area chart.
 * 
 * @param {jsfc.KeyedValues2DDataset} dataset  the source dataset.
 * @param {number} [baseline]  the baseline value (defaults to 0.0).
 * 
 * @returns {jsfc.KeyedValues2DDataset} A new dataset containing the base
 *    values.
 */
jsfc.DatasetUtils.extractStackBaseValues = function(dataset, baseline) {
    baseline = typeof baseline !== 'undefined' ? baseline : 0.0;
    var result = new jsfc.KeyedValues2DDataset();
    var columnCount = dataset.columnCount();
    var rowCount = dataset.rowCount();
    for (var c = 0; c < columnCount; c++) {
        var columnKey = dataset.columnKey(c);
        var posBase = baseline;
        var negBase = baseline;
        for (var r = 0; r < rowCount; r++) {
            var y = dataset.valueByIndex(r, c);
            var rowKey = dataset.rowKey(r);
            if (r > 0) {                
                if (y >= 0) {
                    result.add(rowKey, columnKey, posBase);
                } else {
                    result.add(rowKey, columnKey, negBase);
                }
            } else { // row 0 should contain the baseline value for all entries
                result.add(rowKey, columnKey, baseline);   
            } 
            if (y > 0) {
                posBase = posBase + y;
            }
            if (y < 0) {
                negBase = negBase + y;
            }
        }
    }
    return result;
};

/**
 * Creates and returns a new XYDataset by extracting data from the specified 
 * columns (to form a single series in the new dataset).
 * 
 * @param {jsfc.KeyedValues2DDataset} dataset  the dataset.
 * @param {!string} xcol  the key for the column containing the x-values.
 * @param {!string} ycol  the key for the column containing the y-values.
 * @param {string} [seriesKey]  the key to use for the series in the new 
 *         dataset (defaults to 'series 1').
 * @returns {jsfc.XYDataset} The XY dataset.
 */
jsfc.DatasetUtils.extractXYDatasetFromColumns2D = function(dataset, xcol, 
        ycol, seriesKey) {
    jsfc.Args.requireString(xcol, "xcol");
    jsfc.Args.requireString(ycol, "ycol");
    var result = new jsfc.StandardXYDataset();
    seriesKey = seriesKey || "series 1";
    for (var r = 0; r < dataset.rowCount(); r++) {
        var rowKey = dataset.rowKey(r);
        var x = dataset.valueByKey(rowKey, xcol);
        var y = dataset.valueByKey(rowKey, ycol);
        result.add(seriesKey, x, y);
        var rowPropKeys = dataset.getRowPropertyKeys(rowKey);
        var xPropKeys = dataset.getItemPropertyKeys(rowKey, xcol);
        var yPropKeys = dataset.getItemPropertyKeys(rowKey, ycol);
        var itemIndex = result.itemCount(0) - 1;
        rowPropKeys.forEach(function(key) {
            var p = dataset.getRowProperty(rowKey, key);
            result.setItemPropertyByIndex(0, itemIndex, key, p);
        });
        xPropKeys.forEach(function(key) {
            var p = dataset.getItemProperty(rowKey, xcol, key);
            result.setItemPropertyByIndex(0, itemIndex, key, p); 
        });
        yPropKeys.forEach(function(key) {
            var p = dataset.getItemProperty(rowKey, ycol, key);
            result.setItemPropertyByIndex(0, itemIndex, key, p); 
        });
    }

    // special handling for 'symbols' property
    var xsymbols = dataset.getColumnProperty(xcol, "symbols");
    if (xsymbols) {
        result.setProperty("x-symbols", xsymbols);
    }
    var ysymbols = dataset.getColumnProperty(ycol, "symbols");
    if (ysymbols) {
        result.setProperty("y-symbols", ysymbols);
    }
    
    return result;
};

/**
 * Creates and returns a new XYDataset by extracting a single series of data
 * from the specified rows.
 * 
 * @param {jsfc.KeyedValues2DDataset} dataset  the dataset.
 * @param {string} xrow  the key for the row containing the x-values.
 * @param {string} yrow  the key for the row containing the y-values.
 * @returns {jsfc.XYDataset} The XY dataset.
 */
jsfc.DatasetUtils.extractXYDatasetFromRows2D = function(dataset, xrow, 
        yrow, seriesKey) {
    var result = new jsfc.StandardXYDataset();
    seriesKey = seriesKey || "series 1";
    for (var c = 0; c < dataset.columnCount(); c++) {
        var colKey = dataset.columnKey(c);
        var x = dataset.valueByKey(xrow, colKey);
        var y = dataset.valueByKey(yrow, colKey);
        result.add(seriesKey, x, y);
        var colPropKeys = dataset.getColumnPropertyKeys(colKey);
        var xPropKeys = dataset.getItemPropertyKeys(xrow, colKey);
        var yPropKeys = dataset.getItemPropertyKeys(yrow, colKey);
        var itemKey = result.getItemKey(0, result.itemCount(0) - 1);
        colPropKeys.forEach(function(key) {
            var p = dataset.getColumnProperty(colKey, key);
            result.setItemProperty(seriesKey, itemKey, key, p); 
        });
        xPropKeys.forEach(function(key) {
            var p = dataset.getItemProperty(xrow, colKey, key);
            result.setItemProperty(seriesKey, itemKey, key, p); 
        });
        yPropKeys.forEach(function(key) {
            var p = dataset.getItemProperty(yrow, colKey, key);
            result.setItemProperty(seriesKey, itemKey, key, p); 
        });
    }

    // special handling for 'symbols' property
    var xsymbols = dataset.getRowProperty(xrow, "symbols");
    if (xsymbols) {
        result.setProperty("x-symbols", xsymbols);
    }
    var ysymbols = dataset.getRowProperty(yrow, "symbols");
    if (ysymbols) {
        result.setProperty("y-symbols", ysymbols);
    }
    
    return result;
};

/**
 * Creates a new XYDataset by extracting values from selected columns of
 * a KeyedValues3DDataset.
 * 
 * @param {!jsfc.KeyedValues3DDataset} dataset  the source dataset.
 * @param {!string} xcol  the key for the column containing the x-values.
 * @param {!string} ycol  the key for the column containing the y-values.
 * @returns {jsfc.XYDataset} A new XYDataset.
 */
jsfc.DatasetUtils.extractXYDatasetFromColumns = function(dataset, xcol, ycol) {
    var result = new jsfc.StandardXYDataset();
    for (var s = 0; s < dataset.seriesCount(); s++) {
        var seriesKey = dataset.seriesKey(s);
        for (var r = 0; r < dataset.rowCount(); r++) {
            var rowKey = dataset.rowKey(r);
            var x = dataset.valueByKey(seriesKey, rowKey, xcol);
            if (x === null) continue;
            var xPropKeys = dataset.propertyKeys(seriesKey, rowKey, xcol);
            var y = dataset.valueByKey(seriesKey, rowKey, ycol);
            var yPropKeys = dataset.propertyKeys(seriesKey, rowKey, ycol);
            result.add(seriesKey, x, y);
            var itemKey = result.getItemKey(s, result.itemCount(s) - 1);
            xPropKeys.forEach(function(key) {
                var p = dataset.getProperty(seriesKey, rowKey, xcol, key);
                result.setItemProperty(seriesKey, itemKey, key, p); 
            });
            yPropKeys.forEach(function(key) {
                var p = dataset.getProperty(seriesKey, rowKey, ycol, key);
                result.setItemProperty(seriesKey, itemKey, key, p); 
            });
        }
    }
    return result;
};

/**
 * Creates a new jsfc.XYDataset by extracting values from selected rows of
 * a KeyedValues3DDataset.
 * 
 * @param {!jsfc.KeyedValues3DDataset} dataset  the source dataset.
 * @param {!string} xrow  the key for the row containing the x-values.
 * @param {!string} yrow  the key for the row containing the y-values.
 * @returns {jsfc.XYDataset} A new XYDataset.
 */
jsfc.DatasetUtils.extractXYDatasetFromRows = function(dataset, xrow, yrow) {
    var result = new jsfc.StandardXYDataset();
    for (var s = 0; s < dataset.seriesCount(); s++) {
        var seriesKey = dataset.seriesKey(s);
        for (var c = 0; c < dataset.columnCount(); c++) {
            var colKey = dataset.columnKey(c);
            var x = dataset.valueByKey(seriesKey, xrow, colKey);
            if (x === null) continue;
            var xPropKeys = dataset.propertyKeys(seriesKey, xrow, colKey);
            var y = dataset.valueByKey(seriesKey, yrow, colKey);
            var yPropKeys = dataset.propertyKeys(seriesKey, yrow, colKey);
            var itemKey = result.getItemKey(s, result.itemCount(s) - 1);
            xPropKeys.forEach(function(key) {
                var p = dataset.getProperty(seriesKey, xrow, colKey, key);
                result.setItemProperty(seriesKey, itemKey, key, p); 
            });
            yPropKeys.forEach(function(key) {
                var p = dataset.getProperty(seriesKey, yrow, colKey, key);
                result.setItemProperty(seriesKey, itemKey, key, p); 
            });
            result.add(seriesKey, x, y);
        }
    }
    return result;
};

"use strict";

/**
 * Creates a new (empty) HistogramDataset.
 * @classdesc A dataset that summarises univariate data according to predefined 
 *     bins.
 * @constructor
 * @implements {jsfc.IntervalXYDataset}
 * @param {!string} seriesKey  the series key (null not permitted).
 */
jsfc.HistogramDataset = function(seriesKey) {
    this._seriesKey = seriesKey;
    this._bins = [];
    this._selections = [];
    this._listeners = [];
};

/**
 * Returns the number of bins in the dataset.
 * 
 * @returns {!number} The bin count.
 */
jsfc.HistogramDataset.prototype.binCount = function() {
    return this._bins.length;
};

/**
 * Returns true if the dataset is empty (all bins have a zero count) and
 * false otherwise.
 * 
 * @returns {!boolean} A boolean.
 */
jsfc.HistogramDataset.prototype.isEmpty = function() {
    // return false if there is any bin with a non-zero count
    var result = true;
    this._bins.forEach(function(bin) { 
        if (bin.count > 0.0) {
            result = false;
        };
    });
    return result;
};

/**
 * Adds a new bin to the dataset.
 * 
 * @param {!number} xmin  the lower bound for the bin.
 * @param {!number} xmax  the upper bound for the bin.
 * @param {boolean} [incmin]  is the bin range inclusive of the minimum value? 
 *         (optional, defaults to true).
 * @param {boolean} [incmax]  is the bin range inclusive of the maximum value? 
 *         (optional, defaults to true).
 * 
 * @returns {jsfc.HistogramDataset} This dataset (for method chaining).
 */
jsfc.HistogramDataset.prototype.addBin = function(xmin, xmax, incmin, incmax) {
    var incmin_ = incmin !== false;
    var incmax_ = incmax !== false;
    var bin = new jsfc.Bin(xmin, xmax, incmin_, incmax_);
    // check that this bin does not overlap any existing bins TODO
    this._bins.push(bin);
    return this;
};

/**
 * Returns true if the specified bin overlaps with any of the existing bins in
 * the dataset.
 * 
 * @param {!jsfc.Bin} bin  the bin.
 * @returns {!boolean} A boolean.
 */
jsfc.HistogramDataset.prototype.isOverlapping = function(bin) {
    for (var i = 0; i < this._bins.length; i++) {
        if (this._bins[i].overlaps(bin)) {
            return true;
        }
    }
    return false;
};

/**
 * Returns the mid-point on the x-axis for the bin with the specified index.
 * 
 * @param {!number} binIndex  the bin index.
 * @returns {!number} The mid-point for a bin.
 */
jsfc.HistogramDataset.prototype.binMid = function(binIndex) {
    var bin = this._bins[binIndex];
    return (bin.xmin + bin.xmax) / 2;    
};

/**
 * Returns the lower bound (on the x-axis) for the bin with the specified index.
 * 
 * @param {!number} binIndex  the bin index.
 * @returns {!number} The lower bound for a bin.
 */
jsfc.HistogramDataset.prototype.binStart = function(binIndex) {
    return this._bins[binIndex].xmin;
};

/**
 * Returns the upper bound (on the x-axis) for the bin with the specified index.
 * 
 * @param {!number} binIndex  the bin index.
 * @returns {!number} The upper bound for a bin.
 */
jsfc.HistogramDataset.prototype.binEnd = function(binIndex) {
    return this._bins[binIndex].xmax;
};

/**
 * Returns the count for the bin with the specified index.
 * 
 * @param {!number} binIndex  the bin index.
 * @returns {!number} The y-value (the count for the bin).
 */
jsfc.HistogramDataset.prototype.count = function(binIndex) {
    return this._bins[binIndex].count;    
};

/**
 * Resets the counters in all bins (to 0.0).
 * @returns {jsfc.HistogramDataset} 'this' (for chaining method calls).
 */
jsfc.HistogramDataset.prototype.reset = function() {
    this._bins.forEach(function(bin) { bin.count = 0; } );
    return this;
};

/**
 * Returns the index of the bin that will contain the specified value, or
 * -1 if there is no such bin.
 * @param {!number} value  the data value to be placed in a bin.
 * @returns {!number} The index of the bin in which the value belongs.
 */
jsfc.HistogramDataset.prototype._binIndex = function(value) {
    for (var i = 0; i < this._bins.length; i++) {
        if (this._bins[i].includes(value)) {
            return i;
        }
    }
    return -1;
};

/**
 * Returns the bounds for this dataset as an array in the form
 * [xmin, xmax, ymin, ymax].
 * 
 * @returns {Array} The bounds.
 */
jsfc.HistogramDataset.prototype.bounds = function() {
    var xmin = Number.POSITIVE_INFINITY;
    var xmax = Number.NEGATIVE_INFINITY;
    var ymin = 0.0;
    var ymax = 0.0;
    for (var i = 0; i < this.binCount(); i++) {
        var bin = this._bins[i];
        xmin = Math.min(xmin, bin.xmin);
        xmax = Math.max(xmax, bin.xmax);
        ymin = Math.min(ymin, bin.y);
        ymax = Math.max(ymax, bin.y);
    }
    return [xmin, xmax, ymin, ymax];
};

/**
 * Adds a value to the dataset (by finding the bin that the value belongs to
 * and incrementing the count for that bin).
 * 
 * @param {number} value  the data value.
 * @param {boolean} [notify]  notify listeners? (optional, defaults to true)
 * @returns {jsfc.HistogramDataset} 'this' (for chaining method calls).
 */
jsfc.HistogramDataset.prototype.add = function(value, notify) {
    var binIndex = this._binIndex(value);
    if (binIndex >= 0) {
        this._bins[binIndex].count++;        
    } else {
        throw new Error("No bin for the value " + value);
    }
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Adds an array of values to the dataset
 * @param {Array} values an array of Numbers
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.HistogramDataset} 'this' (for chaining method calls).
 */
jsfc.HistogramDataset.prototype.addAll = function(values, notify) {
    var me = this;
    values.forEach(function(v) { me.add(v, false); });
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

// the methods below augment the API to make it appear like an XYDataset

/**
 * Returns the number of series in the dataset.  It is always 1 for the
 * HistogramDataset.
 * 
 * @returns {number} The series count.
 */
jsfc.HistogramDataset.prototype.seriesCount = function() {
    return 1;
};

/**
 * Returns the number of items in the specified series.  Bear in mind that
 * the dataset has only one series, and the number of items is the same as
 * the number of bins.
 * 
 * @param {number} seriesIndex  the series index.
 * 
 * @returns {number} The item count.
 */
jsfc.HistogramDataset.prototype.itemCount = function(seriesIndex) {
    return this.binCount();
};

/**
 * Returns [xmin, xmax] where xmin is the lowest x-value in the dataset and
 * xmax is this highest x-value in the dataset.  If the dataset is empty,
 * this method returns [POSITIVE_INFINITIY, NEGATIVE_INFINITY] (maybe we'll
 * change this).
 * 
 * @returns {Array}
 */
jsfc.HistogramDataset.prototype.xbounds = function() {
    var xmin = Number.POSITIVE_INFINITY;
    var xmax = Number.NEGATIVE_INFINITY;
    for (var s = 0; s < this.seriesCount(); s++) {
        for (var i = 0; i < this.itemCount(s); i++) {
            var xs = this.xStart(s, i);
            var xe = this.xEnd(s, i);
            xmin = Math.min(xmin, xs);
            xmax = Math.max(xmax, xe);
        }
    }
    return [xmin, xmax];    
};

/**
 * Returns [ymin, ymax] where ymin is the lowest y-value in the dataset and
 * xmax is this highest y-value in the dataset.  If the dataset is empty,
 * this method returns [POSITIVE_INFINITIY, NEGATIVE_INFINITY] (maybe we'll
 * change this).
 * 
 * @returns {Array}
 */
jsfc.HistogramDataset.prototype.ybounds = function() {
    var ymin = Number.POSITIVE_INFINITY;
    var ymax = Number.NEGATIVE_INFINITY;
    for (var s = 0; s < this.seriesCount(); s++) {
        for (var i = 0; i < this.itemCount(s); i++) {
            var y = this.y(s, i);
            ymin = Math.min(ymin, y);
            ymax = Math.max(ymax, y);
        }
    }
    return [ymin, ymax];    
};

/**
 * Returns an array containing the keys for all the series in the dataset.
 * 
 * @returns {Array} The series keys.
 */
jsfc.HistogramDataset.prototype.seriesKeys = function() {
    return [this._seriesKey];
};

/**
 * Returns the index for the series with the specified key, or -1.
 * 
 * @param {string} seriesKey  the series key.
 * 
 * @returns {number} The series index.
 */
jsfc.HistogramDataset.prototype.seriesIndex = function(seriesKey) {
    if (seriesKey === this._seriesKey) {
        return 0;
    }
    return -1;
};

/**
 * Returns the key for the series with the specified index.
 * 
 * @param {number} seriesIndex  the series index.
 * 
 * @returns {string} The series key.
 */
jsfc.HistogramDataset.prototype.seriesKey = function(seriesIndex) {
    if (seriesIndex === 0) {
        return this._seriesKey;
    }
    throw new Error("Invalid seriesIndex: " + seriesIndex);
};

/**
 * Returns the item key for an item.  All items will have a key that is unique
 * within the series (either auto-generated or explicitly set).
 * 
 * @param {number} seriesIndex
 * @param {number} itemIndex
 * @returns {number|string}
 */
jsfc.HistogramDataset.prototype.getItemKey = function(seriesIndex, 
        itemIndex) {
    if (seriesIndex === 0) {
        return itemIndex;  // for now we will use the bin index as the key
    }
    throw new Error("Invalid seriesIndex: " + seriesIndex);
};

/**
 * Returns the index of the item in the specified series that has the specified
 * item key.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @returns {!number} The item index.
 */
jsfc.HistogramDataset.prototype.itemIndex = function(seriesKey, itemKey) {
    if (seriesKey === this._seriesKey) {
        // find the bin with the specified key
        return itemKey; // for now we are assuming the key is a number that is the index of the bin
    }
    throw new Error("Invalid seriesIndex: " + seriesKey);
};

/**
 * Returns the x-value for an item in a series.  This corresponds to the 
 * mid-point on the x-axis for the bin with the specified index.
 * 
 * @param {!number} seriesIndex  the bin index.
 * @param {!number} itemIndex  the bin index.
 * @returns {!number} The mid-point for a bin.
 */
jsfc.HistogramDataset.prototype.x = function(seriesIndex, itemIndex) {
    return this.binMid(itemIndex);    
};

/**
 * Returns the start value for the x-interval of the item with the specified
 * series and item indices.  This is for implementing the IntervalXYDataset 
 * interface.
 * 
 * @param {!number} seriesIndex  the series index.
 * @param {!number} itemIndex  the item index.
 * @returns {number} The start value of the x-interval.
 */
jsfc.HistogramDataset.prototype.xStart = function(seriesIndex, itemIndex) {
    return this.binStart(itemIndex);    
};

/**
 * Returns the end value for the x-interval of the item with the specified
 * series and item indices.  This is for implementing the IntervalXYDataset 
 * interface.
 * 
 * @param {!number} seriesIndex  the series index.
 * @param {!number} itemIndex  the item index.
 * @returns {number} The start value of the x-interval.
 */
jsfc.HistogramDataset.prototype.xEnd = function(seriesIndex, itemIndex) {
    return this.binEnd(itemIndex);    
};

/**
 * Returns the y-value for the specified item.  Keep in mind that this dataset
 * has a single series, and the item indices correspond to the bin indices.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * @returns {number}
 */
jsfc.HistogramDataset.prototype.y = function(seriesIndex, itemIndex) {
    return this.count(itemIndex);    
};

/**
 * Returns a property for the specified data item.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string} itemKey  the item key.
 * @param {string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.HistogramDataset.prototype.getProperty = function(seriesKey, itemKey, 
        propertyKey) {
    return null;  // FIXME: implement this
};

/**
 * Registers a listener to receive notification of changes to this dataset.
 * 
 * @param {Object} listenerObj  the listener to register.
 * @returns {jsfc.HistogramDataset} This dataset (for chaining method calls).
 */
jsfc.HistogramDataset.prototype.addListener = function(listenerObj) {
    this._listeners.push(listenerObj);
    return this;
};

/**
 * Deregisters a listener so that it no longer receives notification of changes
 * to the dataset.
 * 
 * @param {Object} listenerObj  the listener to remove.
 * @returns {jsfc.HistogramDataset} This dataset (for chaining method calls).
 */
jsfc.HistogramDataset.prototype.removeListener = function(listenerObj) {
    var i = this._listeners.indexOf(listenerObj);
    if (i >= 0) {
        this._listeners.splice(i, 1);
    }
    return this;
};

/**
 * Notifies all registered listeners that this dataset has changed. 
 * @returns {jsfc.HistogramDataset} This dataset (for chaining method calls).
 */
jsfc.HistogramDataset.prototype.notifyListeners = function() {
    for (var i = 0; i < this._listeners.length; i++) {
        this._listeners[i].datasetChanged(this);
    }
    return this;
};


/**
 * An extension of the XYDataset interface.
 *  
 * @interface
 */
jsfc.IntervalXYDataset = function() {
    throw new Error("Interface only.");
};

/**
 * Returns the value of a property for the dataset.
 * 
 * @param {!string} key  the property key.
 * @returns {*} The property value.
 */
jsfc.IntervalXYDataset.prototype.getProperty = function(key) {    
};

/**
 * Sets the value of a property for the dataset.
 * 
 * @param {!string} key  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (the default is true).
 */
jsfc.IntervalXYDataset.prototype.setProperty = function(key, value, notify) {    
};

/**
 * Returns an array containing all the keys of the properties defined for
 * this dataset.
 * 
 * @returns {Array}
 */
jsfc.IntervalXYDataset.prototype.getPropertyKeys = function() {
};

/**
 * Clears the dataset-level properties and sends a change notification to
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {boolean} [notify] notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.IntervalXYDataset.prototype.clearProperties = function(notify) {  
};

/**
 * Returns the number of series in the dataset.
 * 
 * @returns {number} The series count.
 */
jsfc.IntervalXYDataset.prototype.seriesCount = function() {
};

/**
 * Returns an array containing the keys for all the series in the dataset.
 * 
 * @returns {Array} The series keys.
 */
jsfc.IntervalXYDataset.prototype.seriesKeys = function() {
};

/**
 * Returns the key for the series with the specified index.
 * 
 * @param {number} seriesIndex  the series index.
 * 
 * @returns {string} The series key.
 */
jsfc.IntervalXYDataset.prototype.seriesKey = function(seriesIndex) {
};

/**
 * Returns the index for the series with the specified key, or -1.
 * 
 * @param {string} seriesKey  the series key.
 * 
 * @returns {number} The series index.
 */
jsfc.IntervalXYDataset.prototype.seriesIndex = function(seriesKey) {
};

/**
 * Returns the number of items in the specified series.
 * 
 * @param {number} seriesIndex  the series index.
 * 
 * @returns {number} The item count.
 */
jsfc.IntervalXYDataset.prototype.itemCount = function(seriesIndex) {
};

/**
 * Returns the index of the item in the specified series that has the specified
 * item key.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!Object} itemKey  the item key.
 * @returns {number} The item index.
 */
jsfc.IntervalXYDataset.prototype.itemIndex = function(seriesKey, itemKey) {
};

/**
 * Returns the x-value for an item in a series.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {number} The x-value.
 */
jsfc.IntervalXYDataset.prototype.x = function(seriesIndex, itemIndex) {
};

/**
 * Returns the y-value for an item in a series.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {number} The y-value.
 */
jsfc.IntervalXYDataset.prototype.y = function(seriesIndex, itemIndex) {  
};

/**
 * Returns one item from a series.  The return value is an object with the form
 * {"x": x, "y": y, "key": key}.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * @returns {Object} A data item.
 */
jsfc.IntervalXYDataset.prototype.item = function(seriesIndex, itemIndex) {
};

/**
 * Registers a listener to receive notification of changes to the dataset. The
 * listener must have a 'datasetChanged(KeyedValuesDataset)' method.
 * 
 * @param {Function} listener  the listener object.
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.IntervalXYDataset.prototype.addListener = function(listener) {
};

/**
 * Removes a listener so that it will no longer receive notification of changes
 * to this dataset.
 * 
 * @param {Function} listener the listener.
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.IntervalXYDataset.prototype.removeListener = function(listener) {
};

/**
 * The bounds for the data values.  This method returns an array in the form
 * [xmin, xmax, ymin, ymax].
 * 
 * @returns {Array} An array containing the dataset bounds.
 */
jsfc.IntervalXYDataset.prototype.bounds = function() {
};

/**
 * Returns [xmin, xmax] where xmin is the lowest x-value in the dataset and
 * xmax is this highest x-value in the dataset.  If the dataset is empty,
 * this method returns [POSITIVE_INFINITIY, NEGATIVE_INFINITY] (maybe we'll
 * change this).
 * 
 * @returns {Array}
 */
jsfc.IntervalXYDataset.prototype.xbounds = function() {
};

/**
 * Returns [ymin, ymax] where ymin is the lowest y-value in the dataset and
 * xmax is this highest y-value in the dataset.  If the dataset is empty,
 * this method returns [POSITIVE_INFINITIY, NEGATIVE_INFINITY] (maybe we'll
 * change this).
 * 
 * @returns {Array}
 */
jsfc.IntervalXYDataset.prototype.ybounds = function() {   
};

/**
 * Returns a property for the specified data item.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.IntervalXYDataset.prototype.getItemProperty = function(seriesKey, itemKey, 
        propertyKey) {
};

/**
 * Marks an item as selected within a selection with the specified ID.
 * 
 * @param {!string} selectionId  the selection id.
 * @param {!string} seriesKey  the series key.
 * @param {!Object} itemKey  the item key.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * 
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.IntervalXYDataset.prototype.select = function(selectionId, seriesKey, itemKey, 
        notify) {
};

/**
 * Unselects the specified item, returning true if the item was previously 
 * selected and false otherwise (in other words, the return value is true if
 * there is a state change). 
 * 
 * @param {!string} selectionId  the ID for the set of selected items.
 * @param {!string} seriesKey  the series key.
 * @param {!Object} itemKey  the item key.
 * 
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.IntervalXYDataset.prototype.unselect = function(selectionId, seriesKey, itemKey) {
};

/**
 * Returns true if the specified item is selected (for the given selectionId) 
 * and false otherwise.
 * 
 * @param {!string} selectionId  the selection ID.
 * @param {!string} seriesKey  the series key.
 * @param {!Object} itemKey  the item key.
 * 
 * @returns {boolean} The selection state.
 */
jsfc.IntervalXYDataset.prototype.isSelected = function(selectionId, seriesKey, 
        itemKey) {
};

/**
 * Clears any items from the selection with the specified id.
 * 
 * @param {string} selectionId  the selection it.
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.IntervalXYDataset.prototype.clearSelection = function(selectionId) {
};

/**
 * Returns the start value for the x-interval of the item with the specified
 * series and item indices.
 * 
 * @param {!number} seriesIndex  the series index.
 * @param {!number} itemIndex  the item index.
 * @returns {number} The start value of the x-interval.
 */
jsfc.IntervalXYDataset.prototype.xStart = function(seriesIndex, itemIndex) {    
};

/**
 * Returns the end value for the x-interval of the item with the specified
 * series and item indices.
 * 
 * @param {!number} seriesIndex  the series index.
 * @param {!number} itemIndex  the item index.
 * @returns {number} The start value of the x-interval.
 */
jsfc.IntervalXYDataset.prototype.xEnd = function(seriesIndex, itemIndex) {
};


/**
 * Creates a new (empty) dataset instance.
 * @constructor
 * @implements {jsfc.Values2DDataset}
 * @classdesc A dataset that is a two-dimensional table where each column is 
 *     identified by a unique key, each row is identified by a unique key, and
 *     each element (identified by a (rowKey, columnKey) pair) contains a 
 *     numeric value (possibly null).  Such a table can be used to create
 *     bar and stacked-bar charts, where each row represents a data series and
 *     the columns represent the items within the data series.
 *     <p>A typical dataset will serialise to JSON format as follows:</p>
 *     <blockquote>{"data":{"columnKeys":["C1","C2","C3"],"rows":[{"key":"R1","values":[1.1,2.2,3.3]},{"key":"R2","values":[4.4,6.6,null]}]},"selections":[{"id":"hilite","items":[{"rowKey":"R2","columnKey":"C1"},{"rowKey":"R2","columnKey":"C2"}]},{"id":"selection","items":[{"rowKey":"R1","columnKey":"C1"}]}],"_listeners":[]}</blockquote>
 */
jsfc.KeyedValues2DDataset = function() {
    if (!(this instanceof jsfc.KeyedValues2DDataset)) {
        return new jsfc.KeyedValues2DDataset();
    }
    this.data = { "columnKeys": [], "rows": []};
    // the 'dataset' properties will be stored in a jsfc.Map, for the column
    // properties there will be one entry in the array per column, and for
    // the row properties there will be one entry per row (either null or a
    // jsfc.Map)
    this.properties = { "dataset": null, "columns": [], "rows": [] };
    this.selections = [];
    this._rowKeyToIndexMap = new jsfc.Map();
    this._columnKeyToIndexMap = new jsfc.Map();
    this._listeners = [];
};

/**
 * Returns the number of rows in the dataset.
 * @returns {!number} The row count.
 */
jsfc.KeyedValues2DDataset.prototype.rowCount = function() {
    return this.data.rows.length;
};

/**
 * Returns the number of columns in the dataset.
 * @returns {!number} The column count.
 */
jsfc.KeyedValues2DDataset.prototype.columnCount = function() {
    return this.data.columnKeys.length; 
};

/**
 * Returns true if the dataset is empty, and false otherwise.  Note that a 
 * dataset that contains all null values or all zero values is not considered
 * empty - it is required that the dataset contains zero rows and zero columns
 * to be considered empty.
 * 
 * @returns {boolean} A boolean.
 */
jsfc.KeyedValues2DDataset.prototype.isEmpty = function() {
    if (!this.data.hasOwnProperty("columnKeys")) {
        return true;
    }
    return (this.data.columnKeys.length === 0 && this.data.rows.length === 0);
};

/**
 * Adds a value to the dataset for the specified cell identified by the row
 * and column keys.  If necessary, a new row and/or column will be added to the
 * dataset.
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @param {number} value  the value.
 * @param {boolean} [notify]  notify listeners? (the default is true).
 * @returns {jsfc.KeyedValues2DDataset} This dataset for chaining method calls.
 */
jsfc.KeyedValues2DDataset.prototype.add = function(rowKey, columnKey, value, 
        notify) {
    if (this.isEmpty()) {
        this.data.columnKeys.push(columnKey);
        this._columnKeyToIndexMap.put(columnKey, 0);
        this.data.rows.push({"key": rowKey, "values": [value]});
        this.properties.columns.push(null);
        this.properties.rows.push({"key": rowKey, "rowProperties": null, 
            "maps": [null]});
        this._rowKeyToIndexMap.put(rowKey, 0);
        return this;
    }
    var columnIndex = this.columnIndex(columnKey);
    if (columnIndex < 0) {
        // add the column key and insert a null data item in all existing rows
        var i = this.data.columnKeys.push(columnKey);
        this._columnKeyToIndexMap.put(columnKey, i - 1);
        this.properties.columns.push(null);
        var rowCount = this.data.rows.length;
        for (var r = 0; r < rowCount; r++) {
            this.data.rows[r].values.push(null);
            this.properties.rows[r].maps.push(null);
        }
        columnIndex = this.columnCount() - 1;
    }
    var rowIndex = this.rowIndex(rowKey);
    if (rowIndex < 0) {
        var rowData = new Array(this.columnCount());
        rowData[columnIndex] = value;
        var i = this.data.rows.push({"key": rowKey, "values": rowData});
        this._rowKeyToIndexMap.put(rowKey, i - 1);
        var rowItemProperties = new Array(this.columnCount());
        this.properties.rows.push({"key": rowKey, "maps": rowItemProperties});
    } else {
        // update an existing data item
        this.data.rows[rowIndex].values[columnIndex] = value;
    }
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Parses the supplied JSON-format string to populate the 'data' attribute
 * for this dataset.
 * 
 * @param {string} jsonStr  a string in JSON format.
 * @param {boolean} [notify]  notify listeners (optional, defaults to true).
 * 
 * @returns {jsfc.KeyedValues2DDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValues2DDataset.prototype.parse = function(jsonStr, notify) {
    this.load(JSON.parse(jsonStr));
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Loads the supplied data object into the dataset.  The object must be either
 * an empty object {} or an object with properties "columnKeys" (an array of 
 * strings) and "rows" (an array of row objects, where each row object has a 
 * "key" attribute (a string that is the unique key identifying the row, and a 
 * "values" array containing the data values (there should be the same number 
 * of values as there are columns in the dataset - data values can be null.
 * 
 * @param {*} data  the data object.
 * @param {boolean} [notify]  notify listeners? (optional, defaults to true).
 * 
 * @returns {jsfc.KeyedValues2DDataset} This dataset (for chaining method 
 *         calls).
 */
jsfc.KeyedValues2DDataset.prototype.load = function(data, notify) {
    this.data = data;
    if (!this.data.hasOwnProperty("rows")) {
        this.data.rows = [];
    }
    if (!this.data.hasOwnProperty("columnKeys")) {
        this.data.columnKeys = [];
    }
    this._columnKeyToIndexMap = this._buildKeyMap(this.data.columnKeys);
    this._rowKeyToIndexMap = this._buildKeyMap(this.rowKeys());
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

jsfc.KeyedValues2DDataset.prototype._buildKeyMap = function(keys) {
    var map = new jsfc.Map();
    for (var i = 0; i < keys.length; i++) {
        map.put(keys[i], i);
    }
    return map;
};

/**
 * Returns the data value in the cell with the specified row and column indices.
 * 
 * @param {!number} r  the row index.
 * @param {!number} c  the column index.
 * @returns {number} The data value.
 */
jsfc.KeyedValues2DDataset.prototype.valueByIndex = function(r, c) {
    return this.data.rows[r].values[c];
};

/**
 * Returns the key for the row with the specified index.
 * 
 * @param {!number} r  the row index.
 * @returns {string} The row key.
 */
jsfc.KeyedValues2DDataset.prototype.rowKey = function(r) {
    return this.data.rows[r].key;
};

/**
 * Returns the index of the row with the specified key, or -1 if there is no
 * such row.
 * 
 * @param {!string} key  the row key.
 * @returns {number} The row index, or -1.
 */
jsfc.KeyedValues2DDataset.prototype.rowIndex = function(key) {
    var r = this._rowKeyToIndexMap.get(key);
    if (r !== undefined) {
        return r;
    }
    return -1;    
};

/**
 * Returns an array containing all the row keys for this dataset in the order
 * of their respective row indices.
 * 
 * @returns {Array} An array of row keys.
 */
jsfc.KeyedValues2DDataset.prototype.rowKeys = function() {
    return this.data.rows.map(function(d) { return d.key; }); 
};

/**
 * Returns the column key at the specified index.
 * 
 * @param {!number} c  the column index.
 * @returns The column key.
 */
jsfc.KeyedValues2DDataset.prototype.columnKey = function(c) {
    return this.data.columnKeys[c];  
};

/**
 * Returns the index of the column with the specified key, or -1 if there is no
 * such column.
 * 
 * @param {!string} key  the column key.
 * @returns {number} The column index, or -1.
 */
jsfc.KeyedValues2DDataset.prototype.columnIndex = function(key) {
    var c = this._columnKeyToIndexMap.get(key);
    if (c !== undefined) {
        return c;
    }
    return -1;    
};

/**
 * Returns an array containing all the column keys for this dataset.
 * 
 * @returns {Array} An array of column keys.
 */
jsfc.KeyedValues2DDataset.prototype.columnKeys = function() {
    return this.data.columnKeys.map(function(d) { return d; });
};

/**
 * Returns the value (possibly null) of the cell identified by the supplied
 * row and column keys.
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @returns {number} The data value.
 */
jsfc.KeyedValues2DDataset.prototype.valueByKey = function(rowKey, columnKey) {
    var r = this.rowIndex(rowKey);
    var c = this.columnIndex(columnKey);
    return this.valueByIndex(r, c);
};

/**
 * Returns the value of a property for the dataset.
 * 
 * @param {!string} key  the property key.
 * @returns {*} The property value.
 */
jsfc.KeyedValues2DDataset.prototype.getProperty = function(key) {
    var map = this.properties.dataset;
    if (map) {
        return map.get(key);
    }
    return undefined;
};

/**
 * Sets the value of a property for the dataset.
 * 
 * @param {!string} key  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 */
jsfc.KeyedValues2DDataset.prototype.setProperty = function(key, value, notify) {
    if (!this.properties.dataset) {
        this.properties.dataset = new jsfc.Map();
    }
    this.properties.dataset.put(key, value);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns an array containing all the keys of the properties defined for
 * this dataset.
 * 
 * @returns {Array}
 */
jsfc.KeyedValues2DDataset.prototype.getPropertyKeys = function() {
    if (this.properties.dataset) {
        return this.properties.dataset.keys();
    }
    return [];
};

/**
 * Clears all the dataset-level properties and sends a change notification
 * to registered listeners (unless 'notify' is set to false).
 * 
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {jsfc.KeyedValues2DDataset} This dataset for chaining method calls.
 */
jsfc.KeyedValues2DDataset.prototype.clearProperties = function(notify) {
    this.properties.dataset = null;
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Returns an array containing the keys for the properties (if any) defined
 * on the specified row.
 * 
 * @param {!string} rowKey  the row key.
 * @returns {Array} An array of keys.
 */
jsfc.KeyedValues2DDataset.prototype.getRowPropertyKeys = function(rowKey) {
    var r = this.rowIndex(rowKey);
    var map = this.properties.rows[r].rowProperties;
    if (map) {
        return map.keys();
    } else {
        return [];
    }
};

/**
 * Returns the value of a property for a row.
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.KeyedValues2DDataset.prototype.getRowProperty = function(rowKey, 
        propertyKey) {
    var r = this.rowIndex(rowKey);
    var map = this.properties.rows[r].rowProperties;
    if (map) {
        return map.get(propertyKey);
    } else {
        return undefined;
    }                
};

/**
 * Sets a property for a row and sends a change notification to all 
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} propertyKey  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.KeyedValues2DDataset.prototype.setRowProperty = function(rowKey, 
        propertyKey, value, notify) {
    var r = this.rowIndex(rowKey);
    var map = this.properties.rows[r].rowProperties;
    if (!map) {
        map = new jsfc.Map();
        this.properties.rows[r].rowProperties = map;
    }
    map.put(propertyKey, value);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Clears the row properties for the specified row and sends a change 
 * notification to registered listeners (unless 'notify' is set to false).
 * 
 * @param {!string} rowKey  the row key.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * 
 * @returns {undefined}
 */
jsfc.KeyedValues2DDataset.prototype.clearRowProperties = function(rowKey, 
        notify) {
    var r = this.rowIndex(rowKey);
    this.properties.rows[r].rowProperties = null;    
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns an array containing all the keys for the properties defined for
 * the specified column.
 * 
 * @param {!string} columnKey  the column key.
 * @returns {Array} The property keys.
 */
jsfc.KeyedValues2DDataset.prototype.getColumnPropertyKeys = function(columnKey) {
    var c = this.columnIndex(columnKey);
    var map = this.properties.columns[c];
    if (map) {
        return map.keys();
    } else {
        return [];
    }
};

/**
 * Returns the value of a property defined for the specified column.
 * 
 * @param {!string} columnKey  the column key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.KeyedValues2DDataset.prototype.getColumnProperty = function(columnKey, 
        propertyKey) {
    var c = this.columnIndex(columnKey);
    var map = this.properties.columns[c];
    if (map) {
        return map.get(propertyKey);
    } else {
        return undefined;
    }
};

/**
 * Sets a property for a column and sends a change notification to registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {!string} columnKey  the column key.
 * @param {!string} propertyKey  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.KeyedValues2DDataset.prototype.setColumnProperty = function(columnKey, 
        propertyKey, value, notify) {
    var c = this.columnIndex(columnKey);
    var map = this.properties.columns[c];
    if (!map) {
        map = new jsfc.Map();
        this.properties.columns[c] = map;
    }
    map.put(propertyKey, value);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Clears all the column properties for the specified column and sends a 
 * change notification to registered listeners (unless 'notify' is set to 
 * false).
 * 
 * @param {!string} columnKey  the column key.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.KeyedValues2DDataset.prototype.clearColumnProperties = function(columnKey,
        notify) {
    var c = this.columnIndex(columnKey);
    this.properties.columns[c] = null;      
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns a property for the specified data item.
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.KeyedValues2DDataset.prototype.getItemProperty = function(rowKey, 
        columnKey, propertyKey) {
    var r = this.rowIndex(rowKey);
    var c = this.columnIndex(columnKey);
    var map = this.properties.rows[r][c];
    if (map) {
        return map.get(propertyKey);
    }
};

/**
 * Sets a property for the specified data item and sends a change notification
 * to all registered listeners (unless 'notify' is set to false).
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @param {!string} propertyKey  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.KeyedValues2DDataset.prototype.setItemProperty = function(rowKey, 
        columnKey, propertyKey, value, notify) {
    var r = this.rowIndex(rowKey);
    var c = this.columnIndex(columnKey);
    var map = this.properties.rows[r][c];
    if (!map) {
        map = new jsfc.Map();
        this.properties.rows[r][c] = map;
    }
    map.put(propertyKey, value);
};

/**
 * Returns the keys for the properties defined for a data item in the dataset.
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @returns {Array} An array containing the property keys.
 */
jsfc.KeyedValues2DDataset.prototype.getItemPropertyKeys = function(rowKey, 
        columnKey) {
    var r = this.rowIndex(rowKey);
    var c = this.columnIndex(columnKey);
    var map = this.properties.rows[r][c];
    if (map) {
        return map.keys();
    } else {
        return [];
    }
};

/**
 * Clears all properties for one item and sends a change notification to
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @returns {undefined}
 */
jsfc.KeyedValues2DDataset.prototype.clearItemProperties = function(rowKey, 
        columnKey, notify) {
    var r = this.rowIndex(rowKey);
    var c = this.columnIndex(columnKey);
    this.properties.rows[r][c] = null;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Marks an item as selected within a selection with the specified ID.
 * 
 * @param {string} selectionId  the selection id.
 * @param {string} rowKey  the row key.
 * @param {string} columnKey  the column key.
 * 
 * @returns {jsfc.KeyedValues2DDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValues2DDataset.prototype.select = function(selectionId, rowKey, 
        columnKey) {
    var selection;
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex < 0) { // no selection with that id
        selection = {"id": selectionId, "items": []};
        this.selections.push(selection);
    } else {
        selection = this.selections[selectionIndex];
    }
    var i = jsfc.Utils.findInArray(selection.items, function(item) {
        return (item.rowKey === rowKey && item.columnKey === columnKey); 
    });
    if (i < 0) {
        selection.items.push({"rowKey": rowKey, "columnKey": columnKey});
    }
    return this;
};

/**
 * Resets the selection state of the specified item. 
 * 
 * @param {string} selectionId  the ID for the set of selected items.
 * @param {string} rowKey  the row key.
 * @param {string} columnKey  the column key.
 * 
 * @returns {jsfc.KeyedValues2DDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValues2DDataset.prototype.unselect = function(selectionId, rowKey, 
        columnKey) {
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex >= 0) {
        var selection = this.selections[selectionIndex];
        var i = jsfc.Utils.findInArray(selection.items, function(obj, i) {
            return (obj.rowKey === rowKey && obj.columnKey === columnKey); 
        });
        if (i >= 0) {
            selection.items.splice(i, 1);
        }
    } 
    return this;
};

/**
 * Returns true if the specified item is selected (for the given selectionId) 
 * and false otherwise.
 * 
 * @param {string} selectionId  the selection ID.
 * @param {string} rowKey  the row key.
 * @param {string} columnKey  the column key.
 * 
 * @returns {boolean} A boolean (the selection state).
 */
jsfc.KeyedValues2DDataset.prototype.isSelected = function(selectionId, rowKey, 
        columnKey) {
    var selection;
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex < 0) {
        return false;
    } else {
        selection = this.selections[selectionIndex];
    }
    return (jsfc.Utils.findInArray(selection.items, function(obj) {
        return (obj.rowKey === rowKey && obj.columnKey === columnKey); 
    }) >= 0); 
};

/**
 * Clears any items from the selection with the specified id.
 * 
 * @param {string} selectionId  the selection ID.
 * @returns {jsfc.KeyedValues2DDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValues2DDataset.prototype.clearSelection = function(selectionId) {
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex >= 0) {
        this.selections.splice(selectionIndex, 1);
    }
    return this;
};

/**
 * Returns the index of the selection with the specified ID, or -1 if there is 
 * no such selection.
 * 
 * @param {string} selectionId  the selection ID.
 * @returns {number} The selection index.
 */
jsfc.KeyedValues2DDataset.prototype._indexOfSelection = function(selectionId) {
    return jsfc.Utils.findInArray(this.selections, function(item) {
        return item.id === selectionId;
    });
};

/**
 * Registers a listener to receive notification of changes to the dataset.
 * @param {Object} listener  the listener.
 * @returns {jsfc.KeyedValues2DDataset} This dataset (for chaining method 
 *         calls).
 */
jsfc.KeyedValues2DDataset.prototype.addListener = function(listener) {
    this._listeners.push(listener);
    return this;
};

/**
 * Deregisters a listener so that it no longer receives notification of changes
 * to the dataset.
 * 
 * @param {Object} listener  the listener.
 * @returns {jsfc.KeyedValues2DDataset} This dataset (for chaining method 
 *         calls).
 */
jsfc.KeyedValues2DDataset.prototype.removeListener = function(listener) {
    var i = this._listeners.indexOf(listener);
    if (i >= 0) {
        this._listeners.splice(i, 1);
    }
    return this;
};

/**
 * Notifies all registered listeners that there has been a change to this 
 * dataset.
 * 
 * @returns {jsfc.KeyedValues2DDataset} This dataset (for chaining method 
 *         calls).
 */
jsfc.KeyedValues2DDataset.prototype.notifyListeners = function() {
    for (var i = 0; i < this._listeners.length; i++) {
        this._listeners[i].datasetChanged(this);
    }
    return this;
};


/**
 * Creates a new (empty) dataset instance.
 * @constructor
 * @classdesc A dataset that is a three-dimensional table where... 
 */
jsfc.KeyedValues3DDataset = function() {
    if (!(this instanceof jsfc.KeyedValues3DDataset)) {
        return new jsfc.KeyedValues3DDataset();
    }
    this.data = { "columnKeys": [], "rowKeys": [], "series": [] };
    this.properties = [];
    this._listeners = [];
};

/**
 * Returns true if the dataset is empty and false otherwise.
 * @returns {boolean}
 */
jsfc.KeyedValues3DDataset.prototype.isEmpty = function() {
    return this.data.columnKeys.length === 0 
            && this.data.rowKeys.length === 0;
};


/**
 * Returns the number of series in the dataset.
 * @returns {number} The series count.
 */
jsfc.KeyedValues3DDataset.prototype.seriesCount = function() {
    return this.data.series.length;  
};

/**
 * Returns the number of rows in the dataset.
 * @returns {number}
 */
jsfc.KeyedValues3DDataset.prototype.rowCount = function() {
    return this.data.rowKeys.length;
};

/**
 * Returns the number of columns in the dataset.
 * @returns {number}
 */
jsfc.KeyedValues3DDataset.prototype.columnCount = function() {
    return this.data.columnKeys.length; 
};

/**
 * Returns one row from the dataset.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {string} rowKey  the row key.
 * @returns {Object} The row.
 */
jsfc.KeyedValues3DDataset.prototype._fetchRow = function(seriesIndex, rowKey) {
    var rows = this.data.series[seriesIndex].rows;
    for (var r = 0; r < rows.length; r++) {
        if (rows[r].rowKey === rowKey) {
            return rows[r];
        }
    }
    return null;
};

/**
 * Returns a value by series, row and column index.
 * 
 * @param {number} seriesIndex
 * @param {number} rowIndex
 * @param {number} columnIndex
 * @returns {number|null} The value.
 */
jsfc.KeyedValues3DDataset.prototype.valueByIndex = function(seriesIndex, 
        rowIndex, columnIndex) {
    var rowKey = this.rowKey(rowIndex);
    var row = this._fetchRow(seriesIndex, rowKey);
    if (row === null) {
        return null;
    } else {
        return row.values[columnIndex];
    }
};

/**
 * Returns the index of the series with the specified key, or -1.
 * @param {string} seriesKey  the series key.
 * @returns {number} The series index, or -1.
 */
jsfc.KeyedValues3DDataset.prototype.seriesIndex = function(seriesKey) {
    var seriesCount = this.seriesCount();
    for (var s = 0; s < seriesCount; s++) {
        if (this.data.series[s].seriesKey === seriesKey) {
            return s;
        }
    }
    return -1;
};

/**
 * Returns the key for the series with the specified index.
 * @param {number} seriesIndex
 * @returns {string} The series key.
 */
jsfc.KeyedValues3DDataset.prototype.seriesKey = function(seriesIndex) {
    return this.data.series[seriesIndex].seriesKey;  
};

/**
 * Returns the key for the row with the specified index.
 * @param {number} rowIndex  the row index.
 * @returns {string} The row key.
 */
jsfc.KeyedValues3DDataset.prototype.rowKey = function(rowIndex) {
    return this.data.rowKeys[rowIndex];  
};

/**
 * Returns the index of the row with the specified key.
 * @param {string} rowKey  the row key.
 * @returns {number} The row index.
 */
jsfc.KeyedValues3DDataset.prototype.rowIndex = function(rowKey) {
    var rowCount = this.data.rowKeys.length;
    for (var r = 0; r < rowCount; r++) {
        if (this.data.rowKeys[r] === rowKey) {
            return r;
        }
    }
    return -1;
};

/**
 * Returns all the row keys.
 * 
 * @returns {Array} The row keys.
 */
jsfc.KeyedValues3DDataset.prototype.rowKeys = function() {
    return this.data.rowKeys.map(function(d) { return d; });
};
 
/**
 * Returns the key for the column with the specified index.
 * @param {number} columnIndex  the column index.
 * @returns {string} The column key.
 */
jsfc.KeyedValues3DDataset.prototype.columnKey = function(columnIndex) {
    return this.data.columnKeys[columnIndex];
};

/**
 * Returns the index of the column with the specified key.
 * @param {string} columnKey  the column key.
 * @returns {number} The column index.
 */
jsfc.KeyedValues3DDataset.prototype.columnIndex = function(columnKey) {
    var columnCount = this.data.columnKeys.length;
    for (var c = 0; c < columnCount; c++) {
        if (this.data.columnKeys[c] === columnKey) {
            return c;
        }
    }
    return -1;
};
 
/**
 * Returns all the column keys.
 * 
 * @returns {Array} The column keys.
 */
jsfc.KeyedValues3DDataset.prototype.columnKeys = function() {
    return this.data.columnKeys.map(function(d) { return d; });    
};
 
/**
 * Returns the value for the item identified by the specified series, row and
 * column keys.
 * @param {string} seriesKey  the series key.
 * @param {string} rowKey  the row key.
 * @param {string} columnKey  the column key.
 * @returns {number|null} The value (possibly null).
 */
jsfc.KeyedValues3DDataset.prototype.valueByKey = function(seriesKey, rowKey, 
        columnKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var row = this._fetchRow(seriesIndex, rowKey);
    if (row === null) {
        return null;
    } else {
        var columnIndex = this.columnIndex(columnKey);
        return row.values[columnIndex];
    }
};

/**
 * Adds a listener to the dataset (the listener method will be called whenever 
 * the dataset is modified)
 * @param {*} listener
 * @returns {undefined}
 */
jsfc.KeyedValues3DDataset.prototype.addListener = function(listener) {
    this._listeners.push(listener);  
};

/**
 * Deregisters the specified listener so that it no longer receives
 * notification of dataset changes.
 * 
 * @param {*} listener  the listener.
 * @returns {undefined}
 */
jsfc.KeyedValues3DDataset.prototype.removeListener = function(listener) {
    var i = this._listeners.indexOf(listener);
    if (i >= 0) {
        this._listeners.splice(i, 1);
    }
};

/**
 * Notifies all registered listeners that there has been a change to this 
 * dataset.
 * @returns {jsfc.KeyedValues3DDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValues3DDataset.prototype.notifyListeners = function() {
    for (var i = 0; i < this._listeners.length; i++) {
        this._listeners[i].datasetChanged(this);
    }
    return this;
};

/**
 * Adds a value to the dataset (or updates an existing value).
 * @param {string} seriesKey
 * @param {string} rowKey
 * @param {string} columnKey
 * @param {number} value
 * @returns {jsfc.KeyedValues3DDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValues3DDataset.prototype.add = function(seriesKey, rowKey, 
    columnKey, value) {

    if (this.isEmpty()) {
        this.data.rowKeys.push(rowKey);
        this.data.columnKeys.push(columnKey);
        this.data.series.push({"seriesKey": seriesKey, 
            "rows": [{ "rowKey": rowKey, "values": [value]}]});
        this.properties.push({"seriesKey": seriesKey, 
            "rows": [{ "rowKey": rowKey, "maps": [null]}]});
    } else {
        var seriesIndex = this.seriesIndex(seriesKey);
        if (seriesIndex < 0) {
            this.data.series.push({"seriesKey": seriesKey, "rows": []});
            this.properties.push({"seriesKey": seriesKey, "rows": []});
            seriesIndex = this.data.series.length - 1;
        }
        var columnIndex = this.columnIndex(columnKey);
        if (columnIndex < 0) {
            // add the column key and insert a null data item in all existing rows
            this.data.columnKeys.push(columnKey);
            for (var s = 0; s < this.data.series.length; s++) {
                var rows = this.data.series[s].rows;
                for (var r = 0; r < rows.length; r++) {
                    rows[r].values.push(null);
                }
            }
            for (var s = 0; s < this.properties.length; s++) {
                 var rows = this.properties[s].rows;
                 for (var r = 0; r < rows.length; r++) {
                     rows[r].maps.push(null);
                 }
            }
            columnIndex = this.columnCount() - 1;
        }
        var rowIndex = this.rowIndex(rowKey);
        if (rowIndex < 0) {
            this.data.rowKeys.push(rowKey);
            // add the row for the current series only
            var rowData = jsfc.Utils.makeArrayOf(null, this.columnCount());
            rowData[columnIndex] = value;
            this.data.series[seriesIndex].rows.push({ "rowKey": rowKey, "values": rowData}); 
            var rowMaps = jsfc.Utils.makeArrayOf(null, this.columnCount());
            this.properties[seriesIndex].rows.push({"rowKey": rowKey, "maps": rowMaps});
        } else {
            var row = this._fetchRow(seriesIndex, rowKey);
            if (row !== null) {
                row.values[columnIndex] = value;
            } else {
                var rowData = jsfc.Utils.makeArrayOf(null, this.columnCount());
                rowData[columnIndex] = value;
                this.data.series[seriesIndex].rows.push({"rowKey": rowKey, "values": rowData}); 
            }
            var propRow = this._fetchPropertyRow(seriesIndex, rowKey);
            if (propRow === null) {
                var rowMaps = jsfc.Utils.makeArrayOf(null, this.columnCount());
                this.properties[seriesIndex].rows.push({"rowKey": rowKey, 
                        "maps": rowMaps}); 
            }
        }
    }
    return this;
};

/**
 * Parses a JSON formatted string containing data.
 * 
 * @param {string} jsonStr  the JSON string.
 * @returns {jsfc.KeyedValues3DDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValues3DDataset.prototype.parse = function(jsonStr) {
    this.load(JSON.parse(jsonStr));
    return this;
};

/**
 * Loads a data object into the dataset directly, replacing any data that
 * already exists.  All properties are cleared.
 * 
 * @param {Object} dataObj  the data object.
 * 
 * @returns {jsfc.KeyedValues3DDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValues3DDataset.prototype.load = function(dataObj) {
    this.data = dataObj;
    if (!this.data.hasOwnProperty("rowKeys")) {
        this.data.rowKeys = [];
    }
    if (!this.data.hasOwnProperty("columnKeys")) {
        this.data.columnKeys = [];
    }
    if (!this.data.hasOwnProperty("series")) {
        this.data.series = [];
    }
    this.clearAllProperties(); // this rebuilds the properties data structure
    this.notifyListeners();
    return this;
};

/**
 * Returns a property for the specified data item.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string} rowKey  the row key.
 * @param {string} columnKey  the column key.
 * @param {string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.KeyedValues3DDataset.prototype.getProperty = function(seriesKey, rowKey, 
        columnKey, propertyKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var rowIndex = this.rowIndex(rowKey);
    var columnIndex = this.columnIndex(columnKey);
    var map = this.properties[seriesIndex].rows[rowIndex][columnIndex];
    if (map) {
        return map.get(propertyKey);
    }
};

/**
 * Sets a property for the specified data item.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string} rowKey  the row key.
 * @param {string} columnKey  the column key.
 * @param {string} propertyKey  the property key.
 * @param {*} value
 * @returns {undefined}
 */
jsfc.KeyedValues3DDataset.prototype.setProperty = function(seriesKey, rowKey, 
        columnKey, propertyKey, value) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var rowIndex = this.rowIndex(rowKey);
    var columnIndex = this.columnIndex(columnKey);
    var map = this.properties[seriesIndex].rows[rowIndex][columnIndex];
    if (!map) {
        map = new jsfc.Map();
        this.properties[seriesIndex].rows[rowIndex][columnIndex] = map;
    }
    map.put(propertyKey, value);
};

/**
 * Returns the keys for the properties defined for a data item in the dataset.
 * 
 * @param {string} seriesKey
 * @param {string} rowKey
 * @param {string} columnKey
 * @returns {Array} An array containing the property keys.
 */
jsfc.KeyedValues3DDataset.prototype.propertyKeys = function(seriesKey,
        rowKey, columnKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var rowIndex = this.rowIndex(rowKey);
    var columnIndex = this.columnIndex(columnKey);
    var map = this.properties[seriesIndex].rows[rowIndex][columnIndex];
    if (map) {
        return map.keys();
    } else {
        return [];
    }
};

/**
 * Clears all properties for one item.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the series key.
 * @returns {undefined}
 */
jsfc.KeyedValues3DDataset.prototype.clearProperties = function(seriesKey, 
        rowKey, columnKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var row = this._fetchPropertyRow(seriesIndex, rowKey);
    if (row) {
        var columnIndex = this.columnIndex(columnKey);
        row[columnIndex] = null;
    }
};

/**
 * Clears all the properties for the dataset.
 * 
 * @returns {jsfc.KeyedValues3DDataset} This dataset (for chaining method 
 *     calls).
 */
jsfc.KeyedValues3DDataset.prototype.clearAllProperties = function() {
    this.properties = [];
    var me = this;
    this.data.series.forEach(function(series) {
        var s = {"seriesKey": series.seriesKey, "rows": []};
        me.properties.push(s);
        series.rows.forEach(function(row) {
            var maps = jsfc.Utils.makeArrayOf(null, me.columnCount());
            var r = {"rowKey": row.rowKey, "maps": maps};
            s.rows.push(r);
        });
    });
    return this;
};

/**
 * Returns one row from the properties.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {string} rowKey  the row key.
 * @returns {Object} The row.
 */
jsfc.KeyedValues3DDataset.prototype._fetchPropertyRow = function(seriesIndex, 
        rowKey) {
    var rows = this.properties[seriesIndex].rows;
    for (var r = 0; r < rows.length; r++) {
        if (rows[r].rowKey === rowKey) {
            return rows[r];
        }
    }
    return null;
};


"use strict";

/**
 * Creates a new (empty) dataset.
 * @constructor
 * @classdesc A dataset that consists of a list of (key, value) pairs.  The keys
 *     must be non-null and unique within the dataset (the same key cannot be
 *     used twice).
 *     <br><br>
 *     A typical dataset would serialise to JSON format as follows:
 *     <blockquote><code>{"data":{"sections":[{"key":"A","value":1.1},{"key":"B","value":2.2},{"key":"C","value":3.3},{"key":"D","value":4.4}]},"selections":[{"id":"hilite","items":["B","C"]},{"id":"selection","items":["A"]}],"_listeners":[]}</code></blockquote>
`*/
jsfc.KeyedValuesDataset = function() {
    if (!(this instanceof jsfc.KeyedValuesDataset)) {
        return new jsfc.KeyedValuesDataset();
    }
    this.data = { "sections": [] };
    this.properties = [];
    this.selections = [];
    this._listeners = [];
};

/**
 * Returns the number of items in the dataset.
 * 
 * @returns {number} The item count.
 */
jsfc.KeyedValuesDataset.prototype.itemCount = function() {
    return this.data.sections.length;
};

/**
 * Returns true if the dataset contains no items and false otherwise.
 * 
 * @returns {boolean} A boolean.
 */
jsfc.KeyedValuesDataset.prototype.isEmpty = function() {
    return this.data.sections.length === 0;
};

/**
 * Returns the key for the section with the specified index.
 * 
 * @param {number} index  the section index.
 * 
 * @returns {string} The section key.
 */
jsfc.KeyedValuesDataset.prototype.key = function(index) {
    return this.data.sections[index].key;  
};

/**
 * Returns an array containing the keys for all the sections in the dataset.
 * 
 * @returns {Array} The keys.
 */
jsfc.KeyedValuesDataset.prototype.keys = function() {
    return this.data.sections.map(function(d) { return d.key; });
};

/**
 * Returns the index of the section with the specified key, or -1.
 * 
 * @param {string} sectionKey  the section key.
 * 
 * @returns {number} The section index.
 */
jsfc.KeyedValuesDataset.prototype.indexOf = function(sectionKey) {
    var arrayLength = this.data.sections.length;
    for (var i = 0; i < arrayLength; i++) {
        if (this.data.sections[i].key === sectionKey) {
            return i;
        }
    }
    return -1;
};

/**
 * Returns the value of the item with the specified index.
 * 
 * @param {number} index  the section index.
 * 
 * @returns {number} The section value.
 */
jsfc.KeyedValuesDataset.prototype.valueByIndex = function(index) {
    return this.data.sections[index].value;
};

/**
 * Returns the value for the section with the specified key.
 * 
 * @param {string} sectionKey  the section key.
 * @returns {number|null}
 */
jsfc.KeyedValuesDataset.prototype.valueByKey = function(sectionKey) {
    var sectionIndex = this.indexOf(sectionKey);
    if (sectionIndex < 0) {
        return null;
    }
    return this.valueByIndex(sectionIndex);
};

/**
 * Registers a listener to receive notification of changes to the dataset. The
 * listener must have a 'datasetChanged(KeyedValuesDataset)' method.
 * 
 * @param {Object} listener  the listener object.
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.addListener = function(listener) {
    this._listeners.push(listener);
    return this;
};

/**
 * Removes a listener so that it will no longer receive notification of changes
 * to this dataset.
 * 
 * @param {Object} listener the listener.
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.removeListener = function(listener) {
    var i = this._listeners.indexOf(listener);
    if (i >= 0) {
        this._listeners.splice(i, 1);
    }
    return this;
};

/**
 * Notifies all registered listeners that there has been a change to this dataset.
 * 
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.notifyListeners = function() {
    for (var i = 0; i < this._listeners.length; i++) {
        this._listeners[i].datasetChanged(this);
    }
    return this;
};

/**
 * Adds the specified key and value to the dataset (if the key exists already,
 * the value for that key is updated).
 * 
 * @param {string} sectionKey  the section key.
 * @param {number} value  the value.
 * @param {boolean} notify  notify listeners (optional, defaults to true).
 * 
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.add = function(sectionKey, value, notify) {
    var i = this.indexOf(sectionKey);
    if (i < 0) {
        this.data.sections.push({"key": sectionKey, "value": value});
        this.properties.push(new jsfc.Map());
    } else {
        this.data.sections[i].value = value;
    }
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Removes the item with the specified key and sends a change event to all 
 * registered listeners.
 * 
 * @param {string} sectionKey  the section key.
 * @param {boolean} [notify]  notify listeners (optional, defaults to true).
 * 
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.remove = function(sectionKey, notify) {
    if (!sectionKey) {
        throw new Error("The 'sectionKey' must be defined.");
    }
    var i = this.indexOf(sectionKey);
    if (i < 0) throw new Error("The sectionKey '" + sectionKey.toString() 
            + "' is not recognised.");
    this.data.sections.splice(i, 1);
    this.properties.splice(i, 1);
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Parses the supplied JSON-format string to populate the 'sections' attribute
 * for this dataset.
 * 
 * @param {string} jsonStr  a string in JSON format.
 * @param {boolean} [notify]  notify listeners (optional, defaults to true).
 * 
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.parse = function(jsonStr, notify) {
    this.data.sections = JSON.parse(jsonStr);
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Loads the supplied data array into the dataset.
 * 
 * @param {Array} data  an array of data items, where each data item is an
 * array containing two values, the key (a string) and the value (a number).
 * @param {boolean} [notify]  notify listeners?
 * 
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.load = function(data, notify) {
    this.data.sections = data;
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Removes the item with the specified index.
 * 
 * @param {number} itemIndex  the item index.
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.removeByIndex = function(itemIndex) {
    this.data.sections.splice(itemIndex, 1);
    this.properties.splice(itemIndex, 1);
    return this;
};

/**
 * Returns the total for all non-null values in the supplied dataset.
 * 
 * @param {jsfc.KeyedValuesDataset} dataset  the dataset.
 * @returns {number} The total of all non-null values.
 */
jsfc.KeyedValuesDataset.prototype.totalForDataset = function(dataset) {
  var total = 0.0;
  var itemCount = dataset.itemCount();
  for (var i = 0; i < itemCount; i++) {
    var v = dataset.valueByIndex(i);
    if (v) {
      total = total + v;
    }
  }
  return total;
};

/**
 * Returns the minimum value for the specified dataset.
 * 
 * @param {jsfc.KeyedValuesDataset} dataset  the dataset.
 * @returns {number} The minimum value.
 */
jsfc.KeyedValuesDataset.prototype.minForDataset = function(dataset) {
    var min = Number.NaN;
    var itemCount = dataset.itemCount();
    for (var i = 0; i < itemCount; i++) {
        var v = dataset.valueByIndex(i);
        if (v) {
            if (min) {
                min = Math.min(min, v);
            } else {
                min = v;
            }
        }
    }
    return min;
};

/**
 * Returns the maximum value for the specified dataset.
 * 
 * @param {jsfc.KeyedValuesDataset} dataset  the dataset.
 * @returns {number} The minimum value.
 */
jsfc.KeyedValuesDataset.prototype.maxForDataset = function(dataset) {
    var max = Number.NaN;
    var itemCount = dataset.itemCount();
    for (var i = 0; i < itemCount; i++) {
        var v = dataset.valueByIndex(i);
        if (v) {
            if (max) {
                max = Math.max(max, v);
            } else {
                max = v;
            }
        }
    }
    return max;
};

/**
 * Returns the total of all non-null values in this dataset.
 * 
 * @returns {number} The total.
 */
jsfc.KeyedValuesDataset.prototype.total = function() {
    return this.totalForDataset(this);
};

/**
 * Returns the minimum non-null value in this dataset.
 * 
 * @returns {number} The minimum value.
 */
jsfc.KeyedValuesDataset.prototype.min = function() {
  return this.minForDataset(this);
};

/**
 * Returns the maximum non-null value in this dataset.
 * 
 * @returns {number} The maximum value.
 */
jsfc.KeyedValuesDataset.prototype.max = function() {
  return this.maxForDataset(this);
};

/**
 * Returns an array containing the keys for the properties that are defined
 * for the specified section.
 * 
 * @param {string} sectionKey  the section key.
 * @returns {Array}
 */
jsfc.KeyedValuesDataset.prototype.propertyKeys = function(sectionKey) {
    var i = this.indexOf(sectionKey);
    var map = this.properties[i];
    if (map) {
        return map.keys();
    } else {
        return [];
    }
};

/**
 * Returns the value of a property defined for one item in the dataset.
 * 
 * @param {string} sectionKey
 * @param {string} propertyKey
 * @returns {*} The property value.
 */
jsfc.KeyedValuesDataset.prototype.getProperty = function(sectionKey, propertyKey) {
    var i = this.indexOf(sectionKey);
    return this.properties[i].get(propertyKey);    
};

/**
 * Sets a property for one data item in the dataset (or updates an existing
 * property).  Special properties include 'color', 'shape' and 'size'.
 * .  
 * @param {string} sectionKey
 * @param {string} propertyKey
 * @param {*} value
 * @returns {undefined}
 */
jsfc.KeyedValuesDataset.prototype.setProperty = function(sectionKey, 
        propertyKey, value) {
    var i = this.indexOf(sectionKey);
    if (i < 0) {
        throw new Error("Did not recognise 'sectionKey' " + sectionKey);
    }
    var map = this.properties[i];
    map.put(propertyKey, value);
};

/**
 * Clears all properties for one item.
 * 
 * @param {string} sectionKey  the section key.
 * @returns {undefined}
 */
jsfc.KeyedValuesDataset.prototype.clearProperties = function(sectionKey) {
    var i = this.indexOf(sectionKey);
    this.properties[i] = new jsfc.Map();
};

/**
 * Marks an item as selected within a selection with the specified ID.
 * 
 * @param {string} selectionId  the selection id.
 * @param {string} key  the section key.
 * 
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.select = function(selectionId, key) {
    var selection;
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex < 0) { // no selection with that id
        selection = {"id": selectionId, "items": []};
        this.selections.push(selection);
    } else {
        selection = this.selections[selectionIndex];
    }
    var i = selection.items.indexOf(key);
    if (i < 0) {
        selection.items.push(key);
    }
    return this;
};

/**
 * Unselects the specified item. 
 * 
 * @param {string} selectionId  the ID for the set of selected items.
 * @param {string} key  the section key.
 * 
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.unselect = function(selectionId, key) {
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex >= 0) {
        var selection = this.selections[selectionIndex];
        var i = selection.items.indexOf(key);
        if (i >= 0) {
            selection.items.splice(i, 1);
        }
    } 
    return this;
};

/**
 * Returns true if the specified item is selected (for the given selectionId) 
 * and false otherwise.
 * 
 * @param {string} selectionId  the selection ID.
 * @param {string} key  the item key.
 * 
 * @returns {boolean} A boolean.
 */
jsfc.KeyedValuesDataset.prototype.isSelected = function(selectionId, key) {
    var selection;
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex < 0) {
        return false;
    } else {
        selection = this.selections[selectionIndex];
        return (selection.items.indexOf(key) >= 0); 
    }
};

/**
 * Clears any items from the selection with the specified id.
 * 
 * @param {string} selectionId  the selection id.
 * @param {boolean} [notify]  notify listeners (optional, the default value is true).
 * @returns {jsfc.KeyedValuesDataset} This dataset (for chaining method calls).
 */
jsfc.KeyedValuesDataset.prototype.clearSelection = function(selectionId, notify) {
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex >= 0) {
        this.selections.splice(selectionIndex, 1);
    }
    return this;
};

/**
 * Returns the index of the selection with the specified ID, or -1 if there is 
 * no such selection.
 * 
 * @param {string} selectionId  the selection ID.
 * @returns {number} The selection index.
 */
jsfc.KeyedValuesDataset.prototype._indexOfSelection = function(selectionId) {
    return jsfc.Utils.findInArray(this.selections, function(selection) {
        return selection.id === selectionId;
    });
};

"use strict";

/**
 * Constructor for a new (empty) Map.
 * @classdesc A simple map implementation (with ideas taken from 
 *     https://github.com/rauschma/strmap/blob/master/strmap.js).
 * @constructor     
 */
jsfc.Map = function() {
    this._data = {};
};

/**
 * Escapes any special key instances.
 * 
 * @param {!string} key  the key.
 * @returns {!string} The escaped key.
 */
jsfc.Map.prototype._escapeKey = function(key) {
    if (key.indexOf("__proto__") === 0) {
        return key + "%";
    } else {
        return key;
    }
};

/**
 * Returns true if the map contains an entry for the specified key, and false
 * otherwise.
 * 
 * @param {!string} key  the key.
 * @returns {!boolean}
 */
jsfc.Map.prototype.contains = function(key) {
    return Object.prototype.hasOwnProperty.call(this._data, key);       
};

/**
 * Returns an array of the keys that are defined for this map.
 * @returns {Array}
 */
jsfc.Map.prototype.keys = function() {
    return Object.keys(this._data);
};

/**
 * Adds a (key, value) pair to the map or, if an item already exists for the
 * specified key, updates the value for that item.
 * 
 * @param {string} key  the key.
 * @param {*} value  the value.
 * @returns {undefined}
 */
jsfc.Map.prototype.put = function(key, value) {
    key = this._escapeKey(key);
    this._data[key] = value;
};

/**
 * Returns the value of the property with the specified key, or 'undefined'
 * if there is no property with that key.
 * 
 * @param {!string} key  the property key.
 * 
 * @returns {*} The property value.
 */
jsfc.Map.prototype.get = function(key) {
    key = this._escapeKey(key);
    return this._getOwnPropertyValue(this._data, key);
};

/**
 * Returns a property value defined on the specified object.
 * 
 * @param {!Object} obj  the object.
 * @param {!string} prop  the property name.
 * @returns {*} The property value.
 */
jsfc.Map.prototype._getOwnPropertyValue = function(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop) ? obj[prop] 
            : undefined;    
};

/**
 * Removes the property with the specified key.
 * 
 * @param {!string} key  the property key.
 * 
 * @returns {*} The removed property entry.
 */
jsfc.Map.prototype.remove = function(key) {
    key = this._escapeKey(key);
    var value = this._getOwnPropertyValue(this._data, key);
    delete this._data[key];
    return value;
};

"use strict";

/**
 * Creates a new Range instance.
 * @constructor
 * @param {!number} lowerBound  the lower bound for the range.
 * @param {!number} upperBound  the upper bound for the range.
 * @classdesc Represents a range of values.
 */
jsfc.Range = function(lowerBound, upperBound) {
    if (lowerBound >= upperBound) {
        throw new Error("Requires lowerBound to be less than upperBound: " + lowerBound + ", " + upperBound);
    }
    this._lowerBound = lowerBound;
    this._upperBound = upperBound;
};

/**
 * Returns the lower bound for the range.
 * 
 * @returns {!number} The lower bound.
 */
jsfc.Range.prototype.lowerBound = function() {
    return this._lowerBound;
};

/**
 * Returns the upper bound for the range.
 * 
 * @returns {!number} The upper bound.
 */
jsfc.Range.prototype.upperBound = function() {
    return this._upperBound;
};

/**
 * Returns the length of the range.
 * 
 * @returns {number}
 */
jsfc.Range.prototype.length = function() {
    return this._upperBound - this._lowerBound;
};

/**
 * Returns a percentage value reflecting the position of the value within the
 * range.
 * 
 * @param {number} value
 * @returns {number} The percentage.
 */
jsfc.Range.prototype.percent = function(value) {
    return (value - this._lowerBound) / this.length();
};

/**
 * Returns the value in the range corresponding to the specified percentage
 * value.
 * 
 * @param {!number} percent  the percentage (for example, 0.20 is twenty 
 *     percent).
 * @returns {number} The value.
 */
jsfc.Range.prototype.value = function(percent) {
    return this._lowerBound + percent * this.length();
};

/**
 * Returns true if the range contains the specified value, and false otherwise.
 * @param {!number} n  the value.
 * @returns {!boolean} A boolean.
 */
jsfc.Range.prototype.contains = function(n) {
    return n >= this._lowerBound && n <= this._upperBound;
};

jsfc.Range.prototype.toString = function() {
    return "[Range: " + this._lowerBound + ", " + this._upperBound + "]";
};
/**
 * Creates a new (empty) dataset instance.
 * 
 * @classdesc A dataset that stores one or more data series where each series
 *     consists of an arbitrary number of (x, y) data items.  The dataset also
 *     provides a selection state mechanism.  A typical dataset will serialise 
 *     to JSON format as follows:
 *     <blockquote>{"data":{"series":[{"seriesKey":"S1","items":[{"x":1.1,"y":10.1},{"x":2.2,"y":10.2},{"x":3.3,"y":10.3}]},{"seriesKey":"S2","items":[{"x":4.4,"y":10.4}]},{"seriesKey":"S3","items":[{"x":5.5,"y":10.5}]}]},"selections":[],"_listeners":[]}</blockquote>
 *
 * @constructor 
 * @implements {jsfc.XYDataset}
 */
jsfc.StandardXYDataset = function() {
    this.data = { "series": [] };
    this.properties = { "dataset": null, "series": [] };
    this.selections = [];
    
    // the index provides fast lookup of a series index from a series key,
    // and an item index from an item key.
    this._index = { "series": new jsfc.Map(), "items": [] };
    this._listeners = [];
};

/**
 * Returns the number of series in the dataset.
 * 
 * @returns {number} The series count.
 */
jsfc.StandardXYDataset.prototype.seriesCount = function() {
    return this.data.series.length;
};

/**
 * Returns an array containing the keys for all the series in the dataset.
 * 
 * @returns {Array} The series keys.
 */
jsfc.StandardXYDataset.prototype.seriesKeys = function() {
    return this.data.series.map(function(d) {
        return d.seriesKey;
    });
};

/**
 * Returns the key for the series with the specified index.
 * 
 * @param {!number} seriesIndex  the series index.
 * 
 * @returns {string} The series key.
 */
jsfc.StandardXYDataset.prototype.seriesKey = function(seriesIndex) {
    return this.data.series[seriesIndex].seriesKey;
};

/**
 * Returns the index for the series with the specified key, or -1.
 * 
 * @param {!string} seriesKey  the series key.
 * 
 * @returns {!number} The series index.
 */
jsfc.StandardXYDataset.prototype.seriesIndex = function(seriesKey) {
    jsfc.Args.requireString(seriesKey, "seriesKey");
    var index = +this._index.series.get(seriesKey);
    if (index >= 0) {
        return index;
    }
    return -1;
};

/**
 * Returns the number of items in the specified series.
 * 
 * @param {!number} seriesIndex  the series index.
 * 
 * @returns {!number} The item count.
 */
jsfc.StandardXYDataset.prototype.itemCount = function(seriesIndex) {
    return this.data.series[seriesIndex].items.length;
};

/**
 * Returns the key for an item in a series.
 * 
 * @param {!number} seriesIndex  the series index.
 * @param {!number} itemIndex  the item index.
 * @returns {!string} The item key.
 */
jsfc.StandardXYDataset.prototype.itemKey = function(seriesIndex, itemIndex) {
    return this.data.series[seriesIndex].items[itemIndex].key;  
};

/**
 * Returns the index of the item in the specified series that has the specified
 * item key.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @returns {!number} The item index.
 */
jsfc.StandardXYDataset.prototype.itemIndex = function(seriesKey, itemKey) {
    jsfc.Args.require(itemKey, "itemKey");
    var seriesIndex = this.seriesIndex(seriesKey);
    var i = this._index.items[seriesIndex].get(itemKey);
    if (i >= 0) {
        return i;
    }
    return -1;
};

/**
 * Returns the x-value for an item in a series.
 * 
 * @param {!number} seriesIndex  the series index.
 * @param {!number} itemIndex  the item index.
 * 
 * @returns {!number} The x-value.
 */
jsfc.StandardXYDataset.prototype.x = function(seriesIndex, itemIndex) {
    return this.data.series[seriesIndex].items[itemIndex].x; 
};

/**
 * Returns the y-value for an item in a series.
 * 
 * @param {!number} seriesIndex  the series index.
 * @param {!number} itemIndex  the item index.
 * 
 * @returns {number} The y-value.
 */
jsfc.StandardXYDataset.prototype.y = function(seriesIndex, itemIndex) {
    return this.data.series[seriesIndex].items[itemIndex].y;     
};

/**
 * Returns one item from a series.  The return value is an object with the form
 * {"x": x, "y": y, "key": key}.
 * 
 * @param {!number} seriesIndex  the series index.
 * @param {!number} itemIndex  the item index.
 * @returns {Object} A data item.
 */
jsfc.StandardXYDataset.prototype.item = function(seriesIndex, itemIndex) {
    return this.data.series[seriesIndex].items[itemIndex];  
};

/**
 * Returns an item based on the series and item keys.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @returns {Object}
 */
jsfc.StandardXYDataset.prototype.itemByKey = function(seriesKey, itemKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var items = this.data.series[seriesIndex].items;
    for (var i = 0; i < items.length; i++) {
        if (items[i].key === itemKey) {
            return items[i];
        }
    }
    return null;
};

/**
 * Returns the item key for an item.  All items will have a key that is unique
 * within the series (either auto-generated or explicitly set).
 * 
 * @param {!number} seriesIndex
 * @param {!number} itemIndex
 * @returns {string}
 */
jsfc.StandardXYDataset.prototype.getItemKey = function(seriesIndex, itemIndex) {
    return this.item(seriesIndex, itemIndex).key;
};

/**
 * Generates a new (and unique) item key for the specified series.
 * 
 * @param {!number} seriesIndex  the series index.
 * 
 * @returns {!string}
 */
jsfc.StandardXYDataset.prototype.generateItemKey = function(seriesIndex) {
    // for a series that is not yet created, we can use 0 for the itemKey
    if (seriesIndex < 0) {
        return "0";
    }
    var map = this._index.items[seriesIndex];
    var candidate = map.get("_nextFreeKey_");
    while (map.contains("" + candidate)) {
        candidate++;
        map.put("_nextFreeKey_", candidate);
    }
    return "" + candidate;
};

/**
 * Returns the data items for the specified series.  This method provides 
 * direct access to the data for a series - if you update this array directly, 
 * dataset listeners will not receive notification of the change.
 * 
 * @param {!number} seriesIndex  the series index.
 * 
 * @returns {Array} An array of the data items.
 */
jsfc.StandardXYDataset.prototype.items = function(seriesIndex) {
    return this.data.series[seriesIndex].items;
};

/**
 * Returns a new array containing all the (x, y) items in the dataset.
 * 
 * @returns {Array} An array of data items.
 */
jsfc.StandardXYDataset.prototype.allItems = function() {
    var result = [];
    for (var s = 0; s < this.data.series.length; s++) {
        result.push(this.items(s));
    }
    return result;
};

/**
 * Adds an item to the specified series (if the series does not already exist,
 * it will be created).  The new item will have an auto-generated item key.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!number} x  the x-value.
 * @param {number|null} y  the y-value.
 * @param {boolean} [notify]  notify listeners? 
 * 
 * @returns {jsfc.XYDataset} This dataset for method call chaining.
 */
jsfc.StandardXYDataset.prototype.add = function(seriesKey, x, y, notify) {
    jsfc.Args.requireNumber(x, "x");
    var s = this.seriesIndex(seriesKey);
    if (s < 0) {
        this.addSeries(seriesKey);
        s = this.data.series.length - 1;
    }
    var itemKey = this.generateItemKey(s);
    // this code matches what is found in addByKey() but since we know this
    // is a new data item, and we already know the series index, it is faster 
    // to add it directly
    var items = this.data.series[s].items;
    items.push({"x": x, "y": y, "key": itemKey});
    this._index.items[s].put(itemKey, items.length - 1);
    this.properties.series[s].maps.push(null);
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;    
};

/**
 * Adds an item to the dataset with the specified seriesKey and itemKey.  If the
 * series does not already exist it will be created.  If the series contains
 * an item with the specified key, the values for that item will be updated,
 * otherwise a new item will be created in the series.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @param {!number} x  the x-value.
 * @param {number} y  the y-value.
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.StandardXYDataset.prototype.addByKey = function(seriesKey, itemKey, x, y, 
        notify) {
    jsfc.Args.requireString(seriesKey, "seriesKey");
    var s = this.seriesIndex(seriesKey);
    if (s < 0) {
        this.addSeries(seriesKey);
        s = this.data.series.length - 1;
    }
    var item = this.itemByKey(seriesKey, itemKey);
    if (item) {
        item.x = x;
        item.y = y;
    } else {
        var items = this.data.series[s].items;
        items.push({"x": x, "y": y, "key": itemKey});
        this._index.items[s].put(itemKey, items.length - 1);
        this.properties.series[s].maps.push(null);
    }
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;    
};

/**
 * Removes an item from one series in the dataset and sends a change event to 
 * all registered listeners.
 * 
 * @param {!number} seriesIndex  the series key.
 * @param {!number} itemIndex  the item index.
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.StandardXYDataset.prototype.remove = function(seriesIndex, itemIndex, 
        notify) {
    // TODO when an item is removed, any selections that point to it should
    // be updated accordingly
    var removedItemKey = this.itemKey(seriesIndex, itemIndex);
    this.data.series[seriesIndex].items.splice(itemIndex, 1);
    this.properties.series[seriesIndex].maps.splice(itemIndex, 1);
    // update the index of itemKeys --> item indices
    this._index.items[seriesIndex].remove(removedItemKey);
    for (var i = itemIndex; i < this.itemCount(seriesIndex); i++) {
        this._index.items[seriesIndex].put(this.itemKey(seriesIndex, i), i);
    }
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Removes an item from one series in the dataset and sends a change 
 * notification to all registered listeners.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @param {boolean} [notify]  notify listeners? (optional, defaults to true).
 * @returns {undefined}
 */
jsfc.StandardXYDataset.prototype.removeByKey = function(seriesKey, itemKey, 
        notify) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var itemIndex = this.itemIndex(seriesKey, itemKey);
    this.remove(seriesIndex, itemIndex, notify);
};

/**
 * Adds a new empty series with the specified key.
 * 
 * @param {!string} seriesKey  the series key.
 * 
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.StandardXYDataset.prototype.addSeries = function(seriesKey) {
    if (!(typeof seriesKey === 'string')) {
        throw new Error("The 'seriesKey' must be a string.");
    }
    if (this._index.series.contains(seriesKey)) {
        throw new Error("Duplicate key '" + seriesKey);
    }
    this.data.series.push({ "seriesKey": seriesKey, "items": [] });
    this._index.series.put(seriesKey, this.data.series.length - 1);
    var itemKeys = new jsfc.Map();
    itemKeys.put("_nextFreeKey_", 0); // hint for the next free key
    this._index.items.push(itemKeys); // map for itemKeys --> item index
    this.properties.series.push({ "seriesKey": seriesKey, 
            "seriesProperties": null, "maps": [] });
    return this;
};

/**
 * Removes the series with the specified ID and sends a change event to 
 * registered listeners.
 * 
 * @param {!string} seriesKey  the series key.
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.StandardXYDataset.prototype.removeSeries = function(seriesKey, notify) {
    if (!(typeof seriesKey === 'string')) {
        throw new Error("The 'seriesKey' must be a string.");
    }
    // TODO : when a series is removed, any selections that point to the series
    // should be updated accordingly
    var s = this.seriesIndex(seriesKey);
    if (s >= 0) {
        this.data.series.splice(s, 1);
        this.properties.series.splice(s, 1);
        // update the index of series keys to indices for every series affected
        this._index.series.remove(seriesKey);
        this._index.items.splice(s, 1);
        for (var i = s; i < this.seriesCount(); i++) {
            var key = this.seriesKey(i);
            this._index.series.put(key, i);
        }
        if (notify !== false) {
            this.notifyListeners();
        }
    } else {
        throw new Error("No series with that key. " + seriesKey);
    }
    return this;
};

/**
 * The bounds for the data values.  This method returns an array in the form
 * [xmin, xmax, ymin, ymax].
 * 
 * @returns {Array} An array containing the dataset bounds.
 */
jsfc.StandardXYDataset.prototype.bounds = function() {
    var xmin = Number.POSITIVE_INFINITY;
    var xmax = Number.NEGATIVE_INFINITY;
    var ymin = Number.POSITIVE_INFINITY;
    var ymax = Number.NEGATIVE_INFINITY;
    for (var s = 0; s < this.seriesCount(); s++) {
        for (var i = 0; i < this.itemCount(s); i++) {
            var xyitem = this.item(s, i);
            xmin = Math.min(xmin, xyitem.x);
            xmax = Math.max(xmax, xyitem.x);
            ymin = Math.min(ymin, xyitem.y);
            ymax = Math.max(ymax, xyitem.y);
        }
    }
    return [xmin, xmax, ymin, ymax];
};

/**
 * Returns [xmin, xmax] where xmin is the lowest x-value in the dataset and
 * xmax is this highest x-value in the dataset.  If the dataset is empty,
 * this method returns [POSITIVE_INFINITIY, NEGATIVE_INFINITY] (maybe we'll
 * change this).
 * 
 * @returns {Array}
 */
jsfc.StandardXYDataset.prototype.xbounds = function() {
    var xmin = Number.POSITIVE_INFINITY;
    var xmax = Number.NEGATIVE_INFINITY;
    for (var s = 0; s < this.seriesCount(); s++) {
        for (var i = 0; i < this.itemCount(s); i++) {
            var x = this.x(s, i);
            xmin = Math.min(xmin, x);
            xmax = Math.max(xmax, x);
        }
    }
    return [xmin, xmax];    
};

/**
 * Returns [ymin, ymax] where ymin is the lowest y-value in the dataset and
 * xmax is this highest y-value in the dataset.  If the dataset is empty,
 * this method returns [POSITIVE_INFINITIY, NEGATIVE_INFINITY] (maybe we'll
 * change this).
 * 
 * @returns {Array}
 */
jsfc.StandardXYDataset.prototype.ybounds = function() {
    var ymin = Number.POSITIVE_INFINITY;
    var ymax = Number.NEGATIVE_INFINITY;
    for (var s = 0; s < this.seriesCount(); s++) {
        for (var i = 0; i < this.itemCount(s); i++) {
            var y = this.y(s, i);
            ymin = Math.min(ymin, y);
            ymax = Math.max(ymax, y);
        }
    }
    return [ymin, ymax];    
};

/**
 * Returns the value of a property for the dataset.
 * 
 * @param {!string} key  the property key.
 * @returns {*} The property value.
 */
jsfc.StandardXYDataset.prototype.getProperty = function(key) {
    var map = this.properties.dataset;
    if (map) {
        return map.get(key);
    }
    return undefined;
};

/**
 * Sets the value of a property for the dataset.
 * 
 * @param {!string} key  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 */
jsfc.StandardXYDataset.prototype.setProperty = function(key, value, notify) {
    if (!this.properties.dataset) {
        this.properties.dataset = new jsfc.Map();
    }
    this.properties.dataset.put(key, value);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns an array containing all the keys of the properties defined for
 * this dataset.
 * 
 * @returns {Array}
 */
jsfc.StandardXYDataset.prototype.getPropertyKeys = function() {
    if (this.properties.dataset) {
        return this.properties.dataset.keys();
    }
    return [];
};

/**
 * Clears all the dataset-level properties and sends a change notification
 * to registered listeners (unless 'notify' is set to false).
 * 
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {jsfc.StandardXYDataset} This dataset for chaining method calls.
 */
jsfc.StandardXYDataset.prototype.clearProperties = function(notify) {
    this.properties.dataset = null;
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Returns the keys for the properties defined for a series.
 * 
 * @param {!string} seriesKey  the series key.
 * @returns {Array} The property keys.
 */
jsfc.StandardXYDataset.prototype.getSeriesPropertyKeys = function(seriesKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var map = this.properties.series[seriesIndex].seriesProperties;
    if (map) {
        return map.keys();
    } else {
        return [];
    }
};

/**
 * Returns the value of a property for a series.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.StandardXYDataset.prototype.getSeriesProperty = function(seriesKey, 
        propertyKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var map = this.properties.series[seriesIndex].seriesProperties;            
    if (map) {
        return map.get(propertyKey);
    } else {
        return undefined;
    }
};

/**
 * Sets the value of a property for the specified series.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} propertyKey  the property key.
 * @param {*} value  the property value.
 * @returns {undefined}
 */
jsfc.StandardXYDataset.prototype.setSeriesProperty = function(seriesKey, 
        propertyKey, value) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var map = this.properties.series[seriesIndex].seriesProperties;            
    if (!map) {
        map = new jsfc.Map();
        this.properties.series[seriesIndex].seriesProperties = map;
    } 
    map.put(propertyKey, value);
};

/**
 * Clears all the series-level properties for the specified series.
 * 
 * @param {!string} seriesKey  the series key.
 * @returns {undefined}
 */
jsfc.StandardXYDataset.prototype.clearSeriesProperties = function(seriesKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    this.properties.series[seriesIndex].seriesProperties = null;
};

/**
 * Returns a property for the specified data item.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.StandardXYDataset.prototype.getItemProperty = function(seriesKey, 
        itemKey, propertyKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var itemIndex = this.itemIndex(seriesKey, itemKey);
    return this.getItemPropertyByIndex(seriesIndex, itemIndex, propertyKey);
};

/**
 * Sets a property for the specified data item.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @param {!string} propertyKey  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (optional, defaults to true).
 * @returns {undefined}
 */
jsfc.StandardXYDataset.prototype.setItemProperty = function(seriesKey, 
        itemKey, propertyKey, value, notify) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var itemIndex = this.itemIndex(seriesKey, itemKey);
    this.setItemPropertyByIndex(seriesIndex, itemIndex, propertyKey, value, 
            notify);
};

/**
 * Returns a property for the specified data item.  See also the
 * getItemProperty() method where keys rather than indices are used to 
 * specify the data item.
 * 
 * @param {!number} seriesIndex  the series index.
 * @param {!number} itemIndex  the item index.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.StandardXYDataset.prototype.getItemPropertyByIndex = function(seriesIndex, 
        itemIndex, propertyKey) {
    var map = this.properties.series[seriesIndex].maps[itemIndex];
    if (map) {
        return map.get(propertyKey);
    }
    return undefined;
};

/**
 * Sets a property for the specified data item.
 * 
 * @param {!number} seriesIndex  the series index.
 * @param {!number} itemIndex  the item index.
 * @param {!string} propertyKey  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (optional, defaults to true).
 * @returns {undefined}
 */
jsfc.StandardXYDataset.prototype.setItemPropertyByIndex = function(seriesIndex, 
        itemIndex, propertyKey, value, notify) {
    var map = this.properties.series[seriesIndex].maps[itemIndex];
    if (!map) {
        map = new jsfc.Map();
        this.properties.series[seriesIndex].maps[itemIndex] = map;
    }
    map.put(propertyKey, value);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Clears all properties for one item.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @returns {undefined}
 */
jsfc.StandardXYDataset.prototype.clearItemProperties = function(seriesKey, 
        itemKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var itemIndex = this.itemIndex(seriesKey, itemKey);
    this.properties.series[seriesIndex].maps[itemIndex] = null;
};

/**
 * Marks an item as selected within a selection with the specified ID.
 * 
 * @param {!string} selectionId  the selection id.
 * @param {!string} seriesKey  the series key.
 * @param {!Object} itemKey  the item key.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * 
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.StandardXYDataset.prototype.select = function(selectionId, seriesKey, 
        itemKey, notify) {
    var selection;
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex < 0) { // no selection with that id
        selection = {"id": selectionId, "items": []};
        this.selections.push(selection);
    } else {
        selection = this.selections[selectionIndex];
    }
    var i = jsfc.Utils.findInArray(selection.items, function(item) {
        return (item.seriesKey === seriesKey && item.itemKey === itemKey); 
    });
    if (i < 0) {
        selection.items.push({"seriesKey": seriesKey, "itemKey": itemKey});
    }
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Unselects the specified item, returning true if the item was previously 
 * selected and false otherwise (in other words, the return value is true if
 * there is a state change). 
 * 
 * @param {!string} selectionId  the ID for the set of selected items.
 * @param {!string} seriesKey  the series key.
 * @param {!Object} itemKey  the item key.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * 
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.StandardXYDataset.prototype.unselect = function(selectionId, seriesKey, 
        itemKey, notify) {
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex >= 0) {
        var selection = this.selections[selectionIndex];
        var i = jsfc.Utils.findInArray(selection.items, function(obj, i) {
            return (obj.seriesKey === seriesKey && obj.itemKey === itemKey); 
        });
        if (i >= 0) {
            selection.items.splice(i, 1);
        }
    } 
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Returns true if the specified item is selected (for the given selectionId) 
 * and false otherwise.
 * 
 * @param {!string} selectionId  the selection ID.
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * 
 * @returns {!boolean} The selection state.
 */
jsfc.StandardXYDataset.prototype.isSelected = function(selectionId, seriesKey, 
        itemKey) {
    var selection;
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex < 0) {
        return false;
    } else {
        selection = this.selections[selectionIndex];
    }
    return (jsfc.Utils.findInArray(selection.items, function(obj) {
        return (obj.seriesKey === seriesKey && obj.itemKey === itemKey); 
    }) >= 0); 
};

/**
 * Clears any items from the selection with the specified id.
 * 
 * @param {!string} selectionId  the selection it.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.StandardXYDataset.prototype.clearSelection = function(selectionId, notify) {
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex >= 0) {
        this.selections.splice(selectionIndex, 1);
    }
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Returns the index of the selection with the specified ID, or -1 if there is 
 * no such selection.
 * 
 * @param {string} selectionId  the selection ID.
 * @returns {number} The selection index.
 */
jsfc.StandardXYDataset.prototype._indexOfSelection = function(selectionId) {
    return jsfc.Utils.findInArray(this.selections, function(item) {
        return item.id === selectionId;
    });
};

/**
 * Registers a listener to receive notification of changes to the dataset. The
 * listener must have a 'datasetChanged(KeyedValuesDataset)' method.
 * 
 * @param {Function} listener  the listener object.
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.StandardXYDataset.prototype.addListener = function(listener) {
    this._listeners.push(listener);
    return this;
};

/**
 * Removes a listener so that it will no longer receive notification of changes
 * to this dataset.
 * 
 * @param {Function} listener the listener.
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.StandardXYDataset.prototype.removeListener = function(listener) {
    var i = this._listeners.indexOf(listener);
    if (i >= 0) {
        this._listeners.splice(i, 1);
    }
    return this;
};

/**
 * Notifies listeners that the dataset has changed.
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.StandardXYDataset.prototype.notifyListeners = function() {
    for (var i = 0; i < this._listeners.length; i++) {
        this._listeners[i](this);
    }
    return this;
};


"use strict";

/**
 * A dataset representing a two dimensional table of values where each row is 
 * uniquely identified by a row key and each column is uniquely identified by
 * a column key.  In addition to the data values, properties can be defined at 
 * the dataset level, the row and column level, and the item level.
 *  
 * @interface
 */
jsfc.Values2DDataset = function() {
    throw new Error("Interface only.");
};

/**
 * Adds a value to the dataset for the specified cell identified by the row
 * and column keys.  If necessary, a new row and/or column will be added to the
 * dataset.
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @param {number} value  the value.
 * @param {boolean} [notify]  notify listeners? (the default is true).
 * @returns {jsfc.KeyedValues2DDataset} This dataset for chaining method calls.
 */
jsfc.Values2DDataset.prototype.add = function(rowKey, columnKey, value, notify) {
};

/**
 * Returns the number of rows in the dataset.
 * @returns {!number} The row count.
 */
jsfc.Values2DDataset.prototype.rowCount = function() {
};

/**
 * Returns the number of columns in the dataset.
 * @returns {!number} The column count.
 */
jsfc.Values2DDataset.prototype.columnCount = function() {
};

/**
 * Returns the data value in the cell with the specified row and column indices.
 * 
 * @param {!number} r  the row index.
 * @param {!number} c  the column index.
 * @returns {number} The data value.
 */
jsfc.Values2DDataset.prototype.valueByIndex = function(r, c) {
};

/**
 * Returns an array containing all the row keys for this dataset.
 * 
 * @returns {Array} An array of row keys.
 */
jsfc.Values2DDataset.prototype.rowKeys = function() {
};

/**
 * Returns an array containing all the column keys for this dataset.
 * 
 * @returns {Array} An array of column keys.
 */
jsfc.Values2DDataset.prototype.columnKeys = function() {
};

/**
 * Returns the key for the row with the specified index.
 * 
 * @param {!number} r  the row index.
 * @returns {string} The row key.
 */
jsfc.Values2DDataset.prototype.rowKey = function(r) {
};

/**
 * Returns the index of the row with the specified key, or -1 if there is no
 * such row.
 * 
 * @param {!string} key  the row key.
 * @returns {number} The row index, or -1.
 */
jsfc.Values2DDataset.prototype.rowIndex = function(key) {  
};

/**
 * Returns the column key at the specified index.
 * 
 * @param {!number} c  the column index.
 * @returns The column key.
 */
jsfc.Values2DDataset.prototype.columnKey = function(c) { 
};

/**
 * Returns the index of the column with the specified key, or -1 if there is no
 * such column.
 * 
 * @param {!string} key  the column key.
 * @returns {number} The column index, or -1.
 */
jsfc.Values2DDataset.prototype.columnIndex = function(key) {
};

/**
 * Returns the value (possibly null) of the cell identified by the supplied
 * row and column keys.
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @returns {number} The data value.
 */
jsfc.Values2DDataset.prototype.valueByKey = function(rowKey, columnKey) {
};
    
/**
 * Returns an array containing the keys for the properties (if any) defined
 * on the specified row.
 * 
 * @param {!string} rowKey  the row key.
 * @returns {Array} An array of keys.
 */
jsfc.Values2DDataset.prototype.getRowPropertyKeys = function(rowKey) {
};

/**
 * Returns the value of a property for a row.
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.Values2DDataset.prototype.getRowProperty = function(rowKey, propertyKey) {             
};

/**
 * Sets a property for a row and sends a change notification to all 
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} propertyKey  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.Values2DDataset.prototype.setRowProperty = function(rowKey, propertyKey, 
        value, notify) {
};

/**
 * Clears the row properties for the specified row and sends a change 
 * notification to registered listeners (unless 'notify' is set to false).
 * 
 * @param {!string} rowKey  the row key.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * 
 * @returns {undefined}
 */
jsfc.Values2DDataset.prototype.clearRowProperties = function(rowKey, notify) {
};

/**
 * Returns an array containing all the keys for the properties defined for
 * the specified column.
 * 
 * @param {!string} columnKey  the column key.
 * @returns {Array} The property keys.
 */
jsfc.Values2DDataset.prototype.getColumnPropertyKeys = function(columnKey) {
};

/**
 * Returns the value of a property defined for the specified column.
 * 
 * @param {!string} columnKey  the column key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.Values2DDataset.prototype.getColumnProperty = function(columnKey, 
        propertyKey) {
};

/**
 * Sets a property for a column and sends a change notification to registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {!string} columnKey  the column key.
 * @param {!string} propertyKey  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.Values2DDataset.prototype.setColumnProperty = function(columnKey, 
        propertyKey, value, notify) {
};

/**
 * Clears all the column properties for the specified column and sends a 
 * change notification to registered listeners (unless 'notify' is set to 
 * false).
 * 
 * @param {!string} columnKey  the column key.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.Values2DDataset.prototype.clearColumnProperties = function(columnKey,
        notify) {
};

/**
 * Returns a property for the specified data item.
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.Values2DDataset.prototype.getItemProperty = function(rowKey, columnKey, 
        propertyKey) {
};

/**
 * Sets a property for the specified data item and sends a change notification
 * to all registered listeners (unless 'notify' is set to false).
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @param {!string} propertyKey  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.Values2DDataset.prototype.setItemProperty = function(rowKey, 
        columnKey, propertyKey, value, notify) {
};

/**
 * Returns the keys for the properties defined for a data item in the dataset.
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @returns {Array} An array containing the property keys.
 */
jsfc.Values2DDataset.prototype.getItemPropertyKeys = function(rowKey, 
        columnKey) {
};

/**
 * Clears all properties for one item and sends a change notification to
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {!string} rowKey  the row key.
 * @param {!string} columnKey  the column key.
 * @returns {undefined}
 */
jsfc.Values2DDataset.prototype.clearItemProperties = function(rowKey, 
        columnKey, notify) {
};

/**
 * A collection of utility functions for working with datasets.
 * @namespace
 */
jsfc.Values2DDatasetUtils = {};

/**
 * Returns [ymin, ymax] where ymin is the smallest value appearing in the 
 * dataset and ymax is the largest value.
 * 
 * @param {jsfc.Values2DDataset} dataset  the source dataset.
 * @param {number} [baseline]  the baseline value.
 * 
 * @returns {Array} The y-value range.
 */
jsfc.Values2DDatasetUtils.ybounds = function(dataset, baseline) {
    var ymin = baseline ? baseline : Number.POSITIVE_INFINITY;
    var ymax = baseline ? baseline : Number.NEGATIVE_INFINITY;
    for (var r = 0; r < dataset.rowCount(); r++) {
        for (var c = 0; c < dataset.columnCount(); c++) {
            var y = dataset.valueByIndex(r, c);
            if (y) {
                ymin = Math.min(ymin, y);
                ymax = Math.max(ymax, y);
            }
        }
    }
    return [ymin, ymax];    
};

/**
 * Returns the stack base value for the specified item in the dataset.
 * 
 * @param {!jsfc.Values2DDataset} dataset  the dataset.
 * @param {!number} r  the row index.
 * @param {!number} c  the column index.
 * @param {number} [baseline]  the initial baseline (defaults to 0.0).
 * 
 * @returns {!number} The base value.
 */
jsfc.Values2DDatasetUtils.stackBaseY = function(dataset, r, c, baseline) {
    var y = dataset.valueByIndex(r, c);
    var result = baseline || 0.0;
    if (y > 0) {
        for (var rr = 0; rr < r; rr++) {
            y = dataset.valueByIndex(rr, c);
            if (y > 0) {
                result += y;
            }
        }
        return result;
    } else if (y < 0) {
        for (var rr = 0; rr < r; rr++) {
            y = dataset.valueByIndex(rr, c);
            if (y < 0) {
                result += y; // y is negative!
            }
        }
        return result;        
    }
    return result;
};

/**
 * Returns the range of y-values in the dataset assuming that all the values
 * in a given column are stacked on top of one another (as they would be for
 * a stacked bar chart), positive values above the baseline and negative values 
 * below the baseline.
 * 
 * @param {!jsfc.Values2DDataset} dataset  the dataset.
 * @param {number} [baseline]  the baseline (defaults to 0.0).
 * @returns {Array} An array containing [ymin, ymax].
 */
jsfc.Values2DDatasetUtils.stackYBounds = function(dataset, baseline) {
    var ymin = baseline ? baseline : 0;
    var ymax = baseline ? baseline : 0;
    for (var c = 0; c < dataset.columnCount(); c++) {
        var posBase = baseline || 0; 
        var negBase = baseline || 0; 
        for (var r = 0; r < dataset.rowCount(); r++) {
            var y = dataset.valueByIndex(r, c);
            if (y > 0) {
                posBase += y;
            } else if (y < 0) {
                negBase += y;
            }
            ymin = Math.min(ymin, negBase);
            ymax = Math.max(ymax, posBase);
        }
    }
    return [ymin, ymax];        
};

/**
 * A dataset containing an arbitrary number of data series where each series 
 * contains an arbitrary number of (x, y) data items.  In addition to the
 * data values, properties can be defined at the dataset level, the series 
 * level and the item level.
 *  
 * @interface
 */
jsfc.XYDataset = function() {
    throw new Error("Interface only.");
};

/**
 * Returns the value of a property for the dataset.
 * 
 * @param {!string} key  the property key.
 * @returns {*} The property value.
 */
jsfc.XYDataset.prototype.getProperty = function(key) {    
};

/**
 * Sets the value of a property for the dataset.
 * 
 * @param {!string} key  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (the default is true).
 */
jsfc.XYDataset.prototype.setProperty = function(key, value, notify) {    
};

/**
 * Returns an array containing all the keys of the properties defined for
 * this dataset.
 * 
 * @returns {Array}
 */
jsfc.XYDataset.prototype.getPropertyKeys = function() {
};

/**
 * Clears the dataset-level properties and sends a change notification to
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {boolean} [notify] notify listeners? (defaults to true).
 * @returns {jsfc.XYDataset} The dataset for chaining method calls.
 */
jsfc.XYDataset.prototype.clearProperties = function(notify) {  
};

/**
 * Returns the number of series in the dataset.
 * 
 * @returns {number} The series count.
 */
jsfc.XYDataset.prototype.seriesCount = function() {
};

/**
 * Returns an array containing the keys for all the series in the dataset.
 * 
 * @returns {Array} The series keys.
 */
jsfc.XYDataset.prototype.seriesKeys = function() {
};

/**
 * Returns the key for the series with the specified index.
 * 
 * @param {number} seriesIndex  the series index.
 * 
 * @returns {string} The series key.
 */
jsfc.XYDataset.prototype.seriesKey = function(seriesIndex) {
};

/**
 * Returns the index for the series with the specified key, or -1.
 * 
 * @param {string} seriesKey  the series key.
 * 
 * @returns {number} The series index.
 */
jsfc.XYDataset.prototype.seriesIndex = function(seriesKey) {
};

/**
 * Returns the number of items in the specified series.
 * 
 * @param {number} seriesIndex  the series index.
 * 
 * @returns {number} The item count.
 */
jsfc.XYDataset.prototype.itemCount = function(seriesIndex) {
};

/**
 * Returns the index of the item in the specified series that has the specified
 * item key.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @returns {!number} The item index.
 */
jsfc.XYDataset.prototype.itemIndex = function(seriesKey, itemKey) {
};

/**
 * Returns the x-value for an item in a series.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {number} The x-value.
 */
jsfc.XYDataset.prototype.x = function(seriesIndex, itemIndex) {
};

/**
 * Returns the y-value for an item in a series.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {number} The y-value.
 */
jsfc.XYDataset.prototype.y = function(seriesIndex, itemIndex) {  
};

/**
 * Returns one item from a series.  The return value is an object with the form
 * {"x": x, "y": y, "key": key}.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * @returns {Object} A data item.
 */
jsfc.XYDataset.prototype.item = function(seriesIndex, itemIndex) {
};

/**
 * Registers a listener to receive notification of changes to the dataset. The
 * listener must have a 'datasetChanged(KeyedValuesDataset)' method.
 * 
 * @param {Function} listener  the listener object.
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.XYDataset.prototype.addListener = function(listener) {
};

/**
 * Removes a listener so that it will no longer receive notification of changes
 * to this dataset.
 * 
 * @param {Function} listener the listener.
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.XYDataset.prototype.removeListener = function(listener) {
};

/**
 * The bounds for the data values.  This method returns an array in the form
 * [xmin, xmax, ymin, ymax].
 * 
 * @returns {Array} An array containing the dataset bounds.
 */
jsfc.XYDataset.prototype.bounds = function() {
};

/**
 * Returns [xmin, xmax] where xmin is the lowest x-value in the dataset and
 * xmax is this highest x-value in the dataset.  If the dataset is empty,
 * this method returns [POSITIVE_INFINITIY, NEGATIVE_INFINITY] (maybe we'll
 * change this).
 * 
 * @returns {Array}
 */
jsfc.XYDataset.prototype.xbounds = function() {
};

/**
 * Returns [ymin, ymax] where ymin is the lowest y-value in the dataset and
 * xmax is this highest y-value in the dataset.  If the dataset is empty,
 * this method returns [POSITIVE_INFINITIY, NEGATIVE_INFINITY] (maybe we'll
 * change this).
 * 
 * @returns {Array}
 */
jsfc.XYDataset.prototype.ybounds = function() {   
};

/**
 * Returns a property for the specified data item.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @param {!string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.XYDataset.prototype.getItemProperty = function(seriesKey, itemKey, 
        propertyKey) {
};

/**
 * Sets a property for the specified data item and sends a change notification
 * to registered listeners.
 * 
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * @param {!string} propertyKey  the property key.
 * @param {*} value  the property value.
 * @param {boolean} [notify]  notify listeners? (optional, defaults to true).
 * @returns {undefined}
 */
jsfc.XYDataset.prototype.setItemProperty = function(seriesKey, 
        itemKey, propertyKey, value, notify) {
};

/**
 * Marks an item as selected within a selection with the specified ID.
 * 
 * @param {!string} selectionId  the selection id.
 * @param {!string} seriesKey  the series key.
 * @param {!Object} itemKey  the item key.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * 
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.XYDataset.prototype.select = function(selectionId, seriesKey, itemKey, 
        notify) {
};

/**
 * Unselects the specified item, returning true if the item was previously 
 * selected and false otherwise (in other words, the return value is true if
 * there is a state change). 
 * 
 * @param {!string} selectionId  the ID for the set of selected items.
 * @param {!string} seriesKey  the series key.
 * @param {!Object} itemKey  the item key.
 * 
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.XYDataset.prototype.unselect = function(selectionId, seriesKey, itemKey) {
};

/**
 * Returns true if the specified item is selected (for the given selectionId) 
 * and false otherwise.
 * 
 * @param {!string} selectionId  the selection ID.
 * @param {!string} seriesKey  the series key.
 * @param {!string} itemKey  the item key.
 * 
 * @returns {!boolean} The selection state.
 */
jsfc.XYDataset.prototype.isSelected = function(selectionId, seriesKey, 
        itemKey) {
};

/**
 * Clears any items from the selection with the specified id.
 * 
 * @param {string} selectionId  the selection it.
 * @returns {jsfc.XYDataset} This dataset (for chaining method calls).
 */
jsfc.XYDataset.prototype.clearSelection = function(selectionId) {
};

/**
 * A collection of utility functions for working with datasets.
 * @namespace
 */
jsfc.XYDatasetUtils = {};

/**
 * Returns the number of data items in the dataset.
 * 
 * @param {!jsfc.XYDataset} dataset  the dataset.
 * 
 * @returns {!number}
 */
jsfc.XYDatasetUtils.itemCount = function(dataset) {
    var result = 0;
    for (var s = 0; s < dataset.seriesCount(); s++) {
        result += dataset.itemCount(s);
    }
    return result;
};

/**
 * Returns [ymin, ymax] where ymin is the smallest value appearing in the 
 * dataset and ymax is the largest value.
 * 
 * @param {jsfc.XYDataset} dataset  the source dataset.
 * @param {number} [baseline]  the baseline value.
 * 
 * @returns {Array} The y-value range.
 */
jsfc.XYDatasetUtils.ybounds = function(dataset, baseline) {
    var ymin = baseline ? baseline : Number.POSITIVE_INFINITY;
    var ymax = baseline ? baseline : Number.NEGATIVE_INFINITY;
    for (var s = 0; s < dataset.seriesCount(); s++) {
        for (var i = 0; i < dataset.itemCount(s); i++) {
            var y = dataset.y(s, i);
            ymin = Math.min(ymin, y);
            ymax = Math.max(ymax, y);
        }
    }
    return [ymin, ymax];    
};
"use strict";

/**
 * Creates a new (empty) dataset instance.
 * @constructor
 * @classdesc A dataset that stores one or more data series where each series
 *     consists of an arbitrary number of (x, y) data items.  The dataset also
 *     provides a selection state mechanism.  A typical dataset will serialise 
 *     to JSON format as follows:
 *     <blockquote>{"data":{"series":[{"seriesKey":"S1","items":[{"x":1.1,"y":10.1,"z":101},{"x":2.2,"y":10.2,"z":102},{"x":3.3,"y":10.3,"z":103}]},{"seriesKey":"S2","items":[{"x":4.4,"y":10.4,"z":104}]},{"seriesKey":"S3","items":[{"x":5.5,"y":10.5,"z":105}]}]},"selections":[],"listeners":[]}</blockquote>
 */
jsfc.XYZDataset = function() {
    this.data = { "series": [] };
    this.properties = [];
    this.selections = [];
    this._listeners = [];
};

/**
 * Returns the number of series in the dataset.
 * 
 * @returns {number} The series count.
 */
jsfc.XYZDataset.prototype.seriesCount = function() {
    return this.data.series.length;
};

/**
 * Returns an array containing the keys for all the series in the dataset.
 * 
 * @returns {Array} The series keys.
 */
jsfc.XYZDataset.prototype.seriesKeys = function() {
    return this.data.series.map(function(d) { return d.seriesKey; });
};

/**
 * Returns the key for the series with the specified index.
 * 
 * @param {number} seriesIndex  the series index.
 * 
 * @returns {string} The series key.
 */
jsfc.XYZDataset.prototype.seriesKey = function(seriesIndex) {
    return this.data.series[seriesIndex].seriesKey;
};

/**
 * Returns the index for the series with the specified key, or -1.
 * 
 * @param {string} seriesKey  the series key.
 * 
 * @returns {number} The series index.
 */
jsfc.XYZDataset.prototype.seriesIndex = function(seriesKey) {
    jsfc.Args.requireString(seriesKey, "seriesKey");
    var seriesArray = this.data.series;
    var seriesCount = this.data.series.length;
    for (var s = 0; s < seriesCount; s++) {
        if (seriesArray[s].seriesKey === seriesKey) {
            return s;
        }
    }
    return -1;
};

/**
 * Returns the number of items in the specified series.
 * 
 * @param {number} seriesIndex  the series index.
 * 
 * @returns {number} The item count.
 */
jsfc.XYZDataset.prototype.itemCount = function(seriesIndex) {
    return this.data.series[seriesIndex].items.length;
};

/**
 * Returns the index of the item in the specified series that has the specified
 * item key.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string|number} itemKey  the item key.
 * @returns {number} The item index.
 */
jsfc.XYZDataset.prototype.itemIndex = function(seriesKey, itemKey) {
    jsfc.Args.require(itemKey, "itemKey");
    var seriesIndex = this.seriesIndex(seriesKey);
    var items = this.data.series[seriesIndex].items;
    for (var i = 0; i < items.length; i++) {
        if (items[i].key === itemKey) {
            return i;
        }
    }
    return -1;
};

/**
 * Returns the x-value for an item in a series.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {number} The x-value.
 */
jsfc.XYZDataset.prototype.x = function(seriesIndex, itemIndex) {
    return this.data.series[seriesIndex].items[itemIndex].x; 
};

/**
 * Returns the y-value for an item in a series.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {number} The y-value.
 */
jsfc.XYZDataset.prototype.y = function(seriesIndex, itemIndex) {
    return this.data.series[seriesIndex].items[itemIndex].y;     
};

/**
 * Returns the z-value for an item in a series.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {number} The z-value.
 */
jsfc.XYZDataset.prototype.z = function(seriesIndex, itemIndex) {
    return this.data.series[seriesIndex].items[itemIndex].z;     
};

/**
 * Returns one item from a series.  The return value is an object with the form
 * {"x": x, "y": y, "z": z, "key": key}.
 * 
 * @param {number} seriesIndex  the series index.
 * @param {number} itemIndex  the item index.
 * @returns {Object} A data item.
 */
jsfc.XYZDataset.prototype.item = function(seriesIndex, itemIndex) {
    return this.data.series[seriesIndex].items[itemIndex]; 
};

/**
 * Returns an item based on the series and item keys.
 * 
 * @param {string} seriesKey  the series key.
 * @param {number|string} itemKey  the item key.
 * @returns {Object}
 */
jsfc.XYZDataset.prototype.itemByKey = function(seriesKey, itemKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var items = this.data.series[seriesIndex].items;
    for (var i = 0; i < items.length; i++) {
        if (items[i].key === itemKey) {
            return items[i];
        }
    }
    return null;
};

/**
 * Returns the item key for an item.  All items will have a key that is unique
 * within the series (either auto-generated or explicitly set).
 * 
 * @param {number} seriesIndex
 * @param {number} itemIndex
 * @returns {number|string}
 */
jsfc.XYZDataset.prototype.getItemKey = function(seriesIndex, itemIndex) {
    return this.item(seriesIndex, itemIndex).key;
};

/**
 * Generates a new (and unique) item key for the specified series.
 * 
 * @param {number} seriesIndex  the series index.
 * 
 * @returns {string|number}
 */
jsfc.XYZDataset.prototype.generateItemKey = function(seriesIndex) {
    // for a series that is not yet created, we can use 0 for the itemKey
    if (seriesIndex < 0) {
        return 0;
    }
    // if there is a prefix we can use that and append numbers to make something
    // unique
    // otherwise just use numbers
    var candidate = 0;
    var max = Number.MIN_VALUE;
    var items = this.data.series[seriesIndex].items;
    for (var i = 0; i < items.length; i++) {
        if (typeof items[i].key === "number") {
            max = Math.max(items[i].key, max);
        }
        if (candidate === items[i].key) {
            candidate = max + 1;
        };
    }
    return candidate;
};

/**
 * Adds a new item to the dataset.  If the specified series does not exist in 
 * the dataset, it will be created.
 * 
 * @param {string} seriesKey  the series key.
 * @param {number} x  the x-value.
 * @param {number} y  the y-value.
 * @param {number} z  the z-value.
 * 
 * @returns {jsfc.XYZDataset} This dataset (for chaining methods).
 */
jsfc.XYZDataset.prototype.add = function(seriesKey, x, y, z, notify) {
    jsfc.Args.requireNumber(x, "x");
    var itemKey = this.generateItemKey(this.seriesIndex(seriesKey));
    return this.addByKey(seriesKey, itemKey, x, y, z, notify);
};

/**
 * Adds an item to the dataset with the specified seriesKey and itemKey.  If the
 * series does not already exist it will be created.  If the series contains
 * an item with the specified key, the values for that item will be updated,
 * otherwise a new item will be created in the series.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string|number} itemKey  the item key.
 * @param {number} x  the x-value.
 * @param {number} y  the y-value.
 * @param {number} z  the y-value.
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.XYZDataset} This dataset (for chaining method calls).
 */
jsfc.XYZDataset.prototype.addByKey = function(seriesKey, itemKey, x, y, z, notify) {
    jsfc.Args.requireString(seriesKey, "seriesKey");
    var s = this.seriesIndex(seriesKey);
    if (s < 0) {
        this.addSeries(seriesKey);
        s = this.data.series.length - 1;
    }
    var item = this.itemByKey(seriesKey, itemKey);
    if (item) {
        item.x = x;
        item.y = y;
    } else {
        this.data.series[s].items.push({"x": x, "y": y, "z": z, "key": itemKey});
        this.properties[s].maps.push(null);
    }
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;    
};

/**
 * Adds a new empty series with the specified key.
 * 
 * @param {string} seriesKey  the series key.
 * 
 * @returns {jsfc.XYZDataset} This dataset (for chaining method calls).
 */
jsfc.XYZDataset.prototype.addSeries = function(seriesKey) {
    jsfc.Args.requireString(seriesKey, "seriesKey");
    var s = this.seriesIndex(seriesKey);
    if (s >= 0) {
        throw new Error("There is already a series with the key '" + seriesKey);
    }
    this.data.series.push({ "seriesKey": seriesKey, "items": [] });
    this.properties.push({ "seriesKey": seriesKey, "maps": [] });
    return this;
};

/**
 * Removes the series with the specified ID and sends a change event to 
 * registered listeners.
 * 
 * @param {string} seriesKey  the series key.
 * @returns {jsfc.XYZDataset} This dataset (for chaining method calls).
 */
jsfc.XYZDataset.prototype.removeSeries = function(seriesKey) {
    jsfc.Args.requireString(seriesKey, "seriesKey");
    var s = this.seriesIndex(seriesKey);
    if (s >= 0) {
        this.data.series.splice(s, 1);
    }
    return this;
};

/**
 * Registers a listener to receive notification of changes to the dataset. The
 * listener must have a 'datasetChanged(KeyedValuesDataset)' method.
 * 
 * @param {Object} listener  the listener object.
 * @returns {jsfc.XYZDataset} This dataset (for chaining method calls).
 */
jsfc.XYZDataset.prototype.addListener = function(listener) {
    this._listeners.push(listener);
    return this;
};

/**
 * Removes a listener so that it will no longer receive notification of changes
 * to this dataset.
 * 
 * @param {Object} listener the listener.
 * @returns {jsfc.XYZDataset} This dataset (for chaining method calls).
 */
jsfc.XYZDataset.prototype.removeListener = function(listener) {
    var i = this._listeners.indexOf(listener);
    if (i >= 0) {
        this._listeners.splice(i, 1);
    }
    return this;
};

/**
 * Notifies listeners that the dataset has changed.
 * @returns {jsfc.XYZDataset} This dataset (for chaining method calls).
 */
jsfc.XYZDataset.prototype.notifyListeners = function() {
    for (var i = 0; i < this._listeners.length; i++) {
        this._listeners[i](this);
    }
    return this;
};

/**
 * Returns a property for the specified data item.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string} itemKey  the item key.
 * @param {string} propertyKey  the property key.
 * @returns {*} The property value.
 */
jsfc.XYZDataset.prototype.getProperty = function(seriesKey, itemKey, propertyKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var itemIndex = this.itemIndex(seriesKey, itemKey);
    var map = this.properties[seriesIndex].maps[itemIndex];
    if (map) {
        return map.get(propertyKey);
    }
};

/**
 * Sets a property for the specified data item.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string} itemKey  the item key.
 * @param {string} propertyKey  the property key.
 * @param {*} value
 * @returns {undefined}
 */
jsfc.XYZDataset.prototype.setProperty = function(seriesKey, itemKey, propertyKey, value) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var itemIndex = this.itemIndex(seriesKey, itemKey);
    var map = this.properties[seriesIndex][itemIndex];
    if (!map) {
        map = new jsfc.Map();
        this.properties[seriesIndex].maps[itemIndex] = map;
    }
    map.put(propertyKey, value);
};

/**
 * Clears all properties for one item.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string|number} itemKey  the item key.
 * @returns {undefined}
 */
jsfc.XYZDataset.prototype.clearProperties = function(seriesKey, itemKey) {
    var seriesIndex = this.seriesIndex(seriesKey);
    var itemIndex = this.itemIndex(seriesKey, itemKey);
    this.properties[seriesIndex].maps[itemIndex] = null;
};

/**
 * Marks an item as selected within a selection with the specified ID.
 * 
 * @param {string} selectionId  the selection id.
 * @param {string} seriesKey  the series key.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {jsfc.XYZDataset} This dataset (for chaining method calls).
 */
jsfc.XYZDataset.prototype.select = function(selectionId, seriesKey, itemIndex) {
    var selection;
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex < 0) { // no selection with that id
        selection = {"id": selectionId, "items": []};
        this.selections.push(selection);
    } else {
        selection = this.selections[selectionIndex];
    }
    var i = jsfc.Utils.findInArray(selection.items, function(item) {
        return (item.seriesKey === seriesKey && item.item === itemIndex); 
    });
    if (i < 0) {
        selection.items.push({"seriesKey": seriesKey, "item": itemIndex});
    }
    return this;
};

/**
 * Unselects the specified item, returning true if the item was previously 
 * selected and false otherwise (in other words, the return value is true if
 * there is a state change). 
 * 
 * @param {string} selectionId  the ID for the set of selected items.
 * @param {string} seriesKey  the series key.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {jsfc.XYZDataset} This dataset (for chaining method calls).
 */
jsfc.XYZDataset.prototype.unselect = function(selectionId, seriesKey, itemIndex) {
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex >= 0) {
        var selection = this.selections[selectionIndex];
        var i = jsfc.Utils.findInArray(selection.items, function(obj, i) {
            return (obj.seriesKey === seriesKey && obj.item === itemIndex); 
        });
        if (i >= 0) {
            selection.items.splice(i, 1);
        }
    } 
    return this;
};

/**
 * Returns true if the specified item is selected (for the given selectionId) 
 * and false otherwise.
 * 
 * @param {string} selectionId  the selection ID.
 * @param {string} seriesKey  the series key.
 * @param {number} itemIndex  the item index.
 * 
 * @returns {boolean}  the selection state.
 */
jsfc.XYZDataset.prototype.isSelected = function(selectionId, seriesKey, itemIndex) {
    var selection;
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex < 0) {
        return false;
    } else {
        selection = this.selections[selectionIndex];
    }
    return (jsfc.Utils.findInArray(selection.items, function(obj) {
        return (obj.seriesKey === seriesKey && obj.item === itemIndex); 
    }) >= 0); 
};

/**
 * Clears any items from the selection with the specified id.
 * 
 * @param {string} selectionId  the selection it.
 * @returns {undefined}
 */
jsfc.XYZDataset.prototype.clearSelection = function(selectionId) {
    var selectionIndex = this._indexOfSelection(selectionId);
    if (selectionIndex >= 0) {
        this.selections.splice(selectionIndex, 1);
    }
};

/**
 * Returns the index of the selection with the specified ID, or -1 if there is 
 * no such selection.
 * 
 * @param {string} selectionId  the selection ID.
 * @returns {number} The selection index.
 */
jsfc.XYZDataset.prototype._indexOfSelection = function(selectionId) {
    return jsfc.Utils.findInArray(this.selections, function(item) {
        return item.id === selectionId;
    });
};


/**
 * @namespace
 */
jsfc.Charts = {};

/**
 * Creates a table element containing the specified title and subtitle.
 *  
 * @param {!string} title  the title.
 * @param {string} [subtitle]  the subtitle (optional).
 * @param {jsfc.Anchor2D} [anchor]  the title anchor (optional, used to 
 *         determine the default text alignment).
 * 
 * @returns {jsfc.TableElement}
 */
jsfc.Charts.createTitleElement = function(title, subtitle, anchor) {
    jsfc.Args.requireString(title, "title");
    var titleFont = new jsfc.Font("Palatino, serif", 16, true, false);
    var halign = jsfc.HAlign.LEFT;
    var refPt = anchor ? anchor.refPt() : jsfc.RefPt2D.TOP_LEFT;
    if (jsfc.RefPt2D.isHorizontalCenter(refPt)) {
        halign = jsfc.HAlign.CENTER;
    } else if (jsfc.RefPt2D.isRight(refPt)) {
        halign = jsfc.HAlign.RIGHT;
    }
    var titleElement = new jsfc.TextElement(title);
    titleElement.setFont(titleFont);
    titleElement.halign(halign);
    titleElement.isTitle = true;
    if (subtitle) {
        var subtitleFont = new jsfc.Font("Palatino, serif", 12, false, true);
        var subtitleElement = new jsfc.TextElement(subtitle);
        subtitleElement.setFont(subtitleFont);
        subtitleElement.halign(halign);
        subtitleElement.isSubtitle = true;
        var composite = new jsfc.GridElement();
        composite.setInsets(new jsfc.Insets(0, 0, 0, 0));
        composite.add(titleElement, "R1", "C1");
        composite.add(subtitleElement, "R2", "C1");
        return composite;
    } else {
        return titleElement;
    }    
};

/**
 * Creates a bar chart based on the supplied dataset (any object that
 * implements the jsfc.Values2DDataset interface).
 * 
 * @param {string} title  the chart title (null permitted).
 * @param {string} subtitle  the chart subtitle (null permitted).
 * @param {!jsfc.Values2DDataset} dataset  the dataset.
 * @param {string} [xAxisLabel]  the x-axis label (defaults to 'Category').
 * @param {string} [yAxisLabel]  the y-axis label (defaults to 'Value').
 * @returns {jsfc.Chart}
 */
jsfc.Charts.createBarChart = function(title, subtitle, dataset, xAxisLabel, 
        yAxisLabel) {
    var plot = new jsfc.CategoryPlot(dataset);
    var renderer = new jsfc.BarRenderer(plot);
    plot.setRenderer(renderer);
    var xAxis = plot.getXAxis();
    xAxis.setLabel(xAxisLabel || "Category");
    var yAxis = plot.getYAxis();
    yAxis.setLabel(yAxisLabel || "Value");    
    yAxis.setAutoRangeIncludesZero(true);
    return new jsfc.Chart(plot)
            .setTitle(title, subtitle);
};

/**
 * Creates a stacked bar chart based on the supplied dataset (any object that
 * implements the jsfc.Values2DDataset interface).
 * 
 * @param {string} title  the chart title (null permitted).
 * @param {string} subtitle  the chart subtitle (null permitted).
 * @param {!jsfc.Values2DDataset} dataset  the dataset.
 * @param {string} [xAxisLabel]  the x-axis label (defaults to 'Category').
 * @param {string} [yAxisLabel]  the y-axis label (defaults to 'Value').
 * @returns {jsfc.Chart}
 */
jsfc.Charts.createStackedBarChart = function(title, subtitle, dataset, 
        xAxisLabel, yAxisLabel) {
    var plot = new jsfc.CategoryPlot(dataset);
    plot.setRenderer(new jsfc.StackedBarRenderer(plot));
    var xAxis = plot.getXAxis();
    xAxis.setLabel(xAxisLabel || "Category");
    var yAxis = plot.getYAxis();
    yAxis.setLabel(yAxisLabel || "Value");    
    yAxis.setAutoRangeIncludesZero(true);
    return new jsfc.Chart(plot)
            .setTitle(title, subtitle);
};

// Creates a line chart based on the supplied dataset (KeyedValues2DDataset)
jsfc.Charts.createLineChart = function(title, subtitle, dataset, 
        xAxisLabel, yAxisLabel) {
//    jsfc.Args.requireKeyedValues2DDataset(dataset, "dataset");
//    var plot = new jsfc.CategoryPlot(dataset);
//    plot.xAxis.label = xAxisLabel;
//    plot.yAxis.label = yAxisLabel;
//    plot.renderer = new jsfc.LineRenderer();
//    var chart = new jsfc.Chart(plot);
//    chart.initMargin({ top: 5, right: 5, left: 30, bottom: 20});
//    chart.title(jsfc.Charts.createTitleElement(title, subtitle, 
//            chart.titleAnchor()));
//    return chart;
};

/**
 * Creates a scatter chart with the supplied dataset.
 * 
 * @param {string} title  the chart title (null permitted).
 * @param {string} subtitle  the chart subtitle (null permitted).
 * @param {!jsfc.XYDataset} dataset  the dataset (null not permitted).
 * @param {string} xAxisLabel  the x-axis label.
 * @param {string} yAxisLabel  the y-axis label.
 * @returns {jsfc.Chart} A chart.
 */
jsfc.Charts.createScatterChart = function(title, subtitle, dataset, 
        xAxisLabel, yAxisLabel) {
    jsfc.Args.requireXYDataset(dataset, "dataset");
    var plot = new jsfc.XYPlot(dataset);
    plot.getXAxis().setLabel(xAxisLabel);
    plot.getYAxis().setLabel(yAxisLabel);
    plot.setRenderer(new jsfc.ScatterRenderer(plot));
    var chart = new jsfc.Chart(plot);
    chart.setPadding(5, 5, 5, 5);
    chart.setTitle(title, subtitle, chart.getTitleAnchor());
    return chart;
};

/**
 * Creates a line chart based on the supplied dataset (XYDataset).
 * 
 * @param {string} title  the chart title (null permitted).
 * @param {string} subtitle  the chart subtitle (null permitted).
 * @param {!jsfc.XYDataset} dataset  the dataset (null not permitted).
 * @param {string} xAxisLabel  the x-axis label.
 * @param {string} yAxisLabel  the y-axis label.
 * @returns {jsfc.Chart} A chart.
 */
jsfc.Charts.createXYLineChart = function(title, subtitle, dataset, 
        xAxisLabel, yAxisLabel) {
    jsfc.Args.requireXYDataset(dataset, "dataset");
    var plot = new jsfc.XYPlot(dataset);
    plot.getXAxis().setLabel(xAxisLabel);
    plot.getYAxis().setLabel(yAxisLabel);
    var renderer = new jsfc.XYLineRenderer();
    var chart = new jsfc.Chart(plot);
    chart.setTitleElement(jsfc.Charts.createTitleElement(title, subtitle, 
            chart.getTitleAnchor()));
    plot.setRenderer(renderer);
    return chart;
};

/**
 * Creates a bar chart from the specified dataset (IntervalXYDataset).
 * 
 * @param {string} title  the chart title (null permitted).
 * @param {string} subtitle  the chart subtitle (null permitted).
 * @param {!jsfc.XYDataset} dataset  the dataset (null not permitted).
 * @param {string} xAxisLabel  the x-axis label.
 * @param {string} yAxisLabel  the y-axis label.
 * @returns {jsfc.Chart} A chart.
 */
jsfc.Charts.createXYBarChart = function(title, subtitle, dataset, xAxisLabel,
        yAxisLabel) {
    var plot = new jsfc.XYPlot(dataset);
    plot.getXAxis().setLabel(xAxisLabel);
    plot.getYAxis().setLabel(yAxisLabel);
    var renderer = new jsfc.XYBarRenderer();
    plot.setRenderer(renderer);
    var chart = new jsfc.Chart(plot);
    var titleAnchor = new jsfc.Anchor2D(jsfc.RefPt2D.TOP_LEFT);
    chart.setTitle(title, subtitle, titleAnchor);
    return chart;
};


"use strict";

/**
 * Creates a new chart containing the specified plot.
 * 
 * @classdesc Represents a chart which has an optional title and subtitle,
 *   a plot where the data is presented, and an optional legend.  Different
 *   types of plot are supported to represent different types of data.
 *   
 * @constructor
 * @param {jsfc.CategoryPlot|jsfc.XYPlot} plot  the plot.
 * @returns {jsfc.Chart}
 */
jsfc.Chart = function(plot) {
    if (!(this instanceof jsfc.Chart)) {
        throw new Error("Use 'new' for construction.");
    } 
    this._size = new jsfc.Dimension(400, 240);
    var white = new jsfc.Color(255, 255, 255);
    this._backgroundPainter = new jsfc.StandardRectanglePainter(white, null);

    /** The margin around the edges of the plot. */
    this._padding = new jsfc.Insets(4, 4, 4, 4);
    
    /**
     * The title for the chart.
     * @type {jsfc.TableElement}
     */
    this._titleElement = null;
    
    /** The anchor point for the title. */
    this._titleAnchor = new jsfc.Anchor2D(jsfc.RefPt2D.TOP_LEFT);
    
    /** 
     * @type {jsfc.CategoryPlot|jsfc.XYPlot} 
     * @private 
     */
    this._plot = plot;
    
    /**
     * @type {jsfc.LegendBuilder}
     * @private
     */
    this._legendBuilder = new jsfc.StandardLegendBuilder();
    
    /**
     * @type {jsfc.Anchor2D}
     * @private
     */
    this._legendAnchor = new jsfc.Anchor2D(jsfc.RefPt2D.BOTTOM_RIGHT);
    
    this._listeners = [];
     
    // listen for changes to the plot
    var plotListener = function(c) {
        var chart = c;
        return function(plot) {
            chart.notifyListeners();
        };
    }(this);
    plot.addListener(plotListener);
    plot.chart = this;
};

jsfc.Chart.prototype.getElementID = function() {
    return this._elementId;
};

jsfc.Chart.prototype.setElementID = function(id) {
    this._elementId = id;
};

/**
 * Returns the size of the chart.
 * 
 * @returns {!jsfc.Dimension} The size.
 */
jsfc.Chart.prototype.getSize = function() {
    return this._size;
};

/**
 * Sets the dimensions of the chart and sends a change notification to 
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {!number} width  the new width.
 * @param {!number} height  the new height.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.Chart.prototype.setSize = function(width, height, notify) {
    this._size = new jsfc.Dimension(width, height);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the painter for the chart's background.  The default value will draw
 * a white background for the chart.
 * 
 * @returns {jsfc.RectanglePainter} The background painter.
 */
jsfc.Chart.prototype.getBackground = function() {
    return this._backgroundPainter;
};

/**
 * Sets the background painter for the chart and sends a change notification
 * to all registered listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.RectanglePainter} painter  the new painter.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.Chart.prototype.setBackground = function(painter, notify) {
    this._backgroundPainter = painter;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Sets the background color for the chart and sends a change event to 
 * registered listeners (unless 'notify' is set to false.  This is a 
 * convenience method that creates a new 'StandardRectanglePainter' and passes 
 * it to the setBackground(painter, notify) method.
 * 
 * @param {jsfc.Color} color  the background color.
 * @param {boolean} [notify]  notify listeners.
 * @returns {undefined}
 */
jsfc.Chart.prototype.setBackgroundColor = function(color, notify) {
    var painter = new jsfc.StandardRectanglePainter(color);
    this.setBackground(painter, notify);
};

/**
 * Returns the current padding.
 * 
 * @returns {jsfc.Insets} The padding.
 */
jsfc.Chart.prototype.getPadding = function() {
    return this._padding;
};

/**
 * Sets the padding around the edges of the chart and sends a change 
 * notification to all registered listeners (unless 'notify' is set to false).
 * 
 * @param {!number} top  the padding at the top.
 * @param {!number} left  the padding at the left.
 * @param {!number} bottom  the padding at the bottom.
 * @param {!number} right  the padding at the right.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.Chart.prototype.setPadding = function(top, left, bottom, right, notify) {
    this._padding = new jsfc.Insets(top, left, bottom, right);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the chart title (this is a table element structure of arbitrary
 * complexity, the typical case contains a title and subtitle).
 * 
 * @returns {jsfc.TableElement} The chart title (possibly null/undefined).
 */
jsfc.Chart.prototype.getTitleElement = function() {
    return this._titleElement;
};

/**
 * Sets the chart title and sends a change notification to registered listeners
 * (unless 'notify' is set to false).
 * 
 * @param {jsfc.TableElement} title  the chart title (null permitted).
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.Chart.prototype.setTitleElement = function(title, notify) {
    this._titleElement = title;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Sets the chart title and subtitle (this builds a table element representing
 * the title and calls setTitleElement()).
 * 
 * @param {!string} title  the title.
 * @param {string} [subtitle]  the subtitle (null permitted).
 * @param {jsfc.Anchor2D} [anchor]  the anchor point (null permitted).
 * @param {boolean} [notify]  notify listeners.
 * @returns {jsfc.Chart} This object for chaining method calls.
 */
jsfc.Chart.prototype.setTitle = function(title, subtitle, anchor, 
        notify) {
    var element = jsfc.Charts.createTitleElement(title, subtitle, anchor);
    this.setTitleElement(element, notify);
    return this;
};

/**
 * Updates the text, font and color for the existing title.
 * 
 * @param {string} title  the new title text.
 * @param {jsfc.Font} [font]  the new title font.
 * @param {jsfc.Color} [color]  the new title color.
 * @returns {undefined}
 */
jsfc.Chart.prototype.updateTitle = function(title, font, color) {
    if (!this._titleElement) {
        return;
    }
    this._titleElement.receive(function(e) {
        if (e instanceof jsfc.TextElement && e.isTitle) {
            if (title) {
                e.setText(title);
            }
            if (font) {
                e.setFont(font);
            }
            if (color) {
                e.setColor(color);
            }
        }    
    });
};

jsfc.Chart.prototype.updateSubtitle = function(subtitle, font, color) {  
    if (!this._titleElement) {
        return;
    }
    this._titleElement.receive(function(e) {
        if (e instanceof jsfc.TextElement && e.isSubtitle) {
            if (subtitle) {
                e.setText(subtitle);
            }
            if (font) {
                e.setFont(font);
            }
            if (color) {
                e.setColor(color);
            }
        }    
    });
};

/**
 * Returns the title anchor.
 * 
 * @returns {jsfc.Anchor2D} The title anchor.
 */
jsfc.Chart.prototype.getTitleAnchor = function() {
    return this._titleAnchor;
};

/**
 * Sets the title anchor and sends a change notification to all registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {!jsfc.Anchor2D} anchor  the anchor point.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.Chart.prototype.setTitleAnchor = function(anchor, notify) {
    this._titleAnchor = anchor;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the plot, the object that manages the dataset, axes and renderer
 * for the chart.  The plot is set via the constructor.
 * 
 * @returns {Object} The plot (never null).
 */
jsfc.Chart.prototype.getPlot = function() {
    return this._plot;    
};

/**
 * Returns the object that builds the legend for this chart.  The default
 * builder will create a legend that matches the dataset (with colors from 
 * the plot or renderer).  If the legend builder is null, no legend will be
 * drawn for the chart.
 * 
 * @returns {jsfc.LegendBuilder} The legend builder (possibly null).
 */
jsfc.Chart.prototype.getLegendBuilder = function() {
    return this._legendBuilder;
};

/**
 * Sets the legend builder for the chart and sends a change notification to
 * all registered listeners (unless 'notify' is set to false).  Set this 
 * builder to null if you don't require a legend.
 * 
 * @param {jsfc.LegendBuilder} builder  the legend builder (null permitted).
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.Chart.prototype.setLegendBuilder = function(builder, notify) {
    this._legendBuilder = builder;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the legend anchor point.  The default value is BOTTOM_RIGHT.
 * 
 * @returns {jsfc.Anchor2D} The anchor point.
 */
jsfc.Chart.prototype.getLegendAnchor = function() {
    return this._legendAnchor;
};

/**
 * Sets the legend anchor point and sends a change notification to all 
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {!jsfc.Anchor2D} anchor  the anchor point (null not permitted).
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.Chart.prototype.setLegendAnchor = function(anchor, notify) {
    this._legendAnchor = anchor;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Applies an increment to the margins to accommodate an item with the 
 * specified dimensions at the given position (anchor).
 * 
 * @param {Object} margin  the margin object to adjust.
 * @param {jsfc.Dimension} dim  the dimensions for the adjustment.
 * @param {jsfc.Anchor2D} anchor  the anchor point.
 * 
 * @returns {undefined}
 */
jsfc.Chart.prototype._adjustMargin = function(margin, dim, anchor) {
    if (jsfc.RefPt2D.isTop(anchor.refPt())) {
        margin.top += dim.height();
    } else if (jsfc.RefPt2D.isBottom(anchor.refPt())) {
        margin.bottom += dim.height();
    };
};
    
/**
 * Draws the chart on a 2D drawing context.
 * 
 * @param {!jsfc.Context2D} ctx  the drawing context.
 * @param {!jsfc.Rectangle} bounds  the drawing bounds.
 * @returns {undefined}
 */
jsfc.Chart.prototype.draw = function(ctx, bounds) {

    // fill in the chart background
    if (this._backgroundPainter) {
        this._backgroundPainter.paint(ctx, bounds);
    }
        
    var titleDim = new jsfc.Dimension(0, 0);
    var legendDim = new jsfc.Dimension(0, 0);
    if (this._titleElement) {
        titleDim = this._titleElement.preferredSize(ctx, bounds);
    }
    var legend;
    if (this._legendBuilder) {
        legend = this._legendBuilder.createLegend(this._plot, 
                this._legendAnchor, "orientation", {});
        legendDim = legend.preferredSize(ctx, bounds); 
    }
    var padding = this.getPadding();
    var px = padding.left();
    var py = padding.top() + titleDim.height();
    var pw = this._size.width() - padding.left() - padding.right();
    var ph = this._size.height() - padding.top() - padding.bottom() 
            - titleDim.height() - legendDim.height();
        // draw the axes and plot the data
    this._plotArea = new jsfc.Rectangle(px, py, pw, ph);
    this._plot.draw(ctx, bounds, this._plotArea);
        
    // draw the legend
    if (legend) {
        var fitter = new jsfc.Fit2D(this._legendAnchor);
        var dest = fitter.fit(legendDim, bounds);
        legend.draw(ctx, dest);
    }
    if (this._titleElement) {
        var fitter = new jsfc.Fit2D(this._titleAnchor);
        var dest = fitter.fit(titleDim, bounds);
        this._titleElement.draw(ctx, dest);
    }
};

/**
 * Returns the plot area from the most recent rendering of the chart.
 * 
 * @returns {jsfc.Rectangle} The plot area.
 */
jsfc.Chart.prototype.plotArea = function() {
    return this._plotArea;
};

/**
 * Registers a listener to receive notification of changes to the chart.  The
 * listener is a function - it will be passed one argument (this chart).
 * 
 * @param {Function} f  the listener function.
 * @returns {undefined}
 */
jsfc.Chart.prototype.addListener = function(f) {
    this._listeners.push(f);  
};

/**
 * Notify each listener function that this chart has changed.
 * 
 * @returns {undefined}
 */
jsfc.Chart.prototype.notifyListeners = function() {
    var chart = this;
    this._listeners.forEach(function(f) {
        f(chart);
    });
};

"use strict";

/**
 * Creates a chart manager to handle the interaction on the specified chart.
 * Some standard interaction handlers can be installed by default, you can
 * skip these by passing false for the relevant flags.  You can also register 
 * handlers individually if you want more control over the modifier keys or 
 * want to use more complex handlers (for example, the PolygonSelectionHandler).
 * 
 * @constructor 
 * @param {Element} element
 * @param {!jsfc.Chart} chart
 * @param {boolean} [dragZoomEnabled] enable zooming by mouse-dragging a 
 *     zoom rectangle (no modifier key).
 * @param {boolean} [wheelZoomEnabled]  enable mouse wheel zooming.
 * @param {boolean} [panEnabled]  enable panning by dragging the mouse while
 *     holding down the ALT key.
 * @returns {undefined}
 * 
 * @class A chart manager handles user interaction with a chart that is 
 *     rendered in the browser.
 */
jsfc.ChartManager = function(element, chart, dragZoomEnabled, wheelZoomEnabled, 
        panEnabled) {
    if (!(this instanceof jsfc.ChartManager)) {
        throw new Error("Use 'new' for constructor.");
    }
    this._element = element; // this will be a canvas or SVG element
    this._chart = chart;
    var t = element.constructor.name;
    if (element.nodeName === "CANVAS") {
        this._ctx = new jsfc.CanvasContext2D(element);
    } else {
        this._ctx = new jsfc.SVGContext2D(element);
    }
    var chartListener = function(c) {
        var manager = c;
        return function(chart) {
            manager.refreshDisplay();
        };
    }(this);
    chart.addListener(chartListener);
 
    this._liveMouseHandler = null;
    this._availableLiveMouseHandlers = [];
    if (dragZoomEnabled !== false) {
        var zoomModifier = new jsfc.Modifier(false, false, false, false);
        var zoomHandler = new jsfc.ZoomHandler(this, zoomModifier);
        this._availableLiveMouseHandlers.push(zoomHandler);
    }
    if (panEnabled !== false) {
        var panModifier = new jsfc.Modifier(true, false, false, false);
        var panHandler = new jsfc.PanHandler(this, panModifier);
        this._availableLiveMouseHandlers.push(panHandler);
    }
    this._auxiliaryMouseHandlers = [];
    if (wheelZoomEnabled !== false) {
        this._auxiliaryMouseHandlers.push(new jsfc.WheelHandler(this));
    }
    
    this.installMouseDownHandler(this._element);
    this.installMouseMoveHandler(this._element);
    this.installMouseUpHandler(this._element);
    this.installMouseOverHandler(this._element);
    this.installMouseOutHandler(this._element);
    this.installMouseWheelHandler(this._element);
};

/**
 * Returns the chart that is managed by this chart manager.
 * 
 * @returns {jsfc.Chart} The chart.
 */
jsfc.ChartManager.prototype.getChart = function() {
    return this._chart;
};

/**
 * Returns the element into which the chart will be drawn.
 * 
 * @returns {Element}
 */
jsfc.ChartManager.prototype.getElement = function() {
    return this._element;
};

jsfc.ChartManager.prototype.getContext = function() {
    return this._ctx;
};

/**
 * Returns the current live handler (may be null).
 * 
 * @returns {jsfc.MouseHandler}
 */
jsfc.ChartManager.prototype.getLiveHandler = function() {
    return this._liveMouseHandler;    
}

/**
 * Adds a handler to the list of available live handlers.  Exactly ONE of the
 * live handlers will be selected (on the basis of modifier keys) to handle
 * a user interaction with the chart.
 * 
 * @param {!jsfc.MouseHandler} handler  the handler.
 * @returns {undefined}
 */
jsfc.ChartManager.prototype.addLiveHandler = function(handler) {
    this._availableLiveMouseHandlers.push(handler); 
};

/**
 * Removes a handler from the list of available live handlers.
 * 
 * @param {!jsfc.MouseHandler} handler  the handler.
 * @returns {undefined}
 */
jsfc.ChartManager.prototype.removeLiveHandler = function(handler) {
    var i = jsfc.Utils.findItemInArray(handler, this._availableLiveMouseHandlers);
    if (i !== -1) {
        this._availableLiveMouseHandlers.splice(i, 1);
    }
};

/**
 * Resets the current live handler.  
 * @returns {undefined}
 */
jsfc.ChartManager.prototype.resetLiveHandler = function() {
    this._liveMouseHandler.cleanUp();
    this._liveMouseHandler = null;
}

/**
 * Adds an auxiliary mouse handler.  All auxiliary handlers will receive 
 * interaction events so when you add multiple handlers you need to ensure that
 * their behaviour does not conflict.
 * 
 * @param {jsfc.MouseHandler} handler  the new handler.
 * @returns {undefined}
 */
jsfc.ChartManager.prototype.addAuxiliaryHandler = function(handler) {
    this._auxiliaryMouseHandlers.push(handler);
};

/**
 * Removes an auxiliary handler.
 * 
 * @param {jsfc.MouseHandler} handler  the handler to be removed.
 * @returns {undefined}
 */
jsfc.ChartManager.prototype.removeAuxiliaryHandler = function(handler) {
    // find the handler (ensure it exists)
    var i = jsfc.Utils.findItemInArray(handler, this._auxiliaryMouseHandlers);
    if (i !== -1) {
        handler.cleanUp();
        this._auxiliaryMouseHandlers.splice(i, 1);
    }
};

/**
 * Refreshes the display by redrawing the chart.
 * 
 * @returns {undefined}
 */
jsfc.ChartManager.prototype.refreshDisplay = function() {
    var size = this._chart.getSize();
    var bounds = new jsfc.Rectangle(0, 0, size.width(), size.height());
    this._ctx.clear();
    this._chart.draw(this._ctx, bounds);
};

/**
 * Returns a handler from the available live handlers list with modifiers 
 * matching those specified.
 * 
 * @param {!boolean} alt  ALT key?
 * @param {!boolean} ctrl  CTRL key?
 * @param {!boolean} meta  META key?
 * @param {!boolean} shift  SHIFT key?
 * @returns {jsfc.MouseHandler}
 */
jsfc.ChartManager.prototype._matchLiveHandler = function(alt, ctrl, meta, 
        shift) {
    var handlers = this._availableLiveMouseHandlers;
    for (var i = 0; i < handlers.length; i++) {
        var h = handlers[i];
        if (h.getModifier().match(alt, ctrl, meta, shift)) {
            return h;
        }
    }
    return null;
};

jsfc.ChartManager.prototype.installMouseDownHandler = function(element) {
    var my = this;
    element.onmousedown = function(event) {
        if (my._liveMouseHandler !== null) {
            my._liveMouseHandler.mouseDown(event);
        } else {
            // choose one of the available mouse handlers to be "live"
            var h = my._matchLiveHandler(event.altKey, event.ctrlKey, event.metaKey, event.shiftKey);
            if (h) {
                my._liveMouseHandler = h;
                my._liveMouseHandler.mouseDown(event);
            }
        }
    
        // pass the event to the auxiliary mouse handlers
        my._auxiliaryMouseHandlers.forEach(function(h) {
            h.mouseDown(event);
        }); 
        event.preventDefault();
    };
};

jsfc.ChartManager.prototype.installMouseMoveHandler = function(element) {
    var my = this;
    element.onmousemove = function(event) {
        if (my._liveMouseHandler !== null) {
            my._liveMouseHandler.mouseMove(event);
        } else {
        
        }
    
        // pass the event to the auxiliary mouse handlers
        my._auxiliaryMouseHandlers.forEach(function(h) {
            h.mouseMove(event);
        });
        event.stopPropagation();
        return false;
    };
};

jsfc.ChartManager.prototype.installMouseUpHandler = function(element) {
    var my = this;
    element.onmouseup = function(event) {
        if (my._liveMouseHandler !== null) {
            my._liveMouseHandler.mouseUp(event);
        } else {
        
        }
    
        // pass the event to the auxiliary mouse handlers
        my._auxiliaryMouseHandlers.forEach(function(h) {
            h.mouseUp(event);
        }); 
    };
};

jsfc.ChartManager.prototype.installMouseOverHandler = function(element) {
    var my = this;
    element.onmouseover = function(event) {
        if (my._liveMouseHandler !== null) {
            my._liveMouseHandler.mouseOver(event);
        } else {
        
        }
    
        // pass the event to the auxiliary mouse handlers
        my._auxiliaryMouseHandlers.forEach(function(h) {
            h.mouseOver(event);
        }); 
    };
};

jsfc.ChartManager.prototype.installMouseOutHandler = function(element) {
    var my = this;
    element.onmouseout = function(event) {
        if (my._liveMouseHandler !== null) {
            my._liveMouseHandler.mouseOut(event);
        } else {
        
        }
    
        // pass the event to the auxiliary mouse handlers
        my._auxiliaryMouseHandlers.forEach(function(h) {
            h.mouseOut(event);
        }); 
    };
};

/**
 * Register to receive mouse wheel events and pass these on to the handlers.
 * 
 * @param {Element} element
 * @returns {undefined}
 */
jsfc.ChartManager.prototype.installMouseWheelHandler = function(element) {
    var my = this;
    var linkFunction = function(event) {
        var propogate = true;
        if (my._liveMouseHandler !== null) {
            propogate = my._liveMouseHandler.mouseWheel(event);
        } else {
        
        }
    
        // pass the event to the auxiliary mouse handlers
        my._auxiliaryMouseHandlers.forEach(function(h) {
            propogate = h.mouseWheel(event) && propogate;
        });
        return propogate;
    };
    var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) 
        ? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
    element.addEventListener(mousewheelevt, linkFunction, false);
};

"use strict";

/**
 * @interface
 */
jsfc.LegendBuilder = function() {
};
    
/**
 * Creates a legend containing items representing the content of the specified
 * plot.
 * 
 * @param {jsfc.XYPlot|jsfc.CategoryPlot} plot  the plot.
 * @param {jsfc.Anchor2D} anchor  the legend anchor (used to determine 
 *     default item alignment).
 * @param {string} orientation  the orientation ("horizontal" or "vertical").
 * @param {Object} style  the style (currently ignored).
 * 
 * @returns {jsfc.TableElement} The legend (a table element).
 */
jsfc.LegendBuilder.prototype.createLegend = function(plot, anchor, 
        orientation, style) {
};
"use strict";

/**
 * Creates a new StandardLegendBuilder instance.
 * 
 * @constructor
 * @implements {jsfc.LegendBuilder}
 * @classdesc An object that constructs a legend (a table element) to represent
 *         the items in a plot's dataset.
 * @param {jsfc.LegendBuilder} [instance]
 * @returns {jsfc.LegendBuilder} The new instance.
 */
jsfc.StandardLegendBuilder = function(instance) {
    if (!(this instanceof jsfc.StandardLegendBuilder)) {
        throw new Error("Use 'new' for constructor.");
    }
    if (!instance) {
        instance = this;
    }
    jsfc.StandardLegendBuilder.init(instance);
};

jsfc.StandardLegendBuilder.init = function(instance) {
    instance._font = new jsfc.Font("Palatino, serif", 12);
};

/**
 * Returns the font for the legend items.
 * 
 * @returns {jsfc.Font} The font.
 */
jsfc.StandardLegendBuilder.prototype.getFont = function() {
    return this._font; 
};

/**
 * Sets the font for the legend items.  There is no change notification.
 * @param {jsfc.Font} font  the new font (null not permitted).
 * @returns {undefined}
 */
jsfc.StandardLegendBuilder.prototype.setFont = function(font) {
    this._font = font;
};

/**
 * Creates a legend containing items representing the content of the specified
 * plot.
 * 
 * @param {jsfc.XYPlot|jsfc.CategoryPlot} plot  the plot.
 * @param {jsfc.Anchor2D} anchor  the legend anchor (used to determine 
 *     default item alignment).
 * @param {string} orientation  the orientation ("horizontal" or "vertical").
 * @param {Object} style  the style (currently ignored).
 * @returns {jsfc.TableElement} The legend (a table element).
 */
jsfc.StandardLegendBuilder.prototype.createLegend = function(plot, anchor, 
        orientation, style) {
    var info = plot.legendInfo();
    var result = new jsfc.FlowElement();
    var me = this;
    info.forEach(function(info) {
        var shape = new jsfc.RectangleElement(8, 5)
                .setFillColor(info.color);
        var text = new jsfc.TextElement(info.label).setFont(me._font);
        var item = new jsfc.GridElement();
        item.add(shape, "R1", "C1");
        item.add(text, "R1", "C2");
        result.add(item);
    });
    return result;
};
"use strict";

/**
 * Creates a new FixedLegendBuilder instance.
 * 
 * @classdesc An object that constructs a legend (a table element) to represent
 *         the items in a plot's dataset.
 * 
 * @constructor 
 * @implements jsfc.LegendBuilder
 * @returns {jsfc.FixedLegendBuilder} The new instance.
 */
jsfc.FixedLegendBuilder = function() {
    if (!(this instanceof jsfc.FixedLegendBuilder)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.StandardLegendBuilder.init(this);
    this._info = []; // equivalent to the info returned by a plot
};

jsfc.FixedLegendBuilder.prototype = new jsfc.StandardLegendBuilder();

/**
 * Adds an item to be incorporated in the legend.
 * 
 * @param {string} key  the key.
 * @param {jsfc.Color} color  the color.
 * @returns {undefined}
 */
jsfc.FixedLegendBuilder.prototype.add = function(key, color) {
    this._info.push(new jsfc.LegendItemInfo(key, color));
};

/**
 * Clears the list of items that will be included in the legend.
 * 
 * @returns {undefined}
 */
jsfc.FixedLegendBuilder.prototype.clear = function() {
    this._info = [];
};

/**
 * Creates a legend containing items representing the content of the specified
 * plot.
 * 
 * @param {jsfc.XYPlot|jsfc.CategoryPlot} plot  the plot.
 * @param {jsfc.Anchor2D} anchor  the legend anchor (used to determine 
 *     default item alignment).
 * @param {string} orientation  the orientation ("horizontal" or "vertical").
 * @param {Object} style  the style (currently ignored).
 * @returns {jsfc.TableElement} The legend (a table element).
 */
jsfc.FixedLegendBuilder.prototype.createLegend = function(plot, anchor, 
        orientation, style) {
    var info = this._info;
    var result = new jsfc.FlowElement();
    var legendBuilder = this;
    info.forEach(function(info) {
        var shape = new jsfc.RectangleElement(8, 5)
                .setFillColor(info.color);
        var text = new jsfc.TextElement(info.label)
                .setFont(legendBuilder.getFont());
        var item = new jsfc.GridElement();
        item.add(shape, "R1", "C1");
        item.add(text, "R1", "C2");
        result.add(item);
    });
    return result;
};
"use strict";

/**
 * @class An object containing the core info for one item in a legend.  Each
 * plot object (CategoryPlot, PiePlot and XYPlot) has a legendInfo() method
 * that returns a list of LegendItemInfo instances for the plot.
 * @constructor
 */
jsfc.LegendItemInfo = function(key, color) {
    this.seriesKey = key || "";
    this.label = key || "";
    this.description = "";
    this.shape = null;
    this.color = color;
};

/**
 * @interface
 */
jsfc.ValueAxis = function() {
    throw new Error("This object documents an interface.");
};

/**
 * Sets the label for the axis and sends a change notification to registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {string} label  the new label (null is permitted).
 * @param {boolean} [notify]  notify listeners (defaults to true).
 * @returns {undefined}
 */
jsfc.ValueAxis.prototype.setLabel = function(label, notify) {
};

/**
 * Returns the lower bound of the axis (the minimum data value that will be
 * displayed).
 * 
 * @returns {!number} The lower bound.
 */
jsfc.ValueAxis.prototype.getLowerBound = function() {
};

/**
 * Returns the upper bound of the axis (the maximum data value that will be
 * displayed).
 * 
 * @returns {!number} The lower bound.
 */
jsfc.ValueAxis.prototype.getUpperBound = function() {
};

/**
 * Returns the length of the axis (the difference between the upper bound and
 * the lower bound).
 * 
 * @returns {!number}
 */
jsfc.ValueAxis.prototype.length = function() {
};

/**
 * Returns true if the current axis range contains the specified value, and
 * false otherwise.
 * 
 * @param {!number} value  the data value.
 * @returns {!boolean}
 */
jsfc.ValueAxis.prototype.contains = function(value) {  
};

/**
 * Configures this axis for use as an x-axis for the specified plot.
 * 
 * @param {!jsfc.XYPlot} plot  the plot.
 * @returns {undefined}
 */
jsfc.ValueAxis.prototype.configureAsXAxis = function(plot) {    
};

/**
 * Configures this axis for use as a y-axis for the specified plot.
 * 
 * @param {jsfc.CategoryPlot|jsfc.XYPlot} plot  the plot.
 * @returns {undefined}
 */
jsfc.ValueAxis.prototype.configureAsYAxis = function(plot) {
};

/**
 * Converts a data value to a coordinate in the range r0 to r1, assuming that
 * these are equivalent to the current axis range.
 * 
 * @param {!number} value  the data value.
 * @param {!number} r0  the starting coordinate of the target range.
 * @param {!number} r1  the ending coordinate of the target range.
 * @returns {!number} The coordinate.
 */
jsfc.ValueAxis.prototype.valueToCoordinate = function(value, r0, r1) {  
};

/**
 * Converts a coordinate to a data value, assuming that the coordinate range
 * r0 to r1 corresponds to the current axis bounds.
 * 
 * @param {!number} coordinate  the coordinate.
 * @param {!number} r0  the starting coordinate.
 * @param {!number} r1  the ending coordinate.
 * @returns {!number} The data value.
 */
jsfc.ValueAxis.prototype.coordinateToValue = function(coordinate, r0, r1) {  
};

jsfc.ValueAxis.prototype.resizeRange = function(factor, anchorValue, notify) {
};
    
jsfc.ValueAxis.prototype.pan = function(percent, notify) {
};

/**
 * Calculates the amount of space to reserve for drawing the axis.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.CategoryPlot|jsfc.XYPlot} plot  the plot.
 * @param {!jsfc.Rectangle} bounds  the plot bounds.
 * @param {!jsfc.Rectangle} area  the estimated data area.
 * @param {!string} edge  the edge that denotes the axis position.
 * @returns {!number} The space to reserve for the axis.
 */
jsfc.ValueAxis.prototype.reserveSpace = function(ctx, plot, bounds, area, 
        edge) {
};

/**
 * Draws the axis.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.CategoryPlot|jsfc.XYPlot} plot
 * @param {!jsfc.Rectangle} bounds
 * @param {!jsfc.Rectangle} dataArea
 * @param {!number} offset
 * @returns {undefined}
 */
jsfc.ValueAxis.prototype.draw = function(ctx, plot, bounds, dataArea, offset) {
};

/**
 * Registers a listener to receive notification of changes to the axis.
 * 
 * @param {Function} listener  the listener.
 * @returns {undefined}
 */
jsfc.ValueAxis.prototype.addListener = function(listener) {
};
/**
 * @interface
 */
jsfc.CategoryAxis = function() {
    throw new Error("This object documents an interface.");
};

/**
 * Sets the label for the axis and sends a change notification to registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {string} label  the new label (null is permitted).
 * @param {boolean} [notify]  notify listeners (defaults to true).
 * @returns {undefined}
 */
jsfc.CategoryAxis.prototype.setLabel = function(label, notify) {
};

/**
 * Configures this axis so it is up-to-date with respect to being the x-axis
 * for the specified plot.
 * 
 * @param {!jsfc.CategoryPlot} plot  the plot.
 * @returns {undefined}
 */
jsfc.CategoryAxis.prototype.configureAsXAxis = function(plot) {    
};

/**
 * Returns the range of coordinates allocated for the category with the
 * specified key.
 * 
 * @param {!string} key  the column key.
 * @param {!number} r0  the starting screen coordinate.
 * @param {!number} r1  the ending screen coordinate.
 * @returns {jsfc.Range}
 */
jsfc.CategoryAxis.prototype.keyToRange = function(key, r0, r1) {
};

/**
 * Returns the range of coordinates allocated for an item within a category.
 * 
 * @param {!number} item  the item index.
 * @param {!number} itemCount  the item count.
 * @param {!string} columnKey  the column key.
 * @param {!number} r0  the starting screen coordinate.
 * @param {!number} r1  the ending screen coordinate.
 * @returns {!jsfc.Range}
 */
jsfc.CategoryAxis.prototype.itemRange = function(item, itemCount, columnKey, 
        r0, r1) { 
};

/**
 * Converts a (screen) coordinate to a category key, assuming that the axis
 * is drawn with r0 and r1 as the screen bounds.
 * 
 * @param {!number} coordinate  the screen coordinate.
 * @param {!number} r0  the lower (screen) bound of the axis.
 * @param {!number} r1  the upper (screen) bound of the axis.
 * @returns {string} The category key.
 */
jsfc.CategoryAxis.prototype.coordinateToKey = function(coordinate, r0, r1) {  
};

/**
 * Calculates the amount of space to reserve for the axis.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.CategoryPlot} plot  the plot.
 * @param {!jsfc.Rectangle} bounds  the bounds for the plot.
 * @param {!jsfc.Rectangle} area  the (estimated) data area.
 * @param {!string} edge  the edge along which the axis will be drawn.
 * @returns {!number} The space to reserve for the axis.
 */
jsfc.CategoryAxis.prototype.reserveSpace = function(ctx, plot, bounds, area, 
        edge) {
};

/**
 * Draws the axis to the specified graphics context.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.CategoryPlot} plot  the plot.
 * @param {!jsfc.Rectangle} bounds  the bounds for the plot.
 * @param {!jsfc.Rectangle} dataArea  the data area.
 * @param {!number} offset  the offset for the axis.
 * @returns {undefined}
 */
jsfc.CategoryAxis.prototype.draw = function(ctx, plot, bounds, dataArea, 
        offset) {
};

/**
 * Registers a listener to receive notification of changes to the axis.
 * 
 * @param {!Function} listener  the listener.
 * @returns {undefined}
 */
jsfc.CategoryAxis.prototype.addListener = function(listener) {
};
/**
 * Creates a new axis.
 * Note that all properties having names beginning with an underscore should
 * be treated as private.  Updating these properties directly is strongly
 * discouraged.  Look for accessor methods instead.
 * 
 * @constructor
 * @implements {jsfc.CategoryAxis} 
 * @param {string} [label]  the axis label.
 * @returns {jsfc.StandardCategoryAxis}
 */
jsfc.StandardCategoryAxis = function(label) {
    if (!(this instanceof jsfc.StandardCategoryAxis)) {
        throw new Error("Use 'new' with constructor.");
    }
    this._label = label;
    this._labelFont = new jsfc.Font("Palatino;serif", 12, true, false);
    this._labelColor = new jsfc.Color(0, 0, 0);
    this._labelMargin = new jsfc.Insets(2, 2, 2, 2);
    this._tickLabelMargin = new jsfc.Insets(2, 2, 2, 2);
    this._tickLabelFont = new jsfc.Font("Palatino;serif", 12);
    this._tickLabelColor = new jsfc.Color(100, 100, 100);
    this._tickLabelFactor = 1.4;
    this._tickLabelOrientation = null;
    
    this._tickMarkInnerLength = 2;
    this._tickMarkOuterLength = 2;
    this._tickMarkStroke = new jsfc.Stroke(0.5);
    this._tickMarkColor = new jsfc.Color(100, 100, 100);

    this._axisLineColor = new jsfc.Color(100, 100, 100);
    this._axisLineStroke = new jsfc.Stroke(0.5);

    this._lowerMargin = 0.05;
    this._upperMargin = 0.05;
    this._categoryMargin = 0.1;
    this._categories = [];
    this._listeners = [];
};

/**
 * Returns the axis label.
 * 
 * @returns {string|undefined} The axis label (possibly null).
 */
jsfc.StandardCategoryAxis.prototype.getLabel = function() {
    return this._label;
};

/**
 * Sets the axis label and sends a change notification to all registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {string} label  the label (null permitted).
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.StandardCategoryAxis.prototype.setLabel = function(label, notify) {
    this._label = label;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Configures this axis so it is up-to-date with respect to being the x-axis
 * for the specified plot.
 * 
 * @param {!jsfc.CategoryPlot} plot  the plot.
 * @returns {undefined}
 */
jsfc.StandardCategoryAxis.prototype.configureAsXAxis = function(plot) {
    var dataset = plot.getDataset();
    if (dataset) {
        this._categories = dataset.columnKeys();
    }
};

/**
 * Returns the tick label orientation, which is either the value specified or
 * a default value derived from the edge.
 * 
 * @param {string} edge  the edge along which the axis is drawn.
 * @returns {number} The label orientation.
 */
jsfc.StandardCategoryAxis.prototype._resolveTickLabelOrientation = function(edge) {
    var result = this._tickLabelOrientation;
    if (!result) {
        if (edge === jsfc.RectangleEdge.LEFT 
                || edge === jsfc.RectangleEdge.RIGHT) {
           result = jsfc.LabelOrientation.PERPENDICULAR; 
        } else if (edge === jsfc.RectangleEdge.TOP 
                || edge === jsfc.RectangleEdge.BOTTOM) {
           result = jsfc.LabelOrientation.PARALLEL;
        } else {
            throw new Error("Unrecognised 'edge' code: " + edge);
        }
    }
    return result;
};

/**
 * Returns a list of ticks for the axis.
 * 
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} area  the data area.
 * @param {string} edge  the edge.
 * 
 * @returns {Array} An array of jsfc.TickMark instances.
 */
jsfc.StandardCategoryAxis.prototype.ticks = function(ctx, area, edge) {
    return this._categories.map(function(key) {
        return new jsfc.TickMark(0, key + "");  // here we could run a label generator
    });
};

jsfc.StandardCategoryAxis.prototype.reserveSpace = function(ctx, plot, bounds, area, edge) {
    var space = 0; //this._tickMarkOuterLength;
    
    // if there is an axis label we need to include space for it 
    // plus its margins
    if (this._label) {
        ctx.setFont(this._labelFont);
        var dim = ctx.textDim(this._label);
        var lm = this._labelMargin;
        space += dim.height();
        if (jsfc.RectangleEdge.isTopOrBottom(edge)) {
            space += lm.top() + lm.bottom();
        } else if (jsfc.RectangleEdge.isLeftOrRight(edge)) {
            space += lm.left() + lm.right();
        } else {
            throw new Error("Unrecognised edge code: " + edge);
        }
    }
    
    // tick marks
//    var tickSize = this._calcTickSize(ctx, area, edge);
    var ticks = this.ticks(ctx, area, edge);
    ctx.setFont(this._tickLabelFont);
    var orientation = this._resolveTickLabelOrientation(edge);
    if (orientation === jsfc.LabelOrientation.PERPENDICULAR) {
        var max = 0;
        ticks.forEach(function(t) {
            max = Math.max(max, ctx.textDim(t.label).width());    
        });
        space += max;
    } else if (orientation === jsfc.LabelOrientation.PARALLEL) {
        // just add the height of one label, because they are all the same
        var dim = ctx.textDim("123");
        space += dim.height();
    }
    if (jsfc.RectangleEdge.isTopOrBottom(edge)) {
        space += this._tickLabelMargin.top() + this._tickLabelMargin.bottom();
    } else if (jsfc.RectangleEdge.isLeftOrRight(edge)) {
        space += this._tickLabelMargin.left() + this._tickLabelMargin.right();
    } else {
        throw new Error("Unrecognised edge code: " + edge);
    }
    return space;   
};

/**
 * Draws the axis to the specified graphics context.
 * 
 * @param {!jsfc.Context2D} ctx
 * @param {!jsfc.CategoryPlot} plot
 * @param {!jsfc.Rectangle} bounds
 * @param {!jsfc.Rectangle} dataArea
 * @param {!number} offset
 * @returns {undefined}
 */
jsfc.StandardCategoryAxis.prototype.draw = function(ctx, plot, bounds, dataArea, offset) {
    var edge = plot.axisPosition(this);
    var isLeft = edge === jsfc.RectangleEdge.LEFT;
    var isRight = edge === jsfc.RectangleEdge.RIGHT;
    var isTop = edge === jsfc.RectangleEdge.TOP;
    var isBottom = edge === jsfc.RectangleEdge.BOTTOM;
    var ticks = this.ticks(ctx, dataArea, edge);
    var x = dataArea.x();
    var y = dataArea.y();
    var w = dataArea.width();
    var h = dataArea.height();
    var gap = offset + this._tickMarkOuterLength;
    if (isLeft || isRight) {
        
    }
    else if (isTop || isBottom) {
        ctx.setFont(this._tickLabelFont);
        ctx.setFillColor(this._tickLabelColor);
        if (isTop) {
            gap += this._tickLabelMargin.bottom();
        } else {
            gap += this._tickLabelMargin.top();
        }
        for (var i = 0; i < ticks.length; i++) {
            var tick = ticks[i];
            var rx = this.keyToRange(tick.label, x, x + w);
            var xx = rx.value(0.5);
//            if (this._gridLinesVisible) {
//                ctx.setLineStroke(this._gridLineStroke);
//                ctx.setLineColor(this._gridLineColor);
//                ctx.drawLine(Math.round(rx.value(0.5)), y, Math.round(xx), y + h);
//            }
            if (this._tickMarkInnerLength + this._tickMarkOuterLength > 0) {
                ctx.setLineStroke(this._tickMarkStroke);
                ctx.setLineColor(this._tickMarkColor);
                if (isTop) {
                    ctx.drawLine(xx, y - offset - this._tickMarkOuterLength, xx, 
                            y - offset + this._tickMarkInnerLength);                    
                    ctx.drawAlignedString(tick.label, xx, y - gap, 
                            jsfc.TextAnchor.BOTTOM_CENTER);
                } else {
                    ctx.drawLine(xx, y + h + offset - this._tickMarkInnerLength, 
                            xx, y + h + offset + this._tickMarkOuterLength);
                    ctx.drawAlignedString(tick.label, xx, y + h + gap, 
                            jsfc.TextAnchor.TOP_CENTER);
                }
            }
        }
        ctx.setLineColor(this._axisLineColor);
        ctx.setLineStroke(this._axisLineStroke);
        if (isTop) {
            ctx.drawLine(x, y - offset, x + w, y - offset);            
        } else {
            ctx.drawLine(x, y + h + offset, x + w, y + h + offset);
        }
        // if the axis has a label, draw it
        if (this._label) {
            ctx.setFont(this._labelFont);
            ctx.setFillColor(this._labelColor);
            if (isTop) {
                ctx.drawAlignedString(this._label, x + w / 2, 
                        y - gap - this._tickLabelMargin.bottom() 
                        - this._labelMargin.top() - this._tickLabelFont.size, 
                        jsfc.TextAnchor.BOTTOM_CENTER);                
            } else {
                ctx.drawAlignedString(this._label, x + w / 2, 
                        y + h + gap + this._tickLabelMargin.bottom() 
                        + this._labelMargin.top() + this._tickLabelFont.size, 
                        jsfc.TextAnchor.TOP_CENTER);
            }
        }
    }
    // if the axis has a label, draw it
        if (this._label) {
            ctx.setFont(this._labelFont);
            ctx.setFillColor(this._labelColor);
            if (isTop) {
                ctx.drawAlignedString(this._label, x + w / 2, 
                        y - gap - this._tickLabelMargin.bottom() 
                        - this._labelMargin.top() - this._tickLabelFont.size, 
                        jsfc.TextAnchor.BOTTOM_CENTER);                
            } else {
                ctx.drawAlignedString(this._label, x + w / 2, 
                        y + h + gap + this._tickLabelMargin.bottom() 
                        + this._labelMargin.top() + this._tickLabelFont.size, 
                        jsfc.TextAnchor.TOP_CENTER);
            }
        }
};

/**
 * Converts a (screen) coordinate to a category key, assuming that the axis
 * is drawn with r0 and r1 as the screen bounds.
 * 
 * @param {!number} coordinate  the screen coordinate.
 * @param {!number} r0  the lower (screen) bound of the axis.
 * @param {!number} r1  the upper (screen) bound of the axis.
 * @returns {string} The category key.
 */
jsfc.StandardCategoryAxis.prototype.coordinateToKey = function(coordinate, r0, 
        r1) {
    return null; // FIXME: to implement
};

/**
 * Returns the range of coordinates allocated for the category with the
 * specified key.
 * 
 * @param {!string} key  the column key.
 * @param {!number} r0  the starting screen coordinate.
 * @param {!number} r1  the ending screen coordinate.
 * @returns {undefined}
 */
jsfc.StandardCategoryAxis.prototype.keyToRange = function(key, r0, r1) {
    var c = jsfc.Utils.findItemInArray(key, this._categories);
    if (c < 0) {
        throw new Error("Key is not present in the axis. " + key);
    }
    var length = r1 - r0;
    var x0 = Math.round(r0 + this._lowerMargin * length);
    var x1 = Math.round(r1 - this._upperMargin * length);
    var xlength = x1 - x0;
    var count = this._categories.length;
    var tw = xlength / count;
    var mlength = count > 1 ? xlength * this._categoryMargin : 0;
    var cm = count > 1 ? mlength / (count - 1) : 0;
    var clength = xlength - mlength;
    var cw = clength / count;
    var s = x0 + c * tw + (c / count) * cm;
    var e = s + cw;
    return new jsfc.Range(s, e);
};

/**
 * Returns the range of coordinates allocated for an item within a category.
 * 
 * @param {!number} item  the item index.
 * @param {!number} itemCount  the item count.
 * @param {!string} columnKey  the column key.
 * @param {!number} r0  the starting screen coordinate.
 * @param {!number} r1  the ending screen coordinate.
 * @returns {jsfc.Range}
 */
jsfc.StandardCategoryAxis.prototype.itemRange = function(item, itemCount, 
        columnKey, r0, r1) { 
    var r = this.keyToRange(columnKey, r0, r1);
    var w = r.length() / itemCount;
    var s = r.lowerBound() + item * w;
    var e = s + w;
    return new jsfc.Range(s, e);
};

/**
 * Registers a listener to receive notification of changes to the axis.
 * 
 * @param {!Function} listener  the listener.
 * @returns {undefined}
 */
jsfc.StandardCategoryAxis.prototype.addListener = function(listener) {
    this._listeners.push(listener);  
};

/**
 * Removes a listener so that it no longer receives event notifications from 
 * this axis.
 * 
 * @param {!Function} listener  the listener function.
 * 
 * @returns {jsfc.BaseValueAxis} This object for chaining method calls.
 */
jsfc.StandardCategoryAxis.prototype.removeListener = function(listener) {
    var i = this._listeners.indexOf(listener);
    if (i >= 0) {
        this._listeners.splice(i, 1);
    }
    return this;    
};

/**
 * Notify each listener function that this axis has changed.
 * 
 * @returns {undefined}
 */
jsfc.StandardCategoryAxis.prototype.notifyListeners = function() {
    var axis = this;
    this._listeners.forEach(function(listener) {
        listener(axis);
    });
};
"use strict";

/**
 * Creates a new object representing the insets for a rectangular shape.
 * 
 * @constructor 
 * @classdesc A record of the space reserved around a data area for drawing
 *     axes.  THis object has the same methods as jsfc.Insets but is mutable.
 *     
 * @param {number} top  the insets for the top edge.
 * @param {number} left  the insets for the left edge.
 * @param {number} bottom  the insets for the bottom edge.
 * @param {number} right  the insets for the right edge.
 * @returns {jsfc.Insets} The new instance.
 */
jsfc.AxisSpace = function(top, left, bottom, right) {
    if (!(this instanceof jsfc.AxisSpace)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.Args.requireNumber(top, "top");
    jsfc.Args.requireNumber(left, "left");
    jsfc.Args.requireNumber(bottom, "bottom");
    jsfc.Args.requireNumber(right, "right");
    this._top = top;
    this._left = left;
    this._bottom = bottom;
    this._right = right;
};

/**
 * Returns the insets for the top edge.
 * @returns {number} The top insets.
 */
jsfc.AxisSpace.prototype.top = function() {
    return this._top;
};

/**
 * Returns the insets for the left edge.
 * @returns {number} The left insets.
 */
jsfc.AxisSpace.prototype.left = function() {
    return this._left;
};

/**
 * Returns the insets for the bottom edge.
 * @returns {number} The bottom insets.
 */
jsfc.AxisSpace.prototype.bottom = function() {
    return this._bottom;
};

/**
 * Returns the insets for the right edge.
 * @returns {number} The right insets.
 */
jsfc.AxisSpace.prototype.right = function() {
    return this._right;
};

/**
 * Extends the amount of space on the specified edge.
 * 
 * @param {!number} space  the amount of space to add.
 * @param {!string} edge  the edge to add to.
 * @returns {jsfc.AxisSpace} This object (for chaining method calls).
 */
jsfc.AxisSpace.prototype.extend = function(space, edge) {
    jsfc.Args.requireNumber(space, "space");
    if (edge === jsfc.RectangleEdge.TOP) {
        this._top += space;
    } else if (edge === jsfc.RectangleEdge.BOTTOM) {
        this._bottom += space;
    } else if (edge === jsfc.RectangleEdge.LEFT) {
        this._left += space;
    } else if (edge === jsfc.RectangleEdge.RIGHT) {
        this._right += space;
    } else {
        throw new Error("Unrecognised 'edge' code: " + edge);
    }
    return this;
};

/**
 * Returns a new rectangle computed from the 'source' rectangle by subtracting 
 * the reserved space from this object.
 * @param {!jsfc.Rectangle} source  the source rectangle.
 * @returns {!jsfc.Rectangle}
 */
jsfc.AxisSpace.prototype.innerRect = function(source) {
    var x = source.x() + this._left;
    var y = source.y() + this._top;
    var w = source.width() - this._left - this._right;
    var h = source.height() - this._top - this._bottom;
    return new jsfc.Rectangle(x, y, w, h);
};


/**
 * @classdesc A base class for value axes.
 * @constructor
 * @param {string|null|undefined} [label]  the axis label (null permitted).
 * @param {jsfc.BaseValueAxis} [instance] The instance object (optional).
 */
jsfc.BaseValueAxis = function(label, instance) {
    if (!(this instanceof jsfc.BaseValueAxis)) {
        throw new Error("Use 'new' for construction.");
    }
    if (!instance) {
        instance = this;
    }
    if (!label) {
        label = null;
    }
    jsfc.BaseValueAxis.init(label, instance);
};

/**
 * Initialises the attributes for an instance.
 * 
 * @param {string|null|undefined} label  the label (null permitted).
 * @param {!jsfc.BaseValueAxis} instance  the instance.
 * @returns {undefined}
 */
jsfc.BaseValueAxis.init = function(label, instance) {
    instance._label = label;
    instance._listeners = [];
    instance._labelFont = new jsfc.Font("Palatino;serif", 12, true, false);
    instance._labelColor = new jsfc.Color(0, 0, 0);
    instance._labelMargin = new jsfc.Insets(2, 2, 2, 2);
    instance._tickLabelFont = new jsfc.Font("Palatino;serif", 12);
    instance._tickLabelColor = new jsfc.Color(0, 0, 0);
    instance._axisLineColor = new jsfc.Color(100, 100, 100);
    instance._axisLineStroke = new jsfc.Stroke(0.5);
    instance._gridLinesVisible = true;
    instance._gridLineStroke = new jsfc.Stroke(1);
    instance._gridLineColor = new jsfc.Color(255, 255, 255);
};

/**
 * Returns the axis label.
 * 
 * @returns {string} The axis label (possibly null).
 */
jsfc.BaseValueAxis.prototype.getLabel = function() {
    return this._label;
};

/**
 * Sets the axis label and sends a change notification to all registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {string} label  the label (null permitted).
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setLabel = function(label, notify) {
    this._label = label;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the font for the axis label.
 * 
 * @returns {jsfc.Font} The font.
 */
jsfc.BaseValueAxis.prototype.getLabelFont = function() {
    return this._labelFont;
};

/**
 * Sets the font for the axis label and sends a change notification to 
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.Font} font  the font.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setLabelFont = function(font, notify) {
    this._labelFont = font;
    if (notify !== false) {
        this.notifyListeners();   
    };
};

/**
 * Returns the color for the axis label.  The default color is black.
 * 
 * @returns {jsfc.Color} The color (never null).
 */
jsfc.BaseValueAxis.prototype.getLabelColor = function() {
    return this._labelColor;
};

/**
 * Sets the color for the axis label and sends a change notification to 
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {!jsfc.Color} color  the color.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setLabelColor = function(color, notify) {
    this._labelColor = color;
    if (notify !== false) {
        this.notifyListeners();   
    };
};

/**
 * Returns the label margin (the number of pixels to leave around the edges
 * of the axis label (this can be used to control the spacing between the axis
 * label and the tick labels).  The default value is Insets(2, 2, 2, 2).  
 * 
 * Note that the insets are applied in the regular screen orientation, even if
 * the label is rotated (that is, left is always to the left side of the 
 * screen, top is always to the top of the screen).
 * 
 * @returns {jsfc.Insets} The margin.
 */
jsfc.BaseValueAxis.prototype.getLabelMargin = function() {
    return this._labelMargin;
};

/**
 * Sets the label margin and sends a change notification to all registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.Insets} margin  the new margin.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setLabelMargin = function(margin, notify) {
    this._labelMargin = margin;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the font used to display the tick labels.
 * 
 * @returns {jsfc.Font} The font (never null).
 */
jsfc.BaseValueAxis.prototype.getTickLabelFont = function() {
    return this._tickLabelFont;
};

/**
 * Sets the font used to display tick labels and sends a change event to 
 * all registered listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.Font} font  the font.
 * @param {boolean} notify
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setTickLabelFont = function(font, notify) {
    this._tickLabelFont = font;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the color used to display the tick labels.
 * 
 * @returns {jsfc.Color}
 */
jsfc.BaseValueAxis.prototype.getTickLabelColor = function() {
    return this._tickLabelColor;
};

/**
 * Sets the color for the tick labels and sends a change notification to 
 * all registered listeners (unless 'notify' is set to false).
 * 
 * @param {!jsfc.Color} color  the color.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setTickLabelColor = function(color, notify) {
    this._tickLabelColor = color;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the axis line color.
 * 
 * @returns {jsfc.Color} The color (never null).
 */
jsfc.BaseValueAxis.prototype.getAxisLineColor = function() {
    return this._axisLineColor;
};

/**
 * Sets the axis line color and sends a change notification to all registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {!jsfc.Color} color  the new color (null not permitted).
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setAxisLineColor = function(color, notify) {
    this._axisLineColor = color;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the stroke used to draw the axis line.
 * 
 * @returns {jsfc.Stroke} The stroke (never null).
 */
jsfc.BaseValueAxis.prototype.getAxisLineStroke = function() {
    return this._axisLineStroke;
};

/**
 * Sets the axis line stroke and sends a change notification to registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.Stroke} stroke  the stroke.
 * @param {boolean} notify  notify listeners.
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setAxisLineStroke = function(stroke, notify) {
    this._axisLineStroke = stroke;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Registers a listener to receive notification of changes to the axis.
 * 
 * @param {Function} listener  the listener.
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.addListener = function(listener) {
    this._listeners.push(listener);  
};

/**
 * Removes a listener so that it no longer receives event notifications from 
 * this axis.
 * 
 * @param {!Function} listener  the listener function.
 * 
 * @returns {jsfc.BaseValueAxis} This object for chaining method calls.
 */
jsfc.BaseValueAxis.prototype.removeListener = function(listener) {
    var i = this._listeners.indexOf(listener);
    if (i >= 0) {
        this._listeners.splice(i, 1);
    }
    return this;    
};

/**
 * Notify each listener function that this axis has changed.
 * 
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.notifyListeners = function() {
    var axis = this;
    this._listeners.forEach(function(listener) {
        listener(axis);
    });
};

/**
 * Returns the flag that controls whether or not gridlines are drawn for this
 * axis.
 * 
 * @returns {Boolean} A boolean.
 */
jsfc.BaseValueAxis.prototype.isGridLinesVisible = function() {
    return this._gridLinesVisible;
};

/**
 * Sets the flag that controls whether or not gridlines are drawn for this
 * axis and sends a change notification to all registered listeners (unless
 * 'notify' is set to false).
 * 
 * @param {boolean} visible  the new flag value.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setGridLinesVisible = function(visible, notify) {
    this._gridLinesVisible = visible !== false;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the stroke for the gridlines.
 * 
 * @returns {jsfc.Stroke} The stroke.
 */
jsfc.BaseValueAxis.prototype.getGridLineStroke = function() {
    return this._gridLineStroke;
};

/**
 * Sets the stroke for the gridlines and sends a change notification to all
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.Stroke} stroke  the stroke (null not permitted).
 * @param {boolean} notify  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setGridLineStroke = function(stroke, notify) {
    this._gridLineStroke = stroke;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the color for the gridlines.
 * 
 * @returns {jsfc.Color} The color.
 */
jsfc.BaseValueAxis.prototype.getGridLineColor = function() {
    return this._gridLineColor;
};

/**
 * Sets the color for the gridlines and sends a change notification to all
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.Color} color  the color (null not permitted).
 * @param {boolean} notify  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseValueAxis.prototype.setGridLineColor = function(color, notify) {
    this._gridLineColor = color;
    if (notify !== false) {
        this.notifyListeners();
    }
};





/**
 * Creates a new crosshair with the specified value and default attributes.
 * 
 * @class Represents a crosshair for an axis.  It is intended that this object 
 * can be used in different contexts, but for the moment only the 
 * jsfc.CrosshairHandler object makes use of it.
 * 
 * @constructor
 * @returns {jsfc.Crosshair}
 */
jsfc.Crosshair = function(value) {
    if (!(this instanceof jsfc.Crosshair)) {
        throw new Error("Use 'new' with constructor.");
    }
    this._value = value;
    this._color = jsfc.Colors.BLUE;
    this._stroke = new jsfc.Stroke(0.5);
    this._label = null;  // if a string is provided, it will be displayed
    this._labelAnchor = jsfc.RefPt2D.TOP_RIGHT;
    this._labelFont = new jsfc.Font("sans-serif", 10);
    this._labelColor = jsfc.Colors.BLACK;
    this._labelMargin = new jsfc.Insets(4, 4, 4, 4);
    this._labelPadding = new jsfc.Insets(2, 2, 2, 2);
    this._labelBackground = new jsfc.StandardRectanglePainter(
            new jsfc.Color(255, 255, 100, 100));
};

/**
 * Returns the data value for the crosshair.
 * 
 * @returns {number}
 */
jsfc.Crosshair.prototype.getValue = function() {
    return this._value;
};

/**
 * Sets the data value for the crosshair.
 * 
 * @param {number} value  the new value.
 * @returns {undefined}
 */
jsfc.Crosshair.prototype.setValue = function(value) {
    this._value = value;
};

/**
 * Returns the color used to draw the crosshair.
 * 
 * @returns {jsfc.Color}
 */
jsfc.Crosshair.prototype.getColor = function() {
    return this._color;
};

/**
 * Sets the color used to draw the crosshair.
 * 
 * @param {!jsfc.Color} color  the new color.
 * @returns {undefined}
 */
jsfc.Crosshair.prototype.setColor = function(color) {
    this._color = color;
};

/**
 * Returns the stroke used to draw the crosshair.
 * 
 * @returns {!jsfc.Stroke} The stroke.
 */
jsfc.Crosshair.prototype.getStroke = function() {
    return this._stroke;
};

jsfc.Crosshair.prototype.setStroke = function(stroke) {
    this._stroke = stroke;
};

/**
 * Returns the label for the crosshair, if any.
 * 
 * @returns {string|null} The label.
 */
jsfc.Crosshair.prototype.getLabel = function() {
    return this._label;
};

/**
 * Sets the label for the crosshair.
 * 
 * @param {string|null} label  the new label (null permitted).
 * @returns {undefined}
 */
jsfc.Crosshair.prototype.setLabel = function(label) {
    this._label = label;
};

jsfc.Crosshair.prototype.getLabelAnchor = function() {
    return this._labelAnchor;
};

jsfc.Crosshair.prototype.setLabelAnchor = function(anchor) {
    this._labelAnchor = anchor;
};

jsfc.Crosshair.prototype.getLabelFont = function() {
    return this._labelFont;
};

jsfc.Crosshair.prototype.setLabelColor = function(color) {
    this._labelColor = color;
};

jsfc.Crosshair.prototype.getLabelMargin = function() {
    return this._labelMargin;
};

jsfc.Crosshair.prototype.setLabelMargin = function(margin) {
    this._labelMargin = margin;
};

jsfc.Crosshair.prototype.getLabelPadding = function() {
    return this._labelPadding;
};

jsfc.Crosshair.prototype.setLabelPadding = function(insets) {
    this._labelPadding = insets;
};

jsfc.Crosshair.prototype.getLabelBackground = function() {
    return this._labelBackground;
};

jsfc.Crosshair.prototype.setLabelBackground = function(insets) {
    this._labelBackground = insets;
};

/**
 * Draws the crosshair as a horizontal line within the specified data area.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!number} ycoord  the y-coordinate.
 * @param {!jsfc.Rectangle} dataArea  the data area.
 * @returns {undefined}
 */
jsfc.Crosshair.prototype.drawHorizontal = function(ctx, ycoord, dataArea) {
 
    ctx.setLineStroke(this._stroke);
    ctx.setLineColor(this._color);
    ctx.setHint("pointer-events", "none");
    ctx.drawLine(dataArea.minX(), ycoord, dataArea.maxX(), ycoord);
    ctx.setHint("pointer-events", null);
    
    if (this._label) {
        ctx.setFont(this._labelFont);
        var dim = ctx.textDim(this._label);
        var pad = this._labelPadding;
        var margin = this._labelMargin;
        var anchor = this._labelAnchor;
        var w = dim.width() + pad.left() + pad.right();
        var h = dim.height() + pad.top() + pad.bottom();

        var x = dataArea.centerX() - w / 2;
        if (jsfc.RefPt2D.isLeft(anchor)) {
            // add margin at left
            x = dataArea.minX() + margin.left();
        } else if (jsfc.RefPt2D.isRight(anchor)) {
            // subtract margin, padding and width
            x = dataArea.maxX() - margin.right() - w;
        }
        var y = ycoord - h / 2; 
        if (jsfc.RefPt2D.isTop(anchor)) {
            y -= margin.bottom() + h / 2; 
        } else if (jsfc.RefPt2D.isBottom(anchor)) {
            y += margin.top() + h / 2;
        }
        var r = new jsfc.Rectangle(x, y, w, h);

        // if the label area doesn't fit, flip to the other side of the line
        if (!dataArea.containsRect(r)) {
            var adj = h + margin.bottom() + margin.top();
            if (jsfc.RefPt2D.isTop(anchor)) {
                r = new jsfc.Rectangle(x, y + adj, w, h);
            } else if (jsfc.RefPt2D.isBottom(anchor)) {
                r = new jsfc.Rectangle(x, y - adj, w, h);
            }
        }
        if (this._labelBackground) {
            this._labelBackground.paint(ctx, r);
        }
        ctx.setFillColor(this._labelColor);
        ctx.drawAlignedString(this._label, r.x() + pad.left(), 
                r.y() + pad.top(), jsfc.TextAnchor.TOP_LEFT);
    }
};

/**
 * Draws the crosshair as a vertical line within the specified data area.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!number} xcoord  the x-coordinate.
 * @param {!jsfc.Rectangle} dataArea  the data area.
 * @returns {undefined}
 */
jsfc.Crosshair.prototype.drawVertical = function(ctx, xcoord, dataArea) {
    
    ctx.setLineStroke(this._stroke);
    ctx.setLineColor(this._color);
    ctx.setHint("pointer-events", "none");
    ctx.drawLine(xcoord, dataArea.minY(), xcoord, dataArea.maxY());
    ctx.setHint("pointer-events", null);
    
    if (this._label) {
        ctx.setFont(this._labelFont);
        var dim = ctx.textDim(this._label);
        var pad = this._labelPadding;
        var margin = this._labelMargin;
        var anchor = this._labelAnchor;
        var w = dim.width() + pad.left() + pad.right();
        var h = dim.height() + pad.top() + pad.bottom();
        
        var x = xcoord - w / 2;
        if (jsfc.RefPt2D.isLeft(anchor)) {
            x -= w / 2 + margin.right();
        } else if (jsfc.RefPt2D.isRight(anchor)) {
            x += w / 2 + margin.left();
        }
        var y = dataArea.centerY(); 
        if (jsfc.RefPt2D.isTop(anchor)) {
            y = dataArea.minY() + margin.top();
        } else if (jsfc.RefPt2D.isBottom(anchor)) {
            y = dataArea.maxY() - margin.bottom() - h;
        }
        var r = new jsfc.Rectangle(x, y, w, h);

        // if the label area doesn't fit, flip to the other side of the line
        if (!dataArea.containsRect(r)) {
            var adj = w + margin.left() + margin.right();
            if (jsfc.RefPt2D.isLeft(anchor)) {
                r = new jsfc.Rectangle(x + adj, y, w, h);
            } else if (jsfc.RefPt2D.isRight(anchor)) {
                r = new jsfc.Rectangle(x - adj, y, w, h);
            }
        }
        if (this._labelBackground) {
            this._labelBackground.paint(ctx, r);
        }
        ctx.setFillColor(this._labelColor);
        ctx.drawAlignedString(this._label, r.x() + pad.left(), 
                r.y() + pad.top(), jsfc.TextAnchor.TOP_LEFT);        
    }
};

jsfc.LabelOrientation = {
    
    PERPENDICULAR: "PERPENDICULAR",
    
    PARALLEL: "PARALLEL"

};

if (Object.freeze) {
    Object.freeze(jsfc.LabelOrientation);
}
/**
 * Creates a new NumberTickSelector instance.
 * @returns {jsfc.NumberTickSelector}
 * @constructor
 * @classdesc 
 */
jsfc.NumberTickSelector = function(percentage) {
    if (!(this instanceof jsfc.NumberTickSelector)) {
        throw new Error("Use 'new' for constructor.");
    }
    this._power = 0;
    this._factor = 1;
    this._percentage = percentage;
    this._f0 = new jsfc.NumberFormat(0);
    this._f1 = new jsfc.NumberFormat(1);
    this._f2 = new jsfc.NumberFormat(2);
    this._f3 = new jsfc.NumberFormat(3);
    this._f4 = new jsfc.NumberFormat(4);
};

/**
 * Selects and returns a standard tick size that is greater than or equal to 
 * the specified reference value and, ideally, as close to it as possible 
 * (to minimise the number of iterations used by axes to determine the tick
 * size to use).
 * 
 * @param {number} reference  the reference value.
 * @returns {number} The selected value.
 */
jsfc.NumberTickSelector.prototype.select = function(reference) {
    this._power = Math.ceil(Math.LOG10E * Math.log(reference));
    this._factor = 1;
    return this.currentTickSize();    
};

/**
 * Returns the current tick size.
 * 
 * @returns {number} The current tick size.
 */
jsfc.NumberTickSelector.prototype.currentTickSize = function() {
    return this._factor * Math.pow(10.0, this._power);
};

/**
 * Returns a formatter that is appropriate for the current tick size.
 * 
 * @returns {jsfc.NumberFormat}
 */
jsfc.NumberTickSelector.prototype.currentTickFormat = function() {
    if (this._power === -4) {
        return this._f4;
    }
    if (this._power === -3) {
        return this._f3;
    }
    if (this._power === -2) {
        return this._f2;
    }
    if (this._power === -1) {
        return this._f1;
    }
    if (this._power < -4) {
        return new jsfc.NumberFormat(Number.POSITIVE_INFINITY);
    }
    if (this._power > 6) {
        return new jsfc.NumberFormat(1, true);
    }
    return this._f0;
};

/**
 * Moves the pointer to the next available (larger) standard tick size and
 * returns true (the contract for this method says to return false if there 
 * is no larger tick size).
 * 
 * @returns {boolean}
 */
jsfc.NumberTickSelector.prototype.next = function() {
    if (this._power === 300 && this._factor === 5) {
        return false;
    }
    if (this._factor === 1) {
        this._factor = 2;
        return true;
    } 
    if (this._factor === 2) {
        this._factor = 5;
        return true;  
    } 
    if (this._factor === 5) {
        this._power++;
        this._factor = 1;
        return true;
    } 
    // it should not be possible to get a factor that is not equal to 1, 2 or 5
    throw new Error("Factor should be 1, 2 or 5: " + this._factor);
};

/**
 * Moves the pointer to the previous available (smaller) standard tick size and
 * returns true (the contract for this method says to return false if there 
 * is no larger tick size).
 * 
 * @returns {boolean}
 */
jsfc.NumberTickSelector.prototype.previous = function() {
    if (this._power === -300 && this._factor === 1) {
        return false;
    }
    if (this._factor === 1) {
        this._factor = 5;
        this._power--;
        return true;
    } 
    if (this._factor === 2) {
        this._factor = 1;
        return true;  
    } 
    if (this._factor === 5) {
        this._factor = 2;
        return true;
    } 
    // it should not be possible to get a factor that is not equal to 1, 2 or 5
    throw new Error("Factor should be 1, 2 or 5: " + this._factor);
};


/**
 * Creates a new instance.
 * @constructor  
 * @implements {jsfc.ValueAxis}
 * @param {string} [label]  the axis label.
 * @param {jsfc.LinearAxis} [instance]  the instance.
 * @returns {jsfc.LinearAxis}
 * 
 * @class A linear numerical axis.  Note that all properties having names 
 * beginning with an underscore should be treated as private.  Updating these 
 * properties directly is strongly discouraged.  Look for accessor methods 
 * instead.
 */
jsfc.LinearAxis = function(label, instance) {
    if (!(this instanceof jsfc.LinearAxis)) {
        throw new Error("Use 'new' with constructor.");
    }
    if (!instance) {
        instance = this;
    }
    jsfc.LinearAxis.init(label, instance);
};

/**
 * Initialise the attributes for this instance.
 * 
 * @param {string|undefined} label  the label (can be undefined).
 * @param {!jsfc.LinearAxis} instance  the instance.
 * @returns {undefined}
 */
jsfc.LinearAxis.init = function(label, instance) {

    // extend the BaseValueAxis object
    jsfc.BaseValueAxis.init(label, instance);
    
    // current axis bounds 
    instance._lowerBound = 0.0;
    instance._upperBound = 1.0;
   
    // do we automatically calculate the axis range based on the data and, if
    // yes, do we force the range to include zero? 
    instance._autoRange = true;  
    instance._autoRangeIncludesZero = false;
    instance._lowerMargin = 0.05;
    instance._upperMargin = 0.05;
    
    // default range (when there is no data), this can also be used for the
    // default axis length when there is just a single value
    instance._defaultRange = new jsfc.Range(0, 1);
    
    // the tick selector and tick formatter
    instance._tickSelector = new jsfc.NumberTickSelector(false);
    instance._formatter = new jsfc.NumberFormat(2);
    
    // tick mark attributes
    instance._tickMarkInnerLength = 0;
    instance._tickMarkOuterLength = 2;
    instance._tickMarkStroke = new jsfc.Stroke(0.5);
    instance._tickMarkColor = new jsfc.Color(100, 100, 100);
    
    // tick label attributes
    instance._tickLabelMargin = new jsfc.Insets(2, 2, 2, 2);
    instance._tickLabelFactor = 1.4;
    instance._tickLabelOrientation = null;
        // null means it will be derived, otherwise
        // it can be set to PARALLEL or PERPENDICULAR
        
    // if not null, this formatter overrides the one provided by the selector
    instance._tickLabelFormatOverride = null;
    
    instance._symbols = [];
};

// extend BaseValueAxis - see also the init() call in the constructor
jsfc.LinearAxis.prototype = new jsfc.BaseValueAxis();

/**
 * Returns the lower bound for the axis.
 * 
 * @returns {!number}
 */
jsfc.LinearAxis.prototype.getLowerBound = function() {
    return this._lowerBound;
};

/**
 * Returns the upper bound for the axis.
 * 
 * @returns {!number}
 */
jsfc.LinearAxis.prototype.getUpperBound = function() {
    return this._upperBound;
};

/**
 * Returns the length of the axis (upper bound minus the lower bound).
 * 
 * @returns {!number}
 */
jsfc.LinearAxis.prototype.length = function() {
    return this._upperBound - this._lowerBound;
};

/**
 * Returns true if the current axis range contains the specified value, and
 * false otherwise.  The test is inclusive of the axis end points (lower and
 * upper bounds).
 * 
 * @param {!number} value  the data value.
 * @returns {!boolean}
 */
jsfc.LinearAxis.prototype.contains = function(value) {
    return value >= this._lowerBound && value <= this._upperBound;
};

/**
 * Sets the upper and lower bounds for the axis, switches off the auto-range
 * calculation (if it was enabled) and sends a change notification to 
 * registered listeners.
 * 
 * @param {!number} lower  the lower bound.
 * @param {!number} upper  the upper bound.
 * @param {boolean} [notify]  notify listeners?
 * @param {boolean} [keepAutoRangeFlag]  preserve the autoRange flag setting?
 * 
 * @returns {jsfc.LinearAxis} This object for chaining method calls.
 */
jsfc.LinearAxis.prototype.setBounds = function(lower, upper, notify, 
        keepAutoRangeFlag) {
    if (lower >= upper) {
        throw new Error("Require upper > lower: " + lower + " > " + upper);
    }
    this._lowerBound = lower;
    this._upperBound = upper;
    if (!keepAutoRangeFlag) {
        this._autoRange = false;
    }
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Sets the axis bounds using percentage values relative to the current bounds.
 * 
 * @param {!number} lower  the lower percentage.
 * @param {!number} upper  the upper percentage.
 * @param {boolean} [notify]  notify listeners? (optional, defaults to true).
 * @param {boolean} [keepAutoRangeFlag]  don't reset the auto-range flag
 * @returns {jsfc.LinearAxis} This axis for chaining method calls.
 */
jsfc.LinearAxis.prototype.setBoundsByPercent = function(lower, upper, notify, 
        keepAutoRangeFlag) {
    var v0 = this._lowerBound;
    var v1 = this._upperBound;
    var len = v1 - v0;
    var b0 = v0 + lower * len;
    var b1 = v0 + upper * len;
    if (b1 > b0 && isFinite(b1 - b0)) {
        this._lowerBound = b0;
        this._upperBound = b1;
        if (!keepAutoRangeFlag) {
            this._autoRange = false;
        }
        if (notify !== false) {
            this.notifyListeners();
        }
    }
    return this;
};

/**
 * Returns the flag that controls whether the axis bounds are automatically 
 * updated whenever the dataset changes.  The default value is true.
 * 
 * @returns {Boolean} A boolean.
 */
jsfc.LinearAxis.prototype.isAutoRange = function() {
    return this._autoRange;
};

/**
 * Sets the flag that controls whether the axis bounds are automatically 
 * updated whenever the dataset changes and sends a change notification to
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {boolean} auto  the new flag value.
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.LinearAxis} This object for chaining method calls.
 */
jsfc.LinearAxis.prototype.setAutoRange = function(auto, notify) {
    this._autoRange = auto;
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Returns the flag that controls whether the auto-range is forced to include
 * zero.  The default value is false.
 * 
 * @returns {Boolean} A boolean.
 */
jsfc.LinearAxis.prototype.getAutoRangeIncludesZero = function() {
    return this._autoRangeIncludesZero;
};

/**
 * Sets the flag that controls whether the auto-range is forced to include
 * zero and sends a change notification to registered listeners (unless the
 * 'notify' flag is set to false).
 * 
 * @param {boolean} include  the new value.
 * @param {boolean} [notify]  notify listeners.
 * @returns {jsfc.LinearAxis} This object for chaining method calls.
 */
jsfc.LinearAxis.prototype.setAutoRangeIncludesZero = function(include, 
        notify) {
    this._autoRangeIncludesZero = include;
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Returns the lower margin, a percentage of the axis length that is added
 * as a margin during the auto-range calculation.  The default value is 0.05
 * (five percent).
 * 
 * @returns {!number} The lower margin.
 */
jsfc.LinearAxis.prototype.getLowerMargin = function() {
    return this._lowerMargin;
};

/**
 * Sets the lower margin and sends a change notification to all registered
 * listeners.
 * 
 * @param {!number} margin  the new margin.
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.LinearAxis} This object for chaining method calls.
 */
jsfc.LinearAxis.prototype.setLowerMargin = function(margin, notify) {
    this._lowerMargin = margin;
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Returns the upper margin, a percentage of the axis length that is added
 * as a margin during the auto-range calculation.  The default value is 0.05
 * (five percent).
 * 
 * @returns {!number} The upper margin.
 */
jsfc.LinearAxis.prototype.getUpperMargin = function() {
    return this._upperMargin;
};

/**
 * Sets the upper margin and sends a change notification to all registered
 * listeners.
 * 
 * @param {!number} margin  the new margin.
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.LinearAxis} This object for chaining method calls.
 */
jsfc.LinearAxis.prototype.setUpperMargin = function(margin, notify) {
    this._upperMargin = margin;
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Returns the override formatter for the tick labels.  The default value is
 * null.
 * 
 * @returns {jsfc.Format} The override formatter (possibly undefined/null).
 */
jsfc.LinearAxis.prototype.getTickLabelFormatOverride = function() {
    return this._tickLabelFormatOverride;
};

/**
 * Sets the override formatter for the tick labels and sends a change 
 * notification to registered listeners (unless 'notify' is false).
 * 
 * @param {jsfc.Format} formatter  the formatter (null permitted).
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.LinearAxis} This object for chaining method calls.
 */
jsfc.LinearAxis.prototype.setTickLabelFormatOverride = function(formatter, 
        notify) {
    this._tickLabelFormatOverride = formatter;
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Applies the auto-range (including the addition of margins, or the default
 * range length in the case where the supplied min and max are the same).
 * 
 * @param {number} min  the minimum data value.
 * @param {number} max  the maximum data value.
 * @returns {undefined}
 */
jsfc.LinearAxis.prototype._applyAutoRange = function(min, max) {
    if (this._autoRangeIncludesZero) {
        if (min > 0) min = 0;
        if (max < 0) max = 0;
    }
    var xrange = max - min;
    var lowAdj, highAdj;
    if (xrange > 0.0) {
        lowAdj = this._lowerMargin * xrange;
        highAdj = this._upperMargin * xrange;
    } else {
        lowAdj = 0.5 * this._defaultRange.length();
        highAdj = 0.5 * this._defaultRange.length();
    }
    this.setBounds(min - lowAdj, max + highAdj, false, true);
};

/**
 * Translates a data value to a coordinate in the given range.
 * 
 * @param {number} value  the value.
 * @param {number} r0  the lower bound of the coordinate (screen) range.
 * @param {number} r1  the upper bound of the coordinate (screen) range.
 * 
 * @returns {number} The coordinate value.
 */
jsfc.LinearAxis.prototype.valueToCoordinate = function(value, r0, r1) {
    jsfc.Args.requireNumber(r0, "r0");
    jsfc.Args.requireNumber(r1, "r1");
    // let's say the axis runs from a to b...
    var a = this._lowerBound;
    var b = this._upperBound;
    return r0 + ((value - a) / (b - a)) * (r1 - r0);
};

/**
 * Translates a coordinate from the given range to a value on the axis scale.
 * 
 * @param {number} coordinate  the coordinate value.
 * @param {number} r0  the lower bound of the coordinate (screen) range.
 * @param {number} r1  the upper bound of the coordinate (screen) range.
 * @returns {number} The data value.
 */
jsfc.LinearAxis.prototype.coordinateToValue = function(coordinate, r0, r1) {
    var a = this._lowerBound;
    var b = this._upperBound;
    return a + ((coordinate - r0) / (r1 - r0)) * (b - a);
};

/**
 * Calculates a good tick size for the axis assuming it is drawn along the
 * specified edge of the area.  This method should return NaN if there is
 * no good tick size (in which case the axis should just label the end points).
 * 
 * @param {jsfc.Context2D} ctx  the graphics context (used to measure string 
 *         dimensions).
 * @param {jsfc.Rectangle} area  the data area for the plot (the axis lies 
 *         along one edge).
 * @param {string} edge  the edge along which the axis lies.
 * @returns {number} The tick size.
 */
jsfc.LinearAxis.prototype._calcTickSize = function(ctx, area, edge) {
    var result = Number.NaN;
    var pixels = area.length(edge);
    var range = this._upperBound - this._lowerBound;
    if (range <= 0) {
        throw new Error("Can't have a zero range.");
    }
    var orientation = this._resolveTickLabelOrientation(edge);
    var selector = this._tickSelector;
    if (orientation === jsfc.LabelOrientation.PERPENDICULAR) {
        // work with the label height
        var textHeight = ctx.textDim("123").height();
        var maxTicks = pixels / (textHeight * this._tickLabelFactor);
        if (maxTicks > 2) {
            var tickSize = selector.select(range / 2);
            var tickCount = Math.floor(range / tickSize);
            var b = true;
            while (tickCount < maxTicks && b) {
                b = selector.previous();
                tickCount = Math.floor(range / selector.currentTickSize());
            }
            if (b) selector.next();
            result = selector.currentTickSize();
            this._formatter = selector.currentTickFormat();
        } else {
            // result remains Number.NaN
        }
    } else if (orientation === jsfc.LabelOrientation.PARALLEL) {
        // work with label widths (approximate by measuring the min and max)
        selector.select(range);
        ctx.setFont(this._tickLabelFont);
        var done = false;
        while (!done) {
            if (selector.previous()) {
                // estimate the label widths, and do they overlap?
                var f = selector.currentTickFormat();
                this._formatter = f;
                var s0 = f.format(this._lowerBound);
                var s1 = f.format(this._upperBound);
                var w0 = ctx.textDim(s0).width();
                var w1 = ctx.textDim(s1).width();
                var w = Math.max(w0, w1);
                if (w == 0 && s0.length > 0 && s1.length > 0) {
                	// text could not be measured (could be IE bug)
                	return Number.NaN;
                }
                var n = Math.floor(pixels / (w * this._tickLabelFactor));
                if (n < range / selector.currentTickSize()) {
                    selector.next();
                    this._formatter = selector.currentTickFormat();
                    done = true;
                }
            } else {
                done = true;
            }
        }
        result = selector.currentTickSize();        
    }
    return result;
};

/**
 * Returns the tick label orientation, which is either the value specified or
 * a default value derived from the edge.
 * 
 * @param {string} edge  the edge along which the axis is drawn.
 * @returns {number} The label orientation.
 */
jsfc.LinearAxis.prototype._resolveTickLabelOrientation = function(edge) {
    var result = this._tickLabelOrientation;
    if (!result) {
        if (edge === jsfc.RectangleEdge.LEFT 
                || edge === jsfc.RectangleEdge.RIGHT) {
           result = jsfc.LabelOrientation.PERPENDICULAR; 
        } else if (edge === jsfc.RectangleEdge.TOP 
                || edge === jsfc.RectangleEdge.BOTTOM) {
           result = jsfc.LabelOrientation.PARALLEL;
        } else {
            throw new Error("Unrecognised 'edge' code: " + edge);
        }
    }
    return result;
};

/**
 * Calculates and returns the space (width or height) required to draw this 
 * axis on one edge of the specified area.
 * 
 * This method will be called by the plot.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.CategoryPlot|jsfc.XYPlot} plot  the plot.
 * @param {!jsfc.Rectangle} bounds  the plot bounds.
 * @param {!jsfc.Rectangle} area  the estimated data area.
 * @param {!string} edge  the edge that denotes the axis position.
 * @returns {!number} The space to reserve for the axis.
 */
jsfc.LinearAxis.prototype.reserveSpace = function(ctx, plot, bounds, area, 
        edge) {
            
    var space = this._tickMarkOuterLength;
    
    // if there is an axis label we need to include space for it 
    // plus its margins
    if (this._label) {
        ctx.setFont(this._labelFont);
        var dim = ctx.textDim(this._label);
        var lm = this._labelMargin;
        space += dim.height();
        if (jsfc.RectangleEdge.isTopOrBottom(edge)) {
            space += lm.top() + lm.bottom();
        } else if (jsfc.RectangleEdge.isLeftOrRight(edge)) {
            space += lm.left() + lm.right();
        } else {
            throw new Error("Unrecognised edge code: " + edge);
        }
    }
    
    // tick marks
    var tickSize = this._calcTickSize(ctx, area, edge);
    var ticks = this.ticks(tickSize, ctx, area, edge);
    ctx.setFont(this._tickLabelFont);
    var orientation = this._resolveTickLabelOrientation(edge);
    if (orientation === jsfc.LabelOrientation.PERPENDICULAR) {
        var max = 0;
        ticks.forEach(function(t) {
            max = Math.max(max, ctx.textDim(t.label).width());    
        });
        space += max;
    } else if (orientation === jsfc.LabelOrientation.PARALLEL) {
        // just add the height of one label, because they are all the same
        var dim = ctx.textDim("123");
        space += dim.height();
    }
    if (jsfc.RectangleEdge.isTopOrBottom(edge)) {
        space += this._tickLabelMargin.top() + this._tickLabelMargin.bottom();
    } else if (jsfc.RectangleEdge.isLeftOrRight(edge)) {
        space += this._tickLabelMargin.left() + this._tickLabelMargin.right();
    } else {
        throw new Error("Unrecognised edge code: " + edge);
    }
    return space;   
};

/**
 * Returns the number of symbols having a value within the specified range.
 * 
 * @param {!jsfc.Range} range  the range.
 * @returns {number} The number of symbols with values visible in the range.
 * @private
 */
jsfc.LinearAxis.prototype._symbolCount = function(range) {
    var c = 0;
    this._symbols.forEach(function(s) {
        if (range.contains(s.value)) {
            c++;
        }
    });
    return c;
};

/**
 * Returns a list of ticks for the axis.
 * 
 * @param {number} tickSize  the tick size.
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} area  the data area.
 * @param {string} edge  the edge.
 * 
 * @returns {Array} An array of jsfc.TickMark instances.
 */
jsfc.LinearAxis.prototype.ticks = function(tickSize, ctx, area, edge) {

    // special case - if symbols were defined in the dataset
    var b0 = this._lowerBound;
    var b1 = this._upperBound;
    var r = new jsfc.Range(b0, b1);
    if (this._symbolCount(r) > 0) {
        var result = [];
        this._symbols.forEach(function(s) {
            if (s.value > b0 && s.value < b1) {
                result.push(new jsfc.TickMark(s.value, s.symbol));
            }
        });
        return result;
    }

    var formatter = this._tickLabelFormatOverride || this._formatter;
    var result = [];
    if (!isNaN(tickSize)) {
        var t = Math.ceil(b0 / tickSize) * tickSize;
        var t0 = t;
        var count = 0;
        while (t < b1) {
            var tprev = t;
            var tm = new jsfc.TickMark(t, formatter.format(t));
            result.push(tm);
            while (t === tprev) {
                t = t0 + (count * tickSize);
                count++;
            }
        }
    } 
    if (result.length < 2) { 
        var tm0 = new jsfc.TickMark(b0, formatter.format(b0));
        var tm1 = new jsfc.TickMark(b1, formatter.format(b1));
        result = [tm0, tm1];            
    }
    return result;
};

/**
 * Draws the axis.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.CategoryPlot|jsfc.XYPlot} plot
 * @param {!jsfc.Rectangle} bounds
 * @param {!jsfc.Rectangle} dataArea
 * @param {!number} offset
 * @returns {undefined}
 */
jsfc.LinearAxis.prototype.draw = function(ctx, plot, bounds, dataArea, offset) {
    var edge = plot.axisPosition(this);
    var tickSize = this._calcTickSize(ctx, dataArea, edge);
    var ticks = this.ticks(tickSize, ctx, dataArea, edge);
    var x = dataArea.x();
    var y = dataArea.y();
    var w = dataArea.width();
    var h = dataArea.height();
    
    var isLeft = edge === jsfc.RectangleEdge.LEFT;
    var isRight = edge === jsfc.RectangleEdge.RIGHT;
    var isTop = edge === jsfc.RectangleEdge.TOP;
    var isBottom = edge === jsfc.RectangleEdge.BOTTOM;
    if (isLeft || isRight) {
        // draw the tick marks and labels
        ctx.setFont(this._tickLabelFont);
        ctx.setFillColor(this._tickLabelColor);
        var maxTickLabelWidth = 0;
        for (var i = 0; i < ticks.length; i++) {
            var tick = ticks[i];
            var yy = this.valueToCoordinate(tick.value, y + h, y);
            if (this._gridLinesVisible) {
                ctx.setLineStroke(this._gridLineStroke);
                ctx.setLineColor(this._gridLineColor);
                ctx.drawLine(x, Math.round(yy), x + w, Math.round(yy));
            }
            if (this._tickMarkInnerLength + this._tickMarkOuterLength > 0) {
                ctx.setLineStroke(this._tickMarkStroke);
                ctx.setLineColor(this._tickMarkColor);
                if (isRight) {
                    ctx.drawLine(x + w + offset - this._tickMarkInnerLength, yy, 
                            x + w + offset + this._tickMarkOuterLength, yy);
                } else {
                    ctx.drawLine(x - offset - this._tickMarkOuterLength, yy, 
                            x - offset + this._tickMarkInnerLength, yy);
                }
            }
            if (isRight) {
                var adj = offset + this._tickMarkOuterLength 
                        + this._tickLabelMargin.left();
                var dim = ctx.drawAlignedString(tick.label, x + w + adj, yy, 
                        jsfc.TextAnchor.CENTER_LEFT);                
            } else {
                var adj = offset + this._tickMarkOuterLength 
                        + this._tickLabelMargin.right();
                var dim = ctx.drawAlignedString(tick.label, x - adj, yy, 
                        jsfc.TextAnchor.CENTER_RIGHT);
            }
            maxTickLabelWidth = Math.max(maxTickLabelWidth, dim.width());
        }
        ctx.setLineColor(this._axisLineColor);
        ctx.setLineStroke(this._axisLineStroke);
        if (isRight) {
            ctx.drawLine(x + w + offset, y, x + w + offset, 
                    y + dataArea.height());                    
        } else {
            ctx.drawLine(x - offset, y, x - offset, y + dataArea.height());        
        }
        if (this._label) {
            ctx.setFont(this._labelFont);
            ctx.setFillColor(this._labelColor);
            if (isRight) {
                var adj = offset + maxTickLabelWidth + this._tickMarkOuterLength 
                    + this._tickLabelMargin.left() + this._tickLabelMargin.right() 
                    + this._labelMargin.left();
                ctx.drawRotatedString(this._label, x + w + adj, y + h / 2, 
                        jsfc.TextAnchor.BOTTOM_CENTER, Math.PI / 2);                
            } else {
                var adj = offset + maxTickLabelWidth + this._tickMarkOuterLength 
                    + this._tickLabelMargin.left() + this._tickLabelMargin.right() 
                    + this._labelMargin.right();
                ctx.drawRotatedString(this._label, x - adj, y + h / 2, 
                        jsfc.TextAnchor.BOTTOM_CENTER, -Math.PI / 2);
            }
        }
    } else if (isTop || isBottom) {
        ctx.setFont(this._tickLabelFont);
        ctx.setFillColor(this._tickLabelColor);
        var gap = offset + this._tickMarkOuterLength;
        if (isTop) {
            gap += this._tickLabelMargin.bottom();
        } else {
            gap += this._tickLabelMargin.top();
        }
        for (var i = 0; i < ticks.length; i++) {
            var tick = ticks[i];
            var xx = this.valueToCoordinate(tick.value, x, x + w);
            if (this._gridLinesVisible) {
                ctx.setLineStroke(this._gridLineStroke);
                ctx.setLineColor(this._gridLineColor);
                ctx.drawLine(Math.round(xx), y, Math.round(xx), y + h);
            }
            if (this._tickMarkInnerLength + this._tickMarkOuterLength > 0) {
                ctx.setLineStroke(this._tickMarkStroke);
                ctx.setLineColor(this._tickMarkColor);
                if (isTop) {
                    ctx.drawLine(xx, y - offset - this._tickMarkOuterLength, xx, 
                            y - offset + this._tickMarkInnerLength);                    
                    ctx.drawAlignedString(tick.label, xx, y - gap, 
                            jsfc.TextAnchor.BOTTOM_CENTER);
                } else {
                    ctx.drawLine(xx, y + h + offset - this._tickMarkInnerLength, 
                            xx, y + h + offset + this._tickMarkOuterLength);
                    ctx.drawAlignedString(tick.label, xx, y + h + gap, 
                            jsfc.TextAnchor.TOP_CENTER);
                }
            }
        }
        ctx.setLineColor(this._axisLineColor);
        ctx.setLineStroke(this._axisLineStroke);
        if (isTop) {
            ctx.drawLine(x, y - offset, x + w, y - offset);            
        } else {
            ctx.drawLine(x, y + h + offset, x + w, y + h + offset);
        }
        // if the axis has a label, draw it
        if (this._label) {
            ctx.setFont(this._labelFont);
            ctx.setFillColor(this._labelColor);
            if (isTop) {
                ctx.drawAlignedString(this._label, x + w / 2, 
                        y - gap - this._tickLabelMargin.bottom() 
                        - this._labelMargin.top() - this._tickLabelFont.size, 
                        jsfc.TextAnchor.BOTTOM_CENTER);                
            } else {
                ctx.drawAlignedString(this._label, x + w / 2, 
                        y + h + gap + this._tickLabelMargin.bottom() 
                        + this._labelMargin.top() + this._tickLabelFont.size, 
                        jsfc.TextAnchor.TOP_CENTER);
            }
        }
    }
};

/**
 * Configures this axis to function as an x-axis for the specified plot.
 * 
 * @param {Object} plot  the plot (XYPlot).
 * @returns {undefined}
 */
jsfc.LinearAxis.prototype.configureAsXAxis = function(plot) {
    var dataset = plot.getDataset();
    if (this._autoRange && dataset) {
        var bounds = plot.getDataset().xbounds();
        if (bounds[0] <= bounds[1]) {
            this._applyAutoRange(bounds[0], bounds[1]);
        }
    }
    
    // auto-detect symbols in dataset
    if (dataset) {
        var s = plot.getDataset().getProperty("x-symbols");
        if (s) {
            this._symbols = s.map(function(e) { return e; });
        } else {
            this._symbols = [];
        }
    }

};

/**
 * Configures this axis to function as a y-axis for the specified plot.
 * 
 * @param {Object} plot  the plot (XYPlot or, later, CategoryPlot).
 * @returns {undefined}
 */
jsfc.LinearAxis.prototype.configureAsYAxis = function(plot) {
    var dataset = plot.getDataset();
    if (this._autoRange && dataset) {
        var range = plot.getRenderer().calcYRange(dataset);
        if (range.length() >= 0) {
            this._applyAutoRange(range.lowerBound(), range.upperBound());
        }
    }
    // auto-detect symbols in dataset
    if (dataset) {
        var s = plot.getDataset().getProperty("y-symbols");
        if (s) {
            this._symbols = s.map(function(e) { return e; });
        } else {
            this._symbols = [];
        }
    }
};

/**
 * Resizes the axis range by the specified factor (values above 1.0 will 
 * increase the range, values below 1.0 will decrease the range).  If the 
 * factor is not positive, the axis range will be reset to the auto-calculated
 * range.  If the resize would cause the axis range to become zero or infinite,
 * then no resize will be performed.
 * 
 * @param {number} factor  the factor.
 * @param {number} anchorValue  the anchor value.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.LinearAxis.prototype.resizeRange = function(factor, anchorValue, 
        notify) {
    jsfc.Args.requireNumber(factor, "factor");
    if (factor > 0.0) {
        var left = anchorValue - this._lowerBound;
        var right = this._upperBound - anchorValue;
        var b0 = anchorValue - left * factor;
        var b1 = anchorValue + right * factor;
        if (b1 > b0 && isFinite(b1 - b0)) {
            this._lowerBound = b0;
            this._upperBound = b1;
            this._autoRange = false;
            if (notify !== false) {
                this.notifyListeners();
            }
        }
    }
    else {
        this.setAutoRange(true);
    }
};

/**
 * Pans the axis by the specified percentage (positive values will increase
 * the axis bounds, negative values will decrease the axis bounds) and sends a 
 * change notification to registered listeners (unless 'notify' is set to 
 * false).
 * 
 * @param {number} percent  the percentage.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.LinearAxis.prototype.pan = function(percent, notify) {
    jsfc.Args.requireNumber(percent, "percent");
    var length = this._upperBound - this._lowerBound;
    var adj = percent * length;
    var b0 = this._lowerBound + adj;
    var b1 = this._upperBound + adj;
    if (isFinite(b0) && isFinite(b1)) {
        this._lowerBound = b0;
        this._upperBound = b1;
        this._autoRange = false;
        if (notify !== false) {
            this.notifyListeners();
        }
    }
};

/**
 * @class Represents a tick mark.
 * @constructor
 * @param {number} value  the data value.
 * @param {string} label  the label.
 * @returns {jsfc.TickMark}
 */
jsfc.TickMark = function(value, label) {
    if (!(this instanceof jsfc.TickMark)) {
        throw new Error("Use 'new' for constructor.");
    }
    this.value = value;
    this.label = label;
};

jsfc.TickMark.prototype.toString = function() {
    return this.label;
};



/**
 * Creates a new axis with a logarithmic numerical scale.
 * 
 * Note that all properties having names beginning with an underscore should
 * be treated as private.  Updating these properties directly is strongly
 * discouraged.  Look for accessor methods instead.
 * 
 * @param {string} [label]  the axis label.
 * @returns {jsfc.LinearAxis}
 * @constructor
 */
jsfc.LogAxis = function(label) {
    if (!(this instanceof jsfc.LogAxis)) {
        throw new Error("Use 'new' with constructor.");
    }
    jsfc.LinearAxis.init(label, this);
    this._base = 10;
    this._baseLog = Math.log(this._base);
    this._smallestValue = 1e-100;
    var lb = Math.log(Math.max(this._lowerBound, this._smallestValue)) / this._baseLog;
    var ub = Math.log(Math.max(this._upperBound, this._smallestValue)) / this._baseLog;
    this._logRange = new jsfc.Range(lb, ub);
};

// extend LinearAxis - see also the init() call in the constructor
jsfc.LogAxis.prototype = new jsfc.LinearAxis();

/**
 * Calculates the log of the specified value.
 * 
 * @param {number} value  the value.
 * @returns {number} The log value.
 */
jsfc.LogAxis.prototype.calculateLog = function(value) {
    return Math.log(value) / this._baseLog;
};

/**
 * Calculates the value from the specified log.
 * 
 * @param {number} log  the log value.
 * @returns {number} The value.
 */
jsfc.LogAxis.prototype.calculateValue = function(log) {
    return Math.pow(this._base, log);
};

/**
 * Sets the bounds for the axis.
 * 
 * @param {number} lower  the lower bound.
 * @param {number} upper  the upper bound.
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.LogAxis} This object for chaining method calls.
 */
jsfc.LogAxis.prototype.setBounds = function(lower, upper, notify) {
    this._lowerBound = lower;
    this._upperBound = upper;
    this._logRange = new jsfc.Range(this.calculateLog(lower), 
            this.calculateLog(upper));
    this._autoRange = false;
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Translates a data value to a coordinate in the given range.
 * 
 * @param {number} value  the value.
 * @param {number} r0  the lower bound of the coordinate (screen) range.
 * @param {number} r1  the upper bound of the coordinate (screen) range.
 * 
 * @returns {undefined}
 */
jsfc.LogAxis.prototype.valueToCoordinate = function(value, r0, r1) {
    jsfc.Args.requireNumber(r0, "r0");
    jsfc.Args.requireNumber(r1, "r1");
    // let's say the axis runs from a to b...
    var log = this.calculateLog(value);
    var percent = this._logRange.percent(log);    
    return r0 + percent * (r1 - r0);
};

/**
 * Translates a coordinate from the given range to a value on the axis scale.
 * 
 * @param {number} coordinate  the coordinate value.
 * @param {number} r0
 * @param {number} r1
 * @returns {number}
 */
jsfc.LogAxis.prototype.coordinateToValue = function(coordinate, r0, r1) {
    var percent = (coordinate - r0) / (r1 - r0);
    var logValue = this._logRange.value(percent);
    return this.calculateValue(logValue);
};

/**
 * Calculates a good tick size for the axis assuming it is drawn along the
 * specified edge of the area.  This method should return NaN if there is
 * no good tick size (in which case the axis should just label the end points).
 * 
 * @param {jsfc.Context2D} ctx  the graphics context (used to measure string 
 *         dimensions).
 * @param {jsfc.Rectangle} area  the data area for the plot (the axis lies 
 *         along one edge).
 * @param {jsfc.RectangleEdge} edge  the edge along which the axis lies.
 * @returns {number} The tick size.
 */
jsfc.LogAxis.prototype._calcTickSize = function(ctx, area, edge) {
    var result = Number.NaN;
    var pixels = area.length(edge);
    var range = this._logRange.length();
    var orientation = this._resolveTickLabelOrientation(edge);
    var selector = this._tickSelector;
    if (orientation === jsfc.LabelOrientation.PERPENDICULAR) {
        // work with the label height
        var textHeight = ctx.textDim("123").height();
        var maxTicks = pixels / (textHeight * this._tickLabelFactor);
        if (maxTicks > 2) {
            var tickSize = selector.select(range / 2);
            var tickCount = Math.floor(range / tickSize);
            while (tickCount < maxTicks) {
                selector.previous();
                tickCount = Math.floor(range / selector.currentTickSize());
            }
            selector.next();
            result = selector.currentTickSize();
            this._formatter = selector.currentTickFormat();
        } else {
            // result remains Number.NaN
        }
    } else if (orientation === jsfc.LabelOrientation.PARALLEL) {
        // work with label widths (approximate by measuring the min and max)
        selector.select(range);
        ctx.setFont(this._tickLabelFont);
        var done = false;
        while (!done) {
            if (selector.previous()) {
                // estimate the label widths, and do they overlap?
                var f = selector.currentTickFormat();
                this._formatter = f;
                var s0 = f.format(this._lowerBound);
                var s1 = f.format(this._upperBound);
                var w0 = ctx.textDim(s0).width();
                var w1 = ctx.textDim(s1).width();
                var w = Math.max(w0, w1);
                if (w == 0 && s0.length > 0 && s1.length > 0) {
                	// text could not be measured (could be IE bug)
                	return Number.NaN;
                }
                var n = Math.floor(pixels / (w * this._tickLabelFactor));
                if (n < range / selector.currentTickSize()) {
                    selector.next();
                    this._formatter = selector.currentTickFormat();
                    done = true;
                }
            } else {
                done = true;
            }
        }
        result = selector.currentTickSize();        
    }
    return result;
};

/**
 * Returns a list of ticks for the axis.
 * 
 * @param {number} tickSize  the tick size.
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} area  the data area.
 * @param {string} edge  the edge.
 * 
 * @returns {Array} An array of jsfc.TickMark instances.
 */
jsfc.LogAxis.prototype.ticks = function(tickSize, ctx, area, edge) {
    var formatter = this._tickLabelFormatOverride || this._formatter;
    if (!isNaN(tickSize)) {
        var result = [];
        var t = Math.ceil(this._logRange._lowerBound / tickSize) * tickSize; 
        while (t < this._logRange._upperBound) {
            var v = this.calculateValue(t);
            var tm = new jsfc.TickMark(v, formatter.format(v));
            result.push(tm);
            t += tickSize;
        }
        return result;
    } else {
        var tm0 = new jsfc.TickMark(this._lowerBound, 
                formatter.format(this._logRange._lowerBound));
        var tm1 = new jsfc.TickMark(this._upperBound, 
                formatter.format(this._logRange._upperBound));
        return [tm0, tm1];
    }
};


/**
 * Creates a new symbolic axis (initially with no symbols defined).
 * 
 * @class An axis that displays its scale using user-defined symbols to 
 * represent values from the dataset.
 * 
 * @constructor 
 * @implements {jsfc.ValueAxis}
 * @param {string} label  the axis label.
 * @returns {jsfc.SymbolAxis}
 */
jsfc.SymbolAxis = function(label) {
    if (!(this instanceof jsfc.SymbolAxis)) {
        throw new Error("Use 'new' with constructor.");
    }
    jsfc.LinearAxis.init(label, this);
    this._symbols = [];
    this._showEndPointValuesIfNoSymbols = true;
};

// extend LinearAxis - see also the init() call in the constructor
jsfc.SymbolAxis.prototype = new jsfc.LinearAxis();

/**
 * Configures this axis to function as an x-axis for the specified plot.
 * In addition to the auto-range behaviour inherited from LinearAxis, this 
 * method will, in the case where no symbols have been defined, check if the
 * dataset has a property 'x-symbols' and use that to configure the symbols 
 * for the axis.  The 'x-symbols' property should be an array containing
 * one or more objects in the form { "symbol": "abc", "value": 123 }.
 * 
 * @param {Object} plot  the plot (XYPlot).
 * @returns {undefined}
 */
jsfc.SymbolAxis.prototype.configureAsXAxis = function(plot) {
    // if the axis doesn't have defined symbols, see if the dataset provides
    // them via the 'x-symbol' property
    if (this._symbols.length === 0) {
        var s = plot.getDataset().getProperty("x-symbols");
        if (s) {
            this._symbols = s.map(function(e) { return e; });
        }
    }
    // call the super 
    jsfc.LinearAxis.prototype.configureAsXAxis.call(this, plot);     
};

/**
 * Configures this axis to function as a y-axis for the specified plot.
 * In addition to the auto-range behaviour inherited from LinearAxis, this 
 * method will, in the case where no symbols have been defined, check if the
 * dataset has a property 'y-symbols' and use that to configure the symbols 
 * for the axis.  The 'y-symbols' property should be an array containing
 * one or more objects in the form { "symbol": "abc", "value": 123 }.
 * 
 * @param {Object} plot  the plot (XYPlot or, later, CategoryPlot).
 * @returns {undefined}
 */
jsfc.SymbolAxis.prototype.configureAsYAxis = function(plot) {
    // if the axis doesn't have defined symbols, see if the dataset provides
    // them via the 'y-symbol' property
    if (this._symbols.length === 0) {
        var s = plot.getDataset().getProperty("y-symbols");
        if (s) {
            this._symbols = s.map(function(e) { return e; });
        }
    }
    // call the super 
    jsfc.LinearAxis.prototype.configureAsXAxis.call(this, plot); 
};

/**
 * Adds a symbol and its corresponding value to the axis and sends a change
 * notification to registered listeners (unless 'notify' is set to false).
 * 
 * @param {!string} symbol  the symbol.
 * @param {!number} value  the value.
 * @param {boolean} [notify]  notify listeners?
 * @returns {jsfc.SymbolAxis} This axis for chaining method calls.
 */
jsfc.SymbolAxis.prototype.addSymbol = function(symbol, value, notify) {
    this._symbols.push({ "symbol": symbol, "value": value});
    this._symbols.sort(function(a, b) {
        return a.value - b.value;    
    });
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Removes all symbols from the axis and sends a change notification to all 
 * registered listeners (unless 'notify' is set to false).  Note that when an 
 * axis has no symbols, the end points will be labelled with their numerical 
 * values.
 * 
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {jsfc.SymbolAxis} This axis for chaining method calls.
 */
jsfc.SymbolAxis.prototype.clearSymbols = function(notify) {
    this._symbols = [];
    if (notify !== false) {
        this.notifyListeners();
    }
    return this;
};

/**
 * Returns the number of symbols having a value within the specified range.
 * 
 * @param {!jsfc.Range} range  the range.
 * @returns {number} The number of symbols with values visible in the range.
 * @private
 */
jsfc.SymbolAxis.prototype._symbolCount = function(range) {
    var c = 0;
    this._symbols.forEach(function(s) {
        if (range.contains(s.value)) {
            c++;
        }
    });
    return c;
};

/**
 * Returns a list of ticks for the axis.
 * 
 * @param {number} tickSize  the tick size (ignored by this axis).
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} area  the data area.
 * @param {string} edge  the edge.
 * 
 * @returns {Array} An array of jsfc.TickMark instances.
 */
jsfc.SymbolAxis.prototype.ticks = function(tickSize, ctx, area, edge) {
    var r = new jsfc.Range(this._lowerBound, this._upperBound);
    if (this._symbolCount(r) > 0) {
        var result = [];
        var axis = this;
        this._symbols.forEach(function(s) {
            if (s.value > axis._lowerBound && s.value < axis._upperBound) {
                result.push(new jsfc.TickMark(s.value, s.symbol));
            }
        });
        return result;
    } else if (this._showEndPointValuesIfNoSymbols) {
        var formatter = this._tickLabelFormatOverride || this._formatter;
        var tm0 = new jsfc.TickMark(this._lowerBound, 
                formatter.format(this._lowerBound));
        var tm1 = new jsfc.TickMark(this._upperBound, 
                formatter.format(this._upperBound));
        return [tm0, tm1];
    } else {
        return [];
    }
};


/**
 * Creates and returns a new color source.
 * 
 * @param {jsfc.Color[]} colors An array of colors.
 * 
 * @returns {jsfc.ColorSource}
 * 
 * @constructor
 */
jsfc.ColorSource = function(colors) {
    if (!(this instanceof jsfc.ColorSource)) {
        throw new Error("Use 'new' for constructor.");
    }
    this._colors = colors;
};

/**
 * Returns a color.
 * 
 * @param {number} series  the series index.
 * @param {number} item  the item index.
 * 
 * @returns {jsfc.Color} A color.
 */
jsfc.ColorSource.prototype.getColor = function(series, item) {
    return this._colors[series % this._colors.length];
};

/**
 * Returns a color to represent the specified series in the legend.
 * @param {number} series  the series index.
 * @returns {jsfc.Color} A color to represent the series.
 */
jsfc.ColorSource.prototype.getLegendColor = function(series) {
    return this._colors[series % this._colors.length];
};
/**
 * @interface
 */
jsfc.CategoryRenderer = function() {
    throw new Error("Documents the interface only.");
};
/**
 * A base object for CategoryRenderer implementations.
 * @constructor
 * @param {jsfc.BaseCategoryRenderer} [instance]  the instance.
 */
jsfc.BaseCategoryRenderer = function(instance) {
    if (!(this instanceof jsfc.BaseCategoryRenderer)) {
        throw new Error("Use 'new' for constructor.");
    }
    if (!instance) {
        instance = this;
    }
    jsfc.BaseCategoryRenderer.init(instance);
};

/**
 * Initialises an object to have the attributes provided by this base 
 * renderer.
 * 
 * @param {jsfc.BaseCategoryRenderer} instance  the instance.
 * @returns {undefined}
 */
jsfc.BaseCategoryRenderer.init = function(instance) {
    var lineColors = jsfc.Colors.colorsAsObjects(jsfc.Colors.fancyLight());
    var fillColors = jsfc.Colors.colorsAsObjects(jsfc.Colors.fancyLight());
    instance._lineColorSource = new jsfc.ColorSource(lineColors);
    instance._fillColorSource = new jsfc.ColorSource(fillColors);
    instance._listeners = [];    
};

/**
 * Returns the color source that provides line colors.
 * 
 * @returns {jsfc.ColorSource}
 */
jsfc.BaseCategoryRenderer.prototype.getLineColorSource = function() {
    return this._lineColorSource;
};

/**
 * Sets the color source that determines the line color for each data item.
 * 
 * @param {jsfc.ColorSource} cs  the color source.
 * @param {boolean} [notify]
 * @returns {undefined}
 */
jsfc.BaseCategoryRenderer.prototype.setLineColorSource = function(cs, notify) {
    this._lineColorSource = cs;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the color source that provides fill colors.
 * 
 * @returns {jsfc.ColorSource}
 */
jsfc.BaseCategoryRenderer.prototype.getFillColorSource = function() {
    return this._fillColorSource;
};

/**
 * Sets the color source that determines the fill color for each data item.
 * 
 * @param {jsfc.ColorSource} cs  the color source.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseCategoryRenderer.prototype.setFillColorSource = function(cs, notify) {
    this._fillColorSource = cs;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the number of passes required to render the data.  In this case,
 * one pass is required.
 * 
 * @returns {!number} The number of passes required.
 */
jsfc.BaseCategoryRenderer.prototype.passCount = function() {
    return 1;
};

/**
 * Calculates the range of values required on the y-axis for this renderer to
 * show all the data items.
 * 
 * @param {!jsfc.Values2DDataset} dataset  the dataset (null not permitted).
 * 
 * @returns {jsfc.Range} The range.
 */
jsfc.BaseCategoryRenderer.prototype.calcYRange = function(dataset) {
    var bounds = jsfc.Values2DDatasetUtils.ybounds(dataset);
    return new jsfc.Range(bounds[0], bounds[1]);
};

/**
 * Registers a listener to receive notification of changes to the renderer.  
 * The listener is a function - it will be passed one argument (the renderer
 * being listened to).
 * 
 * @param {Function} f  the listener function.
 * @returns {undefined}
 */
jsfc.BaseCategoryRenderer.prototype.addListener = function(f) {
    this._listeners.push(f);  
};

/**
 * Removes a listener so that it will no longer receive notification of changes
 * to this renderer.
 * 
 * @param {Function} listener  the listener.
 * @returns {jsfc.BaseCategoryRenderer} This renderer for chaining method calls.
 */
jsfc.BaseCategoryRenderer.prototype.removeListener = function(listener) {
    var i = this._listeners.indexOf(listener);
    if (i >= 0) {
        this._listeners.splice(i, 1);
    }
    return this;
};

/**
 * Notify each listener function that this plot has changed.
 * 
 * @returns {undefined}
 */
jsfc.BaseCategoryRenderer.prototype.notifyListeners = function() {
    var renderer = this;
    this._listeners.forEach(function(f) {
        f(renderer);
    });
};



/**
 * Creates a new renderer for generating bar charts on a jsfc.CategoryPlot.
 * @constructor
 * @implements {jsfc.CategoryRenderer}
 * @param {!jsfc.CategoryPlot} plot  the plot that the renderer is assigned to
 * @returns {!jsfc.BarRenderer}
 */
jsfc.BarRenderer = function(plot) {
    if (!(this instanceof jsfc.BarRenderer)) {
        throw new Error("Use 'new' for constructors.");
    }
    jsfc.BaseCategoryRenderer.init(this);
    this._plot = plot;
};

jsfc.BarRenderer.prototype = new jsfc.BaseCategoryRenderer();
    
/**
 * Returns the item fill color.
 * 
 * @param {string} rowKey  the row key.
 * @param {string} columnKey  the column key.
 * @returns {jsfc.Color}
 */
jsfc.BarRenderer.prototype.itemFillColor = function(dataset, rowKey, columnKey) {
    var r = dataset.rowIndex(rowKey);
    var c = dataset.columnIndex(columnKey);
    return this._lineColorSource.getColor(r, c);
};

jsfc.BarRenderer.prototype.itemStrokeColor = function(rowKey, columnKey) {
    return "none";
};

/**
 * Calculates the range of values required on the y-axis for this renderer to
 * show all the data items.
 * 
 * @param {jsfc.Values2DDataset} dataset  the dataset.
 * 
 * @returns {jsfc.Range} The range.
 */
jsfc.BarRenderer.prototype.calcYRange = function(dataset) {
    var bounds = jsfc.Values2DDatasetUtils.ybounds(dataset, 0);
    return new jsfc.Range(bounds[0], bounds[1]);
};

/**
 * Draws one item.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} dataArea  the data area.
 * @param {!jsfc.CategoryPlot} plot  the plot.
 * @param {!jsfc.Values2DDataset} dataset  the dataset.
 * @param {!number} rowIndex
 * @param {!number} columnIndex
 * @param {!number} pass
 * @returns {undefined}
 */
jsfc.BarRenderer.prototype.drawItem = function(ctx, dataArea, plot, 
        dataset, rowIndex, columnIndex, pass) {

    var rowKey = dataset.rowKey(rowIndex);
    var columnKey = dataset.columnKey(columnIndex);
    var y = dataset.valueByIndex(rowIndex, columnIndex);
    
    var xAxis = plot.getXAxis();
    var yAxis = plot.getYAxis();
    // convert these to target coordinates using the plot's axes
    var rowCount = dataset.rowCount();
    var xr = xAxis.itemRange(rowIndex, rowCount, columnKey, dataArea.minX(), 
            dataArea.maxX());    
    var yy = yAxis.valueToCoordinate(y, dataArea.maxY(), dataArea.minY());
    var zz = yAxis.valueToCoordinate(0, dataArea.maxY(), dataArea.minY());
    var color = this.itemFillColor(dataset, rowKey, columnKey);
    ctx.setFillColor(color);
    ctx.setLineColor(new jsfc.Color(50, 50, 50));
    
    ctx.drawRect(xr.lowerBound(), Math.min(yy, zz), xr.length(), 
            Math.abs(zz - yy));
};

/**
 * Creates a new renderer for generating stacked bar charts on a 
 * jsfc.CategoryPlot.
 * 
 * @param {jsfc.CategoryPlot} plot  the plot that the renderer is assigned to
 * @returns {jsfc.StackedBarRenderer}
 * @constructor
 */
jsfc.StackedBarRenderer = function(plot) {
    if (!(this instanceof jsfc.StackedBarRenderer)) {
        throw new Error("Use 'new' for constructors.");
    }
    jsfc.BaseCategoryRenderer.init(this);
    this._plot = plot;
};

jsfc.StackedBarRenderer.prototype = new jsfc.BaseCategoryRenderer();
    
/**
 * Returns the item fill color.
 * 
 * @param {string} rowKey  the row key.
 * @param {string} columnKey  the column key.
 * @returns {jsfc.Color}
 */
jsfc.StackedBarRenderer.prototype.itemFillColor = function(dataset, rowKey, columnKey) {
    var r = dataset.rowIndex(rowKey);
    var c = dataset.columnIndex(columnKey);
    return this._lineColorSource.getColor(r, c);
};

/**
 * Calculates the range of values required on the y-axis for this renderer to
 * show all the data items.
 * 
 * @param {!jsfc.Values2DDataset} dataset  the dataset (null not permitted).
 * 
 * @returns {jsfc.Range} The range.
 */
jsfc.StackedBarRenderer.prototype.calcYRange = function(dataset) {
    var bounds = jsfc.Values2DDatasetUtils.stackYBounds(dataset, 0);
    return new jsfc.Range(bounds[0], bounds[1]);
};

/**
 * Draws one item.
 * 
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} dataArea  the data area.
 * @param {jsfc.CategoryPlot} plot  the plot.
 * @param {jsfc.Values2DDataset} dataset  the dataset.
 * @param {number} rowIndex
 * @param {number} columnIndex
 * @param {number} pass
 * @returns {undefined}
 */
jsfc.StackedBarRenderer.prototype.drawItem = function(ctx, dataArea, plot, 
        dataset, rowIndex, columnIndex, pass) {

    var rowKey = dataset.rowKey(rowIndex);
    var columnKey = dataset.columnKey(columnIndex);
    var y = dataset.valueByIndex(rowIndex, columnIndex);
    var b = jsfc.Values2DDatasetUtils.stackBaseY(dataset, rowIndex, columnIndex);
    var xAxis = plot.getXAxis();
    var yAxis = plot.getYAxis();
    // convert these to target coordinates using the plot's axes
    var rowCount = dataset.rowCount();
    var xr = xAxis.keyToRange(columnKey, dataArea.minX(), dataArea.maxX());    
    var yy = yAxis.valueToCoordinate(b + y, dataArea.maxY(), dataArea.minY());
    var bb = yAxis.valueToCoordinate(b, dataArea.maxY(), dataArea.minY());
    var color = this.itemFillColor(dataset, rowKey, columnKey);
    ctx.setFillColor(color);
    ctx.setLineColor(new jsfc.Color(50, 50, 50));
        
    ctx.drawRect(xr.lowerBound(), Math.min(yy, bb), xr.length(), 
            Math.abs(bb - yy));
};

/**
 * Creates and returns a new stroke source.
 * 
 * @param {jsfc.Stroke[]} strokes An array of strokes.
 * 
 * @returns {jsfc.StrokeSource}
 * 
 * @constructor
 */
jsfc.StrokeSource = function(strokes) {
    if (!(this instanceof jsfc.StrokeSource)) {
        throw new Error("Use 'new' for constructor.");
    }
    this._strokes = strokes;
};

/**
 * Returns a stroke for the specified item.
 * 
 * @param {number} series  the series index.
 * @param {number} item  the item index.
 * 
 * @returns {jsfc.Stroke} A stroke.
 */
jsfc.StrokeSource.prototype.getStroke = function(series, item) {
    return this._strokes[series % this._strokes.length];
};
/**
 * A base object for XYRenderer implementations.
 * @constructor
 * @param {jsfc.BaseXYRenderer} [instance]  the instance.
 */
jsfc.BaseXYRenderer = function(instance) {
    if (!(this instanceof jsfc.BaseXYRenderer)) {
        throw new Error("Use 'new' for constructor.");
    }
    if (!instance) {
        instance = this;
    }
    jsfc.BaseXYRenderer.init(instance);
};

/**
 * Initialises an object to have the attributes provided by this base 
 * renderer.
 * 
 * @param {jsfc.BaseXYRenderer} instance  the instance.
 * @returns {undefined}
 */
jsfc.BaseXYRenderer.init = function(instance) {
    var lineColors = jsfc.Colors.colorsAsObjects(jsfc.Colors.fancyLight());
    var fillColors = jsfc.Colors.colorsAsObjects(jsfc.Colors.fancyLight());
    instance._lineColorSource = new jsfc.ColorSource(lineColors);
    instance._fillColorSource = new jsfc.ColorSource(fillColors);
    instance._strokeSource = new jsfc.StrokeSource([new jsfc.Stroke(2)]);
    instance._listeners = [];    
};

/**
 * Returns the color source that provides line colors.
 * 
 * @returns {jsfc.ColorSource}
 */
jsfc.BaseXYRenderer.prototype.getLineColorSource = function() {
    return this._lineColorSource;
};

/**
 * Sets the color source that determines the line color for each data item.
 * 
 * @param {jsfc.ColorSource} cs  the color source.
 * @param {boolean} [notify]
 * @returns {undefined}
 */
jsfc.BaseXYRenderer.prototype.setLineColorSource = function(cs, notify) {
    this._lineColorSource = cs;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the color source that provides fill colors.
 * 
 * @returns {jsfc.ColorSource}
 */
jsfc.BaseXYRenderer.prototype.getFillColorSource = function() {
    return this._fillColorSource;
};

/**
 * Sets the color source that determines the fill color for each data item.
 * 
 * @param {jsfc.ColorSource} cs  the color source.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.BaseXYRenderer.prototype.setFillColorSource = function(cs, notify) {
    this._fillColorSource = cs;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the object that determines the line stroke to be used by the
 * renderer for a particular data item.
 * 
 * @returns {jsfc.StrokeSource}  the stroke source.
 */
jsfc.BaseXYRenderer.prototype.getStrokeSource = function() {
    return this._strokeSource;
};

/**
 * Sets the object that determines the line stroke to be used by the renderer
 * for a particular data item and notifies listeners that the renderer has
 * changed.
 * 
 * @param {jsfc.StrokeSource} ss  the stroke source.
 * @param {boolean} [notify]
 * @returns {undefined}
 */
jsfc.BaseXYRenderer.prototype.setStrokeSource = function(ss, notify) {
    this._strokeSource = ss;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the number of passes required to render the data.  Most renderers
 * will make a single pass through the dataset, but there are cases where 
 * multiple passes will be required.
 * 
 * @returns {!number} The number of passes required.
 */
jsfc.BaseXYRenderer.prototype.passCount = function() {
    return 1;
};

jsfc.BaseXYRenderer.prototype.calcYRange = function(dataset) {
    var bounds = jsfc.XYDatasetUtils.ybounds(dataset);
    return new jsfc.Range(bounds[0], bounds[1]);
};

/**
 * Registers a listener to receive notification of changes to the renderer.  
 * The listener is a function - it will be passed one argument (this plot).
 * 
 * @param {Function} f  the listener function.
 * @returns {undefined}
 */
jsfc.BaseXYRenderer.prototype.addListener = function(f) {
    this._listeners.push(f);  
};

/**
 * Notify each listener function that this plot has changed.
 * 
 * @returns {undefined}
 */
jsfc.BaseXYRenderer.prototype.notifyListeners = function() {
    var plot = this;
    this._listeners.forEach(function(f) {
        f(plot);
    });
};



/**
 * Creates a new renderer for generating scatter plots.
 * @constructor
 * @implements {jsfc.XYRenderer}
 * @param {jsfc.XYPlot} plot  the plot that the renderer is assigned to
 * @returns {jsfc.ScatterRenderer}
 */
jsfc.ScatterRenderer = function(plot) {
    if (!(this instanceof jsfc.ScatterRenderer)) {
        throw new Error("Use 'new' for constructors.");
    }
    jsfc.BaseXYRenderer.init(this);
    this._plot = plot;
    this._radius = 3;
};

// extend BaseXYRenderer (see also the init call in the constructor)
jsfc.ScatterRenderer.prototype = new jsfc.BaseXYRenderer();

/**
 * Returns the fill color string for an item.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string} itemKey  the item key.
 * @returns {string} A color string.
 */
jsfc.ScatterRenderer.prototype.itemFillColorStr = function(seriesKey, 
        itemKey) {
    var dataset = this._plot.getDataset();
    var c = dataset.getProperty(seriesKey, itemKey, "color");
    if (c) {
        return c;
    } 
    var color = this.itemFillColor(seriesKey, itemKey);
    return color.rgbaStr();
};
    
/**
 * Returns the item fill color.
 * 
 * @param {string} seriesKey  the series key.
 * @param {string|number} itemKey  the item key.
 * @returns {jsfc.Color}
 */
jsfc.ScatterRenderer.prototype.itemFillColor = function(seriesKey, itemKey) {
    var dataset = this._plot.getDataset();
    var seriesIndex = dataset.seriesIndex(seriesKey);
    var itemIndex = dataset.itemIndex(seriesKey, itemKey);
    return this._lineColorSource.getColor(seriesIndex, itemIndex);
};

jsfc.ScatterRenderer.prototype.itemStrokeColor = function(seriesKey, itemKey) {
    if (this._plot._dataset.isSelected("select", seriesKey, itemKey)) {
        return "red";
    } 
    return "none";
};

/**
 * Draws one item.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} dataArea  the data area.
 * @param {!jsfc.XYPlot} plot  the plot.
 * @param {!jsfc.XYDataset} dataset  the dataset.
 * @param {!number} seriesIndex
 * @param {!number} itemIndex
 * @param {!number} pass
 * @returns {undefined}
 */
jsfc.ScatterRenderer.prototype.drawItem = function(ctx, dataArea, plot, 
        dataset, seriesIndex, itemIndex, pass) {

    var seriesKey = dataset.seriesKey(seriesIndex);
    var itemKey = dataset.getItemKey(seriesIndex, itemIndex);
    
    // fetch the x and y values
    var x = dataset.x(seriesIndex, itemIndex);
    var y = dataset.y(seriesIndex, itemIndex);
    
    // convert these to target coordinates using the plot's axes
    var xx = plot.getXAxis().valueToCoordinate(x, dataArea.minX(), 
            dataArea.maxX());
    var yy = plot.getYAxis().valueToCoordinate(y, dataArea.maxY(), 
            dataArea.minY());

    // fill color - first check if it is defined as a property in the dataset
    var str = dataset.getItemProperty(seriesKey, itemKey, "color");
    var color;
    if (typeof str === "string") {
        color = jsfc.Color.fromStr(str);
    } else {
        color = this.itemFillColor(seriesKey, itemKey);
    }
    var r = this._radius;
    if (dataset.isSelected("selection", seriesKey, itemKey)) {
        r = r * 2;
    }
    ctx.setFillColor(color);
    ctx.setLineStroke(new jsfc.Stroke(0.2));
    ctx.setLineColor(jsfc.Colors.BLACK);
    ctx.setHint("ref", [seriesKey, itemKey]);
    ctx.drawCircle(xx, yy, r);
};

/**
 * Creates a new renderer for generating bar charts from interval XY datasets.
 * 
 * @constructor
 * @returns {jsfc.XYBarRenderer}
 */
jsfc.XYBarRenderer = function() {
    if (!(this instanceof jsfc.XYBarRenderer)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.BaseXYRenderer.init(this);
};

// extends BaseXYRenderer (see also the init() call in the constructor)
jsfc.XYBarRenderer.prototype = new jsfc.BaseXYRenderer();

/**
 * Draws one data item.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} dataArea  the data area.
 * @param {!jsfc.XYPlot} plot  the plot.
 * @param {!jsfc.IntervalXYDataset} dataset
 * @param {!number} seriesIndex
 * @param {!number} itemIndex
 * @returns {undefined}
 */
jsfc.XYBarRenderer.prototype.drawItem = function(ctx, dataArea, plot, 
        dataset, seriesIndex, itemIndex, pass) {

    var xmin = dataset.xStart(seriesIndex, itemIndex);
    var xmax = dataset.xEnd(seriesIndex, itemIndex);
    var y = dataset.y(seriesIndex, itemIndex);

    // convert these to target coordinates using the plot's axes
    var xAxis = plot.getXAxis();
    var yAxis = plot.getYAxis();
    var w = dataArea.width();
    var h = dataArea.height();
    var xxmin = xAxis.valueToCoordinate(xmin, dataArea.x(), dataArea.x() + w);
    var xxmax = xAxis.valueToCoordinate(xmax, dataArea.x(), dataArea.x() + w);
    var yy = yAxis.valueToCoordinate(y, dataArea.y() + h, dataArea.y());
    var zz = yAxis.valueToCoordinate(0, dataArea.y() + h, dataArea.y());
            
    ctx.setLineColor(this._lineColorSource.getColor(seriesIndex, itemIndex));
    ctx.setLineStroke(new jsfc.Stroke(1));
    ctx.setFillColor(this._fillColorSource.getColor(seriesIndex, itemIndex));
    ctx.drawRect(xxmin, Math.min(yy, zz), xxmax - xxmin, Math.abs(yy - zz));
};

/**
 * Creates a new renderer for generating line charts.
 * 
 * @returns {jsfc.XYLineRenderer}
 * 
 * @constructor
 */
jsfc.XYLineRenderer = function() {
    if (!(this instanceof jsfc.XYLineRenderer)) {
        return new jsfc.XYLineRenderer();
    }
    jsfc.BaseXYRenderer.init(this);
    this._drawSeriesAsPath = true;
};

jsfc.XYLineRenderer.prototype = new jsfc.BaseXYRenderer();

/**
 * Returns the number of passes required to render the data.  In this case,
 * two passes are required, the first draws the lines and the second overlays
 * the shapes on top.
 * 
 * @returns {!number}
 */
jsfc.XYLineRenderer.prototype.passCount = function() {
    return 2;
};

/**
 * Draws a path for one series to the specified graphics context.
 * 
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} dataArea
 * @param {jsfc.XYPlot} plot
 * @param {jsfc.XYDataset} dataset
 * @param {number} seriesIndex
 * @returns {undefined}
 */
jsfc.XYLineRenderer.prototype.drawSeries = function(ctx, dataArea, plot,
        dataset, seriesIndex) {
    var itemCount = dataset.itemCount(seriesIndex);
    if (itemCount == 0) {
        return;
    }
    var connect = false;
    ctx.beginPath();
    for (var i = 0; i < itemCount; i++) {
        var x = dataset.x(seriesIndex, i);
        var y = dataset.y(seriesIndex, i);
        if (y === null) {
            connect = false;
            continue;
        }

        // convert these to target coordinates using the plot's axes
        var xx = plot.getXAxis().valueToCoordinate(x, dataArea.x(), dataArea.x() 
                + dataArea.width());
        var yy = plot.getYAxis().valueToCoordinate(y, dataArea.y() 
                + dataArea.height(), dataArea.y());
        if (!connect) {
            ctx.moveTo(xx, yy);
            connect = true;
        } else {
            ctx.lineTo(xx, yy);
        }
    }
    ctx.setLineColor(this._lineColorSource.getColor(seriesIndex, 0));
    ctx.setLineStroke(this._strokeSource.getStroke(seriesIndex, 0));
    ctx.stroke();
};

/**
 * Draws one data item to the specified graphics context.
 * 
 * @param {jsfc.Context2D} ctx  the graphics context.
 * @param {jsfc.Rectangle} dataArea
 * @param {jsfc.XYPlot} plot
 * @param {jsfc.XYDataset} dataset
 * @param {number} seriesIndex
 * @param {number} itemIndex
 * @returns {undefined}
 */
jsfc.XYLineRenderer.prototype.drawItem = function(ctx, dataArea, plot, 
        dataset, seriesIndex, itemIndex, pass) {

    if (pass === 0 && this._drawSeriesAsPath) {
        var itemCount = dataset.itemCount(seriesIndex);
        if (itemIndex === itemCount - 1) {
            this.drawSeries(ctx, dataArea, plot, dataset, seriesIndex);
        }
        return;
    }
    var x = dataset.x(seriesIndex, itemIndex);
    var y = dataset.y(seriesIndex, itemIndex);

    // convert these to target coordinates using the plot's axes
    var xx = plot.getXAxis().valueToCoordinate(x, dataArea.x(), dataArea.x() 
            + dataArea.width());
    var yy = plot.getYAxis().valueToCoordinate(y, dataArea.y() 
            + dataArea.height(), dataArea.y());
    
    if (pass === 0) { // in the FIRST pass draw lines
        if (itemIndex > 0) {
            // get the previous item
            var x0 = dataset.x(seriesIndex, itemIndex - 1);
            var y0 = dataset.y(seriesIndex, itemIndex - 1);
            var xx0 = plot.getXAxis().valueToCoordinate(x0, dataArea.x(), 
                    dataArea.x() + dataArea.width());
            var yy0 = plot.getYAxis().valueToCoordinate(y0, dataArea.y() 
                    + dataArea.height(), dataArea.y());
            // connect with a line
            ctx.setLineColor(this._lineColorSource.getColor(seriesIndex, 
                    itemIndex));
            ctx.setLineStroke(this._strokeSource.getStroke(seriesIndex, 
                    itemIndex));
            ctx.drawLine(xx0, yy0, xx, yy);
        }
    } else if (pass === 1) { // in the second pass draw shapes if there are any
        //ctx.setFillColor(this.fillColors[seriesIndex]);
        //ctx.drawCircle(xx, yy, 4);
    }
  
};

/**
 * @interface
 */
jsfc.XYRenderer = function() {
    throw new Error("Documents the interface only.");
};

/**
 * Returns the number of passes required to render the data.  Most renderers
 * will require only one pass through the data, but there are some cases where
 * two or more passes are required.
 * 
 * @returns {!number}
 */
jsfc.XYRenderer.prototype.passCount = function() {
};

/**
 * Draws one data item in "immediate" mode.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} dataArea
 * @param {!jsfc.XYPlot} plot
 * @param {!jsfc.XYDataset} dataset
 * @param {!number} seriesIndex
 * @param {!number} itemIndex
 * @param {!number} pass
 * @returns {undefined}
 */
jsfc.XYRenderer.prototype.drawItem = function(ctx, dataArea, plot, 
        dataset, seriesIndex, itemIndex, pass) {
};

/**
 * Creates a new plot for the specified dataset.
 * 
 * @class A CategoryPlot is a two-dimensional plot where the x-axis is ordinal
 * and the y-axis is numerical (for example, a typical bar chart).
 * 
 * @constructor 
 * @param {!jsfc.Values2DDataset} dataset  the dataset (required).
 * @returns {jsfc.CategoryPlot}
 */
jsfc.CategoryPlot = function(dataset) {
    if (!(this instanceof jsfc.CategoryPlot)) {
        throw new Error("Use 'new' for construction.");
    }
    this._listeners = [];
    this._plotBackground = null;
    this._dataBackground = new jsfc.StandardRectanglePainter(
            new jsfc.Color(230, 230, 230), new jsfc.Color(0, 0, 0, 0));
    
    this._renderer = new jsfc.BarRenderer(this);
    this._rendererListener = function(p) {
        var plot = p;
        return function(renderer) {
            plot.rendererChanged(renderer);
        };
    }(this);
    
    this._axisOffsets = new jsfc.Insets(0, 0, 0, 0);
    this._xAxis = new jsfc.StandardCategoryAxis();
    this._xAxisPosition = jsfc.RectangleEdge.BOTTOM;
    this._xAxis.configureAsXAxis(this);
    this._xAxisListener = function(p) {
        var plot = p;
        return function(axis) {
            axis.configureAsXAxis(plot);
            plot.notifyListeners();
        };
    }(this);
    this._xAxis.addListener(this._xAxisListener);
    
    this._yAxis = new jsfc.LinearAxis();
    this._yAxis.setAutoRangeIncludesZero(true);
    this._yAxisPosition = jsfc.RectangleEdge.LEFT;
    this._yAxis.configureAsYAxis(this);
    this._yAxisListener = function(p) {
        var plot = p;
        return function(axis) {
            if (axis.isAutoRange()) {
                axis.configureAsYAxis(plot);    
            }
            plot.notifyListeners();
        };
    }(this);
    this._yAxis.addListener(this._yAxisListener);
    this.setDataset(dataset);
    this.itemLabelGenerator = new jsfc.KeyedValue2DLabels();      
};

/**
 * Returns the dataset.
 * 
 * @returns {jsfc.KeyedValues2DDataset} The category dataset.
 */
jsfc.CategoryPlot.prototype.getDataset = function() {
    return this._dataset;
};

/**
 * Sets the dataset for the plot and sends a change notification to
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {!jsfc.Values2DDataset} dataset  the new dataset.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.setDataset = function(dataset, notify) {
    if (this._datasetListener) {
        this._dataset.removeListener(this._datasetListener);
    }
    this._dataset = dataset;
    
    // keep a reference to the listener so we can deregister it when changing
    // the dataset
    this._datasetListener = function(plot) {
        var me = plot;
        return function(dataset) {
            me.datasetChanged();
        };
    }(this);
    this._dataset.addListener(this._datasetListener);
    
    // reconfigure the axes
    this._xAxis.configureAsXAxis(this);
    this._yAxis.configureAsYAxis(this);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the background painter for the plot.  The default value is 
 * 'undefined' (which means that no background is painted for the plot - the
 * chart background color will be visible).
 * 
 * @returns {jsfc.RectanglePainter} The background painter.
 */
jsfc.CategoryPlot.prototype.getBackground = function() {
    return this._plotBackground;
};

/**
 * Sets the background painter and sends a change event to registered listeners
 * (unless 'notify' is set to false).
 * 
 * @param {jsfc.RectanglePainter} painter  the painter.
 * @param {boolean} [notify]  notify listeners? (the default is true).
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.setBackground = function(painter, notify) {
    this._plotBackground = painter;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Sets the background color for the plot and sends a change notification to 
 * all registered listeners.
 * 
 * @param {jsfc.Color} color  the new color.
 * @param {boolean} [notify]  notify listeners? (the default is true).
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.setBackgroundColor = function(color, notify) {
    var painter = new jsfc.StandardRectanglePainter(color, null);
    this.setBackground(painter, notify);
};

/**
 * Returns the background painter for the data area.
 * 
 * @returns {jsfc.RectanglePainter} The painter.
 */
jsfc.CategoryPlot.prototype.getDataBackground = function() {
    return this._dataBackground;
};

/**
 * Sets the background painter for the data area and sends a change event to 
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.RectanglePainter} painter  the painter.
 * @param {boolean} [notify]  notify listeners? (the default is true).
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.setDataBackground = function(painter, notify) {
    this._dataBackground = painter;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Sets the background color for the data area and sends a change 
 * notification to all registered listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.Color} color  the new color.
 * @param {boolean} [notify]  notify listeners? (the default is true).
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.setDataBackgroundColor = function(color, notify) {
    var painter = new jsfc.StandardRectanglePainter(color, null);
    this.setDataBackground(painter, notify);
};

/**
 * Returns the renderer.
 * 
 * @returns {jsfc.CategoryRenderer}
 */
jsfc.CategoryPlot.prototype.getRenderer = function() {
    return this._renderer;
};

/**
 * Sets the renderer and sends a change notification to all registered 
 * listeners (unless 'notify' is set to false).
 * 
 * @param {Object} renderer  the new renderer.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.setRenderer = function(renderer, notify) {
    this._renderer.removeListener(this._rendererListener);
    this._renderer = renderer;
    this._renderer.addListener(this._rendererListener);
    // reconfigure the axes
    this._xAxis.configureAsXAxis(this);
    this._yAxis.configureAsYAxis(this);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Handles changes to the dataset (this method is called by the dataset 
 * change listener, you don't normally need to call this directly).
 * 
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.datasetChanged = function() {
    this._xAxis.configureAsXAxis(this); 

    // if the y-axis is auto-range, then update the range
    if (this._yAxis.isAutoRange()) {
        this._yAxis.configureAsYAxis(this); 
    }
    // notify listeners that the plot has changed
    this.notifyListeners();
};

/**
 * Handles a change to the renderer.  The change could be a property change 
 * (for example a new series color) or a completely new renderer (switching
 * from a bar renderer to a stacked bar renderer would require the axis ranges
 * to be updated).
 * 
 * @param {jsfc.CategoryRenderer} renderer  the renderer.
 * 
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.rendererChanged = function(renderer) {
    this._xAxis.configureAsXAxis(this); 

    // if the y-axis is auto-range, then update the range
    if (this._yAxis.isAutoRange()) {
        this._yAxis.configureAsYAxis(this); 
    }
    // notify listeners that the plot has changed
    this.notifyListeners();    
};

/**
 * Returns the axis offsets (the gap between the data area and the axis line).
 * The default is Insets(0, 0, 0, 0).
 * 
 * @returns {jsfc.Insets} The axis offsets.
 */
jsfc.CategoryPlot.prototype.getAxisOffsets = function() {
    return this._axisOffsets;
};

/**
 * Sets the axis offsets and sends a change notification to all registered
 * listeners (unless 'notify' is false).
 * 
 * @param {jsfc.Insets} offsets  the new offsets.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.setAxisOffsets = function(offsets, notify) {
    this._axisOffsets = offsets;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the x-axis for the plot.
 * 
 * @returns {!jsfc.CategoryAxis}
 */
jsfc.CategoryPlot.prototype.getXAxis = function() {
    return this._xAxis;
};

/**
 * Sets the x-axis and sends a change notification to registered listeners
 * (unless 'notify' is set to false).
 * 
 * @param {!jsfc.CategoryAxis} axis  the new axis.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.setXAxis = function(axis, notify) {
    this._xAxis.removeListener(this._xAxisListener);
    this._xAxis = axis;
    this._xAxis.addListener(this._xAxisListener);
    this._xAxis.configureAsXAxis(this);
    if (notify !== false) {
        this.notifyListeners();
    }  
};

/**
 * Returns the position of the x-axis (either "TOP" or "BOTTOM", see the
 * values defined in jsfc.RectangleEdge).
 * 
 * @returns {String} The position.
 */
jsfc.CategoryPlot.prototype.getXAxisPosition = function() {
    return this._xAxisPosition;
};

/**
 * Sets the x-axis position and sends a change notification to all registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {String} edge  the edge ("TOP" or "BOTTOM").
 * @param {boolean} [notify] notify listeners? (the default is true).
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.setXAxisPosition = function(edge, notify) {
    this.xAxisPosition = edge;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the y-axis for the plot.
 * 
 * @returns {jsfc.ValueAxis}
 */
jsfc.CategoryPlot.prototype.getYAxis = function() {
    return this._yAxis;
};

/**
 * Sets the y-axis and sends a change notification to registered listeners
 * (unless 'notify' is set to false).
 * 
 * @param {!jsfc.ValueAxis} axis  the new axis.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.setYAxis = function(axis, notify) {
    this._yAxis.removeListener(this._yAxisListener);
    this._yAxis = axis;
    this._yAxis.addListener(this._yAxisListener);
    this._yAxis.configureAsYAxis(this);
    if (notify !== false) {
        this.notifyListeners();
    }  
};

/**
 * Returns the position of the y-axis (either "LEFT" or "RIGHT", see the
 * values defined in jsfc.RectangleEdge).
 * 
 * @returns {String} The position.
 */
jsfc.CategoryPlot.prototype.getYAxisPosition = function() {
    return this._yAxisPosition;
};

/**
 * Sets the y-axis position and sends a change notification to all registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {String} edge  the edge ("TOP" or "BOTTOM").
 * @param {boolean} [notify] notify listeners? (the default is true).
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.setYAxisPosition = function(edge, notify) {
    this.yAxisPosition = edge;
    if (notify !== false) {
        this.notifyListeners();
    }
};

jsfc.CategoryPlot.prototype.isYZoomable = function() {
    return true;  // later we could allow the user to set this
};

/**
 * Performs a zoom (in or out) on the x-axis about the specified anchor point
 * (which is a coordinate from document space).
 * 
 * @param {number} factor  the zoom factor.
 * @param {number} anchor  the anchor point (in document space).
 * @param {boolean} [notify]  notify listeners? (optional).
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.zoomXAboutAnchor = function(factor, anchor, notify) {
    // convert anchor to an axis value
    var x0 = this._dataArea.minX();
    var x1 = this._dataArea.maxX();
    var anchorX = this._xAxis.coordinateToValue(anchor, x0, x1);
    this._xAxis.resizeRange(factor, anchorX, notify !== false);
};

jsfc.CategoryPlot.prototype.zoomX = function(lowpc, highpc, notify) {
    this._xAxis.setBoundsByPercent(lowpc, highpc, notify);    
};

/**
 * Performs a zoom (in or out) on the y-axis about the specified anchor point
 * (which is a coordinate from document space).
 * 
 * @param {number} factor  the zoom factor.
 * @param {number} anchor  the anchor point (in document space).
 * @param {boolean} [notify]  notify listeners? (optional).
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.zoomYAboutAnchor = function(factor, anchor, notify) {
    // convert anchor to an axis value
    var y0 = this._dataArea.minY();
    var y1 = this._dataArea.maxY();
    var anchorY = this._yAxis.coordinateToValue(anchor, y1, y0);
    this._yAxis.resizeRange(factor, anchorY, notify !== false);
};

jsfc.CategoryPlot.prototype.zoomY = function(lowpc, highpc, notify) {
    this._yAxis.setBoundsByPercent(lowpc, highpc, notify);    
};

/**
 * Slides the x-axis values (up or down) by the specified percentage and
 * notifies registered listeners (unless 'notify' is set to false).
 * 
 * @param {number} percent  the percentage.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.panX = function(percent, notify) {
    this._xAxis.pan(percent, notify !== false);
};

/**
 * Slides the x-axis values (up or down) by the specified percentage and
 * notifies registered listeners (unless 'notify' is set to false).
 * 
 * @param {number} percent  the percentage.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.panY = function(percent, notify) {
    this._yAxis.pan(percent, notify !== false);    
};

/**
 * Registers a listener to receive notification of changes to the plot.  The
 * listener is a function - it will be passed one argument (this plot).
 * 
 * @param {Function} f  the listener function.
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.addListener = function(f) {
    this._listeners.push(f);  
};

/**
 * Notify each listener function that this plot has changed.
 * 
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.notifyListeners = function() {
    var plot = this;
    this._listeners.forEach(function(f) {
        f(plot);
    });
};

/**
 * Draws the plot on a 2D rendering context.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} bounds  the chart bounds.
 * @param {!jsfc.Rectangle} plotArea  the area for drawing the plot.
 * @returns {undefined}
 */
jsfc.CategoryPlot.prototype.draw = function(ctx, bounds, plotArea) {
    
    // fill the plot background if there is one (very often this is not defined
    // so that the chart background shows through, and note that there is also
    // a 'dataBackground' painter that is used for the area inside the axes).
    if (this._plotBackground) {
        this._plotBackground.paint(ctx, plotArea);
    }

    // compute the data area by getting the space required for the axes
    var space = new jsfc.AxisSpace(0, 0, 0, 0);
    var edge = this.axisPosition(this._xAxis);
    var xspace = this._xAxis.reserveSpace(ctx, this, bounds, plotArea, edge);
    space.extend(xspace, edge);
    
    var adjArea = space.innerRect(plotArea);
    edge = this.axisPosition(this._yAxis);
    var yspace = this._yAxis.reserveSpace(ctx, this, bounds, adjArea, edge);
    space.extend(yspace, edge);
    
    this._dataArea = space.innerRect(plotArea);
    if (this._dataBackground) {
        this._dataBackground.paint(ctx, this._dataArea);
    }
    this.drawAxes(ctx, bounds, this._dataArea);    

    ctx.setHint("clip", this._dataArea);
    ctx.setHint("glass", this._dataArea);
    ctx.beginGroup("dataArea");
    // get the renderer to draw the data points - this may involve multiple
    // passes through the data
    var passCount = this._renderer.passCount();
    for (var pass = 0; pass < passCount; pass++) {
        for (var r = 0; r < this._dataset.rowCount(); r++) {
            for (var c = 0; c < this._dataset.columnCount(); c++) {
                this._renderer.drawItem(ctx, this._dataArea, this, 
                        this._dataset, r, c, pass);
            }
        }
    }
    ctx.endGroup();
};

/**
 * Returns the data area from the most recent rendering of the plot.
 * 
 * @returns {jsfc.Rectangle}
 */
jsfc.CategoryPlot.prototype.dataArea = function() { 
    return this._dataArea;
};

jsfc.CategoryPlot.prototype.drawAxes = function(ctx, bounds, dataArea) {
    var offset = this._axisOffsets.value(this._xAxisPosition);
    this._xAxis.draw(ctx, this, bounds, dataArea, offset);
    offset = this._axisOffsets.value(this._yAxisPosition);
    this._yAxis.draw(ctx, this, bounds, dataArea, offset);
};

/**
 * Returns the edge location of the specified axis.
 * @param {jsfc.ValueAxis|jsfc.CategoryAxis} axis  the axis.
 * @returns {string} The axis position (refer to jsfc.RectangleEdge).
 */
jsfc.CategoryPlot.prototype.axisPosition = function(axis) {
    if (axis === this._xAxis) {
        return this._xAxisPosition;
    } else if (axis === this._yAxis) {
        return this._yAxisPosition;
    }
    throw new Error("The axis does not belong to this plot.");
};

/**
 * Returns a list of jsfc.LegendItemInfo objects for the plot.  
 * 
 * @returns {Array}
 */
jsfc.CategoryPlot.prototype.legendInfo = function() {
    var info = [];
    var plot = this;
    this._dataset.rowKeys().forEach(function(key) {
        var dataset = plot._dataset;
        var index = dataset.rowIndex(key);
        var color = plot._renderer.getLineColorSource().getLegendColor(index);
        var item = new jsfc.LegendItemInfo(key, color);
        item.label = key;
        info.push(item);
    });
    return info;
};
/**
 * Creates a new plot for the specified dataset.
 * 
 * @class An XYPlot is a two-dimensional plot where both the x and y axes are
 * numerical.
 * 
 * @constructor 
 * @param {!jsfc.XYDataset} dataset  the dataset (null not permitted).
 * @returns {jsfc.XYPlot}
 */
jsfc.XYPlot = function(dataset) {
    if (!(this instanceof jsfc.XYPlot)) {
        throw new Error("Use 'new' for construction.");
    }
    this._listeners = [];
    this._notify = true;
    this._plotBackground = null;
    this._dataBackground = new jsfc.StandardRectanglePainter(
            new jsfc.Color(230, 230, 230), new jsfc.Color(0, 0, 0, 0));
    this._dataArea = new jsfc.Rectangle(0, 0, 0, 0);
    this._renderer = new jsfc.ScatterRenderer(this);
    this._axisOffsets = new jsfc.Insets(0, 0, 0, 0);
    this._xAxis = new jsfc.LinearAxis();
    this._xAxisPosition = jsfc.RectangleEdge.BOTTOM;
    this._xAxis.configureAsXAxis(this);
    this._xAxisListener = function(p) {
        var plot = p;
        return function(axis) {
            if (axis.isAutoRange()) {
                axis.configureAsXAxis(plot);    
            }
            plot.notifyListeners();
        };
    }(this);
    this._xAxis.addListener(this._xAxisListener);
    
    this._yAxis = new jsfc.LinearAxis();
    this._yAxisPosition = jsfc.RectangleEdge.LEFT;
    this._yAxis.configureAsYAxis(this);
    this._yAxisListener = function(p) {
        var plot = p;
        return function(axis) {
            if (axis.isAutoRange()) {
                axis.configureAsYAxis(plot);    
            }
            plot.notifyListeners();
        };
    }(this);
    this._yAxis.addListener(this._yAxisListener);
    this.setDataset(dataset);
    
    this._staggerRendering = false;
    this._drawMS = 150; // milliseconds on then off
    this._pauseMS = 100;
    this._staggerID = null; // id of setTimeout so we can cancel if necessary
    this._progressColor1 = new jsfc.Color(100, 100, 200, 200);
    this._progressColor2 = new jsfc.Color(100, 100, 100, 100);
    this._progressLabelFont = new jsfc.Font("sans-serif", 12);
    this._progressLabelColor = jsfc.Colors.WHITE;
    this._progressLabelFormatter = new jsfc.NumberFormat(0);
};

/**
 * Returns the dataset.
 * 
 * @returns {!jsfc.XYDataset} The XY dataset (never null).
 */
jsfc.XYPlot.prototype.getDataset = function() {
    return this._dataset;
};

/**
 * Sets the dataset for the plot and sends a change notification to 
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {!jsfc.XYDataset} dataset  the new dataset (null not permitted).
 * @param {boolean} [notify]  notify listeners? (the default is true).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setDataset = function(dataset, notify) {
    if (this._datasetListener) {
        this._dataset.removeListener(this._datasetListener);
    }
    this._dataset = dataset;
    
    // keep a reference to the listener so we can deregister it when changing
    // the dataset
    this._datasetListener = function(plot) {
        var me = plot;
        return function(dataset) {
            me.datasetChanged();
        };
    }(this);
    this._dataset.addListener(this._datasetListener);
    
    // reconfigure the axes
    this._xAxis.configureAsXAxis(this);
    this._yAxis.configureAsYAxis(this);
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the background painter for the plot.  The default value is 
 * 'undefined' (which means that no background is painted for the plot - the
 * chart background color will be visible).
 * 
 * @returns {jsfc.RectanglePainter} The background painter.
 */
jsfc.XYPlot.prototype.getBackground = function() {
    return this._plotBackground;
};

/**
 * Sets the background painter and sends a change event to registered listeners
 * (unless 'notify' is set to false).
 * 
 * @param {jsfc.RectanglePainter} painter  the painter.
 * @param {boolean} [notify]  notify listeners? (the default is true).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setBackground = function(painter, notify) {
    this._plotBackground = painter;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Sets the background color for the plot and sends a change notification to 
 * all registered listeners.
 * 
 * @param {jsfc.Color} color  the new color.
 * @param {boolean} [notify]  notify listeners? (the default is true).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setBackgroundColor = function(color, notify) {
    var painter = new jsfc.StandardRectanglePainter(color, null);
    this.setBackground(painter, notify);
};

/**
 * Returns the background painter for the data area.
 * 
 * @returns {jsfc.RectanglePainter} The painter.
 */
jsfc.XYPlot.prototype.getDataBackground = function() {
    return this._dataBackground;
};

/**
 * Sets the background painter for the data area and sends a change event to 
 * registered listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.RectanglePainter} painter  the painter.
 * @param {boolean} [notify]  notify listeners? (the default is true).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setDataBackground = function(painter, notify) {
    this._dataBackground = painter;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Sets the background color for the data area and sends a change 
 * notification to all registered listeners (unless 'notify' is set to false).
 * 
 * @param {jsfc.Color} color  the new color.
 * @param {boolean} [notify]  notify listeners? (the default is true).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setDataBackgroundColor = function(color, notify) {
    var painter = new jsfc.StandardRectanglePainter(color, null);
    this.setDataBackground(painter, notify);
};

/**
 * Returns the renderer.
 * @returns {jsfc.XYRenderer}
 */
jsfc.XYPlot.prototype.getRenderer = function() {
    return this._renderer;
};

/**
 * Returns the flag that controls whether or not rendering is staggered (the
 * default value is false).
 * Staggered rendering will draw the chart in chunks with a pause in between
 * each chunk to allow the browser to process user events.
 * 
 * @returns {!boolean}
 */
jsfc.XYPlot.prototype.getStaggerRendering = function() {
    return this._staggerRendering;
};

/**
 * Sets the flag that controls whether or not rendering is staggered and sends
 * a change notification to all registered listeners.
 * 
 * @param {!boolean} stagger
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setStaggerRendering = function(stagger) {
    this._staggerRendering = stagger;
    this.notifyListeners(); 
};

/**
 * Returns the number of milliseconds that the renderer aims to spend 
 * drawing each chunk.  The default value is 150.
 * 
 * @returns {!number}
 */
jsfc.XYPlot.prototype.getDrawMillis = function() {
    return this._drawMS;
};

/**
 * Sets the number of milliseconds as the target for each chunk when staggered
 * rendering is being used.
 * 
 * @param {!number} ms  the number of milliseconds.
 * 
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setDrawMillis = function(ms) {
    this._drawMS = ms;
};

/**
 * Returns the number of milliseconds to pauses after drawing each chunk.  The 
 * default value is 100.
 * 
 * @returns {!number}
 */
jsfc.XYPlot.prototype.getPauseMillis = function() {
    return this._pauseMS;
};

/**
 * Sets the number of milliseconds to pause after drawing each chunk when 
 * staggered rendering is being used.
 * 
 * @param {!number} ms  the number of milliseconds.
 * 
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setPauseMillis = function(ms) {
    this._pauseMS = ms;
};

jsfc.XYPlot.prototype.getProgressColor1 = function() {
    return this._progressColor1;
};

jsfc.XYPlot.prototype.setProgressColor1 = function(color) {
    this._progressColor1 = color;
};
jsfc.XYPlot.prototype.getProgressColor2 = function() {
    return this._progressColor2;
};

jsfc.XYPlot.prototype.setProgressColor2 = function(color) {
    this._progressColor2 = color;
};

jsfc.XYPlot.prototype.getProgressLabelFont = function() {
    return this._progressLabelFont;
};
jsfc.XYPlot.prototype.setProgressLabelFont = function(font) {
    this._progressLabelFont = font;
};
jsfc.XYPlot.prototype.getProgressLabelColor = function() {
    return this._progressLabelColor;
};
jsfc.XYPlot.prototype.setProgressLabelColor = function(color) {
    this._progressLabelColor = color;
};

jsfc.XYPlot.prototype.getProgressLabelFormatter = function() {
    return this._progressLabelFormatter;
};
jsfc.XYPlot.prototype.setProgressLabelFormatter = function(formatter) {
    this._progressLabelFormatter = formatter;
};

/**
 * Handles changes to the dataset (this method is called by the dataset 
 * change listener, you don't normally need to call this directly).
 * 
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.datasetChanged = function() {
    // if the x-axis is auto-range, then update the range
    if (this._xAxis.isAutoRange()) {
        this._xAxis.configureAsXAxis(this); 
    }
    // if the y-axis is auto-range, then update the range
    if (this._yAxis.isAutoRange()) {
        this._yAxis.configureAsYAxis(this); 
    }
    // notify listeners that the plot has changed
    this.notifyListeners();
};

/**
 * Returns the axis offsets (the gap between the data area and the axis line).
 * The default is Insets(0, 0, 0, 0).
 * 
 * @returns {jsfc.Insets} The axis offsets.
 */
jsfc.XYPlot.prototype.getAxisOffsets = function() {
    return this._axisOffsets;
};

/**
 * Sets the axis offsets and sends a change notification to all registered
 * listeners (unless 'notify' is false).
 * 
 * @param {jsfc.Insets} offsets  the new offsets.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setAxisOffsets = function(offsets, notify) {
    this._axisOffsets = offsets;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Returns the x-axis for the plot.
 * 
 * @returns {!jsfc.ValueAxis}
 */
jsfc.XYPlot.prototype.getXAxis = function() {
    return this._xAxis;
};

/**
 * Sets the x-axis and sends a change notification to registered listeners
 * (unless 'notify' is set to false).
 * 
 * @param {!jsfc.ValueAxis} axis  the new axis.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setXAxis = function(axis, notify) {
    this._xAxis.removeListener(this._xAxisListener);
    this._xAxis = axis;
    this._xAxis.addListener(this._xAxisListener);
    this._xAxis.configureAsXAxis(this);
    if (notify !== false) {
        this.notifyListeners();
    }  
};

/**
 * Returns the position of the x-axis (either "TOP" or "BOTTOM", see the
 * values defined in jsfc.RectangleEdge).
 * 
 * @returns {String} The position.
 */
jsfc.XYPlot.prototype.getXAxisPosition = function() {
    return this._xAxisPosition;
};

/**
 * Sets the x-axis position and sends a change notification to all registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {String} edge  the edge ("TOP" or "BOTTOM").
 * @param {boolean} [notify] notify listeners? (the default is true).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setXAxisPosition = function(edge, notify) {
    this.xAxisPosition = edge;
    if (notify !== false) {
        this.notifyListeners();
    }
};

jsfc.XYPlot.prototype.isXZoomable = function() { 
    return true;  // later we could allow the user to set this
};

/**
 * Returns the y-axis for the plot.
 * 
 * @returns {jsfc.ValueAxis}
 */
jsfc.XYPlot.prototype.getYAxis = function() {
    return this._yAxis;
};

/**
 * Sets the y-axis and sends a change notification to registered listeners
 * (unless 'notify' is set to false).
 * 
 * @param {!jsfc.ValueAxis} axis  the new axis.
 * @param {boolean} [notify]  notify listeners? (defaults to true).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setYAxis = function(axis, notify) {
    this._yAxis.removeListener(this._yAxisListener);
    this._yAxis = axis;
    this._yAxis.addListener(this._yAxisListener);
    this._yAxis.configureAsYAxis(this);
    if (notify !== false) {
        this.notifyListeners();
    }  
};

/**
 * Returns the position of the y-axis (either "LEFT" or "RIGHT", see the
 * values defined in jsfc.RectangleEdge).
 * 
 * @returns {String} The position.
 */
jsfc.XYPlot.prototype.getYAxisPosition = function() {
    return this._yAxisPosition;
};

/**
 * Sets the y-axis position and sends a change notification to all registered
 * listeners (unless 'notify' is set to false).
 * 
 * @param {String} edge  the edge ("TOP" or "BOTTOM").
 * @param {boolean} [notify] notify listeners.
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setYAxisPosition = function(edge, notify) {
    this.yAxisPosition = edge;
    if (notify !== false) {
        this.notifyListeners();
    }
};

jsfc.XYPlot.prototype.isYZoomable = function() {
    return true;  // later we could allow the user to set this
};

/**
 * Performs a zoom (in or out) on the x-axis about the specified anchor point
 * (which is a coordinate from document space).
 * 
 * @param {number} factor  the zoom factor.
 * @param {number} anchor  the anchor point (in document space).
 * @param {boolean} [notify]  notify listeners? (optional).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.zoomXAboutAnchor = function(factor, anchor, notify) {
    // convert anchor to an axis value
    var x0 = this._dataArea.minX();
    var x1 = this._dataArea.maxX();
    var anchorX = this._xAxis.coordinateToValue(anchor, x0, x1);
    this._xAxis.resizeRange(factor, anchorX, notify !== false);
};

jsfc.XYPlot.prototype.zoomX = function(lowpc, highpc, notify) {
    this._xAxis.setBoundsByPercent(lowpc, highpc, notify);    
};

/**
 * Performs a zoom (in or out) on the y-axis about the specified anchor point
 * (which is a coordinate from document space).
 * 
 * @param {number} factor  the zoom factor.
 * @param {number} anchor  the anchor point (in document space).
 * @param {boolean} [notify]  notify listeners? (optional).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.zoomYAboutAnchor = function(factor, anchor, notify) {
    // convert anchor to an axis value
    var y0 = this._dataArea.minY();
    var y1 = this._dataArea.maxY();
    var anchorY = this._yAxis.coordinateToValue(anchor, y1, y0);
    this._yAxis.resizeRange(factor, anchorY, notify !== false);
};

jsfc.XYPlot.prototype.zoomY = function(lowpc, highpc, notify) {
    this._yAxis.setBoundsByPercent(lowpc, highpc, notify);    
};

/**
 * Slides the x-axis values (up or down) by the specified percentage and
 * notifies registered listeners (unless 'notify' is set to false).
 * 
 * @param {number} percent  the percentage.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.panX = function(percent, notify) {
    this._xAxis.pan(percent, notify !== false);
};

/**
 * Slides the x-axis values (up or down) by the specified percentage and
 * notifies registered listeners (unless 'notify' is set to false).
 * 
 * @param {number} percent  the percentage.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.panY = function(percent, notify) {
    this._yAxis.pan(percent, notify !== false);    
};

/**
 * Sets the renderer and sends a change notification to all registered 
 * listeners (unless 'notify' is set to false).
 * 
 * @param {Object} renderer  the new renderer.
 * @param {boolean} [notify]  notify listeners?
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setRenderer = function(renderer, notify) {
    this._renderer = renderer;
    if (notify !== false) {
        this.notifyListeners();
    }
};

/**
 * Draws the plot on a 2D rendering context (such as the HTML5 canvas). This
 * provides an alternative rendering approach.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} bounds  the chart bounds.
 * @param {!jsfc.Rectangle} plotArea  the area for drawing the plot.
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.draw = function(ctx, bounds, plotArea) {
    
    if (this._staggerID) {
        clearTimeout(this._staggerID);
        ctx.setHint("layer", "progress");
        ctx.clear();
        ctx.setHint("layer", "default");
    }
    // fill the plot background if there is one (very often this is not defined
    // so that the chart background shows through, and note that there is also
    // a 'dataBackground' painter that is used for the area inside the axes).
    if (this._plotBackground) {
        this._plotBackground.paint(ctx, plotArea);
    }

    // compute the data area by getting the space required for the axes
    var space = new jsfc.AxisSpace(0, 0, 0, 0);
    var edge = this.axisPosition(this._xAxis);
    var xspace = this._xAxis.reserveSpace(ctx, this, bounds, plotArea, edge);
    space.extend(xspace, edge);
    
    var adjArea = space.innerRect(plotArea);
    edge = this.axisPosition(this._yAxis);
    var yspace = this._yAxis.reserveSpace(ctx, this, bounds, adjArea, edge);
    space.extend(yspace, edge);
    
    this._dataArea = space.innerRect(plotArea);
    if (this._dataBackground) {
        this._dataBackground.paint(ctx, this._dataArea);
    }
    this.drawAxes(ctx, bounds, this._dataArea);    

    
    // get the renderer to draw the data points - this may involve multiple
    // passes through the data
    if (this._staggerRendering) {
        this._renderDataItemsByChunks(ctx);
    } else {
        this._renderAllDataItems(ctx);
    }
};

/**
 * Render all the data items at once.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @returns {undefined}
 */
jsfc.XYPlot.prototype._renderAllDataItems = function(ctx) {
    // for SVG we are setting the clip via hints
    ctx.setHint("clip", this._dataArea);
    ctx.setHint("glass", this._dataArea);
    ctx.beginGroup("dataArea");
    ctx.save();
    ctx.setClip(this._dataArea);
    var passCount = this._renderer.passCount();
    for (var pass = 0; pass < passCount; pass++) {
        for (var s = 0; s < this._dataset.seriesCount(); s++) {
            for (var i = 0; i < this._dataset.itemCount(s); i++) {
                this._renderer.drawItem(ctx, this._dataArea, this, 
                        this._dataset, s, i, pass);
            }
        }
    }    
    ctx.restore();
    ctx.endGroup();
};

/**
 * Renders the data items in multiple chunks, pausing between each chunk to 
 * allow the browser to process user events.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @returns {undefined}
 */
jsfc.XYPlot.prototype._renderDataItemsByChunks = function(ctx) {
    var chunkSize = 200;  // we could ask the renderer for a default, so that if
        // a renderer does something complex, it could suggest a lower number
        
    // if we have a small number of items, just go for regular rendering
    var itemCount = jsfc.XYDatasetUtils.itemCount(this._dataset);
    if (itemCount <= chunkSize * 2) {
        this._renderAllDataItems(ctx);
        return;
    }
    var cursor = {"series": 0, "item": 0};
    // first chunk is drawn immediately
    this._processChunk(ctx, this, chunkSize * 2, cursor);
    // remaining chunks are staggered
    this._processChunkAndSubmitAnother(ctx, this, chunkSize, cursor);

};

/**
 * Renders a chunk of data items starting from the item designated by the 
 * cursor.
 * @param {!jsfc.XYPlot} plot
 * @param {!jsfc.Context2D} ctx  the graphics context (null not permitted).
 * @param {!number} chunkSize  the chunk size (number of data items).
 * @param {!Object} cursor  the cursor.
 * @returns {undefined}
 */
jsfc.XYPlot.prototype._processChunk = function(ctx, plot, chunkSize, cursor) {
    ctx.setHint("clip", this._dataArea);
    ctx.setHint("glass", this._dataArea);
    ctx.beginGroup("chunk");
    var dataset = plot.getDataset();
    var moreItems = true;
    for (var i = 0; i < chunkSize && moreItems; i++) {
        plot._renderer.drawItem(ctx, plot._dataArea, plot, 
                dataset, cursor.series, cursor.item, 0);
        moreItems = plot._advanceCursor(cursor, dataset);
    }  
    ctx.endGroup();
};

/**
 * Processes one chunk of data items then submits a job to process the next 
 * chunk after a short delay.
 * 
 * @param {!jsfc.Context2D} ctx
 * @param {!jsfc.XYPlot} plot
 * @param {!number} chunkSize  the number of data items to process in each chunk
 * @param {!Object} cursor  pointer to the current data item.
 * @returns {undefined}
 */
jsfc.XYPlot.prototype._processChunkAndSubmitAnother = function(ctx, plot, 
        chunkSize, cursor) {
    
    var f = function(plot, ctx, chunkSize, cursor) {
        return function() {
            var start = Date.now();
            plot._processChunk(ctx, plot, chunkSize, cursor);
            var elapsed = Date.now() - start;
            // if there is more to do, call plot._processChunkAndSubmitAnother
            if (cursor.series !== plot._dataset.seriesCount()) {
                chunkSize = chunkSize * (plot._drawMS / elapsed);
                plot._processChunkAndSubmitAnother(ctx, plot, chunkSize, cursor);
            } else {
                ctx.setHint("layer", "progress");
                ctx.clear();
                ctx.setHint("layer", "default");
            }
        };
    };
    this._staggerID = setTimeout(f(plot, ctx, chunkSize, cursor), 
            plot._pauseMS);
    
    // switch to the "progress" layer and draw a progress indicator
    this._drawProgressIndicator(ctx, plot.dataArea(), cursor, plot.getDataset());
    
};

/**
 * Draws a progress indicator for the render-by-chunk process.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} area  the data area.
 * @param {!Object} cursor  the cursor (has 'series' and 'item' properties).
 * @param {!jsfc.XYDataset} dataset  the dataset (required to calculate the
 *         number of items *before* the cursor (that is, already processed).
 * @returns {undefined}
 */
jsfc.XYPlot.prototype._drawProgressIndicator = function(ctx, area, cursor, 
        dataset) {
    ctx.setHint("layer", "progress");
    ctx.clear();
    var itemCount = jsfc.XYDatasetUtils.itemCount(this._dataset);
    var processed = this._itemsProcessed(cursor, this._dataset);
    var x = area.centerX();
    var y = area.maxY() - (0.1 * area.height());
    var width = area.width() / 1.2;
    var height = this._progressLabelFont.size + 4;
    var percent = processed / itemCount;
    var x0 = x - width / 2;
    var y0 = y - height / 2;
    var x1 = x + width / 2;
    var px = x0 + (width * percent);
    ctx.setFillColor(this._progressColor1);
    ctx.fillRect(x0, y0, px - x0, height);
    ctx.setFillColor(this._progressColor2);
    ctx.fillRect(px, y0, x1 - px, height);
    ctx.setFillColor(this._progressLabelColor);
    ctx.setFont(this._progressLabelFont);
    var text = this._progressLabelFormatter.format(percent * 100) + "%";
    ctx.drawAlignedString(text, x, y0, jsfc.TextAnchor.TOP_CENTER);
    ctx.setHint("layer", "default");    
};

/**
 * Calculates the number of data items that precede the cursor.
 * 
 * @param {!Object} cursor  the cursor.
 * @param {!jsfc.XYDataset} dataset  the dataset.
 * @returns {!number} The number of items that precede the item that the cursor 
 *     is pointing to.
 */
jsfc.XYPlot.prototype._itemsProcessed = function(cursor, dataset) {   
    var result = cursor.item;
    for (var s = 0 ; s < cursor.series; s++) {
        result += dataset.itemCount(s);
    }
    return result;
};

/**
 * Advances the cursor to the next item in the dataset, returning true if 
 * the cursor is advanced and false if the cursor was already pointing at the
 * last item in the dataset.
 * 
 * @param {Object} cursor
 * @param {!jsfc.XYDataset} dataset
 * @returns {!boolean}
 */
jsfc.XYPlot.prototype._advanceCursor = function(cursor, dataset) {
    var itemCount = dataset.itemCount(cursor.series);
    if (cursor.item === itemCount - 1) {
        var seriesCount = dataset.seriesCount();
        if (cursor.series === seriesCount - 1) {
            cursor.series++;
            return false;
        } else {
            cursor.series++;
            cursor.item = 0;
            return true;
        }
    } else {
        cursor.item++;
        return true;
    }
};

/**
 * Returns the data area from the most recent rendering of the plot.  If the
 * plot has never been rendered, this method will return a rectangle with
 * zero width and height.
 * 
 * @returns {!jsfc.Rectangle} The data area (never null).
 */
jsfc.XYPlot.prototype.dataArea = function() { 
    return this._dataArea;
};

/**
 * Draws the plot's axes around the specified dataArea.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Rectangle} bounds  the bounds.
 * @param {!jsfc.Rectangle} dataArea  the data area.
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.drawAxes = function(ctx, bounds, dataArea) {
    var offset = this._axisOffsets.value(this._xAxisPosition);
    this._xAxis.draw(ctx, this, bounds, dataArea, offset);
    offset = this._axisOffsets.value(this._yAxisPosition);
    this._yAxis.draw(ctx, this, bounds, dataArea, offset);
};

/**
 * Returns the edge location of the specified axis.
 * @param {jsfc.ValueAxis} axis  the axis.
 * @returns {string} The axis position (refer to jsfc.RectangleEdge).
 */
jsfc.XYPlot.prototype.axisPosition = function(axis) {
    if (axis === this._xAxis) {
        return this._xAxisPosition;
    } else if (axis === this._yAxis) {
        return this._yAxisPosition;
    }
    throw new Error("The axis does not belong to this plot.");
};

/**
 * Returns a list of items that should be included in the plot's legend (each
 * item is an instance of jsfc.LegendItemInfo).  
 * 
 * @returns {Array} The legend items.
 */
jsfc.XYPlot.prototype.legendInfo = function() {
    var info = [];
    var plot = this;
    this._dataset.seriesKeys().forEach(function(key) {
        var dataset = plot._dataset;
        var index = dataset.seriesIndex(key);
        var color = plot._renderer.getLineColorSource().getLegendColor(index);
        var item = new jsfc.LegendItemInfo(key, color);
        item.label = key;
        info.push(item);
    });
    return info;
};

/**
 * Finds the nearest visible data item to the location (x, y) and returns
 * an object containing the "seriesKey" and "itemKey" for that data item.
 * 
 * @param {!number} x  the x-value.
 * @param {!number} y  the y-value.
 * @param {number} [xscale]  the scale factor for the x-values (used in the 
 *         distance calculation, this defaults to 1).
 * @param {number} [yscale]  the scale factor for the y-values (used in the 
 *         distance calculation, this defaults to 1).
 * @returns {Object|undefined} A key for the data item.
 */
jsfc.XYPlot.prototype.findNearestDataItem = function(x, y, xscale, yscale) {
    xscale = xscale || 1;
    yscale = yscale || 1;
    var minD = Number.MAX_VALUE;
    var nearest;
    for (var s = 0; s < this._dataset.seriesCount(); s++) {
        for (var i = 0; i < this._dataset.itemCount(s); i++) {
            var xy = this._dataset.item(s, i);
            var xx = xy.x;
            var yy = xy.y;
            if (this._xAxis.contains(xx) && this._yAxis.contains(yy)) {
                var dx = (x - xx) / xscale;
                var dy = (y - yy) / yscale;
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d < minD) {
                    nearest = { "seriesKey": this._dataset.seriesKey(s), 
                            "itemKey": this._dataset.itemKey(s, i) };
                    minD = d;
                }
            }
        }
    }
    return nearest;
};

/**
 * Registers a listener to receive notification of changes to the plot.  The
 * listener is a function - it will be passed one argument (this plot).
 * 
 * @param {Function} f  the listener function.
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.addListener = function(f) {
    this._listeners.push(f);  
};

/**
 * Notify each listener function that this plot has changed.
 * 
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.notifyListeners = function() {
    if (!this._notify) {
        return;
    }
    var plot = this;
    this._listeners.forEach(function(f) {
        f(plot);
    });
};

/**
 * Returns the flag that controls whether or not notifications are forwarded 
 * to registered listeners.  The default value is true.  This flag can be used
 * to temporarily disable event notifications.
 * 
 * @returns {!boolean}
 */
jsfc.XYPlot.prototype.getNotify = function() {
    return this._notify;
};

/**
 * Sets the notify flag.  If the new value is true, this method also sends a 
 * change notification to all registered listeners (it is usually the case
 * that multiple changes have been made, but it is possible that no changes
 * have occurred).
 * 
 * @param {!boolean} notify  notify listeners?
 * @returns {undefined}
 */
jsfc.XYPlot.prototype.setNotify = function(notify) {
    this._notify = notify;
    if (notify) {
        this.notifyListeners();
    }
};


"use strict";

/**
 * Creates a new instance.
 * 
 * @class A record that defines a combination of modifier keys.  The mouse 
 * handlers will specify a modifier combination that can be used to trigger the
 * handler.  The 'shiftExtends' argument can be used to signal that the
 * SHIFT key is used to 'extend' an operation (such as a selection) - if it is
 * set to true, then the match() method will accept any state for the
 * SHIFT key.
 * 
 * @constructor 
 * @param {boolean} [altKey]  requires ALT key?
 * @param {boolean} [ctrlKey]  requires CTRL key?
 * @param {boolean} [metaKey]  requires META key?
 * @param {boolean} [shiftKey]  requires SHIFT key?
 * @param {boolean} [shiftExtends]  is the SHIFT key used for extension?
 * 
 * @returns {undefined}
 */
jsfc.Modifier = function(altKey, ctrlKey, metaKey, shiftKey, shiftExtends) {
    if (!(this instanceof jsfc.Modifier)) {
        throw new Error("Use 'new' for constructor.");
    }
    this.altKey = altKey || false;
    this.ctrlKey = ctrlKey || false;
    this.metaKey = metaKey || false;
    this.shiftKey = shiftKey || false;
    
    // some mouse interactions use the SHIFT key to extend an operation 
    // (typically a selection).  In this case, we want the modifier to match
    // the event with or without the SHIFT key pressed.  By setting this flag
    // to true, the match() method will know to accept either state for the
    // SHIFT key.  (Note that it doesn't make sense to have both 'shiftKey' and
    // 'shiftExtends' set to true).
    this.shiftExtends = shiftExtends || false;
};

/**
 * Returns true if the modifier matches the specified combination of keys,
 * and false otherwise.  Note that the 'shiftExtends' flag can be used to 
 * modify the matching logic.
 * 
 * @param {!boolean} alt  the ALT key is pressed.
 * @param {!boolean} ctrl  the CTRL key is pressed.
 * @param {!boolean} meta  the META key is pressed.
 * @param {!boolean} shift  the SHIFT key is pressed.
 * @returns {!boolean}
 */
jsfc.Modifier.prototype.match = function(alt, ctrl, meta, shift) {
    var b = this.altKey === alt && this.ctrlKey === ctrl 
            && this.metaKey === meta;
    if (!this.shiftExtends || this.shiftKey) {
        b = b && this.shiftKey === shift;    
    }
    return b;
};

/**
 * Returns true if the modifier matches the state of the modifier keys in the
 * supplied event.
 * 
 * @param {MouseEvent} e
 * @returns {!boolean}
 */
jsfc.Modifier.prototype.matchEvent = function(e) {
    return this.match(e.altKey, e.ctrlKey, e.metaKey, e.shiftKey);
};

/**
 * Returns true if this modifier record matches the specified 'other' 
 * modifier record.
 * 
 * @param {jsfc.Modifier} other  the modifier record to compare.
 * @returns {!boolean}
 */
jsfc.Modifier.prototype.matches = function(other) {
    if (this.altKey !== other.altKey) {
        return false;
    }
    if (this.ctrlKey !== other.ctrlKey) {
        return false;
    }
    if (this.metaKey !== other.metaKey) {
        return false;
    }
    if (this.shiftKey !== other.shiftKey) {
        return false;
    }
    if (this.shiftExtends !== other.shiftExtends) {
        return false;
    }
    return true;
};


"use strict";

/**
 * Creates a new base mouse handler.
 * 
 * @class A base class that can used for creating mouse handlers.
 * @constructor
 * @implements {jsfc.MouseHandler}
 * @param {!jsfc.ChartManager} manager  the ChartManager (provides access to 
 *         the chart and dataset).
 * @param {jsfc.Modifier} [modifier] The modifier
 * @param {jsfc.BaseMouseHandler} [instance] The instance.
 * */
jsfc.BaseMouseHandler = function(manager, modifier, instance) {
    if (!(this instanceof jsfc.BaseMouseHandler)) {
        throw new Error("Use 'new' for constructor.");
    }
    if (!instance) {
        instance = this;
    }
    jsfc.BaseMouseHandler.init(manager, modifier, instance);
};

/**
 * Initialises an object (instance) to have the attributes provided by this 
 * base handler.  The chart manager is the link used to access the chart and
 * its dataset if required.  The modifier is a combination of modifier keys 
 * that is used to invoke the mouse handler (when there are multiple handlers
 * to choose from).
 * 
 * @param {!jsfc.ChartManager} manager  the chart manager.
 * @param {jsfc.Modifier} [modifier]  the modifier (if undefined, a default will 
 *     be created).
 * @param {!jsfc.BaseMouseHandler} [instance]  the instance.
 * @returns {undefined}
 */
jsfc.BaseMouseHandler.init = function(manager, modifier, instance) {
    instance._manager = manager;
    instance._modifier = modifier || new jsfc.Modifier();
};

/**
 * Returns the modifier object that was set in the constructor.
 * 
 * @returns {jsfc.Modifier} The modifier.
 */
jsfc.BaseMouseHandler.prototype.getModifier = function() {
    return this._modifier;
};

/**
 * Returns true if this handler is installed as the current live handler,
 * and false otherwise.
 * 
 * @returns {!boolean}
 */
jsfc.BaseMouseHandler.prototype.isLiveHandler = function() {
    return this === this._manager.getLiveHandler();
};

/**
 * Handles a mouse down event.  This default implementation does nothing, 
 * objects that extend this one can provide their own implementation.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.BaseMouseHandler.prototype.mouseDown = function(e) {
};

/**
 * Handles a mouse move event.  This default implementation does nothing, 
 * objects that extend this one can provide their own implementation.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.BaseMouseHandler.prototype.mouseMove = function(e) {
};

/**
 * Handles a mouse up event.  This default implementation does nothing, 
 * objects that extend this one can provide their own implementation.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.BaseMouseHandler.prototype.mouseUp = function(e) {
};

/**
 * Handles a mouse over event.  This default implementation does nothing, 
 * objects that extend this one can provide their own implementation.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.BaseMouseHandler.prototype.mouseOver = function(e) {
};

/**
 * Handles a mouse out event.  This default implementation does nothing, 
 * objects that extend this one can provide their own implementation.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.BaseMouseHandler.prototype.mouseOut = function(e) {
};

/**
 * Handles a mouse wheel event.  This default implementation does nothing, 
 * objects that extend this one can provide their own implementation.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.BaseMouseHandler.prototype.mouseWheel = function(e) {
};

/**
 * Perform any cleanup required before the handler is removed.
 * 
 * @returns {undefined}
 */
jsfc.BaseMouseHandler.prototype.cleanUp = function() {
};

"use strict";

/**
 * A mouse handler that handles selection by mouse click.
 * 
 * @constructor
 * @implements {jsfc.MouseHandler}
 * @param {!jsfc.ChartManager} manager  the ChartManager (provides access to 
 *         the chart and dataset).
 * @param {jsfc.Modifier} [modifier]  the modifier keys (determines when this
 *         handler will become "live").
 */
jsfc.ClickSelectionHandler = function(manager, modifier) {
    if (!(this instanceof jsfc.ClickSelectionHandler)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.BaseMouseHandler.init(manager, modifier, this);
    this._extendModifier = new jsfc.Modifier(false, false, false, true);
    this._startPoint = null;
};

// extend BaseMouseHandler (see also the init call in the constructor)
jsfc.ClickSelectionHandler.prototype = new jsfc.BaseMouseHandler();

/**
 * Handles a mouse down event - this handler simply records the location of
 * the mouse down event so that later, on mouse up, it can determine if the
 * event is a click or a drag (selection will only be applied for a click).
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.ClickSelectionHandler.prototype.mouseDown = function(e) {
    var element = this._manager.getElement();
    var r = element.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    this._startPoint = new jsfc.Point2D(x, y);
};

/**
 * Handles a mouse up event.  If the event location is close to the original
 * mouse down (so this is a click rather than a drag) then the handler looks
 * for a data reference in the target element...if it finds one, then it sets
 * that item to selected. 
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.ClickSelectionHandler.prototype.mouseUp = function(e) {
    if (this._startPoint == null) {
        return;
    }
    var element = this._manager.getElement();
    var r = element.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    var dist = this._startPoint.distance(x, y);
    if (dist <= 2) {
        var dataset = this._manager.getChart().getPlot().getDataset();
        var t = e.target;
        if (t) {
            var ref = t.getAttribute("jfree:ref");
            if (ref) {
                var refObj = JSON.parse(ref);
                var seriesKey = refObj[0];
                var itemKey = refObj[1];
                var selected = dataset.isSelected("selection", seriesKey, 
                        itemKey);
                if (!this._extendModifier.matchEvent(e)) {
                    dataset.clearSelection("selection");
                }
                if (selected) {
                    dataset.unselect("selection", seriesKey, itemKey);
                } else {
                    dataset.select("selection", seriesKey, itemKey);
                }
            } else {
                if (!this._extendModifier.matchEvent(e)) {
                    dataset.clearSelection("selection");
                }           
            }
        }
    }
    
    // final cleanup - this handler can be used as a live handler
    // or as an auxiliary, hence the check before resetting
    this._startPoint = null;
    if (this.isLiveHandler()) {
        this._manager.resetLiveHandler();
    }
};
"use strict";

/**
 * @class A mouse handler that logs events to the console.  This is a 
 * temporary class used during development.
 * @constructor
 * @returns {undefined}
 */
jsfc.LogEventHandler = function() {
    if (!(this instanceof jsfc.LogEventHandler)) {
        throw new Error("Use 'new' for constructor.");
    }
    this.modifier = new jsfc.Modifier();
    this._log = false;
};

jsfc.LogEventHandler.prototype.mouseDown = function(e) {
    if (!this._log) {
        return;
    }
    console.log("DOWN: clientX = " + e.clientX + ", y = " + e.clientY);
    //console.log("mouseDown: " + e);
    //console.log("Current target: " + e.currentTarget + " id = " + e.currentTarget.id);
    //console.log("clientX = " + e.clientX + ", y = " + e.clientY);
    //console.log("target is : " + evt.target + " id = " + evt.target.id);
};

// mouseMove
jsfc.LogEventHandler.prototype.mouseMove = function(e) {
    if (!this._log) {
        return;
    }
    console.log("MOVE: clientX = " + e.clientX + ", y = " + e.clientY);
};

// mouseUp
jsfc.LogEventHandler.prototype.mouseUp = function(e) {
    if (!this._log) {
        return;
    }
    console.log("UP: clientX = " + e.clientX + ", y = " + e.clientY);
};

// mouseOver
jsfc.LogEventHandler.prototype.mouseOver = function(e) {
    if (!this._log) {
        return;
    }
    console.log("OVER: clientX = " + e.clientX + ", y = " + e.clientY);
};

// mouseOut
jsfc.LogEventHandler.prototype.mouseOut = function(e) {
    if (!this._log) {
        return;
    }
    console.log("OUT: clientX = " + e.clientX + ", y = " + e.clientY);
};

jsfc.LogEventHandler.prototype.mouseWheel = function(e) {
    if (!this._log) {
        return false;
    }
    console.log("WHEEL : " + e.wheelDelta);
    return false;
};

"use strict";

/**
 * @interface
 */
jsfc.MouseHandler = function() {
    throw new Error("Documents an interface only.");
};

/**
 * Handles a mouse down event.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.MouseHandler.prototype.mouseDown = function(e) {
};

/**
 * Handles a mouse move event.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.MouseHandler.prototype.mouseMove = function(e) {
};
 
/**
 * Handles a mouse up event.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.MouseHandler.prototype.mouseUp = function(e) {
};

/**
 * Handles a mouse over event.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.MouseHandler.prototype.mouseOver = function(e) {
};

/**
 * Handles a mouse out event.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.MouseHandler.prototype.mouseOut = function(e) {
};

/**
 * Handles a mouse wheel event.
 * 
 * @param {MouseEvent} e  the mouse event.
 * 
 * @returns {undefined}
 */
jsfc.MouseHandler.prototype.mouseWheel = function(e) {
};

/**
 * Perform any cleanup required before the handler is removed.
 * 
 * @returns {undefined}
 */
jsfc.MouseHandler.prototype.cleanUp = function() {
};

"use strict";

/**
 * Creates a new instance.
 * 
 * @class A mouse handler that will pan charts.
 * 
 * @constructor
 * @param {!jsfc.ChartManager} manager  the ChartManager (provides access to 
 *         the chart).
 * @param {jsfc.Modifier} [modifier]  the modifier keys (determines when this
 *         handler will become "live").
 * @returns {undefined}
 */
jsfc.PanHandler = function(manager, modifier) {
    if (!(this instanceof jsfc.PanHandler)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.BaseMouseHandler.init(manager, modifier, this);
    this._lastPoint = null;
};

jsfc.PanHandler.prototype = new jsfc.BaseMouseHandler();

/**
 * Handles a mouse down event.  Here we record the initial coordinate that
 * will define the zoom rectangle.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.PanHandler.prototype.mouseDown = function(e) {
    var svg = this._manager.getElement();
    var r = svg.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    var dataArea = this._manager.getChart().plotArea();  // we actually need the data area
    this._lastPoint = dataArea.constrainedPoint(x, y);
};

// mouseMove
jsfc.PanHandler.prototype.mouseMove = function(e) {
    if (this._lastPoint === null) {
        return; 
    }
    var svg = this._manager.getElement();
    var r = svg.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    // compute the x-delta and y-delta
    var dx = x - this._lastPoint.x();
    var dy = y - this._lastPoint.y();
    
    if (dx !== 0 || dy !== 0) {
        this._lastPoint = new jsfc.Point2D(x, y);
        // then apply these changes to the axes
        var plot = this._manager.getChart().getPlot();
        var dataArea = plot.dataArea();
        var wpercent = -dx / dataArea.width();
        var hpercent = dy / dataArea.height();
        plot.panX(wpercent, false);
        plot.panY(hpercent);
    }
};
 
// mouseUp
jsfc.PanHandler.prototype.mouseUp = function(e) {
    this._lastPoint = null;
    this._manager._liveMouseHandler = null;
};


"use strict";

/**
 * A mouse handler that handles selection by drawing polygons with the mouse.
 * @constructor
 * @implements {jsfc.MouseHandler}
 * @param {!jsfc.ChartManager} manager  the ChartManager (provides access to 
 *         the chart and dataset).
 * @param {jsfc.Modifier} [modifier]  the modifier keys to select this handler.
 */
jsfc.PolygonSelectionHandler = function(manager, modifier) {
    if (!(this instanceof jsfc.PolygonSelectionHandler)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.BaseMouseHandler.init(manager, modifier, this);
    this._extendModifier = new jsfc.Modifier(false, false, false, true);
    this._polygon = null;
    this._fillColor = new jsfc.Color(255, 255, 100, 100);
    this._lineStroke = new jsfc.Stroke(0.5);
    this._lineStroke.setLineDash([3, 3]);
    this._lineColor = jsfc.Colors.RED;
};

// extend BaseMouseHandler (see also the init call in the constructor)
jsfc.PolygonSelectionHandler.prototype = new jsfc.BaseMouseHandler();

/**
 * Handles a mouse down event - this handler creates a new polygon instance
 * and initialises it with the starting point.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.PolygonSelectionHandler.prototype.mouseDown = function(e) {
    var element = this._manager.getElement();
    var r = element.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    var dataArea = this._manager.getChart().getPlot().dataArea();
    var pt = dataArea.constrainedPoint(x, y);
    this._polygon = new jsfc.Polygon();
    this._polygon.add(pt);
};

// mouseMove
jsfc.PolygonSelectionHandler.prototype.mouseMove = function(e) {
    if (this._polygon === null) {
        return; 
    }
    var r = this._manager.getElement().getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    var dataArea = this._manager.getChart().getPlot().dataArea();
    var currPt = dataArea.constrainedPoint(x, y);
    var lastPt = this._polygon.getLastVertex();
    if (lastPt.distance(currPt.x(), currPt.y()) > 5) {
        this._polygon.add(currPt);
        // add the latest point to the polygon
        // compute the zoom rectangle and draw it
        if (this._polygon.getVertexCount() > 2) {
            var ctx = this._manager.getContext();
            ctx.setHint("layer", "polygon");
            ctx.clear();
            ctx.setFillColor(this._fillColor);
            ctx.setLineColor(this._lineColor);
            ctx.setLineStroke(this._lineStroke);
            this._setPathFromPolygon(ctx, this._polygon);
            ctx.stroke();
            ctx.setHint("layer", "default");
        }
    }
};

/**
 * Handles a mouse up event.  If the event location is close to the original
 * mouse down (so this is a click rather than a drag) then the handler looks
 * for a data reference in the target element...if it finds one, then it sets
 * that item to selected.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.PolygonSelectionHandler.prototype.mouseUp = function(e) {
    var element = this._manager.getElement();
    var r = element.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;

    var plot = this._manager.getChart().getPlot();
    plot.setNotify(false);
    var dataset = plot.getDataset();

    // if this is not extending a selection, then clear the existing selection
    if (!this._extendModifier.matchEvent(e)) {
        dataset.clearSelection("selection");
    }
    
    // iterate over all data items and
    var xAxis = plot.getXAxis();
    var yAxis = plot.getYAxis();
    var dataArea = plot.dataArea();
    for (var s = 0; s < dataset.seriesCount(); s++) {
        var seriesKey = dataset.seriesKey(s);
        for (var i = 0; i < dataset.itemCount(s); i++) {
            var item = dataset.item(s, i);
            var xx = xAxis.valueToCoordinate(item.x, dataArea.minX(), 
                    dataArea.maxX());
            var yy = yAxis.valueToCoordinate(item.y, dataArea.maxY(), 
                    dataArea.minY());
            
            if (this._polygon.contains(new jsfc.Point2D(xx, yy))) {
                //console.log(item.x + ", " + item.y);
                //console.log(xx + ", " + yy);    
                dataset.select("selection", seriesKey, dataset.itemKey(s, i));
            }
        }
    }   
    plot.setNotify(true);
    var ctx = this._manager.getContext();
    ctx.setHint("layer", "polygon");
    ctx.clear();
    ctx.setHint("layer", "default");

    // finally we should remove this handler as the current live handler
    this._polygon = null;
    this._manager._liveMouseHandler = null;
};

/**
 * Sets a path on the graphics context that matches the outline of the
 * polygon.
 * 
 * @param {!jsfc.Context2D} ctx  the graphics context.
 * @param {!jsfc.Polygon} polygon  a polygon with at least three vertices.
 * @returns {undefined}
 */
jsfc.PolygonSelectionHandler.prototype._setPathFromPolygon = function(ctx, polygon) {
    ctx.beginPath();
    var v0 = polygon.getFirstVertex();
    ctx.moveTo(v0.x(), v0.y());
    var n = polygon.getVertexCount();
    for (var i = 1; i < n - 1; i++) {
        var v = polygon.getVertex(i);
        ctx.lineTo(v.x(), v.y());
    }
    ctx.lineTo(v0.x(), v0.y());
};
"use strict";

/**
 * A mouse handler that handles selection by drawing a rectangle with the 
 * mouse.
 * @constructor
 * @implements {jsfc.MouseHandler}
 * @param {!jsfc.ChartManager} manager  the ChartManager (provides access to 
 *         the chart and dataset).
 * @param {jsfc.Modifier} [modifier]  the modifier keys to select this handler.
 */
jsfc.RectangleSelectionHandler = function(manager, modifier) {
    if (!(this instanceof jsfc.RectangleSelectionHandler)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.BaseMouseHandler.init(manager, modifier, this);
    this._extendModifier = new jsfc.Modifier(false, false, false, true);
    this._rectangle = null;
    this._fillColor = new jsfc.Color(255, 255, 100, 100);
    this._lineStroke = new jsfc.Stroke(0.5);
    this._lineStroke.setLineDash([3, 3]);
    this._lineColor = jsfc.Colors.RED;
};

// extend BaseMouseHandler (see also the init call in the constructor)
jsfc.RectangleSelectionHandler.prototype = new jsfc.BaseMouseHandler();

/**
 * Handles a mouse down event - this handler creates a new rectangle instance
 * and initialises it with the starting point.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.RectangleSelectionHandler.prototype.mouseDown = function(e) {
    var element = this._manager.getElement();
    var r = element.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    var dataArea = this._manager.getChart().getPlot().dataArea();
    var pt = dataArea.constrainedPoint(x, y);
    this._rectangle = new jsfc.Rectangle(pt.x(), pt.y(), 0, 0);
};

/**
 * Handles a mouse move event.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.RectangleSelectionHandler.prototype.mouseMove = function(e) {
    if (this._rectangle === null) {
        return; 
    }
    var r = this._manager.getElement().getBoundingClientRect();
    var currX = e.clientX - r.left;
    var currY = e.clientY - r.top;
    var dataArea = this._manager.getChart().getPlot().dataArea();
    var currPt = dataArea.constrainedPoint(currX, currY);
    var x = this._rectangle.x();
    var y = this._rectangle.y();
    var w = Math.max(0, currPt.x() - x);
    var h = Math.max(0, currPt.y() - y);
    this._rectangle.set(x, y, w, h);

    var ctx = this._manager.getContext();
    ctx.setHint("layer", "rectangle");
    ctx.clear();
    ctx.setFillColor(this._fillColor);
    ctx.setLineColor(this._lineColor);
    ctx.setLineStroke(this._lineStroke);
    ctx.drawRect(x, y, w, h);
    ctx.setHint("layer", "default");
};

/**
 * Handles a mouse up event.  If the event location is close to the original
 * mouse down (so this is a click rather than a drag) then the handler looks
 * for a data reference in the target element...if it finds one, then it sets
 * that item to selected.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.RectangleSelectionHandler.prototype.mouseUp = function(e) {
    var element = this._manager.getElement();
    var r = element.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;

    var plot = this._manager.getChart().getPlot();
    plot.setNotify(false);
    var dataset = plot.getDataset();

    // if this is not extending a selection, then clear the existing selection
    if (!this._extendModifier.matchEvent(e)) {
        dataset.clearSelection("selection");
    }
    
    // iterate over all data items and
    var xAxis = plot.getXAxis();
    var yAxis = plot.getYAxis();
    var dataArea = plot.dataArea();
    for (var s = 0; s < dataset.seriesCount(); s++) {
        var seriesKey = dataset.seriesKey(s);
        for (var i = 0; i < dataset.itemCount(s); i++) {
            var item = dataset.item(s, i);
            var xx = xAxis.valueToCoordinate(item.x, dataArea.minX(), 
                    dataArea.maxX());
            var yy = yAxis.valueToCoordinate(item.y, dataArea.maxY(), 
                    dataArea.minY());
            
            if (this._rectangle.contains(xx, yy)) {   
                dataset.select("selection", seriesKey, dataset.itemKey(s, i));
            }
        }
    }   
    plot.setNotify(true);
    var ctx = this._manager.getContext();
    ctx.setHint("layer", "rectangle");
    ctx.clear();
    ctx.setHint("layer", "default");

    // finally we should remove this handler as the current live handler
    this._rectangle = null;
    this._manager._liveMouseHandler = null;
};
"use strict";

/**
 * Creates a new instance.
 * @constructor
 * @implements {jsfc.MouseHandler}
 * @param {!jsfc.ChartManager} manager  the ChartManager (provides access to 
 *         the chart).
 * @param {jsfc.Modifier} [modifier]  the modifier keys (determines when this
 *         handler will become "live").
 * @returns {undefined}
 * 
 * @class A mouse wheel handler that will zoom in and out on charts.
 */
jsfc.WheelHandler = function(manager, modifier) {
    if (!(this instanceof jsfc.WheelHandler)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.BaseMouseHandler.init(manager, modifier, this);
    this.manager = manager;
    this.modifier = modifier || new jsfc.Modifier(false, false, false, false);
};

// extend the BaseMouseHandler
jsfc.WheelHandler.prototype = new jsfc.BaseMouseHandler();

/**
 * Handles a mouse wheel event.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.WheelHandler.prototype.mouseWheel = function(e) {
    var delta;
    if (e.wheelDelta) {
        delta = (e.wheelDelta / 720) * -0.2 + 1;
    } else { // special case for FireFox
        delta = e.detail * 0.05 + 1;
    }
    var plot = this.manager.getChart().getPlot();
    // for a pie chart we should rotate the pie
    
    var zoomX = plot.isXZoomable();
    var zoomY = plot.isYZoomable();
    var svg = this.manager.getElement();
    if (zoomX) {
        plot.zoomXAboutAnchor(delta, 
                e.clientX - svg.getBoundingClientRect().left, !zoomY);
    }
    if (zoomY) {
        plot.zoomYAboutAnchor(delta, 
                e.clientY - svg.getBoundingClientRect().top);
    }
    if (zoomX || zoomY) {
        e.preventDefault();  
    }
};

"use strict";

/**
 * Creates a new instance. 
 * 
 * @class A mouse handler that draws cross-hairs as the mouse pointer moves
 *     over a chart.  This handler is intended for use as an auxiliary
 *     handler, for XY charts only.

 * @constructor
 * @implements {jsfc.MouseHandler}
 * @param {!jsfc.ChartManager} manager  the ChartManager (provides access to 
 *         the chart).
 * @returns {undefined}
 */
jsfc.XYCrosshairHandler = function(manager) {
    if (!(this instanceof jsfc.XYCrosshairHandler)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.BaseMouseHandler.init(manager, null, this);
    this._manager = manager;
    this._layerID = "XYCrosshair";
    this._xCrosshair = new jsfc.Crosshair(Number.NaN);
    this._xLabelGenerator = new jsfc.StandardXYLabelGenerator("{X}", 4, 4);
    this._xFormatter = new jsfc.NumberFormat(4);
    this._yCrosshair = new jsfc.Crosshair(Number.NaN);
    this._yLabelGenerator = new jsfc.StandardXYLabelGenerator("{Y}", 4, 4);
    this._yFormatter = new jsfc.NumberFormat(4);
    this._snapToItem = true;
};

// extend the BaseMouseHandler
jsfc.XYCrosshairHandler.prototype = new jsfc.BaseMouseHandler();

/**
 * Returns the crosshair object for the x-axis.  This provides the ability
 * to customise the visual properties of the crosshair.
 * 
 * @returns {!jsfc.Crosshair}
 */
jsfc.XYCrosshairHandler.prototype.getXCrosshair = function() {
    return this._xCrosshair;
};

/**
 * Returns the generator that creates the labels for the x-crosshair when 
 * the 'snapToItem' flag is set to true.
 * 
 * @returns {jsfc.XYLabelGenerator}
 */
jsfc.XYCrosshairHandler.prototype.getXLabelGenerator = function() {
    return this._xLabelGenerator;
};

/**
 * Sets the label generator for the label on the x-crosshair.
 * @param {jsfc.XYLabelGenerator} generator
 * @returns {undefined}
 */
jsfc.XYCrosshairHandler.prototype.setXLabelGenerator = function(generator) {
    this._xLabelGenerator = generator;
};

/**
 * Returns the crosshair object for the y-axis.  This provides the ability
 * to customise the visual properties of the crosshair.
 * 
 * @returns {!jsfc.Crosshair}
 */
jsfc.XYCrosshairHandler.prototype.getYCrosshair = function() {
    return this._yCrosshair;
};

/**
 * Returns the generator that creates the labels for the y-crosshair when 
 * the 'snapToItem' flag is set to true.
 * 
 * @returns {jsfc.XYLabelGenerator}
 */
jsfc.XYCrosshairHandler.prototype.getYLabelGenerator = function() {
    return this._yLabelGenerator;
};

/**
 * Sets the label generator for the label on the y-crosshair.
 * @param {jsfc.XYLabelGenerator} generator
 * @returns {undefined}
 */
jsfc.XYCrosshairHandler.prototype.setYLabelGenerator = function(generator) {
    this._yLabelGenerator = generator;
};

/**
 * Returns the flag that controls whether the crosshairs "snap" to the nearest
 * visible data value.  The default value is true.
 * 
 * @returns {!boolean}
 */
jsfc.XYCrosshairHandler.prototype.getSnapToItem = function() {
    return this._snapToItem;
};

/**
 * Sets the flag that controls whether or not the crosshairs "snap" to the 
 * nearest visible data item.
 * 
 * @param {!boolean} snap  the new flag value.
 * @returns {undefined}
 */
jsfc.XYCrosshairHandler.prototype.setSnapToItem = function(snap) {
    this._snapToItem = snap;
};

/**
 * Handles a mouse move event.
 * 
 * @param {MouseEvent} e  the event.
 * @returns {undefined}
 */
jsfc.XYCrosshairHandler.prototype.mouseMove = function(e) {
    var r = this._manager.getElement().getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    var plot = this._manager.getChart().getPlot();
    var dataArea = plot.dataArea();
    var minX = dataArea.minX();
    var minY = dataArea.minY();
    var maxX = dataArea.maxX();
    var maxY = dataArea.maxY();
    var ctx = this._manager.getContext();
    if (dataArea.contains(x, y)) {
        ctx.setHint("layer", this._layerID);
        ctx.clear();
        var dataset = plot.getDataset();
        var xaxis = plot.getXAxis();
        var xx = xaxis.coordinateToValue(x, minX, maxX);
        var yaxis = plot.getYAxis();
        var yy = yaxis.coordinateToValue(y, maxY, minY);
        var xlabel, ylabel;
        if (this._snapToItem) {
            // find the nearest visible data point
            var xlen = xaxis.length();
            var xscale = xlen / dataArea.width();
            var ylen = yaxis.length();
            var yscale = ylen / dataArea.height();
            var item = plot.findNearestDataItem(xx, yy, xscale, yscale);
            var s = dataset.seriesIndex(item.seriesKey);
            var i = dataset.itemIndex(item.seriesKey, item.itemKey);
            var ix = dataset.x(s, i);
            x = xaxis.valueToCoordinate(ix, minX, maxX);
            xlabel = this._xLabelGenerator.itemLabel(dataset, 
                    item.seriesKey, item.itemKey);
            var iy = plot.getDataset().y(s, i);
            y = yaxis.valueToCoordinate(iy, maxY, minY);
            ylabel = this._yLabelGenerator.itemLabel(dataset, 
                    item.seriesKey, item.itemKey);
        } 
        xlabel = xlabel || this._xFormatter.format(xx);
        ylabel = ylabel || this._yFormatter.format(yy);
        if (this._xCrosshair) {
            this._xCrosshair.setLabel(xlabel);
            this._xCrosshair.drawVertical(ctx, x, dataArea);
        }
        if (this._yCrosshair) {
            this._yCrosshair.setLabel(ylabel);
            this._yCrosshair.drawHorizontal(ctx, y, dataArea);
        }
        ctx.setHint("layer", "default");
    } else {
        ctx.setHint("layer", this._layerID);
        ctx.clear();        
        ctx.setHint("layer", "default");
    }
};

/**
 * Perform any cleanup required before the handler is removed.
 * 
 * @returns {undefined}
 */
jsfc.XYCrosshairHandler.prototype.cleanUp = function() {
    var ctx = this._manager.getContext();
    ctx.setHint("layer", this._layerID);
    ctx.clear();        
    ctx.setHint("layer", "default");    
};

"use strict";

/**
 * Creates a new instance. 
 * @class A mouse handler that uses a mouse click and drag to define a 
 * zooming rectangle for a chart.

 * @constructor 
 * @param {!jsfc.ChartManager} manager  the ChartManager (provides access to 
 *         the chart).
 * @param {jsfc.Modifier} [modifier]  the modifier keys (determines when this
 *         handler will become "live").
 * @returns {undefined}
 */
jsfc.ZoomHandler = function(manager, modifier) {
    if (!(this instanceof jsfc.ZoomHandler)) {
        throw new Error("Use 'new' for constructor.");
    }
    jsfc.BaseMouseHandler.init(manager, modifier || null, this);
    this.zoomPoint = null;
    this.zoomRectangle = null;
    this._fillColor = new jsfc.Color(255, 0, 0, 50);
};

// extends the BaseMouseHandler
jsfc.ZoomHandler.prototype = new jsfc.BaseMouseHandler();

/**
 * Handles a mouse down event.  Here we record the initial coordinate that
 * will define the zoom rectangle.
 * 
 * @param {MouseEvent} e  the mouse event.
 * @returns {undefined}
 */
jsfc.ZoomHandler.prototype.mouseDown = function(e) {
    // update zoomPoint
    var r = this._manager.getElement().getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    var dataArea = this._manager.getChart().getPlot().dataArea();
    this.zoomPoint = dataArea.constrainedPoint(x, y);
};

// mouseMove
jsfc.ZoomHandler.prototype.mouseMove = function(e) {
    if (this.zoomPoint === null) {
        return; 
    }
    var r = this._manager.getElement().getBoundingClientRect();
    var ex = e.clientX - r.left;
    var ey = e.clientY - r.top;
    var dataArea = this._manager.getChart().getPlot().dataArea();
    var endPoint = dataArea.constrainedPoint(ex, ey);
    // compute the zoom rectangle and draw it
    var ctx = this._manager.getContext();
    ctx.setHint("layer", "zoom");
    ctx.clear();
    var x = this.zoomPoint.x();
    var y = this.zoomPoint.y();
    var width = endPoint.x() - x;
    var height = endPoint.y() - y;
    if (width > 0 && height > 0) {
        ctx.setFillColor(this._fillColor);
        ctx.setLineStroke(new jsfc.Stroke(0.1));
        ctx.drawRect(x, y, width, height);
    }
    ctx.setHint("layer", "default");
    // with SVG we could overlay one rectangle and modify it
    // with Canvas we could redraw everything, or use the buffer approach
    // and just redraw the buffer then the zoom rectangle above it
};
 
/**
 * On a mouse up we can check if a valid zoom rectangle has been created and,
 * if it has, change the ranges on the chart's axes.
 * 
 * @param {MouseEvent} e
 * @returns {undefined}
 */
jsfc.ZoomHandler.prototype.mouseUp = function(e) {
    
    // if we don't have a starting point, there's nothing to do...
    if (this.zoomPoint === null) {
        return;
    }
    
    // calculate the end point (constraining it to be within the data area
    var r = this._manager.getElement().getBoundingClientRect();
    var ex = e.clientX - r.left;
    var ey = e.clientY - r.top;
    var plot = this._manager.getChart().getPlot();
    var dataArea = plot.dataArea();
    var endPoint = dataArea.constrainedPoint(ex, ey);
    
    var x = this.zoomPoint.x();
    var y = this.zoomPoint.y();
    var width = endPoint.x() - x;
    var height = endPoint.y() - y;
    if (width > 0 && height > 0) {
        var xAxis = plot.getXAxis();
        var yAxis = plot.getYAxis();
        var p0 = (x - dataArea.minX()) / dataArea.width();
        var p1 = (x + width - dataArea.minX()) / dataArea.width();
        var p3 = (dataArea.maxY() - y) / dataArea.height();
        var p2 = (dataArea.maxY() - y - height) / dataArea.height();
        xAxis.setBoundsByPercent(p0, p1, false);
        yAxis.setBoundsByPercent(p2, p3);
    } else if (width < -2 && height < -2) {
        plot.getXAxis().setAutoRange(true);
        plot.getYAxis().setAutoRange(true);
    }
    
    this.zoomPoint = null;
    var ctx = this._manager.getContext();
    ctx.setHint("layer", "zoom");
    ctx.clear();
    ctx.setHint("layer", "default");
    // if there is a valid zoom rectangle, we can zoom
    // finally we should remove this handler as the current live handler
    this._manager._liveMouseHandler = null;
};


"use strict";

/**
 * Creates a new label generator with a default template string "{R}, {C} = {V}".
 * @constructor
 * @classdesc A label generator that creates a label for an item in a KeyedValues2DDataset.
 *
 */
jsfc.KeyedValue2DLabels = function() {
    if (!(this instanceof jsfc.KeyedValue2DLabels)) {
        return new jsfc.KeyedValue2DLabels();
    }
    this.format = "{R}, {C} = {V}";
    this.valueDP = 2;
};

/**
 * Creates a label for an item in the specified dataset.  The label format is
 * controlled by the 'format' attribute, where occurrences of certain tokens
 * are replaced by actual data values.  The recognised tokens are: {R} the row
 * key, {C} the column key and {V} the data value.
 * 
 * @param {jsfc.KeyedValues2DDataset} keyedValues2D  the dataset.
 * @param {number} rowIndex  the row index.
 * @param {number} columnIndex  the column index.
 * @returns {string} The item label.
 */
jsfc.KeyedValue2DLabels.prototype.itemLabel = function(keyedValues2D, rowIndex, 
        columnIndex) {
    var labelStr = new String(this.format);
    var rowKeyStr = keyedValues2D.rowKey(rowIndex);
    var columnKeyStr = keyedValues2D.columnKey(columnIndex);
    var value = keyedValues2D.valueByIndex(rowIndex, columnIndex);
    var valueStr = value.toFixed(this.valueDP);
    labelStr = labelStr.replace(/{R}/g, rowKeyStr);
    labelStr = labelStr.replace(/{C}/g, columnKeyStr);
    labelStr = labelStr.replace(/{V}/g, valueStr);
    return labelStr;
};

"use strict";

/**
 * Creates a new label generator with a default template string "{S}, {R}, {C} = {V}".
 * @constructor
 * @classdesc A label generator that creates a label for an item in a KeyedValues3DDataset.
 */
jsfc.KeyedValue3DLabels = function() {
    if (!(this instanceof jsfc.KeyedValue3DLabels)) {
        return new jsfc.KeyedValue3DLabels();
    }
    this.format = "{S}, {R}, {C} = {V}";
    this.valueDP = 2;
};

/**
 * Creates a label for an item in the specified dataset.
 * 
 * @param {jsfc.KeyedValues3DDataset} keyedValues3D  the dataset.
 * @param {number} seriesIndex  the series index.
 * @param {number} rowIndex  the row index.
 * @param {number} columnIndex  the column index.
 * @returns {string}  The item label.
 */
jsfc.KeyedValue3DLabels.prototype.itemLabel = function(keyedValues3D, 
      seriesIndex, rowIndex, columnIndex) {
    var labelStr = new String(this.format);
    var seriesKeyStr = keyedValues3D.seriesKey(seriesIndex);
    var rowKeyStr = keyedValues3D.rowKey(rowIndex);
    var columnKeyStr = keyedValues3D.columnKey(columnIndex);
    var value = keyedValues3D.valueByIndex(seriesIndex, rowIndex, columnIndex);
    var valueStr = value.toFixed(this.valueDP);
    labelStr = labelStr.replace(/{S}/g, seriesKeyStr);
    labelStr = labelStr.replace(/{R}/g, rowKeyStr);
    labelStr = labelStr.replace(/{C}/g, columnKeyStr);
    labelStr = labelStr.replace(/{V}/g, valueStr);
    return labelStr;
};
"use strict";

/**
 * Creates a new label generator.
 * @constructor
 * @classdesc A label generator that creates a label for an item in a 
 *     KeyedValuesDataset.
 */
jsfc.KeyedValueLabels = function() {
    if (!(this instanceof jsfc.KeyedValueLabels)) {
        throw new Error("Use 'new' for construction.");
    }
    this.format = "{K} = {V}";
    this.valueDP = 2;
    this.percentDP = 2;
};

/**
 * Creates a label for one item in a KeyedValuesDataset.  The label will be
 * generated using a template string (the 'format' attribute) by replacing
 * certain tokens with the corresponding values from the dataset.  The tokens 
 * are: {K} the key, {V} the value and {P} the value as a percentage of the 
 * total.
 * 
 * @param {jsfc.KeyedValuesDataset} keyedValues  the dataset.
 * @param {number} itemIndex  the item index.
 * @returns {string} A string.
 */
jsfc.KeyedValueLabels.prototype.itemLabel = function(keyedValues, itemIndex) {
    var labelStr = new String(this.format);
    var keyStr = keyedValues.key(itemIndex);
    var value = keyedValues.valueByIndex(itemIndex);
    var valueStr = value.toFixed(this.valueDP);
    var total = keyedValues.total();
    var percentStr = (value / total * 100).toFixed(this.percentDP);
    labelStr = labelStr.replace(/{K}/g, keyStr);
    labelStr = labelStr.replace(/{V}/g, valueStr);
    labelStr = labelStr.replace(/{P}/g, percentStr);
    return labelStr;
};

"use strict";

/**
 * Creates a new label generator with the default template string 
 * "{X}, {Y} / {S}".
 * 
 * @constructor
 * @implements {jsfc.XYLabelGenerator}
 * @classdesc A label generator that creates a label for an item in a XYDataset. 
 * The labels are generated from a template string that can contain the 
 * following tokens (each occurrence of the token will be replaced by the 
 * actual data value): {X} the x-value, {Y} the y-value and {S} the series key.
 */
jsfc.StandardXYLabelGenerator = function(format, xdp, ydp) {
    if (!(this instanceof jsfc.StandardXYLabelGenerator)) {
        throw new Error("Use 'new' with constructor.");
    }
    this._format = format || "{X}, {Y} / {S}";
    this._xDP = xdp || 2;
    this._yDP = ydp || 2;
};

/**
 * Creates a label for an item in the specified dataset.
 * 
 * @param {jsfc.XYDataset} dataset  the dataset.
 * @param {string} seriesKey  the series key.
 * @param {string|number} itemKey  the item index.
 * @returns {string} The item label.
 */
jsfc.StandardXYLabelGenerator.prototype.itemLabel = function(dataset, 
        seriesKey, itemKey) {
    var labelStr = new String(this._format);
    var seriesKeyStr = seriesKey;
    var item = dataset.itemByKey(seriesKey, itemKey);
    var xStr = item.x.toFixed(this._xDP);
    var yStr = item.y.toFixed(this._yDP);
    labelStr = labelStr.replace(/{X}/g, xStr);
    labelStr = labelStr.replace(/{Y}/g, yStr);
    labelStr = labelStr.replace(/{S}/g, seriesKeyStr);
    return labelStr;
};

"use strict";

/**
 * @interface
 */
jsfc.XYLabelGenerator = function() {
    throw new Error("Documents an interface only.");
};

/**
 * Creates a label for an item in the specified dataset.
 * 
 * @param {!jsfc.XYDataset} dataset  the dataset.
 * @param {!string} seriesKey  the series key.
 * @param {string|number} itemKey  the item key.
 * @returns {string} The item label.
 */
jsfc.XYLabelGenerator.prototype.itemLabel = function(dataset, seriesKey, itemKey) {
};

"use strict";

/**
 * Creates a new label generator with the default template string "{X}, {Y}, {Z} / {S}".
 * @constructor
 * @classdesc A label generator that creates a label for an item in a XYZDataset. 
 *     The labels are generated from a template string that can contain the following
 *     tokens (each occurrence of the token will be replaced by the actual data 
 *     value): {X} the x-value, {Y} the y-value, {Z} the z-value and {S} the series key.
 */
jsfc.XYZLabels = function() {
    if (!(this instanceof jsfc.XYZLabels)) {
        return new jsfc.XYZLabels();
    }
    this.format = "{X}, {Y}, {Z} / {S}";
    this.xDP = 2;
    this.yDP = 2;
    this.zDP = 2;
};

/**
 * Creates a label for an item in the specified dataset.
 * 
 * @param {jsfc.XYZDataset} dataset  the dataset.
 * @param {string} seriesKey  the series key.
 * @param {number} itemIndex  the item index.
 * @returns {string}  The item label.
 */
jsfc.XYZLabels.prototype.itemLabel = function(dataset, seriesKey, itemIndex) {
    var labelStr = new String(this.format);
    var seriesKeyStr = seriesKey;
    var seriesIndex = dataset.seriesIndex(seriesKey);
    var item = dataset.item(seriesIndex, itemIndex);
    var xStr = item.x.toFixed(this.xDP);
    var yStr = item.y.toFixed(this.yDP);
    var zStr = item.z.toFixed(this.zDP);
    labelStr = labelStr.replace(/{X}/g, xStr);
    labelStr = labelStr.replace(/{Y}/g, yStr);
    labelStr = labelStr.replace(/{Z}/g, zStr);
    labelStr = labelStr.replace(/{S}/g, seriesKeyStr);
    return labelStr;
};

if (typeof define === "function" && define.amd) define(jsfc); else if (typeof module === "object" && module.exports) module.exports = jsfc;