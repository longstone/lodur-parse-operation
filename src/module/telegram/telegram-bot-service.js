/**
 * Created by lag on 06.02.2017.
 */
class TelegramBotService {
    constructor(dependencies) {
        this.req = {};
        this.req.Bot = dependencies['node-telegram-bot'];
        this.req.request = dependencies.request;
        this.Chats = dependencies.schemas.Chats;
        this.LogEntry = dependencies.schemas.LogEntry;
        this._ = dependencies.lodash;
        this.log = dependencies.logger;
        this.bot = this._initBot(this.req.Bot, this.LogEntry, this.Chats, this._.get(dependencies, 'config.telegram-token'), this.log);
    }

    _initBot(Bot, LogEntry, Chats, token, logger) {
        const that = this;
        return new Bot({token: token})
            .on('error', function (message) {
                // prevent bot from crashing
                LogEntry.create({
                    timestamp: new Date(),
                    text: 'telegramMngr - received error: ' + JSON.stringify(message),
                    error: 'Bot.onError:' + message
                }, function (err) {
                    if (err !== null) {
                        logger.log('error','persist new received Error', err)
                    }
                });
            }).on('start', function (message) {
                Chats.find({chatId: message.chat.id}).exec(function (err, docs) {
                    if (docs.length === 0) {
                        const newChat = new Chats({
                            chatId: message.chat.id,
                            firstName: message.chat.first_name,
                            lastName: message.chat.last_name,
                            type: message.chat.type,
                            username: message.chat.username
                        });
                        newChat.save(function (err) {
                            logger.log('error',err);
                        });
                        logger.log('info','registered chat id ' + message.chat.id);
                        const msg = 'should be registered right now';
                        that._send(message.chat.id, msg);
                    } else {
                        logger.log('error','already registered chat id ' + message.chat.id);
                        const errorMsg = 'you\'re registered already, doing nothing...';
                        that._send(message.chat.id, errorMsg);
                    }

                });


            }).on('stop', function (message) {
                Chats.find({chatId: message.chat.id}).remove(function (error) {
                    let sendMessage = 'removed you from notification list';
                    if (error) {
                        sendMessage = 'error while removing ' + error;
                    }
                    that._send(message.chat.id, sendMessage);
                });
            }).on('stats', function (message) {
                Chats.find({}, function (err, chats) {
                    const sendMessage = 'currently, im notifying ' + TelegramBotService._chatOrChats(chats.length);
                    that._send(message.chat.id, sendMessage);
                });
            }).on('update', function (message) {
                this.req.request('http://lodurparser-longstone.rhcloud.com/update', () => {
                    logger.log('info','update from bot triggered')
                });
                that._send(message.chat.id, 'update triggered');
            }).start();
    }

    static _chatOrChats(count) {
        const term = count + ' chat';
        if (count > 1) {
            return term + 's';
        }
        return term;
    };

    notifyAll(message) {
        this.log.log('info','should notify all chats with message: ' + sendMessage);
        this.Chats.find({}, function (err, chats) {
            chats.forEach(function (chat) {
                this.log.log('info','send Message [chat, text]', chat, sendMessage);
                this._send(chat.chatId, sendMessage);
            });
        });
    }

    _send(id, msg) {
        const conf = {
            chat_id: id,
            text: msg
        };

        this.bot.sendMessage(
            conf
            , function (err, body) {
                if (err) {
                    this.LogEntry.create({
                        timestamp: new Date(),
                        text: 'telegramMngr - send: ' + JSON.stringify(body) + 'conf: ' + JSON.stringify(conf),
                        error: "id: " + id + " text:" + this._.isObject(err) ? JSON.stringify(err) : err + "\n" + body
                    }, (err) => {
                        if (err !== null) {
                            this.log.log('error','persist new Entry Error', err)
                        }
                    });
                    console.dir(err);
                } else {
                    this.LogEntry.create({
                        timestamp: new Date(),
                        text: 'sucessful sent :' + JSON.stringify(body)
                    }, (err) => {
                        if (err !== null) {
                            this.log.log('error','persist new Entry Error', err)
                        }
                    });
                }
            })
    };
}
module.exports = TelegramBotService;