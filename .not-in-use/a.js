// var Server = require('ws').Server;
// var port = process.env.PORT || 9030;
// var ws = new Server({port: port});

// var sockets = [];
// ws.on('connection', function(w){
  
//   var id = w.upgradeReq.headers['sec-websocket-key'];
//   console.log('New Connection id :: ', id);
//   w.send(id);
//   w.on('message', function(msg){
//     var id = w.upgradeReq.headers['sec-websocket-key'];
//     var message = JSON.parse(msg);
    
//     sockets[message.to].send(message.message);

//     console.log('Message on :: ', id);
//     console.log('On message :: ', msg);
//   });
  
//   w.on('close', function() {
//     var id = w.upgradeReq.headers['sec-websocket-key'];
//     console.log('Closing :: ', id);
//   });

//   sockets[id] = w;
// });

// ##########################################

// var WebSocketServer = require('ws').Server
// var ws = new WebSocketServer({
//     verifyClient: function (info, cb) {
//         var token = info.req.headers.token
//         if (!token)
//             cb(false, 401, 'Unauthorized')
//         else {
//             jwt.verify(token, 'secret-key', function (err, decoded) {
//                 if (err) {
//                     cb(false, 401, 'Unauthorized')
//                 } else {
//                     info.req.user = decoded //[1]
//                     cb(true)
//                 }
//             })

//         }
//     }
// })

// ################################################
            // const broadcastRegix = /^broadcast\:/

            // if (broadcastRegix.test(message)) {
            //     message = message.replace(broadcastRegix, '')

            //     wss.clients.forEach(client => {
            //         if (client != ws){
            //             client.send(`Hello Broadcust Message -> ${message}`)
            //         }
            //     });

            // } else {
                // ws.send(`Hello you sent -> ${message}`)
            // }
// #################################################
            // const wss = new WebSocket.Server({ server, path: '/socket'
            // ,
                // verifyClient: function (info, cb) {
                //     var token = info.req.headers.token
                //     console.log(`here`)
                //     cb(true)
        
                    // if (!token)
                    //     cb(false, 401, 'Unauthorized')
                    // else {
                    //     jwt.verify(token,  process.env.ACCESS_TOCKEN_SECRET, function (err, decoded) {
                    //         if (err) {
                    //             cb(false, 401, 'Unauthorized')
                    //         } else {
                    //             info.req.user = decoded //[1]
                    //             cb(true)
                    //         }
                    //     })
        
                    // }
                // }
            // })

        // ws.isAlive = true

        // ws.on('pong', () => {
        //     ws.isAlive = true
        //     console.log('Pong')
        // })

    // setInterval(() => {
    //     wss.clients.forEach(ws => {
    //         if (!ws.isAlive) return ws.terminate()

    //         ws.isAlive = false
    //         ws.ping(null, false, true)
    //     })
    // }, 10000)





// ###################################################################
    // Express Server

    // const express = require('express')

// const app = express()

// app.use((req, res, next) => {
//     console.log(new Date() + ' Received request for ' + req.url)

//     res.writeHead(200, {'Content-Type' : 'text/plain'})
//     next()
// })

// app.get('/', (req, res) => {
//     res.end('Home Page')
// })

// app.get('/about', (req, res) => {
//     res.end('About Page')
// })

// app.get('/hello/:who', (req, res) => {
//     res.end('Hello ' + req.params.who)
// })

// app.use((req, res) => {
//     res.statusCode = 404
//     res.end('404 Error!')
// })

// app.listen(3000)


//########################################################################
//                    Socket IO Server



// const express = require('express')
// const http = require('http')
// const path = require('path')
// const formatMessage = require('./utils/messages')
// const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')

// const app = express()
// const server = http.createServer(app)
// const socketio = require('socket.io')
// const io = socketio(server)

// const mongoose = require('mongoose')

// mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true,  useUnifiedTopology: true })
// const db = mongoose.connection
// db.on('error', console.error.bind(console, 'connection error:'))
// db.once('open', () => {
// 	console.log('connected to DB')
// })

// // Define a schema
// var Schema = mongoose.Schema

// var message = new Schema({
// 	username: String,
// 	text: String,
// 	time: String
// })

// var MessageModel = mongoose.model('message', message, 'messages')

// app.use(express.static(path.join(__dirname, 'public')))

// server.listen(3000,()=>{
// 	console.log('Node app is running on port 3000')
// })

// const chatBot = 'Chat Bot'
// // Runs when client connects
// io.on('connection', (socket) => {
// 	console.log('made socket connection')

// 	socket.on('chatMessage', (msg) => {

// 		console.log(msg)
// 	})

// 	socket.on('joinRoom', ({username, room}) => {

// 		const user = userJoin(socket.id, username, room)

// 		socket.join(user.room)

//		// Welcome current user
//		// this message only gose to current user
// 		socket.emit('message', formatMessage(chatBot,'Welcole to Chat'))

// 		// Broadcast when a user connects
// 		// this message gose to everyone except current user
// 		socket.broadcast.to(user.room).emit('message',formatMessage(chatBot, `${user.username} has joined the chat`))

// 		// MessageModel.find({}, (err, allMessage) => {

// 		// 	if (err) return console.error(err);

// 		// 	allMessage.forEach(message => {
// 		// 		io.emit('message', formatMessage(message.username, message.text))
// 		// 	})
// 		// })

//  	// send users and room info
// 		io.to(user.room).emit('roomUsers', {
// 			room: user.room,
// 			users: getRoomUsers(user.room)
// 		})
// 	})

// 	// listen chat message
// 	socket.on('chatMessage', (msg) => {
// 		const user = getCurrentUser(socket.id)

// 		io.to(user.room).emit('message', formatMessage(user.username, msg))

// 		console.log(msg)

// 		// console.log(`${{
// 		// 	msg,
// 		// 	user
// 		// }}`)

// 		// var m1 = new MessageModel(formatMessage(user.username, msg))

// 		// m1.save((err, m) => {
// 		// 	if (err) return console.log(err)
// 		// 	console.log('Massage saved')
// 		// })
// 	})

// 	// Runs when client disconnect
// 	socket.on('disconnect', () => {
// 		const user = userLeave(socket.id)

// 		if (user) {
// 			io.to(user.room).emit('message', formatMessage(chatBot, `${user.username} has left the chat`))

// 			io.to(user.room).emit('roomUsers', {
// 					room: user.room,
// 					users: getRoomUsers(user.room)
// 			})
// 		}

// 	})

// })



// ###################################################################
                               //WebSocketServer


                               // const SocketServer = require('websocket').server
// const http = require('http')

// const server = http.createServer((req, res) => {
//     console.log(new Date() + ' Received request for ' + req.url)

//     let answer = ''
//     answer += 'Request URL: ' + req.url + '\n'
//     answer += 'Request Type: ' + req.method + '\n'
//     answer += 'Request Headers: ' + JSON.stringify(req.headers)

//     res.writeHead(200, {'Content-Type' : 'text/plain'})
//     res.end(answer)
// })

// server.listen(3000, () => {
//     console.log('listening to prt 3000')
// })

// wsServer = new SocketServer({ httpServer: server })

// const connections = []

// wsServer.on('request', (req) => {
//     if (!originIsAllowed(req.origin)) {
//         // Make sure we only accept requests from an allowed origin
//         req.reject()
//         console.log(
//             new Date() + ' Connection from origin ' + req.origin + ' rejected.'
//         )
//         return
//     }

//     const connection = req.accept()
//     console.log('New Connection')
//     console.log(connection)

//     connections.push(connection)

//     connection.on('message', (msg) => {
//         connections.forEach((element) => {
//             if (element != connection) {
//                 element.sendUTF(msg.utf8Data)
//             }
//         })
//         console.log(msg)
//         var str = msg.utf8Data
//         // var json = JSON.parse(str)
//         // json.message += ' Send Back From Server'
//         connection.sendUTF(str)
//     })

//     connection.on('close', (resCode, des) => {
//         connections.splice(connections.indexOf(connection), 1)
//         console.log(
//             new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.'
//         )se`
//     })
// })

// function originIsAllowed(origin) {
//     // put logic here to detect whether the specified origin is allowed.
//     return true
// }
