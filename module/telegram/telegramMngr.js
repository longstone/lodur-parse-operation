/**
 * Created by lag on 26.06.2015.
 */
'use strict';
var Bot = require('node-telegram-bot');
var Chat = require('./../../schemas/chats');
var request = require('request');
var LogEntry = require('./../../schemas/logEntry');

/* GET home page. */

var token = process.env.telegram_hash;
console.log('starting bot with token: ' + token);
var send = function (id, msg) {

    bot.sendMessage(
        {
            chat_id: id,
            text: msg
        }
        , function (err, body) {
            if (err) {
                LogEntry.create({
                    timestamp: new Date(),
                    text: 'error: ' + JSON.stringify(body),
                    error: body
                }, function (err) {
                    if (err !== null) {
                        console.log('persist new Entry Error', err)
                    }
                });
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

var bot = new Bot({token: token})
    .on('error', function (message) {
        // prevent bot from crashing
        LogEntry.create({
            timestamp: new Date(),
            text: 'received error: ' + JSON.stringify(message),
            error: message
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