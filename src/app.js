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
        if (err === null) {
            return;
        }
        console.log('persist new Entry ', err);
    });
    console.error((new Date).toUTCString() + ' uncaughtException:');
    console.error(err);
    console.error(err.message);
    console.error(err.stack);
});

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('winston');
const expressWinston = require('express-winston');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const routes = require('./routes/index');
const updatePage = require('./routes/update');
const app = express();

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
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
const checkEnv = new CheckEnv(process.env);
checkEnv.setVariableNames(['MONGOURI', 'telegram_hash']);
const missingEnv = checkEnv.check();
if (missingEnv.length > 0) {
    logger.log('warn', 'missing process.env variables: ', missingEnv);
}
const mongoUri = process.env.MONGOURI || "mongodb://localhost:27017/lodur";


mongoose.connect(mongoUri, function (err, res) {
    const stripCredentialsConnectionString = function (uri) {
        const indexOfAt = uri.indexOf('@');
        let substFrom = 0;
        if (indexOfAt > 0) {
            substFrom = indexOfAt;
        }
      return uri.substring(substFrom);
    };
    const connectionStringWithoutCredentials = stripCredentialsConnectionString(mongoUri);
    if (err) {
        logger.log('error', 'ERROR connecting to: ' + connectionStringWithoutCredentials + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + connectionStringWithoutCredentials);
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
    logger.log('error',err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
const server_port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;
const server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(server_port, server_ip_address, function () {
    logger.log('info',"Listening on " + server_ip_address + ", server_port " + server_port)
});

module.exports = app;
