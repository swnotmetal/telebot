const app = require('./app');
const config = require('./utils/config');
const axios = require('axios');
const Message = require('./models/message.model');
const logger = require('./utils/logger');

app.get("/messages", async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
        console.log(messages);
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

    const mentioned = text.includes(process.env.BOT_NAME.toLowerCase());

    if (mentioned && message.chat.type === 'group') {
        try {
            const randomMessage = await getRandomMessage();
            const responseMessage = randomMessage ? randomMessage.content : "There are no messages yet!";
            await sendMessage(message.chat.id, responseMessage);
            res.end('ok');
        } catch (error) {
            console.error('Error:', error);
            res.end('Error');
        }
    } else {
        res.end();
    }
});

const getRandomMessage = async () => {
    try {
        const count = await Message.countDocuments();
        if (count === 0) return null;
        const randomIndex = Math.floor(Math.random() * count);
        const randomMessage = await Message.findOne().skip(randomIndex);
        return randomMessage;
    } catch (error) {
        console.error('Error fetching random message:', error);
        throw error;
    }
};

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

