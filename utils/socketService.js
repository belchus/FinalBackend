const logger = require("./logger");
const {allchannels,sendMessage,thischannel} = require("../controllers/chat.js");

module.exports = (io) => {
  io.on("connection", async (socket) => {
    logger.info("Client Online");
    socket.emit("channels", await allchannels());
    socket.on("join-room", (roomName, cb) => {
      socket.rooms.forEach(room => {
        if(room !== socket.id){
          socket.leave(room)
        }
      });
      socket.join(roomName);
    });
    socket.on("single-channel", async (user) => {
      socket.emit('channel', await thischannel(user))
    })
    socket.emit("start", "channel")
    socket.on("new-message", async (msg) => {
      await sendMessage(msg);
      io.to(msg.to).emit('recibir-mensajes', await thischannel(msg.to))
      socket.emit("channels", await allchannels());
    });
    socket.on('change-room', async (room) => {
      socket.emit('switch-room', await allchannels(room))
    })
    socket.on('disconnect', () => {
      logger.info("Client Offline")
    })
  });
};
