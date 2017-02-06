"use strict";
const CheckEnv = require('./module/util/checkEnv');
const _ = require('lodash');
const LogEntry = require('./schemas/logEntry');
process.on('uncaughtException', function (err) {
    LogEntry.create({
        timestamp: new Date(),
        text: 'app.js - uncaughtException',
        error: JSON.stringify(err),
        description: _.get(err, 'message', 'nomessage') + '\nstack:\n' + _.get(err, 'stack', 'nostack')
    }, function (err) {
        if(err===null){return;}
        console.log('persist new Entry ', err);
    });
    console.error((new Date).toUTCString()+' uncaughtException:' );
    console.error(err);
    console.error(err.message);
    console.error(err.stack);
});

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('winston');
const  expressWinston = require('express-winston');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


var routes = require('./routes/index');
var updatePage = require('./routes/update');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(expressWinston.logger({
    transports: [
        new logger.transports.Console({
            json: true,
            colorize: true
        })
    ]
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/update', updatePage);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
const checkEnv = new CheckEnv(process.env);
checkEnv.setVariableNames(['MONGOURI','telegram_hash']);
const missingEnv = checkEnv.check();
if(missingEnv.length > 0 ){
   logger.log('warn','missing process.env variables: ',missingEnv);
}
var mongoUri = process.env.MONGOURI || "mongodb://localhost:27017/lodur";


mongoose.connect(mongoUri, function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + mongoUri + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + mongoUri);
    }
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(server_port, server_ip_address, function () {
    console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});

module.exports = app;