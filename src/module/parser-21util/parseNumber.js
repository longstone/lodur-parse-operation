/**
 * Created by longstone on 25/03/15.
 */
"use strict";
// "07.06.2020   ".length;
const stripDate = 13;
module.exports = function parseNumberFromLineF(line) {
    // 07.06.2020   083 - 21:03 Uhr
    let result = parseInt(line.substring(stripDate, line.length).substring(0, 3));
    return result
};