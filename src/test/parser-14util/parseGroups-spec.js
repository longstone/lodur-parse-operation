/**
 * Created by longstone on 20/11/14.
 */
"use strict";
var assert = require("assert");

var parseGroups = require("../../module/parser-14util/parseGroups");

var oneGroup =  "Kdo";
var twoGroups = "KA2+KA3";
describe("parse groups", function () {
    it('should parse ["Kdo"]', function () {
        var actual = parseGroups(oneGroup);
        var expected = ["Kdo"];
        assert.deepEqual(actual, expected);
    });

    it('should parse ["KA2","KA3"]', function () {
        var actual = parseGroups(twoGroups);
        var expected = ["KA2", "KA3"];
        assert.deepEqual(actual, expected);
    });
});