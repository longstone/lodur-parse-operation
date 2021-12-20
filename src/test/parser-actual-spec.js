/**
 * Created by longstone on 20/11/14.
 */
"use strict";
const Parser = require("../module/parser-actual");
const _ = require('underscore');
const assert = require('assert');

// var value = '\n\n03.01.2014\n001 - 17:09 Uhr / Kdo / Hilfeleistung: Weidstrasse, Wangen-Br�ttisellen\n\n';
describe("Actual Parser", function () {
    const parser = new Parser.default()
    let oldTimestamp;
    let newTimestamp;
    before('set up two entries', () => {
         oldTimestamp = parser.getTimestamp("01.01.2021\t001 - 00:22 Uhr / KAN3+FU1 / BMA / Giessenstrasse, Dübendorf");
         newTimestamp = parser.getTimestamp("01.01.2021\t001 – 00:22 Uhr / KAN3+FU1 / BMA / Giessenstrasse, Dübendorf");
    })

    it('should parse the same date', () => {
        assert.strictEqual(oldTimestamp.isSame(newTimestamp),true)
    })

});