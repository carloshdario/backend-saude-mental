const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/auth")

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.put("/users/:id", authMiddleware, UserController.update);
router.get("/users/:id", authMiddleware, UserController.get);


module.exports = router;