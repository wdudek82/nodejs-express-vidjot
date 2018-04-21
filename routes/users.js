const express = require('express');
const router = express.Router();

// User Login Route
router.get('/login', (req, res) => {
  res.send('log in');
});

// User Register Route
router.get('/register', (req, res) => {
  res.send('register');
});

// User Logout Route
router.get('/logout', (req, res) => {
  res.send('log out');
});

module.exports = router;