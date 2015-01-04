/**
 * Created by longstone on 20/11/14.
 */
"use strict";
var assert = require("assert");

var parseDescription = require("./../../module/parser-14util/parseDescription");

var oneGroup = "001 - 17:09 Uhr / Kdo / Hilfeleistung: Weidstrasse, Wangen-Br�ttisellen";
var twoGroups = "20.10.2014	150 - 16:03 Uhr / KA2+KA3 / BMA: Rotbuchstrasse, Dübendorf";
describe("test description", function () {
    it('should parse "Hilfeleistung: Weidstrasse, Wangen-Br�ttisellen"', function () {
        var actual = parseDescription(oneGroup);
        var expected = "Hilfeleistung: Weidstrasse, Wangen-Br�ttisellen";
        assert.deepEqual(actual, expected);
    })
});
describe("test description", function () {
    it('should parse "BMA: Rotbuchstrasse, Dübendorf"', function () {
        var actual = parseDescription(twoGroups);
        var expected = "BMA: Rotbuchstrasse, Dübendorf";
        assert.deepEqual(actual, expected);
    })
});