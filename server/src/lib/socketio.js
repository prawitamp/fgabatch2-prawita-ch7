const http = require('http');
const { Server } = require('socket.io');

const MessageModel = require("../models/v1/message.model")

const io = (app) => {
  const server = http.createServer(app);
  const socketIo = new Server(server, { cors: { origin: '*' } });

  socketIo.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('sendMessage', async (data) => {
      const { sender_id, receiver_id, message } = data;
      const result = await MessageModel.createMessage(sender_id, receiver_id, message);
      
      if (result.status === 201) {
        socketIo.emit('receiveMessage', result.message);
      } else {
        socket.emit('error', result.message);
      }
    })

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  })

  return server;
};

module.exports = io;