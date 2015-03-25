/**
 * Created by longstone on 20/11/14.
 */
"use strict";
var assert = require("assert");

var moment = require("moment");
var dateparser = require("../../module/parser-14util/dateparser");

describe("test date", function () {
    it('should parse date as expected', function () {
        var args = {date: "03.01.2014", time: "17:09"};
        var actual = dateparser(args);
        var expected = moment('2014-01-03 17:09');
        assert.equal(true, expected.isSame(actual));
    })
});