"use strict";
const request = require('request');
const cheerio = require('cheerio');
const parser14 = require("./parser-14");
const LogEntry = require('./../schemas/logEntry');

module.exports = function pageLoaderF(url_unsused) {
    return new Promise((resolve, reject)=>{
        let parsedEntries= [];
        let url = 'http://www.lodur-zh.ch/duebendorf/index.php?modul=6';
        let $;
        request(url, {
            uri: url,
            method: 'GET',
            encoding: 'binary'
        }, function (err, resp, body) {
            let contentsOfPage = [];
            try {
                $ = cheerio.load(body);
                contentsOfPage = $('div .content table');
            } catch (ex) {
                console.log('pageloader $',ex);
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
                reject(ex);
                return;
            }
            let entries = [];
            contentsOfPage.each(function (position, element) {
                const entry = $(element);
                entries.push(entry.text());
            });
            entries.shift(); // remove Einsatzberichte des Jahres...
            entries.forEach((element) =>{
                parsedEntries.push(parser14(element));
            });
            resolve(parsedEntries);
        });

    });
};