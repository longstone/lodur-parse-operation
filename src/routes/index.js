var express = require('express');
var router = express.Router();
var pageloader = require('../module/pageloader');
/* GET home page. */
router.get('/', function (req, res) {


    var success = function sucessF(json) {
        res.setHeader('charset', 'utf8');
        res.setHeader('Content-Length', new Buffer(json).length);
        res.json(json);


    };
    var fail = function failF(err) {
        res.json({error: err});
    };
    pageloader().then(success, fail);

});

module.exports = router;
