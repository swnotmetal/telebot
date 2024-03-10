const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
var bodyParser = require("body-parser")

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

const app = express()
app.use(bodyParser.json()) 
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
)
app.use(cors())
app.use(express.json())


module.exports = app