/**
 * Created by lag on 26.06.2015.
 */
'use strict';
var Bot = require('node-telegram-bot');
var Chat = require('./../../schemas/chats');
var request = require('request');
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
                console.log(err);
            } else {
                console.log('sucessful sent :' + JSON.stringify(body));
            }
        })
};

var bot = new Bot({token: token})
    .on('start', function (message) {
        var newChat = new Chat({
            chatId: message.chat.id
        });
        newChat.save(function (err) {
            console.log(err);
        });
        console.log('registered chat id ' + message.chat.id);
        var msg = 'should be registered right now';
        send(message.chat.id, msg);
    }).on('stop', function (message) {
        Chat.find({chatId: message.chat.id}).remove(function (error) {
            var sendMessage = 'removed you from list';
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
    }).start();

var notifyAll = function notifyAllF(sendMessage) {

    console.log('should notify all chats with message: ' + sendMessage);
    Chat.find({}, function (err, chats) {
        chats.forEach(function (chat) {
            bot.sendMessage({
                chat_id: chat.chatId,
                text: sendMessage
            });

        });
    });
};


module.exports = notifyAll;