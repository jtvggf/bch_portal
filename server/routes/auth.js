const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Register
router.post('/register', async (req, res) => {
  const { email, password, name, username } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name, username });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        email: user.email,
        role: user.role,
        name: user.name,
        username: user.username,
        employeeRole: user.employeeRole,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email }, { username: email }]
    });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { email: user.email, role: user.role, name: user.name, username: user.username, employeeRole: user.employeeRole } });
  } catch (err) {
    res.status(500).json({ message: 'Login error' });
  }
});

// Auth middleware
const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user: { email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

router.get('/users', verifyToken, async (req, res) => {
  try {
    const requester = await User.findById(req.user.userId);
    if (!requester || requester.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view users' });
    }

    const users = await User.find({}, 'email role name username employeeRole');; // only return needed fields
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error loading users' });
  }
});

module.exports = router;

// Promote a user (admin only)
router.post('/promote', verifyToken, async (req, res) => {
  const { targetEmail, newRole, newEmployeeRole } = req.body;
  try {
    const requester = await User.findById(req.user.userId);
    if (!requester || requester.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can promote users' });
    }

    const targetUser = await User.findOne({ email: targetEmail });
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    if (newRole) targetUser.role = newRole;
    if (Array.isArray(newEmployeeRole)) targetUser.employeeRole = newEmployeeRole;

    await targetUser.save();
    res.json({ message: `${targetEmail} updated` });
  } catch (err) {
    res.status(500).json({ message: 'Promotion update error' });
  }
});
