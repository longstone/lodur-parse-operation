/**
 * Created by longstone on 06/03/15.
 */
import express from 'express';
const router = express.Router();
import pageloader from '../module/pageloader';
import TelegramBotNG  from './../module/telegram/telegram-bot-service';
import moment from 'moment';
import LodurEntry from './../schemas/lodurEntry';
import lodurUtil from './../module/util/lodur-util';
import log from 'winston';

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

let _lastEntryCache = {};
router.get('/', function (req, res) {
    let silent = false;
    if (req.query.hasOwnProperty('silent')) {
        silent = req.query.silent;
    }
    const success = function sucessF(json) {

        let lastEntries = lodurUtil.getSendArray(json, _lastEntryCache);
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
                        const message = "Wer:  " + item.group.toString() + "\n"
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
        const result = {newEntries: lastEntries};
        res.json(result);


    };
    const fail = function failF(err) {
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
