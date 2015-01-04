"use strict";
/**
 * Created by longstone on 31/12/14.
 */

module.exports = function parseDescriptionF(line) {
    var start = line.lastIndexOf('/') + 2;
    var end = line.length;
    return line.substring(start, end);
};