"use strict";
/**
 * Created by longstone on 18/03/15.
 */
var mongoose = require("mongoose");
var deviceSchema = new mongoose.Schema({
    deviceId: String,
    date: {type: Date, default: Date.now}
});
var Device = mongoose.model('Device', deviceSchema);
module.exports = Device;