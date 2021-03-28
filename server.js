const path = require("path");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");

const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/peerjs", peerServer);

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
  });
});

server.listen(process.env.PORT || 3000);