const { Router } = require("express");
const router = Router();

const MessageController = require("../../controllers/v1/message.controller");
const token_verify = require("../../middlewares/auth");

router.get("/", token_verify, MessageController.getMessages)
router.post("/:sender_id/:receiver_id", token_verify, MessageController.createMessage)

module.exports = router