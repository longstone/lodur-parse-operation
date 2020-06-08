const mongoose =  require('mongoose');

const deviceSchema = new mongoose.Schema({
    deviceId: String,
    date: {type: Date, default: Date.now}
});
let Device;
if (mongoose.models.Device) {
    Device = mongoose.model('Device');
} else {
    Device = mongoose.model('Device', deviceSchema);
}
module.exports = Device;