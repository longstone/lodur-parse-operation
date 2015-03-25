/**
 * Created by longstone on 18/03/15.
 */
var express = require('express');
var router = express.Router();
var device = require('../Schemas/device');

router.post('/', function (req, res) {
    var sendHeaders = false;
    var fail = function failF(err) {
        console.log(err);
        res.json({error: err});
        sendHeaders = true;
    };
    try {
        var newDevice = new device({
            deviceId: req.body.deviceId
        });
        console.log(newDevice.deviceId);
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
