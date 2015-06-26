/**
 * Created by lag on 26.06.2015.
 */
'use strict';
var Bot = require('node-telegram-bot');
var Chat = require('./../../schemas/chats');
/* GET home page. */

var orders = ['/start', '/stop', '/update', '/stats', '/help'];
var bot = new Bot({token: process.env.telegram_hash}).on('message',
    function (message) {
        var chatId = message.chat.id;
        var sendMessage = 'not processable';
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

                    break;
                case "/stop":
                    Chat.find({chatId: chatId}).remove(function (result) {
                        sendMessage += 'removed ' + result;
                    });

                    break;
                case "/update":
                    sendMessage = message.text + ': is currently not implemented';


                    break;
                case "/help'":
                default:
                    sendMessage = 'Following commands are possible: ' + JSON.stringify(orders);
            }
        }

        bot.sendMessage(
            {
                chat_id: chatId,
                text: sendMessage
            }
            , function (err, body) {
                console.log(err);
                console.log(body);
            })
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