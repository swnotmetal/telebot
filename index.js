const app = require('./app');
const config = require('./utils/config');
const axios = require('axios');
const Message = require('./models/message.model');
const logger = require('./utils/logger');


app.get("/messages", async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
//This is the route the API will call
app.post("/new-message", async function(req, res) {
    const { message } = req.body;
    
    // Each message contains "text" and a "chat" object, which has an "id" which is the chat id
    if (!message || !message.text) {
        return res.end();
    }
    
    const text = message.text.toLowerCase();
    let responseText = '';

    if (text.includes("蛤")) {
        responseText = " ∞ ∞ ∞ ∞ ∞ NAIVE!  ∞ ∞ ∞ ∞ ∞";
    }

    const mentioned = message.text.toLowerCase().includes(process.env.BOT_NAME);

    if (mentioned && message.chat.type === 'group') {
        try {
            // Fetch messages from your own endpoint /messages
            const response = await axios.get('/messages');
            const messages = response.data;

            if (messages.length === 0) {
                await sendMessage(message.chat.id, "There are no messages yet!");
            } else {
                // Select a random message from the fetched messages
                const randomIndex = Math.floor(Math.random() * messages.length);
                const randomMessage = messages[randomIndex];
                const randomMessageText = randomMessage ? randomMessage.content : 'No messages found';
                await sendMessage(message.chat.id, randomMessageText);
            }
            res.end('ok');
        } catch (error) {
            console.error('Error:', error);
            res.end('Error');
        }
    }
})

	if (!responseText) {
		console.error('Error: Response text is empty');
		res.end('Error: Response text is empty');
		return; // Exit the function to avoid sending empty message to Telegram API
	}

	if (!messageText) {
		console.error('Error: Message text is empty');
		res.end('Error: Message text is empty');
		return; // Exit the function to avoid sending empty message to Telegram API
	}


	// Respond by hitting the telegram bot API and responding to the appropriate chat_id with the response text
	axios
		.post(
			`https://api.telegram.org/bot${process.env.API_TOKEN}/sendMessage`, // Replace <your_api_token> with your actual API token
			{
				chat_id: message.chat.id,
				text: responseText,
			}
		)
		.then((response) => {
			// We get here if the message was successfully posted
			console.log("Message posted")
			res.end("ok")
		})
		.catch((err) => {
			// ...and here if it was not
			console.log("Error :", err)
			res.end("Error :" + err)
		})
})

// Function to send a message using Telegram API
const sendMessage = async (chatId, messageText) => {
	await axios.post(
		`https://api.telegram.org/bot${process.env.API_TOKEN}/sendMessage`, // Replace <your_api_token> with your actual API token
		{
			chat_id: chatId,
			text: messageText,
		}
	);
};


app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
