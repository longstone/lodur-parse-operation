/**
 * Created by lag on 26.06.2015.
 */
'use strict';
var Bot = require('node-telegram-bot');
var Chat = require('./../../schemas/chats');
/* GET home page. */

var orders = ['/start', '/stop', '/update', '/stats', '/help'];
var token = process.env.telegram_hash;
console.log('starting bot with token: ' + token);
var bot = new Bot({token: token}).on('message',
    function (message) {
        var chatId = message.chat.id;
        var sendMessage = 'not processable';
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
        if (message && message.text) {
            switch (message.text) {
                case "/start":
                    var newChat = new Chat({
                        chatId: chatId
                    });
                    newChat.save(function (err) {
                        console.log(err);
                    });
                    console.log('registered chat id ' + chatId);
                    sendMessage = 'should be registered right now';
                    send(chatId, sendMessage);
                    break;
                case "/stop":
                    sendMessage = "";
                    Chat.find({chatId: chatId}).remove(function (result) {
                        sendMessage += 'removed ' + result;
                        send(chatId, sendMessage);
                    });

                    break;
                case "/update":
                    sendMessage = message.text + ': is currently not implemented';
                    send(chatId, sendMessage);
                    break;
                case "/stats":
                    Chat.find({}, function (err, chats) {
                        var chatOrChats = function (count) {
                            var term = count+' chat';
                            if(count > 1 ){
                                return term+'s';
                            }
                            return term;
                        };
                        sendMessage = 'currently, im notifying ' + chatOrChats(chats.length);
                        send(chatId, sendMessage);
                    });
                    break;
                case "/help'":
                default:
                    sendMessage = 'Following commands are possible: ' + JSON.stringify(orders);
                    send(chatId, sendMessage);
            }
        }


    }
).start();
var notifyAll = function notifyAllF(sendMessage) {
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