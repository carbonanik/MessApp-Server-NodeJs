const express = require('express')
const http = require('http')
// const path = require('path')
const formatMessage = require('../utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('../utils/users')

const app = express()
const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server)

// app.use(express.static(path.join(__dirname, 'public')))

server.listen(3000,()=>{
	console.log('Node app is running on port 3000')
})

const chatBot = 'Chat Bot'
// Runs when client connects
io.on('connection', (socket) => {
	console.log('made socket connection')

	socket.on('chatMessage', (msg) => {

		console.log(msg)
	})

	socket.on('joinRoom', ({username, room}) => {

		const user = userJoin(socket.id, username, room)

		socket.join(user.room)

		// Welcome current user
		// this message only gose to current user
		socket.emit('message', formatMessage(chatBot,'Welcole to Chat'))

		// Broadcast when a user connects
		// this message gose to everyone except current user
		socket.broadcast.to(user.room).emit('message',formatMessage(chatBot, `${user.username} has joined the chat`))

		// MessageModel.find({}, (err, allMessage) => {

		// 	if (err) return console.error(err);

		// 	allMessage.forEach(message => {
		// 		io.emit('message', formatMessage(message.username, message.text))
		// 	})
		// })

 	// send users and room info
		io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomUsers(user.room)
		})
	})

	// listen chat message
	socket.on('chatMessage', (msg) => {
		const user = getCurrentUser(socket.id)

		io.to(user.room).emit('message', formatMessage(user.username, msg))

		console.log(msg)

		// console.log(`${{
		// 	msg,
		// 	user
		// }}`)

		// var m1 = new MessageModel(formatMessage(user.username, msg))

		// m1.save((err, m) => {
		// 	if (err) return console.log(err)
		// 	console.log('Massage saved')
		// })
	})

	// Runs when client disconnect
	socket.on('disconnect', () => {
		const user = userLeave(socket.id)

		if (user) {
			io.to(user.room).emit('message', formatMessage(chatBot, `${user.username} has left the chat`))

			io.to(user.room).emit('roomUsers', {
					room: user.room,
					users: getRoomUsers(user.room)
			})
		}

	})

})

