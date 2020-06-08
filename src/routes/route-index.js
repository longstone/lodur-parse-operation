import _ from "lodash";

const LogEntry = require('./../schemas/logEntry');
const lodurUtil = require('../module/util/lodur-util');

class RouteIndex {

    constructor(dependencies) {
        this.import = {
            express: dependencies.express,
            pageloader: dependencies.pageloader
        };
    }

    getRoute() {
        return (req, res) => {
            this.import.pageloader.load().then(json => {
                    res.setHeader('charset', 'utf8');
                    if (lodurUtil.containsDuplicatedID(json)) {
                        res.json({error: "duplication, please contact admin"})
                    }
                    res.json(json);
                },
                function (err) {
                    LogEntry.create({
                        timestamp: new Date(),
                        text: 'index - pageloader exception',
                        error: JSON.stringify(err),
                        description: _.get(err, 'message', 'nomessage') + '\nstack:\n' + _.get(err, 'stack', 'nostack')
                    }, function (err) {
                        if (err != null) {
                            console.log('not able to write log Entry ', err);
                        }
                    });
                    res.json({error: err})
                });

        }
    }
}

export default RouteIndex;