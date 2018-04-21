const express = require('express');
const router = express.Router();

// Index route
router.get('/', (req, res) => {
  const context = {
    title: 'Welcome',
    name: 'Neevor'
  };

  res.render('index', context);
});

// Projects route
router.get('/projects', (req, res) => {
  res.render('projects');
});

// About route
router.get('/about', (req, res) => {
  res.render('about');
});

module.exports = router;