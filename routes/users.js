const express = require('express');
const router = express.Router();

// User Login Route
router.get('/login', (req, res) => {
  const errors = [];

  if (!errors.length) {
    res.render('users/login', {
      errors: errors,
    });
  }
});

// User Register Route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// User Logout Route
router.get('/logout', (req, res) => {
  res.send('log out');
});

// Register Form POST
router.post('/register', (req, res) => {
  let errors = [];
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;

  if (password !== password2) {
    errors.push({text: 'Passwords do not match'});
  }

  if (password.length < 4) {
    errors.push({text: 'Password must be at least 4 characters'});
  }

  if (errors.length > 0) {
    res.render('users/register', {
      name,
      email,
      password,
      errors
    });
  } else {
    res.redirect('/');
  }


});

module.exports = router;