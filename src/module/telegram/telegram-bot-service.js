/**
 * Created by lag on 06.02.2017.
 */
class TelegramBotService {
    constructor(dependencies) {
        this.req = {}
        this.req.Bot = dependencies['node-telegram-bot'];
        this.req.request = dependencies.request;
        this.Chats = dependencies.schemas.Chats;
        this.LogEntry = dependencies.schemas.LogEntry;
        this._ = dependencies.lodash;
        this.log = dependencies.logger;
        this.bot = this._initBot(this.req.Bot, this.LogEntry, this.Chats, this._.get(dependencies, 'config.telegram-token'));
    }

    _initBot(Bot, LogEntry, Chats, token) {
        const bot = new Bot({token: token})
            .on('error', function (message) {
                // prevent bot from crashing
                LogEntry.create({
                    timestamp: new Date(),
                    text: 'telegramMngr - received error: ' + JSON.stringify(message),
                    error: 'Bot.onError:' + message
                }, function (err) {
                    if (err !== null) {
                        this.log.log('error','persist new received Error', err)
                    }
                });
            }).on('start', function (message) {
                Chats.find({chatId: message.chat.id}).exec(function (err, docs) {
                    //  console.log('err,docs', err, docs);
                    if (docs.length === 0) {
                        var newChat = new Chats({
                            chatId: message.chat.id,
                            firstName: message.chat.first_name,
                            lastName: message.chat.last_name,
                            type: message.chat.type,
                            username: message.chat.username
                        });
                        newChat.save(function (err) {
                            this.log.log('error',err);
                        });
                        this.log.log('info','registered chat id ' + message.chat.id);
                        var msg = 'should be registered right now';
                        this._send(message.chat.id, msg);
                    } else {
                        this.log.log('error','already registered chat id ' + message.chat.id);
                        var errorMsg = 'you\'re registered already, doing nothing...';
                        this._send(message.chat.id, errorMsg);
                    }

                });


            }).on('stop', function (message) {
                Chats.find({chatId: message.chat.id}).remove(function (error) {
                    let sendMessage = 'removed you from notification list';
                    if (error) {
                        sendMessage = 'error while removing ' + error;
                    }
                    this._send(message.chat.id, sendMessage);
                });
            }).on('stats', function (message) {
                Chats.find({}, function (err, chats) {

                    const sendMessage = 'currently, im notifying ' + TelegramBotService._chatOrChats(chats.length);
                    this._send(message.chat.id, sendMessage);
                });
            }).on('update', function (message) {
                this.req.request('http://lodurparser-longstone.rhcloud.com/update', () => {
                    this.log.log('info','update from bot triggered')
                });
                this._send(message.chat.id, 'update triggered');
            }).start();
        return bot;
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