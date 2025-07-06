const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Ambil token dari header
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ambil data user dari ID di dalam token dan sisipkan ke object request
      // Ini akan membuat req.user tersedia di semua rute yang dilindungi
      req.user = await User.findById(decoded.id);

      if (!req.user) {
         return res.status(401).json({ success: false, error: 'Not authorized, user not found' });
      }

      next(); // Lanjutkan ke fungsi controller
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};

module.exports = { protect };