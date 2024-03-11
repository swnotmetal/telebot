const app = require('./app');
const config = require('./utils/config');
const axios = require('axios');
const Message = require('./models/message.model');
const logger = require('./utils/logger');

app.get("/messages", async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
		console.log(messages)
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post("/new-message", async function(req, res) {
    const { message } = req.body;
    
    
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
            const response = await axios.get('/messages');
			console.log(response)
            const messages = response.data;

            if (messages.length === 0) {
                await sendMessage(message.chat.id, "There are no messages yet!");
            } else {
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
});


const sendMessage = async (chatId, messageText) => {
    try {
        const response = await axios.post(
            `https://api.telegram.org/bot${process.env.API_TOKEN}/sendMessage`, 
            {
                chat_id: chatId,
                text: messageText,
            }
        );
        console.log("Message posted:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});

