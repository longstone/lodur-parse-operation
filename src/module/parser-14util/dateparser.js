"use strict";
var moment = require('moment');
/**
 * Created by longstone on 16/12/14.
 */
/**
 * due to missing java a little bit, this is an array with date and time, named after the public static void main args..
 * @param args
 */
module.exports = function (args) {
    var date = args.date;
    var time = args.time;
    return moment(date + " " + time, "DD.MM.YYYY HH.mm");
};