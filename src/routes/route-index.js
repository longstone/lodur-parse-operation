class RouteIndex {

    constructor(dependencies) {
        this.import = {
            express: dependencies.express,
            pageloader: dependencies.pageloader
        };
    }

    getRoute() {
        return (req, res) => {
            this.import.pageloader().then(json => {
                    res.setHeader('charset', 'utf8');
                    res.setHeader('Content-Length', new Buffer(json).length);
                    res.json(json);
                },
                err => res.json({error: err}));

        }
    }
}

module.exports = RouteIndex;