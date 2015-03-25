"use strict";
var moment = require('moment');
/**
 * Created by longstone on 16/12/14.
 */

module.exports = function parseTimeFromLineF(line) {
    var startIndex = line.indexOf('/') + 2;
    var endIndex = line.substring(startIndex, line.length).indexOf('/') - 1 + startIndex;
    var result = line.substring(startIndex, endIndex);
    return result.split("+");
};