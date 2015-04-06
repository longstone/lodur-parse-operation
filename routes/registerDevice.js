/**
 * Created by longstone on 18/03/15.
 */
var express = require('express');
var winston = require('winston');
var router = express.Router();
var device = require('../schemas/device');

router.post('/', function (req, res) {
    var sendHeaders = false;
    var fail = function failF(err) {
        if (err) {
            winston.info("something is going wrong while persisting " + JSON.stringify(err));
        res.json({error: err});
        sendHeaders = true;
        }
    };
    try {
        var newDevice = new device({
            deviceId: req.body.deviceId
        });
        winston.info("register new Device: " + JSON.stringify(newDevice));
        newDevice.save(fail);
    } catch (err) {
        fail(err);
        return
    }
    if (!sendHeaders) {
        res.statusCode = 201;
        res.send();
    }
});

module.exports = router;
