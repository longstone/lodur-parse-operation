"use strict";
const request = require('request');
const cheerio = require('cheerio');
const parser14 = require("./parser-14");
const q = require('q');
const LogEntry = require('./../schemas/logEntry');

module.exports = function pageLoaderF(url) {
    const deferred = q.defer();
    let parsedEntries;
    let url = 'http://www.lodur-zh.ch/duebendorf/index.php?modul=6';
    parsedEntries = [];

    request(url, {
        uri: url,
        method: 'GET',
        encoding: 'binary'
    }, function (err, resp, body) {
        var contentsOfPage = [];
        try {
            var $ = cheerio.load(body);
            contentsOfPage = $('div .content table');

        } catch (ex) {
            LogEntry.create({
                timestamp: new Date(),
                text: 'pageloader - parser: uncaughtException',
                error: JSON.stringify(ex),
                description: ex.message + '\nbody:' + body + '\n' + ex.stack
            }, function (err) {
                if (err === null) {
                    return;
                }
                console.log('persist new Entry ', err);
            });
        }
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