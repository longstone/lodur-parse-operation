class RouteIndex {

    constructor(dependencies) {
        this.import = {
            express: dependencies.express,
            persistenceService: dependencies.persistenceService,
            logger: dependencies.logger
        };
    }

    // maybe there is something for https://www.dasheroo.com/
    getRoute() {
        return (req, res) => {
            this.import.persistenceService.getEntriesForActualYear().then(
                thisYear => res.json({
                    my_statistic: {
                        type: 'integer',
                        value: thisYear.length,
                        label: 'Einsätze im aktuellen Jahr'
                    }
                })
            );
        }
    }
}


module.exports = RouteIndex;
