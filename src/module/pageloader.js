"use strict";
const logger = require('winston');
const axios = require('axios').default;
const cheerio = require('cheerio');
const Parser = require("./parser-14");
class Pageloader {

    constructor() {
        this.parser = new Parser.default();
        this.cheerio = cheerio;
        this.axios = axios;
    }

    parse(text) {
        return this.parser.parse(text);
    }

    load(url_unused) {
        return new Promise((resolve, reject) => {
            let url = url_unused || 'https://www.lodur-zh.ch/duebendorf/index.php?modul=6';
            this.axios.get(url, {responseEncoding: 'binary' })
                .then(this.htmlToLines.bind(this))
                .then(this.linesToEntries.bind(this))
                .then(resolve)
                .catch(reject);

        });
    }

    htmlToLines(response) {
        let html = response.data;
        let $ = this.cheerio.load(html , {
            normalizeWhitespace: true,
            xmlMode: true
        });
        let contentsOfPage = $('div .content table');
        let entries = [];
        contentsOfPage.each(function (position, element) {
            const entry = $(element);
            entries.push(entry.text());
        });
        return entries;
    }

    linesToEntries(elements) {
        elements.shift(); // remove Einsatzberichte des Jahres...
        return elements.map(element => this.parse(element));
    }

    // handleException(ex, reject) {
    //     LogEntry.create({
    //         timestamp: new Date(),
    //         text: 'pageloader - parser: uncaughtException',
    //         error: JSON.stringify(ex),
    //         description: ex.message + ex.stack
    //     }, function (err) {
    //         if (err === null) {
    //             return;
    //         }
    //         console.log('persist new Entry ', err);
    //     });
    //     logger.log('error: pageloader parse', ex);
    //     reject({'err-parse-contents-page': ex});
    // }
}

export default Pageloader;
