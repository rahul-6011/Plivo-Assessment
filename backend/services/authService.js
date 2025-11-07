const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../lib/prisma');
const { JWT_SECRET } = require('../middleware/auth');

class AuthService {
  async login(email, password) {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId
      }
    };
  }

  async register(email, password, role = 'user', organizationId) {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        organizationId
      }
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId
      }
    };
  }
}

module.exports = new AuthService();