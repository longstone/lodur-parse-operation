/**
 * Created by longstone on 06/03/15.
 */
var express = require('express');
var router = express.Router();
var pageloader = require('../module/pageloader');
var gcm = require('node-gcm');
var Device = require('../schemas/device');
/* GET home page. */
router.get('/', function (req, res) {


    var success = function sucessF(json) {


        var message = new gcm.Message({
            collapseKey: 'demo',
            delayWhileIdle: true,
            timeToLive: 3,
            data: {
                message: json[0]
            }
        });
        var sender = new gcm.Sender(process.env.gcmapikey);
        var registrationIds = [];

        // ... or retrying
        Device.find({}).exec(function (err, result) {
            console.log(result);
            result.forEach(function (item) {

                registrationIds.push(item.deviceId);
                sender.send(message, registrationIds, function (err, result) {
                    if (err) {
                        console.error(err);
                        console.log("result: " + result)
                    }
                    else {
                        console.log(result);
                    }
                });
            });
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

