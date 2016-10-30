"use strict";
/**
 * Created by longstone on 18/03/15.
 */
var mongoose = require("mongoose");
var logSchema = new mongoose.Schema({
    timestamp: Date,
    text: String,
    error: {},
    description: String
});

var LogEntry;
if (mongoose.models.LogEntry) {
    LogEntry = mongoose.model('LogEntry');
} else {
    LogEntry = mongoose.model('LogEntry', logSchema);
}
module.exports = LogEntry;