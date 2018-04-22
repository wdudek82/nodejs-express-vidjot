const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');


// Idea Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

// Add Idea
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({_id: req.params.id})
    .then(idea => {
      res.render('ideas/edit', {
        idea: idea
    });
  });
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
  const title = req.body.title;
  const details = req.body.details;
  const errors = [];

  if (!title) {
    errors.push({text: 'Please add a title'});
  }
  if (!details) {
    errors.push({text: 'Please add some details'});
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: title,
      details: details
    });
  } else {
    const newIdea = {
      title: title,
      details: details
    };
    new Idea(newIdea)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Video idea added!')
        res.redirect('/ideas');
      });
  }
});

// Edit Form process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
      .then(() => { 
        req.flash('success_msg', 'Idea edited successfully!');
        res.redirect('/ideas');
      });
  });
});

// Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Video idea removed!');
      res.redirect('/ideas');
    });
});

module.exports = router;