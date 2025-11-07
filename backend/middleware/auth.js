const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const JWT_SECRET = 'your-secret-key';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    try {
      const userData = await prisma.user.findUnique({
        where: { id: user.id }
      });
      
      if (!userData) {
        return res.status(403).json({ error: 'User not found' });
      }
      
      req.user = userData;
      next();
    } catch (error) {
      return res.status(500).json({ error: 'Database error' });
    }
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = { authenticateToken, requireAdmin, JWT_SECRET };