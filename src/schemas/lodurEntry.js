import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
    group: [String],
    timestamp: Date,
    description: String,
    number : Number
});

let LodurEntry;
if (mongoose.models.LodurEntry) {
    LodurEntry = mongoose.model('LodurEntry');
} else {
    LodurEntry = mongoose.model('LodurEntry', entrySchema);
}
module.exports = LodurEntry;