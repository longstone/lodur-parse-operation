import moment from 'moment';

class PersistenceService {

    constructor(schemas, dependencies) {
        this.LodurEntry = schemas.LodurEntry;
        this.Chats = schemas.Chats;
        this.LogEntry = schemas.LogEntry;
        this.logger = dependencies.logger;
        this.query = {
            entriesThisYear: {timestamp: {$gte:  moment().year(new Date().getFullYear()).month(0).date(1).hour(0).minute(0).second(0).millisecond(0).toDate()}}
        };
    }

    getLastEntryForYear() {
        return this.LodurEntry.find(this.query.entriesThisYear).sort({number: -1}).limit(1).exec();
    }

    getEntriesForActualYear() {
        return this.LodurEntry.find(this.query.entriesThisYear).sort({number: -1}).exec();
    }

    createNewLodurEntry(entry) {
        return new Promise((resolve, reject) => {
            this.LodurEntry.create(entry, (err, obj) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(obj);
                }
            });
        });
    }

    findChatsById(chatId) {
        return new Promise((resolve, reject) => {
            this.Chats.find({chatId}, (err, docs) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            })
        });
    }

    findAllChats() {
        return new Promise((resolve, reject) => {
            this.Chats.find({}, (err, chats) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(chats);
                }
            })
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
    createChat(chat) {
        return new Promise((resolve, reject) => {
            const newChat = new this.Chats(chat);
            newChat.save(function (err, document) {
                if (err) {
                    reject(err)
                } else {
                    resolve(document);
                }
            });
        });
    }

    log(text, error) {
        this.logger.log('debug', 'persistence-service logged: ' + text + ' -> ' + error);
        this.LogEntry.create({
            timestamp: new Date(),
            text,
            error
        }, function (err) {
            if (err !== null) {
                this.logger.log('error', 'persist new received Error', err)
            }
        });
    }
}

module.exports = PersistenceService;