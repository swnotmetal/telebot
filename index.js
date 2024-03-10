const app = require('./app') 
const config = require('./utils/config')
const axios = require('axios');
const Message = require('./models/message.model')
const logger = require('./utils/logger')


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

  const mentioned = message.text.toLowerCase().includes(process.env.BOT_NAME)
  if (mentioned) {
	try {
	  const totalDocuments = await Message.countDocuments();
	  if (totalDocuments === 0) {
		await sendMessage(message.chat.id, "There are no messages yet!");
		res.end('ok');
	  } else {
		const randomId = Math.floor(Math.random() * totalDocuments); // Ensure non-zero value
		const randomMessage = await Message.findById(randomId);
		const randomMessageText = randomMessage ? randomMessage.content : 'No messages found';
		await sendMessage(message.chat.id, randomMessageText);
		res.end('ok');
	  }
	} catch (error) {
	  console.error('Error:', error);
	  res.end('Error');
	}
  }

const sendMessage = async (chatId, messageText) => {
  await axios.post(
    `https://api.telegram.org/bot${process.env.API_TOKEN}/sendMessage`,
    {
      chat_id: chatId,
      text: messageText,
    }
  );
};

app.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`)
  })

