'use-strict';
/**
 * Created by longstone on 15/05/16.
 */

var assert = require("assert");
var createNumberEntry = function (number) {
    return {number: number};
};
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

describe('order array by number', function () {
    it('should sort a unsorted array', function () {
        var arr = [createNumberEntry(2), createNumberEntry(3), createNumberEntry(1)];
        var expected = [createNumberEntry(1), createNumberEntry(2), createNumberEntry(3)];
        var actual = lodurUtil.sortArrayByNumber(arr);
        assert.deepEqual(arr, expected);
    });
    // https://github.com/longstone/lodur-parse-operation/issues/4
    it('should order multible entries the right way', function () {
        var arr = [{
            "timestamp": "2016-11-26T11:39:00.000Z",
            "group": [
                "KA4"
            ],
            "description": "BMA: Giessenstrasse, Dübendorf",
            "number": 200
        }, {
            "timestamp": "2016-11-26T14:29:00.000Z",
            "group": [
                "BagT1"
            ],
            "description": "gelöschter Brand/Rauchentwicklung: Hallenstrasse, Dübendorf",
            "number": 201
        },
            {
                "timestamp": "2016-11-26T10:35:00.000Z",
                "group": [
                    "KA3"
                ],
                "description": "BMA: Giessenstrasse, Dübendorf",
                "number": 199
            },
            {
                "timestamp": "2016-11-26T03:01:00.000Z",
                "group": [
                    "VrkGr"
                ],
                "description": "Verkehrsunfall: Bettlistrasse, Dübendorf",
                "number": 198
            }];
        var expected = [{
            "timestamp": "2016-11-26T03:01:00.000Z",
            "group": [
                "VrkGr"
            ],
            "description": "Verkehrsunfall: Bettlistrasse, Dübendorf",
            "number": 198
        }, {
            "timestamp": "2016-11-26T10:35:00.000Z",
            "group": [
                "KA3"
            ],
            "description": "BMA: Giessenstrasse, Dübendorf",
            "number": 199
        }, {
            "timestamp": "2016-11-26T11:39:00.000Z",
            "group": [
                "KA4"
            ],
            "description": "BMA: Giessenstrasse, Dübendorf",
            "number": 200
        }, {
            "timestamp": "2016-11-26T14:29:00.000Z",
            "group": [
                "BagT1"
            ],
            "description": "gelöschter Brand/Rauchentwicklung: Hallenstrasse, Dübendorf",
            "number": 201
        }];
        var actual = lodurUtil.sortArrayByNumber(arr);
        assert.deepEqual(arr, expected);
    });
    // https://github.com/longstone/lodur-parse-operation/issues/4
    it('should order multible entries the right way and return them', function () {
        var arr = [{
            "timestamp": "2016-11-26T11:39:00.000Z",
            "group": [
                "KA4"
            ],
            "description": "BMA: Giessenstrasse, Dübendorf",
            "number": 200
        }, {
            "timestamp": "2016-11-26T14:29:00.000Z",
            "group": [
                "BagT1"
            ],
            "description": "gelöschter Brand/Rauchentwicklung: Hallenstrasse, Dübendorf",
            "number": 201
        },
            {
                "timestamp": "2016-11-26T10:35:00.000Z",
                "group": [
                    "KA3"
                ],
                "description": "BMA: Giessenstrasse, Dübendorf",
                "number": 199
            },
            {
                "timestamp": "2016-11-26T03:01:00.000Z",
                "group": [
                    "VrkGr"
                ],
                "description": "Verkehrsunfall: Bettlistrasse, Dübendorf",
                "number": 198
            }];
        var expected = [{
            "timestamp": "2016-11-26T03:01:00.000Z",
            "group": [
                "VrkGr"
            ],
            "description": "Verkehrsunfall: Bettlistrasse, Dübendorf",
            "number": 198
        }, {
            "timestamp": "2016-11-26T10:35:00.000Z",
            "group": [
                "KA3"
            ],
            "description": "BMA: Giessenstrasse, Dübendorf",
            "number": 199
        }, {
            "timestamp": "2016-11-26T11:39:00.000Z",
            "group": [
                "KA4"
            ],
            "description": "BMA: Giessenstrasse, Dübendorf",
            "number": 200
        }, {
            "timestamp": "2016-11-26T14:29:00.000Z",
            "group": [
                "BagT1"
            ],
            "description": "gelöschter Brand/Rauchentwicklung: Hallenstrasse, Dübendorf",
            "number": 201
        }];
        var actual = lodurUtil.sortArrayByNumber(arr);
        assert.deepEqual(actual, expected);
    });
});

describe('isOrderingForwards', function () {
    it('should be true when ordering is forwards', function () {
        var items = [{number: 4}, {number: 5}, {number: 6}, {number: 7}];
        var actual = lodurUtil.isOrderingForwards(items);
        var expected = true;
        assert.deepEqual(actual, expected);
    });

    it('should be false when ordering is backwards', function () {
        var items = [{number: 4}, {number: 5}, {number: 6}, {number: 7}].reverse();
        var actual = lodurUtil.isOrderingForwards(items);
        var expected = false;
        assert.deepEqual(actual, expected);
    });

    it('should return true when array is empty', function () {
        var items = [].reverse();
        var actual = lodurUtil.isOrderingForwards(items);
        var expected = false;
        assert.deepEqual(actual, expected);
    });

});
describe("recognize duplicated ids", () => {
    it('should recognize duplicated numbers', () => {
        var items = [{number: 4}, {number: 6}, {number: 6}, {number: 5}];
        var actual = lodurUtil.containsDuplicatedID(items);
        var expected = true;
        assert.equal(actual, expected);
    })

    it('should return false when not containing duplicated numbers', () => {
        var items = [{number: 4}, {number: 6}, {number: 7}, {number: 5}];
        var actual = lodurUtil.containsDuplicatedID(items);
        var expected = false;
        assert.equal(actual, expected);
    })
    it('should not fail if input is empty array', () => {
        var items = [];
        var actual = lodurUtil.containsDuplicatedID(items);
        var expected = false;
        assert.equal(actual, expected);
    })
    it('should not fail if input is undefined', () => {
        var items = [];
        var actual = lodurUtil.containsDuplicatedID();
        var expected = false;
        assert.equal(actual, expected);
    })
    it('should not fail if input is null', () => {
        var items = [];
        var actual = lodurUtil.containsDuplicatedID(null);
        var expected = false;
        assert.equal(actual, expected);
    })
});
describe("new entries array filtering", function () {


    it('should return nothing', function () {
        var cache = {number: 6};
        var items = [{number: 4}, {number: 5}, {number: 6}].reverse();
        var actual = lodurUtil.getSendArray(items, cache);
        var expected = [];
        assert.deepEqual(actual, expected);
    });
    it('should return nothing on empty input', function () {
        var cache = {number: -1};
        var items = [].reverse();
        var actual = lodurUtil.getSendArray(items, cache);
        var expected = [];
        assert.deepEqual(actual, expected);
    });

    it('should add only 6', function () {
        var cache = {number: 5};
        var items = [{number: 4}, {number: 5}, {number: 6}].reverse();
        var actual = lodurUtil.getSendArray(items, cache);
        var expected = [{number: 6}];
        assert.deepEqual(actual, expected);
    });

    it('should add 6 and 7', function () {
        var cache = {number: 5};
        var items = [{number: 4}, {number: 5}, {number: 6}, {number: 7}].reverse();
        var actual = lodurUtil.getSendArray(items, cache);
        var expected = [{number: 6}, {number: 7}];
        assert.deepEqual(actual, expected);
    });
});