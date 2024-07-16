const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
 const isDev = app.settings.env === "development"
 const URL = isDev ?"http://localhost:3000": "https://dboard-draw.vercel.app"
app.use(cors({origin: URL}))
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: URL });

io.on("connection", (socket) => {
  console.log("server connected")

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("beginPath",(data)=>{
    console.log(`beginPath received from ${socket.id} for room ${data.roomId}`, data);
    socket.to(data.roomId).emit("beginPath", data)
  })

  socket.on("drawLine",(data)=>{
    socket.to(data.roomId).emit("drawLine", data)
  })

  socket.on("changeConfig",(data)=>{
    socket.to(data.roomId).emit("changeConfig", data)
  })
});

httpServer.listen(5000);