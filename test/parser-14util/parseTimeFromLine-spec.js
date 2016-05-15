/**
 * Created by longstone on 20/11/14.
 */
"use strict";
var assert = require("assert");

var parseTimeFromLine = require("../../module/parser-14util/parseTimeFromLine");

var sample_line = "001 - 17:09 Uhr / Kdo / Hilfeleistung: Weidstrasse, Wangen-Br�ttisellen";

describe("parse time", function () {
    it('should parse time as expected', function () {
        var actual = parseTimeFromLine(sample_line);
        var expected = "17:09";
        assert.strictEqual(actual, expected);
    })
});