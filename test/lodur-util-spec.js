'use-strict';
/**
 * Created by longstone on 15/05/16.
 */

var assert = require("assert");

var lodurUtil = require('./../module/util/lodur-util');

describe('last entry', function () {
    it('should return the last entry of array', function () {
        var cache = {number: 6};
        var items = [{number: 4}, {number: 5}, {number: 6}, {number: 7}];
        var actual = lodurUtil.getLastEntry(items, cache);
        var expected = {number: 7};
        assert.deepEqual(actual, expected);
    });

    it('should return cache if array is empty', function () {
        var cache = {number: 6};
        var items = [];
        var actual = lodurUtil.getLastEntry(items, cache);
        assert.deepEqual(actual, cache);
    });

});
describe("new entries array filtering", function () {


    it('should return nothing', function () {
        var cache = {number: 6};
        var items = [{number: 4}, {number: 5}, {number: 6}];
        var actual = lodurUtil.getSendArray(items, cache);
        var expected = [];
        assert.deepEqual(actual, expected);
    });

    it('should add only 6', function () {
        var cache = {number: 5};
        var items = [{number: 4}, {number: 5}, {number: 6}];
        var actual = lodurUtil.getSendArray(items, cache);
        var expected = [{number: 6}];
        assert.deepEqual(actual, expected);
    });

    it('should add 6 and 7', function () {
        var cache = {number: 5};
        var items = [{number: 4}, {number: 5}, {number: 6}, {number: 7}];
        var actual = lodurUtil.getSendArray(items, cache);
        var expected = [{number: 6}, {number: 7}];
        assert.deepEqual(actual, expected);
    });
});