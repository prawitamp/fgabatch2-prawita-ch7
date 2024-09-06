const MessageModel = require("../../models/v1/message.model");

const MessageController = {
  async getMessages(req, res) {
    const { receiver_id } = req.params;
    const sender_id = req.user.id;
    try {
      const result = await MessageModel.getMessages(sender_id, receiver_id);

      if(result.status === 500){
        return res.status(500).json({
          message: result.message,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Messages found",
        data: { message: result.results },
      })
    } catch (err) {
      console.log('error getMessages :>> ', err.message);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        error: err.message,
      })
    }
  },

  async createMessage(req, res) {
    const { receiver_id, message } = req.body;
    const sender_id = req.user.id;

    try {
      const result = await MessageModel.createMessage(sender_id, receiver_id, message);

      if(result.status === 404){
        return res.status(404).json({
          message: result.message,
        });
      }
      if(result.status === 500){
        return res.status(500).json({
          message: result.message,
        });
      }

      req.io.emit('newMessage', result.message);

      return res.status(201).json({
        status: "success",
        message: "Messages created",
        data: { message: result.message },
      })
    } catch (err) {
      console.log('error createMessage :>> ', err.message);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        error: err.message,
      })
    }
  }
}

module.exports = MessageController;