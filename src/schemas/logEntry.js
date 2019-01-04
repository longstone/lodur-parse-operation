import mongoose from 'mongoose';
import SchemaUtil from './schemaU';

const logSchema = new mongoose.Schema({
    timestamp: Date,
    text: String,
    error: {},
    description: String
});

new SchemaUtil(logSchema, 'LogEntry').indexes({timestamp: 1, error: -1});

let LogEntry;
if (mongoose.models.LogEntry) {
    LogEntry = mongoose.model('LogEntry');
} else {
    LogEntry = mongoose.model('LogEntry', logSchema);
}


module.exports = LogEntry;