"use strict";
import Parser from "./module/parser-14";

require('source-map-support').install();
import 'source-map-support/register';
import PersistenceService from './module/persistence/persistence-service';
import TelegramBotService from './module/telegram/telegram-bot-service';
import Bot from 'node-telegram-bot'
import LodurEntry from './schemas/lodurEntry';
import Chats from './schemas/chats';
import LogEntry from './schemas/logEntry'
import _ from 'lodash';
import request from 'request';
import express from 'express';
import winston from 'winston';
import RouteIndex from './routes/route-index';
import RouteUpdate from './routes/route-update';
import RouteUpdateLastYear from './routes/route-update-last-year';
import RouteStats from './routes/route-stats';
import LodurUtil from './module/util/lodur-util';
import MongoConnection from './schemas/mongo-connect';
//# sourceMappingURL=./app.bundle.js.map

const CheckEnv = require('./module/util/checkEnv');
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

const path = require('path');
const favicon = require('serve-favicon');
const expressWinston = require('express-winston');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Pageloader = require('./module/pageloader');
const pageloader = new Pageloader.default();
const app = express();


// uncomment after placing your favicon in /public
// @todo place favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.Console({
            colorize: true,
            level: 'debug'
        }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const config = {telegramToken: process.env.telegram_hash};
const bot = new Bot({token: config.telegramToken});

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
    telegramBotService: null,

};
dependencies.telegramBotService = new TelegramBotService(bot, dependencies);
const router = express.Router();
router.get('/', new RouteIndex(dependencies).getRoute());
router.get('/update', new RouteUpdate(dependencies).getRoute());
router.get('/update-last-year', new RouteUpdateLastYear(dependencies).getRoute());
router.get('/stats-dasheroo', new RouteStats(dependencies).getRoute());
app.use('/', router);
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

const options = {promiseLibrary: global.Promise};

const mongoUri = process.env.MONGOURI || "mongodb://localhost:27017/lodur";
new MongoConnection(mongoose, mongoUri, logger);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    logger.level = 'silly';
    logger.warn('env:development');
    mongoose.set('debug', true);
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
} else {
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
}

app.listen(LodurUtil.getServerPort(), LodurUtil.getServerIp(), function () {
    logger.log('info', "Listening on server_port: " + LodurUtil.getServerPort());
    logger.log('info', "Listening on server_ip_address: " + LodurUtil.getServerIp());
});

export default app;
