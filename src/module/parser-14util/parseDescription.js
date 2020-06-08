"use strict";
/**
 * Created by longstone on 31/12/14.
 */

var nThPositionOf = function NthPositionOf(string, subString, n) {
    return string.split(subString, n).join(subString).length;
}

module.exports = function parseDescriptionF(text) {
    const start = nThPositionOf(text, "/", 2) + 1;
    return text.substr(start).trim();
};
