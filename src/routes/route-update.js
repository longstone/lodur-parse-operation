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
            this.logger.log('debug', 'route-update: update requested');
             Promise.all([
                this.persistenceService.getLastEntryForYear(),
                this.pageloader()
            ])
                .then(result => {
                    const docs = result[0];
                    const entries = result[1];
                    let lastEntries = [];
                    if (lodurUtil.containsDuplicatedID(entries)) {
                        this.logger('warn', 'duplicated ID in entries: ', JSON.stringify(lastEntries));
                    } else {
                        let lastEntry = {number: -1};
                        if (docs.length === 1) {
                            lastEntry = docs[0]._doc;
                        }
                        lastEntries = lodurUtil.getSendArray(entries, lastEntry);
                        if (lastEntries.length > 0) {
                            lodurUtil.sortArrayByNumber(lastEntries);
                            lastEntries.forEach((item) => {
                                this.persistenceService.createNewLodurEntry({
                                    number: item.number,
                                    group: item.group,
                                    timestamp: item.timestamp,
                                    description: item.description
                                }).then(persistedDocumnet => {
                                    this.logger.log('debug', 'persisted document', persistedDocumnet); // TODO REMOVE ME
                                    const message = "Wer:  " + item.group.toString() + "\n"
                                        + "Was:  " + item.description + "\n"
                                        + "Wann: " + moment(item.timestamp).locale('de').format('HH:mm DD.MM.YY') + "\n"
                                        + "Nummer: " + item.number;
                                    this.telegramBot.notifyAll(message);
                                }).error(error => this.logger.log('error', 'persist new Entry Error' + JSON.stringify(err)));
                            });
                        } else if (silent) {
                            this.logger.log('debug', 'no update, latest was: ' + JSON.stringify(lastEntry));
                        }
                    }
                    const updateDiff = {newEntries: lastEntries};
                    res.json(updateDiff);
                })
                .catch((err,err2) => {
                    this.persistenceService.log('error', 'route-update Promise.all#1 err: ' + JSON.stringify(err));
                    this.persistenceService.log('error', 'route-update Promise.all#2 err: ' + JSON.stringify(err2));
                    res.json({error1: err, error2:err2});
                })

        }
    }
}
module.exports = RouteUpdate;
