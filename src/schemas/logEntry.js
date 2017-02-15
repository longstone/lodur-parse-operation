import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    timestamp: Date,
    text: String,
    error: {},
    description: String
});

let LogEntry;
if (mongoose.models.LogEntry) {
    LogEntry = mongoose.model('LogEntry');
} else {
    LogEntry = mongoose.model('LogEntry', logSchema);
}
module.exports = LogEntry;