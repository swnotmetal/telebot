var express = require("express")
var app = express()
var bodyParser = require("body-parser")
const axios = require("axios")
require('dotenv').config()
const mongoose = require ('mongoose')
var DetectLanguage = require('detectlanguage')
const fs = require('fs')


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

/*const jsonFilePath = `${__dirname}/quotes.json`;

// Read and parse JSON file
const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
const documents = JSON.parse(jsonData);

// Save each document to the database
documents.forEach(async (docData) => {
    try {
        const document = new Document(docData);
        await document.save();
        console.log('Document saved:', document);
    } catch (error) {
        console.error('Error saving document:', error);
    }
}) */

async function getRandomDocumentId() {
    const documents = await Document.find({}, '_id'); // Retrieve all document IDs
    const randomIndex = Math.floor(Math.random() * documents.length);
    return documents[randomIndex]._id; // Return a random document ID
}

async function getRandomDocumentById(documentId) {
    return await Document.findById(documentId);
}
const languageThreshold = 2


app.use(bodyParser.json()) // for parsing application/json
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
) 
const detectlanguage = new DetectLanguage({
    key: process.env.DETECT_LANGUAGE_API_KEY // Use the API key from environment variables
})
app.post("/new-message", async function(req, res) {
	const { message } = req.body

	//Each message contains "text" and a "chat" object, which has an "id" which is the chat id

	if (!message || !message.text) {
		return res.end()
	}

	// Process different types of messages based on keywords
	const text = message.text.toLowerCase()
	
	let responseText = ''

	if (text.includes("包子")|| text.includes("包子")) {
		responseText = "刁民！朕怎么不知道自己叫包子！来人拖出去割鸡巴!!"
	} else if (text.includes("猪头") || text.includes("猪头")) {
		responseText = "呜呜呜呜 就我一个候选人50%选票都不给我 等我上台你们都的死"
	} else if (text.includes("共匪") || text.includes("共匪")) {
		responseText = "你以为当年井冈山上发生了什么？LGBTQ+大专政么"
	} else if (text.includes("汉地") || text.includes("汉地")) {
		responseText = "装什么少民 七五就该把你们汉民图光了"
    } else if (text.includes("小哥") || text.includes("小哥")) {
		responseText = "小哥是个好同志 亲自颁发劳模奖章 就是再撒狗粮你大大的**也硬不起来"
    } else if (text.includes("维尼") || text.includes("维尼")) {
		responseText = "呜呜呜呜 jj太小了 又是水筒形身材 还有癌症 哪里有安全感 全国韭菜一起陪葬吧"
    } else if (text.includes("这卖") || text.includes("这卖")) {
		responseText = "卖批！阿达西阿囊阿死给！"
	} else if (text.includes("我蛤", "江泽民") || text.includes("我蛤", "江泽民")) {
		responseText = "团派江派一扫光哟"
	}
	else {
		return res.end()
	}
	const englishWordCount = message.text.split(/\s+/).filter(word => /[a-zA-Z]/.test(word)).length
	let shouldDetectLanguage = englishWordCount > languageThreshold
	let language = "zh"
	if(shouldDetectLanguage) {
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
            responseText = "尼玛会不会说中文，呼叫无精这里有汉奸，虽远必诛！"
        } 
	} else {
		return res.end()
	}

	const mentioned = message.text.toLowerCase().includes(process.env.BOT_NAME);

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
	

})

// Finally, start our server
app.listen(3000, function() {
	console.log("Telegram app listening on port 3000!")
})

