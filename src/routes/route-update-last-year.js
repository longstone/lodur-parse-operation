const _ = require('lodash');
const moment = require('moment');
const lodurUtil = require('../module/util/lodur-util');

class RouteUpdate {
    constructor(dependencies) {
        this.persistenceService = dependencies.persistenceService;
        this.pageloader = dependencies.pageloader;
        this.telegramBot = dependencies.telegramBotService;
        this.logger = dependencies.logger;
    }


    getRoute() {
        return (req, res) => {
            let silent = _.get(req, 'query.silent', false);
            this.logger.log('debug', 'route-update: update requested');
            Promise.all([
                this.persistenceService.getLastEntryForLastYear(),
                this.pageloader.load("https://www.lodur-zh.ch/duebendorf/index.php?modul=6&year=" + moment().startOf('year').subtract(1, 'years').get('year'))
            ])
                .then(result => {
                    try {
                        const docs = result[0];
                        const entries = result[1];
                        let lastEntries = [];
                        if (lodurUtil.containsDuplicatedID(entries)) {
                            this.logger.log('warn', 'duplicated ID in entries: ', JSON.stringify(lastEntries));
                        } else {
                            let lastEntry = {number: -1};
                            if (docs.length === 1) {
                                lastEntry = docs[0]._doc;
                            }
                            this.logger.log('info', `route-update: latest element found ${lastEntry.number}`)
                            lastEntries = lodurUtil.getSendArray(entries, lastEntry);
                            this.logger.log('info', `route-update: elements to send ${lastEntries.length}`,);
                            if (lastEntries.length > 0) {
                                lodurUtil.sortArrayByNumber(lastEntries).forEach((item) => {
                                    try {
                                        this.logger.log('info', `route-update: persisting item nr ${item.number}`,);
                                        const entry = {
                                            number: item.number,
                                            group: item.group,
                                            timestamp: item.timestamp,
                                            description: item.description
                                        };
                                        this.persistenceService.createNewLodurEntry(entry).then(() => {
                                            this.logger.log('info', 'route-update: persisted item nr', item.number);

                                            const message = "Wer:  " + item.group.toString() + "\n"
                                                + "Was:  " + item.description + "\n"
                                                + "Wann: " + moment(item.timestamp).locale('de').format('HH:mm DD.MM.YY') + "\n"
                                                + "Nummer: " + item.number;
                                            this.telegramBot.notifyAll(message).then((chats) => this.logger.log('info', 'total ' + chats.length + ' notified'));

                                        }).catch(error => this.logger.log('error', 'persist new Entry Error' + JSON.stringify(error)));
                                    } catch (constex) {
                                        this.logger.log('info', 'woohwohohwohowow' + constex);
                                    }
                                });
                            } else if (silent) {
                                this.logger.log('debug', 'no update, latest was: ' + JSON.stringify(lastEntry));
                            }
                        }
                        res.json({newEntries: lastEntries});
                    } catch (ex) {
                        this.logger.log('error', 'route-update: exception occured: ' + JSON.stringify(ex));
                        res.json({'error-catch': ex});
                    }
                })
                .catch((err) => {
                    this.persistenceService.log('error', 'route-update Promise.all err: ' + JSON.stringify(err));
                    res.json({error: err});
                })

        }
    }
}

module.exports = RouteUpdate;
