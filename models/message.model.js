const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    chat_id: String
  },
});

module.exports = mongoose.model('Message', messageSchema);
