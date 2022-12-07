const EventEmitter = require('node:events');

class MongoConnection {
        connected =  new EventEmitter();

    constructor(mongoose, mongoUri, logger) {
        const connectionStringWithoutCredentials = MongoConnection._stripCredentialsConnectionString(mongoUri);
        mongoose.connect(mongoUri, {
            strictQuery: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(
            () => {
                this.connected.emit('connected');
                logger.log('info', 'Succeeded connected to: ' + connectionStringWithoutCredentials);
            },
            err => {
                logger.log('error', 'ERROR connecting to: ' + connectionStringWithoutCredentials + '. ' + err);
                this.connected.emit('error')
            }
        ).catch(err => console.log('mongoose-connect: unhandled error', err));
    }

    static _stripCredentialsConnectionString(uri) {
        const indexOfAt = uri.indexOf('@');
        let substFrom = 0;
        if (indexOfAt > 0) {
            substFrom = indexOfAt;
        }
        return uri.substring(substFrom);
    }

    getConnectionStatus(){
        return this.connected;
    }
}

module.exports = MongoConnection;
