const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Load User model
require('../models/User');
const User = mongoose.model('users');

// User Login Route
router.get('/login', (req, res) => {
  const errors = [];

  if (!errors.length) {
    res.render('users/login', {
      errors: errors
    });
  }
});

// User Register Route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Register Form POST
router.post('/register', (req, res) => {
  let errors = [];
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;

  if (password !== password2) {
    errors.push({ text: 'Passwords do not match' });
  }

  if (password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      name,
      email,
      password,
      errors
    });
  } else {
    User.findOne({
      $or: [
        { name },
        { email }
      ]
    }).then((user) => {
      if (user) {
        req.flash('error_msg', 'Name or email already registered');
        res.redirect('/users/login');
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash('success_msg', 'Registered successfully!');
                res.redirect('/users/register');
              })
              .catch((err) => {
                console.log(err);
                res.redirect('/users/register');
              });
          });
        });
      }
    });
  }
});

// User Logout Route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});


module.exports = router;
