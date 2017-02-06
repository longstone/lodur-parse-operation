/**
 * Created by longstone on 06/03/15.
 */
var express = require('express');
var router = express.Router();
var pageloader = require('../module/pageloader');
var q = require('q');
var teleBot = require('./../module/telegram/telegramMngr');
var TelegramBotNG = require('./../module/telegram/telegram-bot-service');
var moment = require('moment');
var LodurEntry = require('./../schemas/lodurEntry');
var lodurUtil = require('./../module/util/lodur-util');
var log = require('winston');

const dependencies = {
    'node-telegram-bot': require('node-telegram-bot'),
    lodash: require('lodash'),
    request: require('request'),
    logger: log,
    schemas: {
        Chats: require('./../schemas/chats'),
        LogEntry: require('./../schemas/logEntry')
    },
    config: {
        'telegram-token': process.env.telegram_hash
    }
};
const telegramBot = new TelegramBotNG(dependencies);

/* GET home page. */
var _lastEntryCache = null;
router.get('/', function (req, res) {
    let silent = false;
    if (req.query.hasOwnProperty('silent')) {
        silent = req.query.silent;
    }
    var success = function sucessF(json) {

        var lastEntries = lodurUtil.getSendArray(json, _lastEntryCache);
        if (lastEntries.length > 0) {
            _lastEntryCache = lodurUtil.getLastEntry(lastEntries, _lastEntryCache);
            lodurUtil.sortArrayByNumber(lastEntries);
            if (lodurUtil.containsDuplicatedID(lastEntries)) {
                log.log('warn','duplicated ID in entries: ', JSON.stringify(lastEntries));
            } else {
                lastEntries.forEach(function (item) {
                    // persist new Entry
                    let errorFree = true;
                    LodurEntry.create({
                        number: item.number,
                        group: item.group,
                        timestamp: item.timestamp,
                        description: item.description
                    }, function (err) {
                        if (err === null) {
                            return;
                        }
                        log.log('error','persist new Entry Error', err);
                        errorFree = false;
                    });
                    if (errorFree) {
                        var message = "Wer:  " + item.group.toString() + "\n"
                            + "Was:  " + item.description + "\n"
                            + "Wann: " + moment(item.timestamp).locale('de').format('HH:mm DD.MM.YY') + "\n"
                            + "Nummer: " + item.number;
                        telegramBot.notifyAll(message);
                        //   teleBot(message);
                    }
                });
            }
        } else {
            if (!silent) {
                log.debug('no update, latest was:', _lastEntryCache);
            }
        }
        var result = {newEntries: lastEntries};
        res.json(result);


    };
    var fail = function failF(err) {
        log.log('error','err', err);
        res.json({error: err});
    };


    LodurEntry.find({timestamp: {$gte: moment().year(new Date().getFullYear()).month(0).date(1).hour(0).minute(0).second(0).millisecond(0).toDate()}}).sort({number: -1}).limit(1).exec(function (err, docs) {
        if (docs.length === 0) {
            _lastEntryCache.number = -1;
        } else {
            _lastEntryCache = docs[0]._doc;
        }

        pageloader().then(success, fail);
    });


});

module.exports = router;
