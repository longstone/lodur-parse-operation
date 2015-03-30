/**
 * Created by longstone on 06/03/15.
 */
var express = require('express');
var router = express.Router();
var pageloader = require('../module/pageloader');
var gcm = require('node-gcm');
var Device = require('../schemas/device');
var q = require('q');
/* GET home page. */
lastID = -1;
router.get('/', function (req, res) {


    var success = function sucessF(json) {


        var message = new gcm.Message({
            collapseKey: result.id,
            delayWhileIdle: true,
            timeToLive: 259200,
            data: {
                message: json[0]
            }
        });
        var sender = new gcm.Sender(process.env.gcmapikey);
        var registrationIds = [];

        // ... or retrying
        Device.find({}).exec(function (err, result) {
            console.log(result);
            if (lastID !== result.id) {
                lastID = result.id;
            result.forEach(function (item) {

                // registrationIds.push(item.deviceId);
                sender.send(message, item.deviceId, function (err, result) {
                    if (err) {
                        console.error(err);
                        console.log("result: " + result)
                    }
                    else {
                        console.log(JSON.stringify(result) + " - Message: " + JSON.stringify(message));
                    }
                });
            });
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
