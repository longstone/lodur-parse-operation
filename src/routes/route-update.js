import _ from 'lodash';
import lodurUtil from '../module/util/lodur-util';

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
            Promise.all(
                this.persistenceService.getLastEntryForYear(),
                this.pageloader()
            ).then(result => {
                const docs = result[0];
                const entries = result[1];
                let lastEntry = {number: -1};
                if (docs.length === 1) {
                    lastEntry = docs[0]._doc;
                }
                let lastEntries = lodurUtil.getSendArray(json, lastEntry);
                if (lastEntries.length > 0) {
                    lodurUtil.getLastEntry(lastEntries, lastEntry);
                    lodurUtil.sortArrayByNumber(lastEntries);
                    if (lodurUtil.containsDuplicatedID(lastEntries)) {
                        this.logger('warn', 'duplicated ID in entries: ', JSON.stringify(lastEntries));
                    } else {
                        lastEntries.forEach(function (item) {
                            // persist new Entry
                            let errorFree = true;
                            this.persistenceService.createNewLodurEntry({
                                number: item.number,
                                group: item.group,
                                timestamp: item.timestamp,
                                description: item.description
                            }).then(persistedDocumnet => {
                                console.log(persistedDocumnet); // TODO REMOVE ME
                                const message = "Wer:  " + item.group.toString() + "\n"
                                    + "Was:  " + item.description + "\n"
                                    + "Wann: " + moment(item.timestamp).locale('de').format('HH:mm DD.MM.YY') + "\n"
                                    + "Nummer: " + item.number;
                                telegramBot.notifyAll(message);
                            }).error(error => this.logger.log('error', 'persist new Entry Error' + JSON.stringify(err)));
                        });
                    }
                } else if (!silent) {
                    this.logger.log('debug', 'no update, latest was: ' + JSON.stringify(lastEntry));

                }
                const updateDiff = {newEntries: lastEntries};
                res.json(updateDiff);
            }).error(err => {
                this.logger.log('error', 'err: ' + JSON.stringify(err));
                res.json({error: err});
            });

        }
    }
}
module.exports = RouteUpdate;
