const moment = require('moment');

class PersistenceService {

    constructor(schemas, dependencies) {
        this.LodurEntry = schemas.LodurEntry;
        this.Chats = schemas.Chats;
        this.LogEntry = schemas.LogEntry;
        this.logger = dependencies.logger;
        this.query = {
            entriesThisYear: {timestamp: {$gte: moment().startOf('year').toDate()}},
            entriesLastYear: {timestamp: {$gte: moment().startOf('year').subtract(1,'years').toDate()}}
        };
    }

    getLastEntryForYear() {
        return new Promise((resolve, reject) => {
            this.LodurEntry.find(this.query.entriesThisYear).sort({number: -1}).limit(1).exec(function (err, entries) {
                if (err === null) {
                    resolve(entries)
                } else {
                    reject(err);
                }
            });
        });
    }

    getLastEntryForLastYear() {
        return new Promise((resolve, reject) => {
            this.LodurEntry.find(this.query.entriesLastYear).sort({number: -1}).limit(1).exec(function (err, entries) {
                if (err === null) {
                    resolve(entries)
                } else {
                    reject(err);
                }
            });
        });
    }

    getEntriesForActualYear() {
        return this.LodurEntry.find(this.query.entriesThisYear).sort({number: -1}).exec();
    }

    getEntriesForLastYear() {
        return this.LodurEntry.find(this.query.entriesLastYear).sort({number: -1}).exec();
    }

    createNewLodurEntry(dto) {
        return new this.LodurEntry(dto).save();
    }

    findChatsById(chatId) {
        return new Promise((resolve, reject) => {
            this.Chats.find({chatId}, (err, docs) => {
                if (err !== null) {
                    reject({'err-find-chats-by-id': err});
                } else {
                    resolve(docs);
                }
            })
        });
    }

    findAllChats() {
        return new Promise((resolve, reject) => {
            this.Chats.find({}, (err, chats) => {
                if (err != null) {
                    reject({'err-find-all-chats': err});
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
        return new this.Chats(chat).save();
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