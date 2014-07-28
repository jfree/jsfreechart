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
