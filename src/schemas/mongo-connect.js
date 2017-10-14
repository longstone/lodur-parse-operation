class MongoConnection {
    constructor(mongoose, mongoUri,logger) {
        const connectionStringWithoutCredentials = MongoConnection._stripCredentialsConnectionString(mongoUri);
        mongoose.connect(mongoUri, {
            useMongoClient: true
        }).then(
            () => logger.log('info', 'Succeeded connected to: ' + connectionStringWithoutCredentials),
            err => logger.log('error', 'ERROR connecting to: ' + connectionStringWithoutCredentials + '. ' + err)
        ).catch( err => console.log('mongoose-connect: unhandled error', err));
    }

    static  _stripCredentialsConnectionString(uri) {
        const indexOfAt = uri.indexOf('@');
        let substFrom = 0;
        if (indexOfAt > 0) {
            substFrom = indexOfAt;
        }
        return uri.substring(substFrom);
    }


}

module.exports = MongoConnection;