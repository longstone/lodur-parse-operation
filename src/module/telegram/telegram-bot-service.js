const _ = require('lodash');
const LodurUtil = require('./../util/lodur-util');

class TelegramBotService {
    constructor(botInstance, dependencies) {
        this.req = {};
        this.req.request = dependencies.request;
        this.persistenceService = dependencies.persistenceService;
        this.logger = dependencies.logger;
        this.bot = this._initBot(botInstance, this.logger);
        this.logger.log('debug', 'telegram-bot-service: construction');
    }

    _initBot(botInstance, logger) {
        logger.log('info', 'binding bot commands');
        const that = this;
        botInstance.onText(/\/start/, message => {
            this.persistenceService.log('telegram-bot-service: cmd start: ', JSON.stringify(message));
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
            }).catch(err => this.logger.log('error', 'telegram-bot-service: unknow error occured ' + JSON.stringify(err)));
        });
        botInstance.onText(/\/stop/, (message) => {
            this.persistenceService.log('telegram-bot-service: cmd stop: ', JSON.stringify(message));
            this.persistenceService.findChatsById(message.chat.id).then(docs => {
                _.each(docs, doc => doc.remove((error) => {
                    let sendMessage = 'removed you from notification list';
                    if (error) {
                        sendMessage = 'error while removing ' + error;
                    }
                    that._send(message.chat.id, sendMessage);
                }));
            });
        });
        botInstance.onText(/\/stats/, message => {
            this.persistenceService.log('telegram-bot-service: cmd stats: ' + JSON.stringify(message));
            this.persistenceService.findAllChats().then(chats => {
                const sendMessage = 'currently, im notifying ' + TelegramBotService._chatOrChats(chats.length);
                that._send(message.chat.id, sendMessage);
            }).catch(err => {
                console.log('stats', err);
                that.logger('warn', JSON.stringify(err))
            });
        });
        botInstance.onText(/\/update/, message => {
            this.persistenceService.log('telegram-bot-service: cmd update: ', JSON.stringify(message));
            this.req.request('http://' + LodurUtil.getServerIp() + ':' + LodurUtil.getServerPort() + '/update', () => {
                logger.log('info', 'update from bot triggered');
                that._send(message.chat.id, 'update triggered');
            }).catch(_errorHandlerText);

        });
        botInstance.on('polling_error', (error) => {
            logger.log('error', error);
            console.log(error.code);  // => 'EFATAL'
        });
        botInstance.on('error', (error) => {
            logger.log('error', error);
            console.log(error.code);  // => 'EFATAL'
        });
        botInstance.getMe().then(value => {
            console.log('Sally goes up...');
            console.log(value);
        }).catch(reason => console.error(reason));
        return botInstance;
    }

    static _chatOrChats(count) {
        const term = count + ' chat';
        if (count > 1) {
            return term + 's';
        }
        return term;
    };

    notifyAll(message) {
        return new Promise((resolve, reject) => {
            this.persistenceService.findAllChats().then(chats => {
                chats.map(chat => {
                    this._send(chat.chatId, message);
                    return true;
                }).every(() => {
                    resolve(chats);
                    return false;
                });
            }).catch(err => {
                this.persistenceService.log('telegram-bot-service.notifyAll: error', err);
                reject({'error-find-all-chats': err})
            });
        });
    }

    _send(id, msg) {
        this.bot.sendMessage(id, msg)
            .then(() => this.logger.log('debug', 'send ' + JSON.stringify({id, msg}))
            ).catch((error) => {
            console.log(error.code);  // => 'ETELEGRAM'
            console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
            this.persistenceService.log('telegram-bot-service.send: error', error);
        });
    }

}

module.exports = TelegramBotService;