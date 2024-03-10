const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const axios = require("axios")
require('dotenv').config()
const mongoose = require ('mongoose')
const DetectLanguage = require('detectlanguage')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
})

const documentSchema = new mongoose.Schema({
  text: String
})

const Document = mongoose.model('Document', documentSchema)

async function getRandomDocumentId() {
  const documents = await Document.find({}, '_id'); // Retrieve all document IDs
  const randomIndex = Math.floor(Math.random() * documents.length);
  return documents[randomIndex]._id; // Return a random document ID
}

async function getRandomDocumentById(documentId) {
  return await Document.findById(documentId);
}

const languageThreshold = 0.4 // Detect language if English word percentage is above 40%

const detectlanguage = new DetectLanguage({
  key: process.env.DETECT_LANGUAGE_API_KEY // Use the API key from environment variables
})

app.use(bodyParser.json()) // for parsing application/json
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.post("/new-message", async function(req, res) {
  const { message } = req.body

  //Each message contains "text" and a "chat" object, which has an "id" which is the chat id

  if (!message || !message.text) {
    return res.end()
  }

  // Process different types of messages based on keywords
  const text = message.text.toLowerCase()
  let responseText = ''

  if (text.includes("Hello") || text.includes("good morning")) {
    responseText = "Have a nice day!"
  }

  const englishWordCount = message.text.split(/\s+/).filter(word => /[a-zA-Z]/.test(word)).length;
  const englishWordPercentage = englishWordCount / message.text.split(/\s+/).length;
  let shouldDetectLanguage = englishWordPercentage > languageThreshold;
  let language = "zh";
  
  if (shouldDetectLanguage) {
    try {
      const languageDetectionResult = await detectlanguage.detect(message.text);
      language = languageDetectionResult && languageDetectionResult.length > 0 ? languageDetectionResult[0].language : 'en';
    } catch (error) {
      console.error("Error detecting language:", error);
    }
  }

  if (language === "zh") {
    const containsEnglishWords = message.text.match(/[a-zA-Z]{2,}/);
    if (containsEnglishWords) {
      responseText = "Would you like me to translate this message to English?"
    } else {
      responseText = "你好！" // Respond in Chinese if no English detected
    }
  }

  const mentioned = message.text.toLowerCase().includes(process.env.BOT_NAME)

  if(mentioned) {
	const randomDocumentId = await getRandomDocumentId()

	const randomDocument = await getRandomDocumentById(randomDocumentId)

	const documentRes = randomDocument ? randomDocument.content: "Doc not found"
	axios.post(
		`https://api.telegram.org/bot${process.env.API_TOKEN}/sendMessage`,
		{
		  chat_id: message.chat.id,
		  text: documentRes, // Use the variable here
		}
	  ).then((response) => {
		console.log("Message posted");
		res.end("ok");
	  }).catch((err) => {
		console.log("Error:", err);
		res.end("Error:" + err);
	  });
	}
  
	
	res.end(responseText);
  })
  
  // Finally, start our server
  app.listen(3000, function() {
	console.log("Telegram app listening on port 3000!")
  })

