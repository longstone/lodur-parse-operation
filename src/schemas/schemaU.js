import _ from 'lodash';

/**
 * Schema Utility
 *
 */
class SchemaU {
    constructor(schema, schemaName) {
        this.schema = schema;
        schema.on('index', (error) => {
            // "_id index cannot be sparse"
            console.log(schemaName + ' index: ' + _.get(error, 'message', 'seems ok'));
        });
    }

    indexes(indexes) {
        this.schema.index(indexes);
    }


}

module.exports = SchemaU;