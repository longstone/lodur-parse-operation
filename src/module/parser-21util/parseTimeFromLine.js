"use strict";
var moment = require('moment');
/**
 * Created by longstone on 16/12/14.
 */

module.exports = function parseTimeFromLineF(line) {
    // 07.12.2021   083 21:03 Uhr
    return line.match('\\d\\d:\\d\\d');
};