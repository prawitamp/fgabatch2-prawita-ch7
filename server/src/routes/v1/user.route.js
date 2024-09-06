const { Router } = require("express")

const router = Router()
const UserController = require("../../controllers/v1/user.controller")
const token_verify = require("../../middlewares/auth")

router.get("/:id", UserController.getById);
router.get("/", UserController.getAll);
router.put("/:id", token_verify, UserController.update);

module.exports = router