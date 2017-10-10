/**
 * Created by longstone on 06/03/15.
 */
var express = require('express');
var router = express.Router();
var q = require('q');
var teleBot = require('./../module/telegram/telegramMngr');
var moment = require('moment');
var LodurEntry = require('./../schemas/lodurEntry');
var lodurUtil = require('./../module/util/lodur-util');

/* GET home page. */
var _lastEntryCache = null;
router.get('/', function (req, res) {
    var conf = {};
    if (req.query.hasOwnProperty('key')) {
        conf.key = req.query.key;
    }
    if(req.query.hasOwnProperty('msg')){
        conf.msg = req.query.msg;
    }
    
    if(req.quey.hasOwnProperty('channel')){}
    channelName

teleBot.sendToChannel(  conf.key, conf.msg, '@LodurUpdatesDueWaBrue'    );
    res.json({msg:'done'});

});

module.exports = router;
