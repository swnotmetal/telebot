const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const axios = require("axios")
require('dotenv').config()
const mongoose = require ('mongoose')

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

  const mentioned = message.text.toLowerCase().includes("@new_clothes_belly_bot");

  if (mentioned) {
    // Get a random document ID from the database
    const randomDocumentId = await getRandomDocumentId();
  
    // Get the random document by its ID
    const randomDocument = await getRandomDocumentById(randomDocumentId);
  
    // Send the random document as a response
    const documentResponse = randomDocument ? randomDocument.content : "No documents found";
    axios.post(
      `https://api.telegram.org/bot${process.env.API_TOKEN}/sendMessage`,
      {
        chat_id: message.chat.id,
        text: documentResponse, // Use the variable here
      }
    ).then((response) => {
      console.log("Message posted");
      res.end("ok");
    }).catch((err) => {
      console.log("Error:", err);
      res.end("Error:" + err);
    });
  }

  // Send the response text based on message content (language detection removed)
  res.end(responseText);
})

// Finally, start our server
app.listen(3000, function() {
  console.log("Telegram app listening on port 3000!")
})

module.exports = app
