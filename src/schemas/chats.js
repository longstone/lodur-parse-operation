import mongoose from 'mongoose';
import SchemaUtil from './schemaU';

const chatSchema = new mongoose.Schema({
    chatId: String,
    firstName: String,
    lastName: String,
    type: String,
    username: String
});

new SchemaUtil(chatSchema, 'Chat').indexes({chatId: 1});

let Chat;
if (mongoose.models.Chat) {
    Chat = mongoose.model('Chat');
} else {
    Chat = mongoose.model('Chat', chatSchema);
}
module.exports = Chat;