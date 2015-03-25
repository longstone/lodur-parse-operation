/**
 * Created by longstone on 20/11/14.
 */
"use strict";
var assert = require("assert");

var parseGroups = require("../../module/parser-14util/parseGroups");

var oneGroup = "001 - 17:09 Uhr / Kdo / Hilfeleistung: Weidstrasse, Wangen-Br�ttisellen";
var twoGroups = "20.10.2014	150 - 16:03 Uhr / KA2+KA3 / BMA: Rotbuchstrasse, Dübendorf";
describe("test group parsing", function () {
    it('should parse ["Kdo"]', function () {
        var actual = parseGroups(oneGroup);
        var expected = ["Kdo"];
        assert.deepEqual(actual, expected);
    })
});
describe("test date", function () {
    it('should parse ["KA2","KA3"]', function () {
        var actual = parseGroups(twoGroups);
        var expected = ["KA2", "KA3"];
        assert.deepEqual(actual, expected);
    })
});