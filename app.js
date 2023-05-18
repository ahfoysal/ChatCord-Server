const express = require("express")
const mongoose = require("mongoose")
const authRoutes = require("./src/routes/auth")
const chatRoutes = require("./src/routes/chat")
const messageRoute = require("./src/routes/messageRoute")
const http = require("http")
// const { Server } = require("socket.io")
const bodyParser = require("body-parser")
const cors = require("cors")
const dotenv = require("dotenv")


const app = new express()
// const server = http.createServer(app)
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST']
//   }
// });
app.use(bodyParser.json())
app.use(cors())


dotenv.config()

let users = []
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push({ userId, socketId })
}

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
  return users.find(user => user.userId === userId)
}

// io.on("connection", (socket) => {
//   console.log("User Connected");
//   // socket.on("addUser", userId => {
//   //   addUser(userId, socket.id)
//   //   // console.log("users", userId);

//   //   io.emit("getUsers", users)
//   // })

//   // socket.on("sendMessage", ({ senderId, receiverId, text }) => {
//   //   console.log('triggered')
//   //   const receiver = getUser(receiverId)
//   //   const sender = getUser(senderId)

//   //   if (!receiver || !sender) {
//   //     return
//   //   }
//   //   io.to(sender.socketId).to(receiver.socketId).emit("getMessage", {
//   //     senderId,
//   //     text
//   //   })

//   //   io.to(receiver.socketId).to(sender.socketId).emit("getMessage", {
//   //     senderId,
//   //     text
//   //   })

//   // })

  
//   // socket.on("disconnect", () => {
//   //   console.log("User Disconnected");
//   //   removeUser(socket.id)
//   //   io.emit("getUsers", users)
//   // })
// })

//Route Handle
app.use("/api/v1", authRoutes)

app.use("/api/v1", chatRoutes)
app.use("/api/v1", messageRoute)

let OPTION = {
  autoIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URL, OPTION, (err) => {
  err ? console.log(err)
    : console.log("MongoDB Server Connected");
})


// server.listen(5001, () => {
//   console.log("Socket Server Connected Successfully");
// })

module.exports = app
