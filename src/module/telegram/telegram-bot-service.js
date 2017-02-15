import _ from 'lodash';

class TelegramBotService {
    constructor(botInstance, dependencies) {
        this.req = {};
        this.req.request = dependencies.request;
        this.persistenceService = dependencies.persistenceService;
        this.log = dependencies.logger;
        this.bot = this._initBot(botInstance, this.log);
    }

    _initBot(botInstance, logger) {
        logger.log('info','binding bot commands');
        const that = this;
        return botInstance.on('error', (message) => {
            // prevent bot from crashing
            this.persistenceService.log('telegramMngr - received error: ' + JSON.stringify(message),
                'Bot.onError:' + message
            );
        }).on('start', message => {
            this.persistenceService.log('telegram-bot-service: cmd start: ',JSON.stringify(message));
            this.persistenceService.findChatsById(message.chat.id).then(docs => {
                if (docs.length === 0) {
                    this.persistenceService.createChat({
                        chatId: message.chat.id,
                        firstName: message.chat.first_name,
                        lastName: message.chat.last_name,
                        type: message.chat.type,
                        username: message.chat.username
                    }).then(success => {
                        this.persistenceService.log('info', 'registered chat id ' + message.chat.id);
                        this._send(message.chat.id, 'should be registered right now');
                    }).catch(err => {
                        this.persistenceService.log('error', 'telegram-bot-service: error occured ' + JSON.stringify(err));
                        this._send(message.chat.id, 'should be registered right now');
                    });
                } else {
                    this.persistenceService.log('error', 'already registered chat id ' + message.chat.id);
                    this._send(message.chat.id, 'you\'re registered already, doing nothing...');
                }
            }).catch(err => this.log('error', 'telegram-bot-service: unknow error occured ' + JSON.stringify(err)));
        }).on('stop', (message) => {
            this.persistenceService.log('telegram-bot-service: cmd stop: ',JSON.stringify(message));
            this.persistenceService.findChatsById(message.chat.id).then(docs => {
                _.each(docs, doc => doc.remove((error) => {
                    let sendMessage = 'removed you from notification list';
                    if (error) {
                        sendMessage = 'error while removing ' + error;
                    }
                    that._send(message.chat.id, sendMessage);
                }));
            });
        }).on('stats', message => {
            this.persistenceService.log('telegram-bot-service: cmd stats: ',JSON.stringify(message));
            this.persistenceService.findAllChats().then(chats => {
                const sendMessage = 'currently, im notifying ' + TelegramBotService._chatOrChats(chats.length);
                that._send(message.chat.id, sendMessage);
            }).catch(err => {
                console.log('stats', err);
                that.logger('warn', JSON.stringify(err))
            });
        }).on('update', message => {
            this.persistenceService.log('telegram-bot-service: cmd update: ',JSON.stringify(message));
          /*  this.req.request('http://lodurparser-longstone.rhcloud.com/update', () => {
                logger.log('info', 'update from bot triggered')
            });*/
            that._send(message.chat.id, '(not working right now)update triggered');
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
        this.log.log('info', 'should notify all chats with message: ' + sendMessage);
        this.persistenceService.findAllChats().then(chats => {
            chats.forEach(chat => {
                this.log.log('info', 'send Message [chat, text]', chat, sendMessage);
                this._send(chat.chatId, sendMessage);
            });
        }).catch( err => this.persistenceService.log('telegram-bot-service.notifyAll: error',err));
    }

    _send(id, msg) {
        const conf = {
            chat_id: id,
            text: msg
        };
        const that = this;
        this.bot.sendMessage(conf, (err, body) => {
                if (err) {
                    this.persistenceService.log(
                        'telegramMngr - send: ' + JSON.stringify(body) + 'conf: ' + JSON.stringify(conf),
                        'id: ' + id + ' text:' + this._.isObject(err) ? JSON.stringify(err) : err + '\n' + body
                    );
                } else {
                    this.persistenceService.log('sucessful sent :' + JSON.stringify(body), '');
                }
        });
    }

}
module.exports = TelegramBotService;