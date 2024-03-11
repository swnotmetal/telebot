const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    chat_id: String
  },
}, { collection: 'documents' });

module.exports = mongoose.model('Message', messageSchema);
