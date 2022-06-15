const WebSocket = require('ws')
const Message = require('./model/message-m')
const User = require('./model/user-m')
const jwt = require('jsonwebtoken')
const { now } = require('mongoose')
require('dotenv/config')

var MessageType

(function (MessageType) {
    MessageType["TEXT_MESSAGE"] = "TextMessage"
    MessageType["IMAGE_MESSAGE"] = "ImageMessage"

    MessageType["MESSAGE_STATUS"] = "MessageStatusCarrier"
    MessageType["TYPING_STATUS"] = "TypingStatus"
    MessageType["RTC_REQUEST"] = "RtcRequest"

    MessageType["SDP"] = "SDPMessage"
    MessageType["ICE"] = "ICEMessage"
    MessageType["PEER_LEFT"] = "PeerLeft"
})(MessageType || (MessageType = {}))


var MessageStatus

(function (MessageStatus) {
    MessageStatus["SENDING"] = "sending"
    MessageStatus["SENT"] = "sent"
    MessageStatus["DELIVERED"] = "delivered"
    MessageStatus["seen"] = "seen"
})(MessageStatus || (MessageStatus = {}))


module.exports = (server) => {

    const wss = new WebSocket.Server({ 
        server, 
        path: '/socket', 
        clientTracking: true
    })

    wss.on('connection', (ws) => {
        console.log('new connection')

        hasMessage(ws)

        ws.on('message', async (data) => handleMessage(data, wss, ws))

        ws.on('close', (code, reason) => {
            console.log('Disconnected' + reason + code)
        })
        ws.on('error', (error) => {
            console.error(error)
        })
    })

    server.on('upgrade', (request, socket, head) => {

        authenticate(request, socket, (error) => {
            if (error) {
                // socket.write('HTTP/1.1 401 Unauthorized')
                // socket.destroy()
            }
        })
    })
}

function authenticate(request, socket, callback) {

    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return callback(true)

    jwt.verify(token, 
        process.env.ACCESS_TOCKEN_SECRET, 
        (error, user) => {
        if (error) return callback(true)
        socket.userId = user.userId
    })
}

async function handleMessage(data, wss, ws){

    let message = dataParse(data)
    if (!message) return
    console.log(message)

    // let receiver = findUserById(message.receiver)
    // if (!receiver) return

    switch (message.type) {
        case MessageType.TEXT_MESSAGE:
            let client = findClient(wss, message.receiver)

            if (client != undefined){
                toClient(client, message)
                let status = createMessageStatusCarrier(message, MessageStatus.DELIVERED)
                ws.send(JSON.stringify(status))
            } else {
                // push 
                // save to database
                saveMessageToDatabase(message)
                let status = createMessageStatusCarrier(message, MessageStatus.SENT)
                ws.send(JSON.stringify(status))
            }
            break

        case MessageType.IMAGE_MESSAGE:
            break

        case MessageType.MESSAGE_STATUS:
            // let client = findClient(wss, message.receiver)
            if (client != undefined) {
                toClient(client, message)
            }
            break

        case MessageType.RTC_REQUEST:
            break

        case MessageType.ICE:
            break

        case MessageType.SDP:
            break

        case MessageType.PEER_LEFT:
            // sendToReceiver(wss, ws, message, (isSuccessed) => {})
            break

        default:
            console.error("Unexpected message" + message)
            console.log(message)
            break

    }
}

function dataParse(data){
    let message
    try { message = JSON.parse(data) } 
    catch (e) { console.log("Invalid JSON") }
    return message
}

async function findUserById(id){
    let receiver = await User.findById(id).select('-passwordHash')
    return receiver
}

function findClient(wss, id){
    let foundClient
    for (const client of wss.clients) {
        if (client._socket.userId == id) {
            console.log(client._socket.userId)
            foundClient = client
            break;
        }
    }
    return foundClient
}

function toClient(client, message) {
    client.send(JSON.stringify(message))
}

function createMessageStatusCarrier(message, status){
    return {
        type: 'MessageStatusCarrier',
        sender: '',
        receiver: '',
        messageLocalId: message.localId,
        time: message.time,
        status: status
    }
}

async function saveMessageToDatabase(message){
    if (!message) return
    let mongoseMessage = new Message({
        sender  : message.sender,
        receiver: message.receiver,
        type    : message.type,
        localId : message.localId,
        time    : message.time,
        text    : message.text,
        with    : message.with,
        status  : message.status
    })
    let savedMessage = await mongoseMessage.save()
}

async function hasMessage(ws){
    let userId = ws._socket.userId
    let messageList = await Message.find({ receiver: userId}).exec();

    for (let message of messageList) {
        toClient(ws, message)
        Message.find({ _id: message.id }).remove().exec()
    }
}