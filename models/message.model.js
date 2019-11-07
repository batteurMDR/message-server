const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: String,
    channel: String
});

module.exports = mongoose.model('Message', MessageSchema);
