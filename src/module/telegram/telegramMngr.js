'use strict';
const Bot = require('node-telegram-bot');
const Chat = require('./../../schemas/chats');
const request = require('request');
const LogEntry = require('./../../schemas/logEntry');
const _ = require('lodash');
/* GET home page. */

const token = process.env.telegram_hash;
console.log('starting bot with token: ' + token);
const bot = new Bot({token: token})
    .on('error', function (message) {
        // prevent bot from crashing
        LogEntry.create({
            timestamp: new Date(),
            text: 'telegramMngr - received error: ' + JSON.stringify(message),
            error: 'Bot.onError:' + message
        }, function (err) {
            if (err !== null) {
                console.log('persist new received Error', err)
            }
        });
    }).on('start', function (message) {
        Chat.find({chatId: message.chat.id}).exec(function (err, docs) {
            //  console.log('err,docs', err, docs);
            if (docs.length === 0) {
                var newChat = new Chat({
                    chatId: message.chat.id,
                    firstName: message.chat.first_name,
                    lastName: message.chat.last_name,
                    type: message.chat.type,
                    username: message.chat.username
                });
                newChat.save(function (err) {
                    console.log(err);
                });
                console.log('registered chat id ' + message.chat.id);
                var msg = 'should be registered right now';
                send(message.chat.id, msg);
            } else {
                console.log('already registered chat id ' + message.chat.id);
                var errorMsg = 'you\'re registered already, doing nothing...';
                send(message.chat.id, errorMsg);
            }

        });


    }).on('stop', function (message) {
        Chat.find({chatId: message.chat.id}).remove(function (error) {
            var sendMessage = 'removed you from notification list';
            if (error) {
                sendMessage = 'error while removing ' + error;
            }
            send(message.chat.id, sendMessage);
        });
    }).on('stats', function (message) {
        Chat.find({}, function (err, chats) {
            var chatOrChats = function (count) {
                var term = count + ' chat';
                if (count > 1) {
                    return term + 's';
                }
                return term;
            };
            var sendMessage = 'currently, im notifying ' + chatOrChats(chats.length);
            send(message.chat.id, sendMessage);
        });
    }).on('update', function (message) {
        request('http://lodurparser-longstone.rhcloud.com/update', function () {
        });
        send(message.chat.id, 'update triggered');
    }).on('wieheisstschind', function (message) {
        // some fun...
        // usbaut 15.05
        //    send(message.chat.id, 'ANNAAAAAAAAAA!');
        //    send(message.chat.id, 'ANNAAAAAAAAAA!');
        //    send(message.chat.id, 'ANNAAAAAAAAAA!');
    }).start();
var send = function (id, msg) {

    var conf = {
        chat_id: id,
        text: msg
    };
    bot.sendMessage(
        conf
        , function (err, body) {
            if (err) {
                LogEntry.create({
                    timestamp: new Date(),
                    text: 'telegramMngr - send: ' + JSON.stringify(body) + 'conf: '+ JSON.stringify(conf),
                    error: "id: " + id + " text:" + _.isObject(err) ? JSON.stringify(err) : err + "\n" + body
                }, function (err) {
                    if (err !== null) {
                        console.log('persist new Entry Error', err)
                    }
                });
                console.dir(err);
            } else {
                LogEntry.create({
                    timestamp: new Date(),
                    text: 'sucessful sent :' + JSON.stringify(body)
                }, function (err) {
                    if (err !== null) {
                        console.log('persist new Entry Error', err)
                    }
                });
            }
        })
};



var notifyAll = function notifyAllF(sendMessage) {

    console.log('should notify all chats with message: ' + sendMessage);
    Chat.find({}, function (err, chats) {
        chats.forEach(function (chat) {
            console.log('send Message [chat, text]', chat, sendMessage);
            send(chat.chatId, sendMessage);
        });
    });
};


module.exports = notifyAll;