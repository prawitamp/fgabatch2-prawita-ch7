const jwt = require("jsonwebtoken")

const Prisma = require("../../config/index")

const MessageModel = {
  async getMessages(sender_id, receiver_id) {
    try {
      const messages = await Prisma.message.findMany({
        where: {
          OR: [
            { user_sender_id: sender_id, user_receiver_id: receiver_id },
            { user_sender_id: receiver_id, user_receiver_id: sender_id}, 
          ]
        },
        orderBy: { id: "asc" }
      })
      
      return { status: 200, results: messages };
    } catch (err) {
      console.log('error in getMessages :>> ', err.message);
      return { status: 500, message: err.message };
    }
  },

  async createMessage(user_sender_id, user_receiver_id, message) {
    try {
      const sender = await Prisma.users.findUnique({ where: { id: user_sender_id } });
      const receiver = await Prisma.users.findUnique({ where: { id: user_receiver_id } });

      if (!sender || !receiver) {
        return { status: 404, message: "Sender or receiver not found"}
      }

      const newMessage = await Prisma.message.create({
        data: {
          user_sender_id,
          user_receiver_id,
          message,
        }
      });

      return { status: 201, message: newMessage }
    } catch (err) {
      console.log('error in createMessage :>> ', err.message);
      return { status: 500, message: err.message };
    }
  }
}

module.exports = MessageModel;