/**
 * Created by longstone on 15/11/14.
 */
"use strict";
var request = require('request')
    , cheerio = require('cheerio'), parser14 = require("./parser-14"), q = require('q');// iconv = require('iconv');
module.exports = function pageLoaderF(url) {
    var deferred = q.defer();
    var parsedEntries, url;
    parsedEntries = [];
    url = 'http://www.lodur-zh.ch/duebendorf/index.php?modul=6';

    // encoding for umlaute
    request(url, {
        encoding: null
    }, function (err, resp, body) {
  //      var ic = new iconv.Iconv('iso-8859-1', 'utf-8');
    //    var buf = ic.convert(body);
      //  body = buf.toString('utf-8');

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