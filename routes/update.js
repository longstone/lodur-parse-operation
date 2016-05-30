/**
 * Created by longstone on 06/03/15.
 */
var express = require('express');
var router = express.Router();
var pageloader = require('../module/pageloader');
var q = require('q');
var teleBot = require('./../module/telegram/telegramMngr');
var moment = require('moment');
var LodurEntry = require('./../schemas/lodurEntry');
var lodurUtil = require('./../module/util/lodur-util');

/* GET home page. */
var _lastEntryCache = null;
router.get('/', function (req, res) {
    var silent = false;
    if (req.query.hasOwnProperty('silent')) {
        silent = req.query.silent;
    }


    LodurEntry.find({timestamp: {$gte: moment().year(new Date().getFullYear()).month(0).date(1).hour(0).minute(0).second(0).millisecond(0).toDate()}}).sort({number: -1}).limit(1).exec(function (err, docs) {
        //  console.log('err,docs', err, docs);
        if (docs.length === 0) {
            _lastEntryCache.number = -1;
        } else {
            _lastEntryCache = docs[0]._doc;
        }

        pageloader().then(success, fail);
    });
    var success = function sucessF(json) {

        var lastEntries = lodurUtil.getSendArray(json, _lastEntryCache);
        if (lastEntries.length > 0) {
            _lastEntryCache = lodurUtil.getLastEntry(lastEntries, _lastEntryCache);
            lodurUtil.sortArrayByNumber(lastEntries);
            lastEntries.forEach(function (item) {
                // persist new Entry
                LodurEntry.create({
                    number: item.number,
                    group: item.group,
                    timestamp: item.timestamp,
                    description: item.description
                }, function (err) {
                    console.log('persist new Entry Error', err);
                });

                teleBot("Wer:  " + item.group.toString() + "\n"
                    + "Was:  " + item.description + "\n"
                    + "Wann: " + moment(item.timestamp).locale('de').format('HH:mm DD.MM.YY') + "\n"
                    + "Nummer: " + item.number
                );
            });
        } else {
            if (!silent) {
                console.log('no update, latest was:', _lastEntryCache);
            }
        }
        var result = {newEntries: lastEntries};
        res.json(result);


    };
    var fail = function failF(err) {
        console.log('err', err);
        res.json({error: err});
    };


});

module.exports = router;
