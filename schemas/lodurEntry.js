"use strict";
/**
 * Created by longstone on 18/03/15.
 */
var mongoose = require("mongoose");
var entrySchema = new mongoose.Schema({
    group: [String],
    timestamp: Date,
    description: String
});
var lodurEntry;

var lodurEntry;
if (mongoose.models.LodurEntry) {
    lodurEntry = mongoose.model('LodurEntry');
} else {
    lodurEntry = mongoose.model('LodurEntry', entrySchema);
}
module.exports = lodurEntry;