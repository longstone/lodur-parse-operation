"use strict";
var moment = require('moment');
/**
 * Created by longstone on 16/12/14.
 */

module.exports = function parseTimeFromLineF(line) {
    var timeStartIndex = line.indexOf('- ') + 2;
    var timeEndIndex = line.indexOf(' Uhr');
    return line.substring(timeStartIndex, timeEndIndex)
};