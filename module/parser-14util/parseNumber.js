/**
 * Created by longstone on 25/03/15.
 */
"use strict";
var S = require("string");
/**
 * Created by longstone on 16/12/14.
 */

module.exports = function parseNumberFromLineF(line) {
    var endIndex = line.indexOf(' /');
    return S(line).left(endIndex).toInt();
};