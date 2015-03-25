/**
 * Created by longstone on 20/11/14.
 */
"use strict";
var assert = require("assert");

var parseNumber = require("../../module/parser-14util/parseNumber");

var sample_line_001 = "001 - 17:09 Uhr / Kdo / Hilfeleistung: Weidstrasse, Wangen-Brüttisellen";
var sample_line_043 = "043 - 18:16 Uhr / KA5 / Brand: Ringstrasse, Brüttisellen \n\t\t\t\t  \n\t\t\t\t";
describe("test date", function () {
    it('should parse number as 1', function () {
        var actual = parseNumber(sample_line_001);
        var expected = 1;
        assert.strictEqual(actual, expected);
    });
    it('should parse "043 ..." as 43', function () {
        var actual = parseNumber(sample_line_043);
        var expected = 43;
        assert.strictEqual(actual, expected);
    });
});

