class RouteIndex {

    constructor(dependencies) {
        this.import = {
            express: dependencies.express,
            persistenceService: dependencies.persistenceService,
            logger: dependencies.logger
        };
    }

    getRoute() {
        return (req, res) => {
                let thisYear = this.import.persistenceService.getEntriesForActualYear();

                // maybe there is something for https://www.dasheroo.com/
                
                res.json({
                    my_statistic: {
                        type: 'integer',
                        value: thisYear.length,
                        label: 'Einsätze im Aktuellen Jahr'
                    }
                });
            }
        }
}


module.exports = RouteIndex;
