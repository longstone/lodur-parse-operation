"use strict";
/**
 * Created by longstone on 18/03/15.
 */
var mongoose = require("mongoose");
var deviceSchema = new mongoose.Schema({
    deviceId: String
});

return deviceSchema;