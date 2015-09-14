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
var lastID = 163;
var _lastEntryCache = null;
router.get('/', function (req, res) {

    if (!_lastEntryCache) {
        LodurEntry.find({}).sort({number: -1}).limit(1).exec(function (err, docs) {
            if (docs.length === 0) {
                return;
            }
            _lastEntryCache = docs[0]._doc;
            lastID = _lastEntryCache.number;
        });
    }
    var success = function sucessF(json) {

        function getSendArray(json) {
            var sendArr = [];
            json.forEach(function (item) {
                if (item.number > lastID) {
                    sendArr.push(item);
                    LodurEntry.create({
                        number: item.number,
                        group: item.group,
                        timestamp: item.timestamp,
                        description: item.description
                    }, function (err) {
                        console.log(err);
                    });
                    _lastEntryCache = item;
                    lastID = _lastEntryCache.number;
                }
            });

            return sendArr;
        }

        var lastEntries = getSendArray(json);
        lastEntries.reverse();
        lastEntries.forEach(function (item) {
            teleBot("Wer:  " + item.group.toString() + "\n"
                + "Was:  " + item.description + "\n"
                + "Wann: " + moment(item.timestamp).locale('de').format('HH:mm DD.MM.YY') + "\n"
                + "Nummer: " + item.number
            );
        });


    };
    var fail = function failF(err) {
        res.json({error: err});
    };
    pageloader().then(success, fail);

});

module.exports = router;
