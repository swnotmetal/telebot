var express = require("express")
var app = express()
var bodyParser = require("body-parser")
const axios = require("axios")
require('dotenv').config()

app.use(bodyParser.json()) // for parsing application/json
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
) // for parsing application/x-www-form-urlencoded

//This is the route the API will call
app.post("/new-message", function(req, res) {
	const { message } = req.body

	//Each message contains "text" and a "chat" object, which has an "id" which is the chat id

	if (!message || !message.text) {
		// In case a message is not present or doesn't have text, do nothing and return an empty response
		return res.end()
	}

	// Process different types of messages based on keywords
	const text = message.text.toLowerCase()
	let responseText = ''

	if (text.includes("包子")|| text.includes("包子")) {
		responseText = "刁民！朕怎么不知道自己叫包子！来人拖出去割鸡巴!!"
	} else if (text.includes("猪头") || text.includes("猪头")) {
		responseText = "朕年轻落选厦门副市长的时候可帅了你们懂什么!"
	} else if (text.includes("共匪") || text.includes("共匪")) {
		responseText = "你怎么不去舔美国的屁股沟子，你们总统都老年痴呆了"
	} else if (text.includes("汉地") || text.includes("汉地")) {
		responseText = "装什么少民 七五就该把你们汉民图光了"
    } else if (text.includes("小哥") || text.includes("小哥")) {
		responseText = "小哥是个好同志 亲自颁发劳模奖章 就是再撒狗粮你大大的鸡巴也硬不起来"
    } else if (text.includes("维尼") || text.includes("维尼")) {
		responseText = "呜呜呜呜 鸡巴太小了 又是水筒形身材 还有癌症 哪里有安全感 全国韭菜一起陪葬吧"
    } 
	
	else {
		// If no specific keyword is matched, respond with a default message
		responseText = "会不会说中文，呼叫吴京，这里有汉奸"
	}

	// Respond by hitting the telegram bot API and responding to the appropriate chat_id with the response text
	axios
        .post(
        `https://api.telegram.org/bot${process.env.API_TOKEN}/sendMessage`, // Use environment variable
        {
            chat_id: message.chat.id, // Use the chat ID of the incoming message
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

// Finally, start our server
app.listen(3000, function() {
	console.log("Telegram app listening on port 3000!")
})

