/**
 * Created by longstone on 15/11/14.
 */
"use strict";
var Entry = require("./entry");
var empty = '';
module.exports = function(){
describe("testDefaults", function () {
    it("initial timestamp is empty and not undefined", function () {
        var entry = new Entry();
        expect(entry.getTimestamp().toBe(empty));
    });
    it("initial group is empty and not undefined", function () {
        var entry = new Entry();
        expect(entry.getGroup().toBe(empty));
    });
    it("initial description is empty and not undefined", function () {
        var entry = new Entry();
        expect(entry.getDescription().toBe(empty));
    });

});
};