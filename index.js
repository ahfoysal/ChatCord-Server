const app = require("./app");
const {sendNotification}  = require("./firebase");

const server = app.listen(process.env.PORT, (err) => {
  
  err
    ? console.log("Server Error")
    : console.log(
        `Server is running on ${
          process.env.SERVER_PORT || process.env.PORT
        } port`
      );
});
const io = require("socket.io")(server, {
  cors: {
    origin: "https://chatcord.pewds.vercel.app",
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000,
});
io.on("connection", (socket) => {
  console.log("User Connected");

  socket.on("setup", (userData) => {
    // console.log(userData)
    socket.join(userData?._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room" + room);
  });
  socket.on("typing", (room) => {
    console.log(room.userId, "typing");
    socket.in(room.conversationId).emit("typing", room);
  });
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    // Send a message to the device corresponding to the provided
    // registration token.
    // console.log(newMessageReceived)
    newMessageReceived.chats.members.forEach((user) => {
      console.log(user.id.deviceId)
      if (user.id._id == newMessageReceived.message.senderId) return;
  
      sendNotification(user.id.deviceId, newMessageReceived?.message?.sender?.name, newMessageReceived?.message?.text)
      newMessageReceived.message.time = Date.now();
     
      //  if(newMessageReceived.chats.conversation._id !== newMessageReceived.message.conversationId)return
      // if(newMessageReceived.chats.conversation._id)
      // console.log(
      //   newMessageReceived.chats.conversation._id,
      //   newMessageReceived.message.conversationId
      // );
      socket
        .in(newMessageReceived.chats.conversation._id)
        .emit("message received", newMessageReceived.message);
    });
  });
});


