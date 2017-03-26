(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 24);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mongoose = __webpack_require__(1);

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logSchema = new _mongoose2.default.Schema({
    timestamp: Date,
    text: String,
    error: {},
    description: String
});

var LogEntry = void 0;
if (_mongoose2.default.models.LogEntry) {
    LogEntry = _mongoose2.default.model('LogEntry');
} else {
    LogEntry = _mongoose2.default.model('LogEntry', logSchema);
}
module.exports = LogEntry;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("string");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var request = __webpack_require__(5);
var cheerio = __webpack_require__(34);
var parser14 = __webpack_require__(26);
var LogEntry = __webpack_require__(3);

module.exports = function pageLoaderF(url_unsused) {
    return new Promise(function (resolve, reject) {
        var parsedEntries = [];
        var url = 'https://www.lodur-zh.ch/duebendorf/index.php?modul=6';
        var $ = void 0;
        request(url, {
            uri: url,
            method: 'GET',
            encoding: 'binary'
        }, function (err, resp, body) {
            var contentsOfPage = [];
            try {
                $ = cheerio.load(body);
                contentsOfPage = $('div .content table');
            } catch (ex) {
                console.log('pageloader $', ex);
                LogEntry.create({
                    timestamp: new Date(),
                    text: 'pageloader - parser: uncaughtException',
                    error: JSON.stringify(ex),
                    description: ex.message + '\nbody:' + body + '\n' + ex.stack
                }, function (err) {
                    if (err === null) {
                        return;
                    }
                    console.log('persist new Entry ', err);
                });
                logger.log('error: pageloader parse', ex);
                reject({ 'err-parse-contents-page': ex });
                return;
            }
            var entries = [];
            contentsOfPage.each(function (position, element) {
                var entry = $(element);
                entries.push(entry.text());
            });
            entries.shift(); // remove Einsatzberichte des Jahres...
            entries.forEach(function (element) {
                parsedEntries.push(parser14(element));
            });
            resolve(parsedEntries);
        });
    });
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = __webpack_require__(0);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PersistenceService = function () {
    function PersistenceService(schemas, dependencies) {
        _classCallCheck(this, PersistenceService);

        this.LodurEntry = schemas.LodurEntry;
        this.Chats = schemas.Chats;
        this.LogEntry = schemas.LogEntry;
        this.logger = dependencies.logger;
        this.query = {
            entriesThisYear: { timestamp: { $gte: (0, _moment2.default)().year(new Date().getFullYear()).month(0).date(1).hour(0).minute(0).second(0).millisecond(0).toDate() } }
        };
    }

    _createClass(PersistenceService, [{
        key: 'getLastEntryForYear',
        value: function getLastEntryForYear() {
            return this.LodurEntry.find(this.query.entriesThisYear).sort({ number: -1 }).limit(1).exec();
        }
    }, {
        key: 'getEntriesForActualYear',
        value: function getEntriesForActualYear() {
            return this.LodurEntry.find(this.query.entriesThisYear).sort({ number: -1 }).exec();
        }
    }, {
        key: 'createNewLodurEntry',
        value: function createNewLodurEntry(dto) {
            return new this.LodurEntry(dto).save();
        }
    }, {
        key: 'findChatsById',
        value: function findChatsById(chatId) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                _this.Chats.find({ chatId: chatId }, function (err, docs) {
                    if (err !== null) {
                        reject({ 'err-find-chats-by-id': err });
                    } else {
                        resolve(docs);
                    }
                });
            });
        }
    }, {
        key: 'findAllChats',
        value: function findAllChats() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                _this2.Chats.find({}, function (err, chats) {
                    if (err != null) {
                        reject({ 'err-find-all-chats': err });
                    } else {
                        resolve(chats);
                    }
                });
            });
        }

        /**
         *
         * @param chat {
                    chatId,
                    firstName,
                    lastName,
                    type,
                    username
                }
         * @returns {Promise}
         */

    }, {
        key: 'createChat',
        value: function createChat(chat) {
            return new this.Chats(chat).save();
        }
    }, {
        key: 'log',
        value: function log(text, error) {
            this.logger.log('debug', 'persistence-service logged: ' + text + ' -> ' + error);
            this.LogEntry.create({
                timestamp: new Date(),
                text: text,
                error: error
            }, function (err) {
                if (err !== null) {
                    this.logger.log('error', 'persist new received Error', err);
                }
            });
        }
    }]);

    return PersistenceService;
}();

module.exports = PersistenceService;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = __webpack_require__(2);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TelegramBotService = function () {
    function TelegramBotService(botInstance, dependencies) {
        _classCallCheck(this, TelegramBotService);

        this.req = {};
        this.req.request = dependencies.request;
        this.persistenceService = dependencies.persistenceService;
        this.logger = dependencies.logger;
        this.bot = this._initBot(botInstance, this.logger);
    }

    _createClass(TelegramBotService, [{
        key: '_initBot',
        value: function _initBot(botInstance, logger) {
            var _this = this;

            logger.log('info', 'binding bot commands');
            var that = this;
            return botInstance.on('error', function (message) {
                // prevent bot from crashing
                _this.persistenceService.log('telegramMngr - received error: ' + JSON.stringify(message), 'Bot.onError:' + message);
            }).on('start', function (message) {
                _this.persistenceService.log('telegram-bot-service: cmd start: ', JSON.stringify(message));
                _this.persistenceService.findChatsById(message.chat.id).then(function (docs) {
                    if (docs.length === 0) {
                        _this.persistenceService.createChat({
                            chatId: message.chat.id,
                            firstName: message.chat.first_name,
                            lastName: message.chat.last_name,
                            type: message.chat.type,
                            username: message.chat.username
                        }).then(function (success) {
                            _this.persistenceService.log('info', 'registered chat id ' + message.chat.id);
                            _this._send(message.chat.id, 'should be registered right now');
                        }).catch(function (err) {
                            _this.persistenceService.log('error', 'telegram-bot-service: error occured ' + JSON.stringify(err));
                            _this._send(message.chat.id, 'should be registered right now');
                        });
                    } else {
                        _this.persistenceService.log('error', 'already registered chat id ' + message.chat.id);
                        _this._send(message.chat.id, 'you\'re registered already, doing nothing...');
                    }
                }).catch(function (err) {
                    return _this.logger.log('error', 'telegram-bot-service: unknow error occured ' + JSON.stringify(err));
                });
            }).on('stop', function (message) {
                _this.persistenceService.log('telegram-bot-service: cmd stop: ', JSON.stringify(message));
                _this.persistenceService.findChatsById(message.chat.id).then(function (docs) {
                    _lodash2.default.each(docs, function (doc) {
                        return doc.remove(function (error) {
                            var sendMessage = 'removed you from notification list';
                            if (error) {
                                sendMessage = 'error while removing ' + error;
                            }
                            that._send(message.chat.id, sendMessage);
                        });
                    });
                });
            }).on('stats', function (message) {
                _this.persistenceService.log('telegram-bot-service: cmd stats: ' + JSON.stringify(message));
                _this.persistenceService.findAllChats().then(function (chats) {
                    var sendMessage = 'currently, im notifying ' + TelegramBotService._chatOrChats(chats.length);
                    that._send(message.chat.id, sendMessage);
                }).catch(function (err) {
                    console.log('stats', err);
                    that.logger('warn', JSON.stringify(err));
                });
            }).on('update', function (message) {
                _this.persistenceService.log('telegram-bot-service: cmd update: ', JSON.stringify(message));
                /*  this.req.request('http://lodurparser-longstone.rhcloud.com/update', () => {
                 logger.log('info', 'update from bot triggered')
                 });*/
                that._send(message.chat.id, '(not working right now)update triggered');
            }).start();
        }
    }, {
        key: 'notifyAll',
        value: function notifyAll(message) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                _this2.persistenceService.findAllChats().then(function (chats) {
                    chats.map(function (chat) {
                        _this2._send(chat.chatId, message);
                        return true;
                    }).every(function () {
                        resolve(chats);
                        return false;
                    });
                }).catch(function (err) {
                    _this2.persistenceService.log('telegram-bot-service.notifyAll: error', err);
                    reject({ 'error-find-all-chats': err });
                });
            });
        }
    }, {
        key: '_send',
        value: function _send(id, msg) {
            var _this3 = this;

            var conf = {
                chat_id: id,
                text: msg
            };
            this.logger.log('debug', 'send ' + JSON.stringify(conf));
            this.bot.sendMessage(conf, function (err, body) {
                if (err) {
                    _this3.persistenceService.log('telegramMngr - send: ' + JSON.stringify(body) + 'conf: ' + JSON.stringify(conf),  true ? JSON.stringify(err) : err + '\n' + body);
                } else {
                    _this3.persistenceService.log('sucessful sent :' + JSON.stringify(body), '');
                }
            });
        }
    }], [{
        key: '_chatOrChats',
        value: function _chatOrChats(count) {
            var term = count + ' chat';
            if (count > 1) {
                return term + 's';
            }
            return term;
        }
    }]);

    return TelegramBotService;
}();

module.exports = TelegramBotService;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by lag on 06.02.2017.
 */
var CheckEnv = function () {
    /**
     *
     * @param envVar process.env
     */
    function CheckEnv(envVar) {
        _classCallCheck(this, CheckEnv);

        this.process = envVar;
    }

    /**
     * pass an array containing the variable names
     * @param array
     */


    _createClass(CheckEnv, [{
        key: "setVariableNames",
        value: function setVariableNames(array) {
            this.names = array.slice();
        }
    }, {
        key: "check",
        value: function check() {
            var _this = this;

            return this.names.filter(function (name) {
                return _this.process[name] === undefined;
            });
        }
    }]);

    return CheckEnv;
}();

module.exports = CheckEnv;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RouteIndex = function () {
    function RouteIndex(dependencies) {
        _classCallCheck(this, RouteIndex);

        this.import = {
            express: dependencies.express,
            pageloader: dependencies.pageloader
        };
    }

    _createClass(RouteIndex, [{
        key: 'getRoute',
        value: function getRoute() {
            var _this = this;

            return function (req, res) {
                _this.import.pageloader().then(function (json) {
                    res.setHeader('charset', 'utf8');
                    res.setHeader('Content-Length', new Buffer(json).length);
                    res.json(json);
                }, function (err) {
                    return res.json({ error: err });
                });
            };
        }
    }]);

    return RouteIndex;
}();

module.exports = RouteIndex;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = __webpack_require__(2);

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = __webpack_require__(0);

var _moment2 = _interopRequireDefault(_moment);

var _lodurUtil = __webpack_require__(32);

var _lodurUtil2 = _interopRequireDefault(_lodurUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RouteUpdate = function () {
    function RouteUpdate(dependencies) {
        _classCallCheck(this, RouteUpdate);

        this.persistenceService = dependencies.persistenceService;
        this.pageloader = dependencies.pageloader;
        this.telegramBot = dependencies.telegramBotService;
        this.logger = dependencies.logger;
    }

    _createClass(RouteUpdate, [{
        key: 'getRoute',
        value: function getRoute() {
            var _this = this;

            return function (req, res) {
                var silent = _lodash2.default.get(req, 'query.silent', false);
                _this.logger.log('debug', 'route-update: update requested');
                Promise.all([_this.persistenceService.getLastEntryForYear(), _this.pageloader()]).then(function (result) {
                    try {
                        var docs = result[0];
                        var entries = result[1];
                        var lastEntries = [];
                        if (_lodurUtil2.default.containsDuplicatedID(entries)) {
                            _this.logger.log('warn', 'duplicated ID in entries: ', JSON.stringify(lastEntries));
                        } else {
                            var lastEntry = { number: -1 };
                            if (docs.length === 1) {
                                lastEntry = docs[0]._doc;
                            }
                            lastEntries = _lodurUtil2.default.getSendArray(entries, lastEntry);
                            _this.logger.log('info', 'route-update: elements to send ', lastEntries.length);
                            if (lastEntries.length > 0) {
                                _lodurUtil2.default.sortArrayByNumber(lastEntries).forEach(function (item) {
                                    try {
                                        _this.logger.log('info', 'route-update: persisting item nr', item.number);
                                        var entry = {
                                            number: item.number,
                                            group: item.group,
                                            timestamp: item.timestamp,
                                            description: item.description
                                        };
                                        _this.persistenceService.createNewLodurEntry(entry).then(function () {
                                            _this.logger.log('info', 'route-update: persisted item nr', item.number);

                                            var message = "Wer:  " + item.group.toString() + "\n" + "Was:  " + item.description + "\n" + "Wann: " + (0, _moment2.default)(item.timestamp).locale('de').format('HH:mm DD.MM.YY') + "\n" + "Nummer: " + item.number;
                                            _this.telegramBot.notifyAll(message).then(function (chats) {
                                                return _this.logger.log('info', 'total ' + chats.length + ' notified');
                                            });
                                        }).catch(function (error) {
                                            return _this.logger.log('error', 'persist new Entry Error' + JSON.stringify(error));
                                        });
                                    } catch (constex) {
                                        _this.logger.log('info', 'woohwohohwohowow' + constex);
                                    }
                                });
                            } else if (silent) {
                                _this.logger.log('debug', 'no update, latest was: ' + JSON.stringify(lastEntry));
                            }
                        }
                        res.json({ newEntries: lastEntries });
                    } catch (ex) {
                        _this.logger.log('error', 'route-update: exception occured: ' + JSON.stringify(ex));
                        res.json({ 'error-catch': ex });
                    }
                }).catch(function (err) {
                    _this.persistenceService.log('error', 'route-update Promise.all err: ' + JSON.stringify(err));
                    res.json({ error: err });
                });
            };
        }
    }]);

    return RouteUpdate;
}();

module.exports = RouteUpdate;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mongoose = __webpack_require__(1);

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chatSchema = new _mongoose2.default.Schema({
    chatId: String,
    firstName: String,
    lastName: String,
    type: String,
    username: String
});

var Chat = void 0;
if (_mongoose2.default.models.Chat) {
    Chat = _mongoose2.default.model('Chat');
} else {
    Chat = _mongoose2.default.model('Chat', chatSchema);
}
module.exports = Chat;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mongoose = __webpack_require__(1);

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var entrySchema = new _mongoose2.default.Schema({
    group: [String],
    timestamp: Date,
    description: String,
    number: Number
});

var LodurEntry = void 0;
if (_mongoose2.default.models.LodurEntry) {
    LodurEntry = _mongoose2.default.model('LodurEntry');
} else {
    LodurEntry = _mongoose2.default.model('LodurEntry', entrySchema);
}
module.exports = LodurEntry;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(33).install();


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("express-winston");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("node-telegram-bot");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("serve-favicon");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("source-map-support");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("winston");

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

__webpack_require__(15);

var _persistenceService = __webpack_require__(8);

var _persistenceService2 = _interopRequireDefault(_persistenceService);

var _telegramBotService = __webpack_require__(9);

var _telegramBotService2 = _interopRequireDefault(_telegramBotService);

var _nodeTelegramBot = __webpack_require__(20);

var _nodeTelegramBot2 = _interopRequireDefault(_nodeTelegramBot);

var _lodurEntry = __webpack_require__(14);

var _lodurEntry2 = _interopRequireDefault(_lodurEntry);

var _chats = __webpack_require__(13);

var _chats2 = _interopRequireDefault(_chats);

var _logEntry = __webpack_require__(3);

var _logEntry2 = _interopRequireDefault(_logEntry);

var _lodash = __webpack_require__(2);

var _lodash2 = _interopRequireDefault(_lodash);

var _request = __webpack_require__(5);

var _request2 = _interopRequireDefault(_request);

var _express = __webpack_require__(18);

var _express2 = _interopRequireDefault(_express);

var _winston = __webpack_require__(23);

var _winston2 = _interopRequireDefault(_winston);

var _routeIndex = __webpack_require__(11);

var _routeIndex2 = _interopRequireDefault(_routeIndex);

var _routeUpdate = __webpack_require__(12);

var _routeUpdate2 = _interopRequireDefault(_routeUpdate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(22).install();
//# sourceMappingURL=./app.bundle.js.map

var CheckEnv = __webpack_require__(10);

process.on('uncaughtException', function (err) {
    _logEntry2.default.create({
        timestamp: new Date(),
        text: 'app.js - uncaughtException',
        error: JSON.stringify(err),
        description: _lodash2.default.get(err, 'message', 'nomessage') + '\nstack:\n' + _lodash2.default.get(err, 'stack', 'nostack')
    }, function (err) {
        if (err === null) {
            return;
        }
        console.log('persist new Entry ', err);
    });
    console.error(new Date().toUTCString() + ' uncaughtException:');
    console.error(err);
    console.error(err.message);
    console.error(err.stack);
});

var path = __webpack_require__(4);
var favicon = __webpack_require__(21);
var expressWinston = __webpack_require__(19);
var cookieParser = __webpack_require__(17);
var bodyParser = __webpack_require__(16);
var mongoose = __webpack_require__(1);

var pageloader = __webpack_require__(7);
var app = (0, _express2.default)();

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(_express2.default.static(path.join(__dirname, 'public')));

var config = { telegramToken: process.env.telegram_hash };
var dependencies = {
    express: _express2.default,
    pageloader: pageloader,
    persistenceService: new _persistenceService2.default({
        Chats: _chats2.default,
        LogEntry: _logEntry2.default,
        LodurEntry: _lodurEntry2.default
    }, { logger: _winston2.default }),
    logger: _winston2.default,
    request: _request2.default,
    telegramBotService: null
};
var bot = new _nodeTelegramBot2.default({ token: config.telegramToken });
dependencies.telegramBotService = new _telegramBotService2.default(bot, dependencies);
var router = _express2.default.Router();
router.get('/', new _routeIndex2.default(dependencies).getRoute());
router.get('/update', new _routeUpdate2.default(dependencies).getRoute());
app.use('/', router);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
var checkEnv = new CheckEnv(process.env);
checkEnv.setVariableNames(['MONGOURI', 'telegram_hash']);
var missingEnv = checkEnv.check();
if (missingEnv.length > 0) {
    _winston2.default.log('warn', 'missing process.env variables: ', missingEnv);
}
mongoose.Promise = global.Promise;
var mongoUri = process.env.MONGOURI || "mongodb://localhost:27017/lodur";
var options = { promiseLibrary: global.Promise };

mongoose.connect(mongoUri, function (err, res) {
    var stripCredentialsConnectionString = function stripCredentialsConnectionString(uri) {
        var indexOfAt = uri.indexOf('@');
        var substFrom = 0;
        if (indexOfAt > 0) {
            substFrom = indexOfAt;
        }
        return uri.substring(substFrom);
    };
    var connectionStringWithoutCredentials = stripCredentialsConnectionString(mongoUri);
    if (err) {
        _winston2.default.log('error', 'ERROR connecting to: ' + connectionStringWithoutCredentials + '. ' + err);
    } else {
        _winston2.default.log('info', 'Succeeded connected to: ' + connectionStringWithoutCredentials);
    }
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    _winston2.default.level = 'silly';
    _winston2.default.warn('env:development');
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
    _winston2.default.log('error', err);
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});
var server_port = process.env.NODE_PORT || process.env.PORT || 8080;
// const server_port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;
// const server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(server_port, function () {
    _winston2.default.log('info', "Listening on server_port: " + server_port);
});

module.exports = app;
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by longstone on 15/11/14.
 */


var Entry = function EntryF(that) {
    if (!that) {
        that = {};
    }
    this.timestamp = that.timestamp || '';
    this.group = that.group || '';
    this.description = that.description || '';
    this.number = that.number || -1;
};

Entry.prototype.getTimestamp = function getTimestampF() {
    return this.timestamp;
};
Entry.prototype.getGroup = function getGroupF() {
    return this.group;
};
Entry.prototype.getDescription = function getDescriptionF() {
    return this.description;
};
Entry.prototype.getNumber = function getNumberF() {
    return this.nr;
};

module.exports = Entry;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _entry = __webpack_require__(25);

var _entry2 = _interopRequireDefault(_entry);

var _dateparser = __webpack_require__(27);

var _dateparser2 = _interopRequireDefault(_dateparser);

var _parseTimeFromLine = __webpack_require__(31);

var _parseTimeFromLine2 = _interopRequireDefault(_parseTimeFromLine);

var _parseGroups = __webpack_require__(29);

var _parseGroups2 = _interopRequireDefault(_parseGroups);

var _parseDescription = __webpack_require__(28);

var _parseDescription2 = _interopRequireDefault(_parseDescription);

var _parseNumber = __webpack_require__(30);

var _parseNumber2 = _interopRequireDefault(_parseNumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by longstone on 15/11/14.
 */
var newLine = '\n';

var getTimestamp = function getTimestamp(lines) {
    var dateValues = {};
    dateValues.date = lines[2];
    dateValues.time = (0, _parseTimeFromLine2.default)(lines[3]);
    return (0, _dateparser2.default)(dateValues);
};
module.exports = function (text) {
    var lines = text.split(newLine);
    var values = {
        group: (0, _parseGroups2.default)(lines[3]),
        timestamp: getTimestamp(lines, values),
        description: (0, _parseDescription2.default)(lines[3]),
        number: (0, _parseNumber2.default)(lines[3])

    };
    return new _entry2.default(values);
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var moment = __webpack_require__(0);
/**
 * Created by longstone on 16/12/14.
 */
/**
 * due to missing java a little bit, this is an array with date and time, named after the public static void main args..
 * @param args
 */
module.exports = function (args) {
  var date = args.date;
  var time = args.time;
  return moment(date + " " + time, "DD.MM.YYYY HH.mm");
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var S = __webpack_require__(6);
/**
 * Created by longstone on 31/12/14.
 */
var POSITION_OF_FIRST_SLASH = 17;
module.exports = function parseDescriptionF(line) {
    line = S(line).replaceAll('\t', '').s;
    var start = line.indexOf(' / ', POSITION_OF_FIRST_SLASH) + 3;
    var end = line.length;
    return line.substring(start, end).trim();
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var moment = __webpack_require__(0);
/**
 * Created by longstone on 16/12/14.
 */

module.exports = function parseTimeFromLineF(line) {
    var startIndex = line.indexOf('/') + 2;
    var endIndex = line.substring(startIndex, line.length).indexOf('/') - 1 + startIndex;
    var result = line.substring(startIndex, endIndex);
    return result.split("+");
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by longstone on 25/03/15.
 */


var S = __webpack_require__(6);
/**
 * Created by longstone on 16/12/14.
 */

module.exports = function parseNumberFromLineF(line) {
  var endIndex = line.indexOf(' /');
  return S(line).left(endIndex).toInt();
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var moment = __webpack_require__(0);
/**
 * Created by longstone on 16/12/14.
 */

module.exports = function parseTimeFromLineF(line) {
    var timeStartIndex = line.indexOf('- ') + 2;
    var timeEndIndex = line.indexOf(' Uhr');
    return line.substring(timeStartIndex, timeEndIndex);
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getLastEntry = function getLastEntryF(list, cache) {
    if (list.length > 0) {
        return list.slice(-1).pop();
    }
    return cache;
};

var isOrderingForwards = function orderingForwardsF(arr) {
    return arr.length > 0 && arr[0].number < getLastEntry(arr).number;
};

var sortArrayByNumber = function sortArrayByNumberF(arr) {
    arr.sort(function (a, b) {
        return a.number - b.number;
    });
    return arr;
};

var getSendArray = function getSendArrayF(json, _lastEntryCache) {

    var sendArr = [];

    if (json && json.length > 0) {
        var entries = json.slice();
        sortArrayByNumber(entries);
        entries.reverse().every(function (item) {

            if (item.number > _lastEntryCache.number) {
                sendArr.push(item);
                return true;
            } else {
                //we want to break
                return false;
            }
        });
    }
    return sendArr.reverse();
};

var containsDuplicatedID = function containsDuplicatedID(array) {
    if (!array) {
        return false;
    }
    var set = new Set();
    array.map(function (item) {
        return set.add(item.number);
    });
    return !(array.length === set.size);
};
module.exports = {
    getLastEntry: getLastEntry,
    getSendArray: getSendArray,
    isOrderingForwards: isOrderingForwards,
    sortArrayByNumber: sortArrayByNumber,
    containsDuplicatedID: containsDuplicatedID
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var SourceMapConsumer = __webpack_require__(37).SourceMapConsumer;
var path = __webpack_require__(4);

var fs;
try {
  fs = __webpack_require__(35);
  if (!fs.existsSync || !fs.readFileSync) {
    // fs doesn't have all methods we need
    fs = null;
  }
} catch (err) {
  /* nop */
}

// Only install once if called multiple times
var errorFormatterInstalled = false;
var uncaughtShimInstalled = false;

// If true, the caches are reset before a stack trace formatting operation
var emptyCacheBetweenOperations = false;

// Supports {browser, node, auto}
var environment = "auto";

// Maps a file path to a string containing the file contents
var fileContentsCache = {};

// Maps a file path to a source map for that file
var sourceMapCache = {};

// Regex for detecting source maps
var reSourceMap = /^data:application\/json[^,]+base64,/;

// Priority list of retrieve handlers
var retrieveFileHandlers = [];
var retrieveMapHandlers = [];

function isInBrowser() {
  if (environment === "browser")
    return true;
  if (environment === "node")
    return false;
  return ((typeof window !== 'undefined') && (typeof XMLHttpRequest === 'function') && !(window.require && window.module && window.process && window.process.type === "renderer"));
}

function hasGlobalProcessEventEmitter() {
  return ((typeof process === 'object') && (process !== null) && (typeof process.on === 'function'));
}

function handlerExec(list) {
  return function(arg) {
    for (var i = 0; i < list.length; i++) {
      var ret = list[i](arg);
      if (ret) {
        return ret;
      }
    }
    return null;
  };
}

var retrieveFile = handlerExec(retrieveFileHandlers);

retrieveFileHandlers.push(function(path) {
  // Trim the path to make sure there is no extra whitespace.
  path = path.trim();
  if (path in fileContentsCache) {
    return fileContentsCache[path];
  }

  var contents = null;
  if (!fs) {
    // Use SJAX if we are in the browser
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.send(null);
    var contents = null
    if (xhr.readyState === 4 && xhr.status === 200) {
      contents = xhr.responseText
    }
  } else if (fs.existsSync(path)) {
    // Otherwise, use the filesystem
    contents = fs.readFileSync(path, 'utf8');
  }

  return fileContentsCache[path] = contents;
});

// Support URLs relative to a directory, but be careful about a protocol prefix
// in case we are in the browser (i.e. directories may start with "http://")
function supportRelativeURL(file, url) {
  if (!file) return url;
  var dir = path.dirname(file);
  var match = /^\w+:\/\/[^\/]*/.exec(dir);
  var protocol = match ? match[0] : '';
  return protocol + path.resolve(dir.slice(protocol.length), url);
}

function retrieveSourceMapURL(source) {
  var fileData;

  if (isInBrowser()) {
     try {
       var xhr = new XMLHttpRequest();
       xhr.open('GET', source, false);
       xhr.send(null);
       fileData = xhr.readyState === 4 ? xhr.responseText : null;

       // Support providing a sourceMappingURL via the SourceMap header
       var sourceMapHeader = xhr.getResponseHeader("SourceMap") ||
                             xhr.getResponseHeader("X-SourceMap");
       if (sourceMapHeader) {
         return sourceMapHeader;
       }
     } catch (e) {
     }
  }

  // Get the URL of the source map
  fileData = retrieveFile(source);
  var re = /(?:\/\/[@#][ \t]+sourceMappingURL=([^\s'"]+?)[ \t]*$)|(?:\/\*[@#][ \t]+sourceMappingURL=([^\*]+?)[ \t]*(?:\*\/)[ \t]*$)/mg;
  // Keep executing the search to find the *last* sourceMappingURL to avoid
  // picking up sourceMappingURLs from comments, strings, etc.
  var lastMatch, match;
  while (match = re.exec(fileData)) lastMatch = match;
  if (!lastMatch) return null;
  return lastMatch[1];
};

// Can be overridden by the retrieveSourceMap option to install. Takes a
// generated source filename; returns a {map, optional url} object, or null if
// there is no source map.  The map field may be either a string or the parsed
// JSON object (ie, it must be a valid argument to the SourceMapConsumer
// constructor).
var retrieveSourceMap = handlerExec(retrieveMapHandlers);
retrieveMapHandlers.push(function(source) {
  var sourceMappingURL = retrieveSourceMapURL(source);
  if (!sourceMappingURL) return null;

  // Read the contents of the source map
  var sourceMapData;
  if (reSourceMap.test(sourceMappingURL)) {
    // Support source map URL as a data url
    var rawData = sourceMappingURL.slice(sourceMappingURL.indexOf(',') + 1);
    sourceMapData = new Buffer(rawData, "base64").toString();
    sourceMappingURL = source;
  } else {
    // Support source map URLs relative to the source URL
    sourceMappingURL = supportRelativeURL(source, sourceMappingURL);
    sourceMapData = retrieveFile(sourceMappingURL);
  }

  if (!sourceMapData) {
    return null;
  }

  return {
    url: sourceMappingURL,
    map: sourceMapData
  };
});

function mapSourcePosition(position) {
  var sourceMap = sourceMapCache[position.source];
  if (!sourceMap) {
    // Call the (overrideable) retrieveSourceMap function to get the source map.
    var urlAndMap = retrieveSourceMap(position.source);
    if (urlAndMap) {
      sourceMap = sourceMapCache[position.source] = {
        url: urlAndMap.url,
        map: new SourceMapConsumer(urlAndMap.map)
      };

      // Load all sources stored inline with the source map into the file cache
      // to pretend like they are already loaded. They may not exist on disk.
      if (sourceMap.map.sourcesContent) {
        sourceMap.map.sources.forEach(function(source, i) {
          var contents = sourceMap.map.sourcesContent[i];
          if (contents) {
            var url = supportRelativeURL(sourceMap.url, source);
            fileContentsCache[url] = contents;
          }
        });
      }
    } else {
      sourceMap = sourceMapCache[position.source] = {
        url: null,
        map: null
      };
    }
  }

  // Resolve the source URL relative to the URL of the source map
  if (sourceMap && sourceMap.map) {
    var originalPosition = sourceMap.map.originalPositionFor(position);

    // Only return the original position if a matching line was found. If no
    // matching line is found then we return position instead, which will cause
    // the stack trace to print the path and line for the compiled file. It is
    // better to give a precise location in the compiled file than a vague
    // location in the original file.
    if (originalPosition.source !== null) {
      originalPosition.source = supportRelativeURL(
        sourceMap.url, originalPosition.source);
      return originalPosition;
    }
  }

  return position;
}

// Parses code generated by FormatEvalOrigin(), a function inside V8:
// https://code.google.com/p/v8/source/browse/trunk/src/messages.js
function mapEvalOrigin(origin) {
  // Most eval() calls are in this format
  var match = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(origin);
  if (match) {
    var position = mapSourcePosition({
      source: match[2],
      line: +match[3],
      column: match[4] - 1
    });
    return 'eval at ' + match[1] + ' (' + position.source + ':' +
      position.line + ':' + (position.column + 1) + ')';
  }

  // Parse nested eval() calls using recursion
  match = /^eval at ([^(]+) \((.+)\)$/.exec(origin);
  if (match) {
    return 'eval at ' + match[1] + ' (' + mapEvalOrigin(match[2]) + ')';
  }

  // Make sure we still return useful information if we didn't find anything
  return origin;
}

// This is copied almost verbatim from the V8 source code at
// https://code.google.com/p/v8/source/browse/trunk/src/messages.js. The
// implementation of wrapCallSite() used to just forward to the actual source
// code of CallSite.prototype.toString but unfortunately a new release of V8
// did something to the prototype chain and broke the shim. The only fix I
// could find was copy/paste.
function CallSiteToString() {
  var fileName;
  var fileLocation = "";
  if (this.isNative()) {
    fileLocation = "native";
  } else {
    fileName = this.getScriptNameOrSourceURL();
    if (!fileName && this.isEval()) {
      fileLocation = this.getEvalOrigin();
      fileLocation += ", ";  // Expecting source position to follow.
    }

    if (fileName) {
      fileLocation += fileName;
    } else {
      // Source code does not originate from a file and is not native, but we
      // can still get the source position inside the source string, e.g. in
      // an eval string.
      fileLocation += "<anonymous>";
    }
    var lineNumber = this.getLineNumber();
    if (lineNumber != null) {
      fileLocation += ":" + lineNumber;
      var columnNumber = this.getColumnNumber();
      if (columnNumber) {
        fileLocation += ":" + columnNumber;
      }
    }
  }

  var line = "";
  var functionName = this.getFunctionName();
  var addSuffix = true;
  var isConstructor = this.isConstructor();
  var isMethodCall = !(this.isToplevel() || isConstructor);
  if (isMethodCall) {
    var typeName = this.getTypeName();
    // Fixes shim to be backward compatable with Node v0 to v4
    if (typeName === "[object Object]") {
      typeName = "null";
    }
    var methodName = this.getMethodName();
    if (functionName) {
      if (typeName && functionName.indexOf(typeName) != 0) {
        line += typeName + ".";
      }
      line += functionName;
      if (methodName && functionName.indexOf("." + methodName) != functionName.length - methodName.length - 1) {
        line += " [as " + methodName + "]";
      }
    } else {
      line += typeName + "." + (methodName || "<anonymous>");
    }
  } else if (isConstructor) {
    line += "new " + (functionName || "<anonymous>");
  } else if (functionName) {
    line += functionName;
  } else {
    line += fileLocation;
    addSuffix = false;
  }
  if (addSuffix) {
    line += " (" + fileLocation + ")";
  }
  return line;
}

function cloneCallSite(frame) {
  var object = {};
  Object.getOwnPropertyNames(Object.getPrototypeOf(frame)).forEach(function(name) {
    object[name] = /^(?:is|get)/.test(name) ? function() { return frame[name].call(frame); } : frame[name];
  });
  object.toString = CallSiteToString;
  return object;
}

function wrapCallSite(frame) {
  if(frame.isNative()) {
    return frame;
  }

  // Most call sites will return the source file from getFileName(), but code
  // passed to eval() ending in "//# sourceURL=..." will return the source file
  // from getScriptNameOrSourceURL() instead
  var source = frame.getFileName() || frame.getScriptNameOrSourceURL();
  if (source) {
    var line = frame.getLineNumber();
    var column = frame.getColumnNumber() - 1;

    // Fix position in Node where some (internal) code is prepended.
    // See https://github.com/evanw/node-source-map-support/issues/36
    if (line === 1 && !isInBrowser() && !frame.isEval()) {
      column -= 62;
    }

    var position = mapSourcePosition({
      source: source,
      line: line,
      column: column
    });
    frame = cloneCallSite(frame);
    frame.getFileName = function() { return position.source; };
    frame.getLineNumber = function() { return position.line; };
    frame.getColumnNumber = function() { return position.column + 1; };
    frame.getScriptNameOrSourceURL = function() { return position.source; };
    return frame;
  }

  // Code called using eval() needs special handling
  var origin = frame.isEval() && frame.getEvalOrigin();
  if (origin) {
    origin = mapEvalOrigin(origin);
    frame = cloneCallSite(frame);
    frame.getEvalOrigin = function() { return origin; };
    return frame;
  }

  // If we get here then we were unable to change the source position
  return frame;
}

// This function is part of the V8 stack trace API, for more info see:
// http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
function prepareStackTrace(error, stack) {
  if (emptyCacheBetweenOperations) {
    fileContentsCache = {};
    sourceMapCache = {};
  }

  return error + stack.map(function(frame) {
    return '\n    at ' + wrapCallSite(frame);
  }).join('');
}

// Generate position and snippet of original source with pointer
function getErrorSource(error) {
  var match = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/.exec(error.stack);
  if (match) {
    var source = match[1];
    var line = +match[2];
    var column = +match[3];

    // Support the inline sourceContents inside the source map
    var contents = fileContentsCache[source];

    // Support files on disk
    if (!contents && fs && fs.existsSync(source)) {
      contents = fs.readFileSync(source, 'utf8');
    }

    // Format the line from the original source code like node does
    if (contents) {
      var code = contents.split(/(?:\r\n|\r|\n)/)[line - 1];
      if (code) {
        return source + ':' + line + '\n' + code + '\n' +
          new Array(column).join(' ') + '^';
      }
    }
  }
  return null;
}

function printErrorAndExit (error) {
  var source = getErrorSource(error);

  if (source) {
    console.error();
    console.error(source);
  }

  console.error(error.stack);
  process.exit(1);
}

function shimEmitUncaughtException () {
  var origEmit = process.emit;

  process.emit = function (type) {
    if (type === 'uncaughtException') {
      var hasStack = (arguments[1] && arguments[1].stack);
      var hasListeners = (this.listeners(type).length > 0);

      if (hasStack && !hasListeners) {
        return printErrorAndExit(arguments[1]);
      }
    }

    return origEmit.apply(this, arguments);
  };
}

exports.wrapCallSite = wrapCallSite;
exports.getErrorSource = getErrorSource;
exports.mapSourcePosition = mapSourcePosition;
exports.retrieveSourceMap = retrieveSourceMap;

exports.install = function(options) {
  options = options || {};

  if (options.environment) {
    environment = options.environment;
    if (["node", "browser", "auto"].indexOf(environment) === -1) {
      throw new Error("environment " + environment + " was unknown. Available options are {auto, browser, node}")
    }
  }

  // Allow sources to be found by methods other than reading the files
  // directly from disk.
  if (options.retrieveFile) {
    if (options.overrideRetrieveFile) {
      retrieveFileHandlers.length = 0;
    }

    retrieveFileHandlers.unshift(options.retrieveFile);
  }

  // Allow source maps to be found by methods other than reading the files
  // directly from disk.
  if (options.retrieveSourceMap) {
    if (options.overrideRetrieveSourceMap) {
      retrieveMapHandlers.length = 0;
    }

    retrieveMapHandlers.unshift(options.retrieveSourceMap);
  }

  // Support runtime transpilers that include inline source maps
  if (options.hookRequire && !isInBrowser()) {
    var Module;
    try {
      Module = __webpack_require__(36);
    } catch (err) {
      // NOP: Loading in catch block to convert webpack error to warning.
    }
    var $compile = Module.prototype._compile;

    if (!$compile.__sourceMapSupport) {
      Module.prototype._compile = function(content, filename) {
        fileContentsCache[filename] = content;
        sourceMapCache[filename] = undefined;
        return $compile.call(this, content, filename);
      };

      Module.prototype._compile.__sourceMapSupport = true;
    }
  }

  // Configure options
  if (!emptyCacheBetweenOperations) {
    emptyCacheBetweenOperations = 'emptyCacheBetweenOperations' in options ?
      options.emptyCacheBetweenOperations : false;
  }

  // Install the error reformatter
  if (!errorFormatterInstalled) {
    errorFormatterInstalled = true;
    Error.prepareStackTrace = prepareStackTrace;
  }

  if (!uncaughtShimInstalled) {
    var installHandler = 'handleUncaughtExceptions' in options ?
      options.handleUncaughtExceptions : true;

    // Provide the option to not install the uncaught exception handler. This is
    // to support other uncaught exception handlers (in test frameworks, for
    // example). If this handler is not installed and there are no other uncaught
    // exception handlers, uncaught exceptions will be caught by node's built-in
    // exception handler and the process will still be terminated. However, the
    // generated JavaScript code will be shown above the stack trace instead of
    // the original source code.
    if (installHandler && hasGlobalProcessEventEmitter()) {
      uncaughtShimInstalled = true;
      shimEmitUncaughtException();
    }
  }
};


/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = require("cheerio");

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("module");

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("source-map");

/***/ })
/******/ ])));
//# sourceMappingURL=app.bundle.js.map