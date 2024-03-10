const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');
const Message = require('./models/message.model');

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000; // Use port from environment variable or default to 3000

// Replace with your actual MongoDB connection string
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.json()); // Parse incoming JSON data

app.post('/new-message', async (req, res) => {
  const { message } = req.body;

  if (!message || !message.text) {
    return res.end();
  }
  if (text.includes("蛤")) {
	responseText = " ∞ ∞ ∞ ∞ ∞ NAIVE!  ∞  ∞ ∞ ∞ ∞ ∞";
  }

  const mentioned = message.text.toLowerCase().includes(prcess.env.BOT_NAME)
  if (mentioned) {
    try {
      const randomMessage = await Message.aggregate([{ $sample: { size: 1 } }]);
      const randomMessageText = randomMessage.length > 0 ? randomMessage[0].content : 'No messages found';
      await sendMessage(message.chat.id, randomMessageText);
      res.end('ok');
    } catch (error) {
      console.error('Error:', error);
      res.end('Error');
    }
  } else {
    res.end(); // Don't respond if not mentioned
  }
});

const sendMessage = async (chatId, messageText) => {
  await axios.post(
    `https://api.telegram.org/bot${process.env.API_TOKEN}/sendMessage`,
    {
      chat_id: chatId,
      text: messageText,
    }
  );
};

app.listen(port, () => console.log(`Server listening on port ${port}`));

