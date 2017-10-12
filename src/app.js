"use strict";
require('source-map-support').install();
import 'source-map-support/register';
//# sourceMappingURL=./app.bundle.js.map

import PersistenceService from './module/persistence/persistence-service';
import TelegramBotService from './module/telegram/telegram-bot-service';
import Bot from 'node-telegram-bot'
import LodurEntry from './schemas/lodurEntry';
import Chats from './schemas/chats';
import LogEntry from './schemas/logEntry'

const CheckEnv = require('./module/util/checkEnv');
import _  from 'lodash';
import request from 'request';
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

import express from 'express';
import logger from 'winston';

const path = require('path');
const favicon = require('serve-favicon');
const expressWinston = require('express-winston');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
import RouteIndex from './routes/route-index';
import RouteUpdate from './routes/route-update';
import LodurUtil from './module/util/lodur-util';
const pageloader = require('./module/pageloader');
const app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(expressWinston.logger({
//     transports: [
//         new logger.transports.Console({
//             json: true,
//             colorize: true
//         })
//     ]
// }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const config = {telegramToken: process.env.telegram_hash};
const dependencies = {
    express,
    pageloader,
    persistenceService: new PersistenceService({
        Chats,
        LogEntry,
        LodurEntry
    }, {logger}),
    logger,
    request,
    telegramBotService: null
};
const bot = new Bot({token: config.telegramToken});
dependencies.telegramBotService = new TelegramBotService(bot, dependencies);
const router = express.Router();
router.get('/', new RouteIndex(dependencies).getRoute());
router.get('/update', new RouteUpdate(dependencies).getRoute());
app.use('/',router);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    logger.log('warn', 'errorhandler ', req.originalUrl);
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
mongoose.Promise = global.Promise;
const mongoUri = process.env.MONGOURI || "mongodb://localhost:27017/lodur";
const options = { promiseLibrary: global.Promise };
const stripCredentialsConnectionString = function (uri) {
    const indexOfAt = uri.indexOf('@');
    let substFrom = 0;
    if (indexOfAt > 0) {
        substFrom = indexOfAt;
    }
    return uri.substring(substFrom);
};
const connectionStringWithoutCredentials = stripCredentialsConnectionString(mongoUri);
var promise = mongoose.createConnection(mongoUri, {
    useMongoClient: true
}).then(
    () => logger.log('info','Succeeded connected to: ' + connectionStringWithoutCredentials) ,
    err => logger.log('error', 'ERROR connecting to: ' + connectionStringWithoutCredentials + '. ' + err)
);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    logger.level = 'silly';
    logger.warn('env:development');
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    logger.log('error', err);
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});


app.listen(LodurUtil.getServerPort(),LodurUtil.getServerIp(), function () {
    logger.log('info', "Listening on server_port: " + LodurUtil.getServerPort());
    logger.log('info', "Listening on server_ip_address: " + LodurUtil.getServerIp());
});

module.exports = app;
