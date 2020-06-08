"use strict";
var moment = require('moment');
/**
 * Created by longstone on 16/12/14.
 */

module.exports = function parseTimeFromLineF(line) {
    // 07.06.2020   083 - 21:03 Uhr
    var timeStartIndex = line.indexOf('- ') + 2;
    var timeEndIndex = line.indexOf(' Uhr');
    return line.substring(timeStartIndex, timeEndIndex)
};