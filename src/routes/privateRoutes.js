const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { User } = require("../models"); // Certifique-se de que User está sendo importado corretamente

router.get("/dashboard", auth, async (req, res) => {
  try {
    const { userId, userRole } = req;
    console.log(User)
    const user = await User.findByPk(userId); // Aqui estamos usando findByPk para buscar pelo id
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json({
      msg: `Bem-vindo, ${userId} (${userRole})`,
    });
  } catch (err) {
    console.error("Erro na dashboard:", err);
    res.status(500).json({ error: "Erro ao carregar dashboard" });
  }
});

module.exports = router;
