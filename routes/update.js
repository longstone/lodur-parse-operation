/**
 * Created by longstone on 06/03/15.
 */
var express = require('express');
var router = express.Router();
var pageloader = require('../module/pageloader');
var Device = require('../schemas/device');
var q = require('q');
var teleBot = require('./../module/telegram/telegramMngr');
var moment = require('moment');
var LodurEntry = require('./../schemas/lodurEntry');
/* GET home page. */
var _lastEntryCache = null;
router.get('/', function (req, res) {
    var silent = false;
    if (req.query.hasOwnProperty('silent')) {
        silent = req.query.silent;
    }


    LodurEntry.find({}).sort({number: -1}).limit(1).exec(function (err, docs) {
        //  console.log('err,docs', err, docs);
        if (docs.length === 0) {
            return;
        }
        _lastEntryCache = docs[0]._doc;
        pageloader().then(success, fail);
    });
    var success = function sucessF(json) {

        function getSendArray(json) {
            var sendArr = [];
            json.every(function (item) {
                if (item.number > _lastEntryCache.number) {
                    sendArr.push(item);
                    // persist new Entry
                    LodurEntry.create({
                        number: item.number,
                        group: item.group,
                        timestamp: item.timestamp,
                        description: item.description
                    }, function (err) {
                        console.log('persist new Entry Error', err);
                    });
                } else {
                    return false;
                }
            });
            if (sendArr[0]) {
                _lastEntryCache = sendArr[0];
            }
            return sendArr;
        }

        var lastEntries = getSendArray(json);
        if (lastEntries.length > 0) {
            lastEntries.reverse();
            lastEntries.forEach(function (item) {
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
