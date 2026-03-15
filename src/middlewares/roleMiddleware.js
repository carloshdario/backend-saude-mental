module.exports = (role) => {
  return (req, res, next) => {
    // O authMiddleware já deve ter colocado o userRole no req
    if (req.userRole !== role) {
      return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
    }
    next();
  };
};