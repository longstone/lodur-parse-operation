"use strict";
var moment = require('moment');
/**
 * Created by longstone on 16/12/14.
 */

module.exports = function parseTimeFromLineF(line) {
    // 07.06.2020   083 - 21:03 Uhr
    const charAt = line.indexOf('- ');
    const timeStartIndex = charAt <= 0 ? line.indexOf('– ') + 2 : charAt + 2;
    const timeEndIndex = line.indexOf(' Uhr');
    return line.match('\\d\\d:\\d\\d');
};