"use strict";
/**
 * Created by longstone on 18/03/15.
 */
var mongoose = require("mongoose");
var entrySchema = new mongoose.Schema({
    group: [String],
    timestamp: Date,
    description: String,
    number : Number
});

var LodurEntry;
if (mongoose.models.LodurEntry) {
    LodurEntry = mongoose.model('LodurEntry');
} else {
    LodurEntry = mongoose.model('LodurEntry', entrySchema);
}
module.exports = LodurEntry;