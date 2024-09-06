const { Router } = require("express")

const router = Router()
const UserController = require("../../controllers/v1/user.controller")

router.post("/", UserController.create);
router.post("/login", UserController.login);

router.get("/verify/:id", UserController.verify);
router.post("/forgot-password", UserController.forgotPassword);
router.post("/reset-password/:id", UserController.resetPassword);

module.exports = router