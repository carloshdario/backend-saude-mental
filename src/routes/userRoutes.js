const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/auth")

router.post("/register", UserController.register);
router.post("/login", UserController.login);

// ADICIONE ESTA LINHA AQUI (Antes do /users/:id)
router.get("/users/psicologos", authMiddleware, UserController.listPsicologos);

router.put("/users/:id", authMiddleware, UserController.update);
router.get("/users/:id", authMiddleware, UserController.get);
router.delete("/users/:id", authMiddleware, UserController.delete);

module.exports = router;