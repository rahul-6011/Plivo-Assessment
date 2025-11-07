const authService = require('../services/authService');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async register(req, res) {
    try {
      const { email, password, role, organizationId } = req.body;
      const result = await authService.register(email, password, role, organizationId);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async me(req, res) {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        organizationId: req.user.organizationId
      }
    });
  }
}

module.exports = new AuthController();