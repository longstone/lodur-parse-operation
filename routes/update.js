/**
 * Created by longstone on 06/03/15.
 */
var express = require('express');
var router = express.Router();
var pageloader = require('../module/pageloader');
var gcm = require('node-gcm');
var Device = require('../schemas/device');
var q = require('q');
var teleBot = require('./../module/telegram/telegramMngr');
var moment = require('moment');
/* GET home page. */
lastID = -1;
router.get('/', function (req, res) {


    var success = function sucessF(json) {

        var lastEntry = json[0];
        if (lastID !== lastEntry.number) {
            teleBot("Wer:  " + lastEntry.group.toString() + "\n"
                + "Was:  " + lastEntry.description + "\n"
                + "Wann: " + moment(lastEntry.timestamp).locale('de').format('HH:mm DD.MM.YY')
            );
            _lastEntryCache = lastEntry;
        }
        var message = new gcm.Message({
            collapseKey: lastEntry.number,
            delayWhileIdle: true,
            timeToLive: 259200,
            data: {
                message: lastEntry
            }
        });
        var sender = new gcm.Sender(process.env.gcmapikey);
        var registrationIds = [];
        // ... or retrying
        Device.find({}).exec(function (err, result) {
            console.log(result);
            if (lastID !== lastEntry.number) {

                lastID = lastEntry.number;
                result.forEach(function (item) {

                    // registrationIds.push(item.deviceId);
                    sender.send(message, item.deviceId, function (err, result) {
                        if (err) {
                            console.error(err);
                            console.log("failed sending, result: " + err)
                        }
                        else {
                            console.log('sent to' + JSON.stringify(result) + " - Message: " + JSON.stringify(message));
                        }
                    });
                });
            } else {
                console.log('no update, latest id ' + lastID);
            }
            res.statusCode = 204;
            res.send();
        });


    };
    var fail = function failF(err) {
        res.json({error: err});
    };
    pageloader().then(success, fail);

});

module.exports = router;
