// Main Server 

//Importing Modules
require('dotenv/config')
const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const mongoose = require('mongoose')
//Importing Healpers
const authenticateToken = require('./helpers/authencate-token')
// const errorHandler = require('./helpers/error-handler')

// Initializing Express Server
const app = express()
const server = http.createServer(app)

//MilldeWare
app.use(express.json())

const api = process.env.API_URL

//Importing Routers
const userRouter = require('./router/user-r')
const authRouter = require('./router/auth-r')

// Using Routers
app.use(`${api}/user`, userRouter)
app.use(`${api}/auth`, authRouter)

// Connecting To Mongo DB
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Setting Listiner To DB
const db = mongoose.connection 
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () =>{
    console.log('Connected To DB')
})

// Initializing Web Socket Server
require('./wss')(server)


// Starting The Server
server.listen(3000, () => {
    console.log("Server Started on port 3000")
})
