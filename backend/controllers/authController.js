const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, error: 'Please provide username and password' });
    if (password.length < 6) return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    const userExists = await User.findByUsername(username);
    if (userExists) return res.status(400).json({ success: false, error: 'Username already exists' });
    const user = await User.create({ username, password });
    res.status(201).json({
      success: true,
      data: { id: user.id, username: user.username, token: generateToken(user.id) },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        success: true,
        data: { id: user.id, username: user.username, token: generateToken(user.id) },
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ success: false, error: 'Please provide old and new password' });
    if (newPassword.length < 6) return res.status(400).json({ success: false, error: 'New password must be at least 6 characters' });

    const userWithPassword = await User.findByUsername(req.user.username);
    if (!userWithPassword) return res.status(404).json({ success: false, error: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, userWithPassword.password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid old password' });

    await User.updatePassword(req.user.id, newPassword);
    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.updateUsername = async (req, res) => {
  try {
    const { newUsername } = req.body;
    if (!newUsername) return res.status(400).json({ success: false, error: 'New username is required' });

    const userExists = await User.findByUsername(newUsername);
    if (userExists) return res.status(400).json({ success: false, error: 'Username already taken' });

    await User.updateUsername(req.user.id, newUsername);
    const updatedUser = await User.findById(req.user.id);

    if (!updatedUser) return res.status(404).json({ success: false, error: 'User not found after update' });

    res.status(200).json({
      success: true,
      message: 'Username updated successfully',
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        token: generateToken(updatedUser.id),
      },
    });
  } catch (error) {
    console.error('Update username error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};