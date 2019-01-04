import mongoose from 'mongoose';
import SchemaUtil from './schemaU';

const entrySchema = new mongoose.Schema({
    group: [String],
    timestamp: Date,
    description: String,
    number : Number
});

new SchemaUtil(entrySchema, 'LodurEntry').indexes({number: 1, timestamp: -1});
let LodurEntry;
if (mongoose.models.LodurEntry) {
    LodurEntry = mongoose.model('LodurEntry');
} else {
    LodurEntry = mongoose.model('LodurEntry', entrySchema);
}

module.exports = LodurEntry;