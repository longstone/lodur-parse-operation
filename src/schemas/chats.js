import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    chatId: String,
    firstName: String,
    lastName: String,
    type: String,
    username: String
});

let Chat;
if (mongoose.models.Chat) {
    Chat = mongoose.model('Chat');
} else {
    Chat = mongoose.model('Chat', chatSchema);
}
module.exports = Chat;