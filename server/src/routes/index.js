const { Router } = require('express')
const router = Router();

const auth_route = require("./v1/auth.route")
const user_route = require("./v1/user.route")
const message_route = require("./v1/message.route")

router.use("/auth", auth_route)
router.use("/users", user_route)
router.use("/messages", message_route)

module.exports = router;
