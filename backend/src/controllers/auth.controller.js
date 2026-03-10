const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Cafe } = require('../models');

const generateTokens = (userId, cafeId, role) => {
  const accessToken = jwt.sign(
    { userId, cafeId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
  return { accessToken, refreshToken };
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'ERR_VALIDATION', message: 'Email and password are required' });
    }

    const emailNorm = email.toLowerCase().trim();
    const user = await User.findOne({
      where: { email: emailNorm, is_active: true },
      include: [{ model: Cafe, as: 'cafe' }],
    });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      if (process.env.NODE_ENV !== 'production') {
        const logger = require('../utils/logger');
        logger.info(`Login 401: email=${emailNorm} (user ${user ? 'found, wrong password' : 'not found'})`);
      }
      return res.status(401).json({ error: 'ERR001', message: 'Invalid credentials' });
    }

    if (!user.cafe) {
      return res.status(500).json({ error: 'ERR', message: 'User cafe not found' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.cafe_id, user.role);
    await user.update({ refresh_token: refreshToken, last_login_at: new Date() });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        cafe: {
          id: user.cafe.id,
          name: user.cafe.name,
          slug: user.cafe.slug,
          logo_url: user.cafe.logo_url,
          primary_color: user.cafe.primary_color,
          default_language: user.cafe.default_language,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'ERR_VALIDATION', message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findOne({
      where: { id: decoded.userId, refresh_token: refreshToken, is_active: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'ERR001', message: 'Invalid refresh token' });
    }

    const tokens = generateTokens(user.id, user.cafe_id, user.role);
    await user.update({ refresh_token: tokens.refreshToken });

    res.json(tokens);
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'ERR001', message: 'Invalid or expired refresh token' });
    }
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await req.user.update({ refresh_token: null });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    cafe: req.user.cafe,
  });
};

module.exports = { login, refresh, logout, me };
