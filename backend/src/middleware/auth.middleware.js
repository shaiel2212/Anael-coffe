const jwt = require('jsonwebtoken');
const { User, Cafe } = require('../models');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'ERR001', message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      where: { id: decoded.userId, is_active: true },
      include: [{ model: Cafe, as: 'cafe' }],
    });

    if (!user) {
      return res.status(401).json({ error: 'ERR001', message: 'User not found or inactive' });
    }

    req.user = user;
    req.cafeId = user.cafe_id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'ERR001', message: 'Invalid or expired token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'ERR001', message: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'ERR002', message: 'Insufficient permissions' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
