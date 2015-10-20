/**
 * Created by longstone on 15/11/14.
 */
"use strict";
var request = require('request');
var cheerio = require('cheerio');
var parser14 = require("./parser-14");
var q = require('q');
require('iconv-lite').extendNodeEncodings();
module.exports = function pageLoaderF(url) {
    var deferred = q.defer();
    var parsedEntries, url;
    parsedEntries = [];
    url = 'http://www.lodur-zh.ch/duebendorf/index.php?modul=6';

    // encoding for umlaute
    request(url, {
        uri: url,
        method: 'GET',
        encoding: "ISO-8859-1"
    }, function (err, resp, body) {
        var $ = cheerio.load(body);
        var contentsOfPage = $('div .content table');
        var entries = [];
        contentsOfPage.each(function (position, element) {

            // returns something like:
            /**
             *19.11.2014
             164 - 22:32 Uhr / BAG N1 / Rauch/gelöschter Brand: Hörnlistrasse, Dübendorf
             */
            var entry = $(element);
            // extract text only
            entries.push(entry.text());

        });
        entries.shift(); // remove Einsatzberichte des Jahres...
        entries.forEach(function (element) {
            parsedEntries.push(parser14(element));
        });
        deferred.resolve(parsedEntries);
//        $(links).each(function(i, link){
        ///          console.log($(link).text() + ':\n  ' + $(link).attr('href'));
        //   });
    });

    return deferred.promise;
};