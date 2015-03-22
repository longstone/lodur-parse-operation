"use strict";
/**
 * Created by longstone on 31/12/14.
 */

module.exports = function parseDescriptionF(line) {
    line = line.replace('\t', '');
    var start = line.indexOf(' / ', 23) + 3;
    var end = line.length;
    return line.substring(start, end);
};
