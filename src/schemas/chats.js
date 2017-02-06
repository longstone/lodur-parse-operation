"use strict";
/**
 * Created by longstone on 18/03/15.
 */
var mongoose = require("mongoose");
var chatSchema = new mongoose.Schema({
    chatId: String,
    firstName: String,
    lastName: String,
    type: String,
    username: String
});

var Chat;
if (mongoose.models.Chat) {
    Chat = mongoose.model('Chat');
} else {
    Chat = mongoose.model('Chat', chatSchema);
}
module.exports = Chat;