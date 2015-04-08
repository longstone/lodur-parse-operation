/**
 * Created by longstone on 06/03/15.
 */
var express = require('express');
var moment = require('moment');
var router = express.Router();
var gcm = require('node-gcm');
var Device = require('../schemas/device');
var q = require('q');
/* GET home page. */

router.get('/', function (req, res) {


    var entry = {
        timestamp: moment().toDate(),
        group: ["Heartbeat"],

        description: "Heartbeat check",
        number: -2
    };
    var message = new gcm.Message({
        collapseKey: "heartbeat",
        delayWhileIdle: true,
        timeToLive: 120,
        data: {
            message: entry
        }
    });
    var sender = new gcm.Sender(process.env.gcmapikey);
    var registrationIds = [];

    // ... or retrying
    Device.find({}).exec(function (err, result) {
        console.log(result);

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

        res.statusCode = 204;
        res.send();
    });


});

module.exports = router;
