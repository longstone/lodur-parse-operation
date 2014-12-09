/**
 * Created by longstone on 20/11/14.
 */
"use strict"
var parser14 =require("./../module/parser-14"), _ = require('underscore');

var value = '\n\n03.01.2014\n001 - 17:09 Uhr / Kdo / Hilfeleistung: Weidstrasse, Wangen-Br�ttisellen\n\n';
describe("test date",function(){
    it('parse date',function(){
        var entries = parser14.getValues(value);
        expect(_.first(entries).getDate().toBe('03.01.2014'));
    })
});