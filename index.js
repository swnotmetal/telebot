const app = require('./app');
const config = require('./utils/config');
const axios = require('axios');
const Message = require('./models/message.model');
const logger = require('./utils/logger');

app.post('/new-message', async (req, res) => {
  const { message } = req.body;

  if (!message || !message.text) {
    return res.end();
  }

  const text = message.text.toLowerCase();
  let responseText = '';
  if (text.includes("蛤")) {
    responseText = " ∞ ∞ ∞ ∞ ∞ NAIVE!  ∞  ∞ ∞ ∞ ∞ ∞";
  }

  const mentioned = message.text.toLowerCase().includes(process.env.BOT_NAME);
  if (mentioned) {
    try {
      const randomMessage = await Message.aggregate([{ $sample: { size: 1 } }]);
      const randomMessageText = randomMessage.length > 0 ? randomMessage[0].content : 'No messages found';
      await sendMessage(message.chat.id, randomMessageText);
      return res.end('ok');
    } catch (error) {
      logger.error('Error:', error);
      return res.status(500).end('Error');
    }
  }
});

const sendMessage = async (chatId, messageText) => {
  try {
    await axios.post(
      `https://api.telegram.org/bot${process.env.API_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: messageText,
      }
    );
  } catch (error) {
    logger.error('Error sending message:', error);
  }
};

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
