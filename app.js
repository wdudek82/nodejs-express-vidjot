const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();


///////////////////////////////
// Database
//////////////////////////////

// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));


///////////////////////////////
// Middleware
//////////////////////////////

// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
  secret: '[#<wip4u1z;af~rmWd3w',
  resave: true,
  saveUninitiated: true,
  // cookie: { secure: true }
}));

// Connect flash middleware
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


///////////////////////////////
// Models
//////////////////////////////

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');


///////////////////////////////
// Routing
//////////////////////////////

// Index route
app.get('/', (req, res) => {
  const context = {
    title: 'Welcome',
    name: 'Neevor'
  }

  res.render('index', context);
});

// Projects route
app.get('/projects', (req, res) => {
  res.render('projects');
});

// About route
app.get('/about', (req, res) => {
  res.render('about');
});

// Idea Index Page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

// Add Idea
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({_id: req.params.id})
    .then(idea => {
      res.render('ideas/edit', {
        idea: idea
    });
  });
});

// Process Form
app.post('/ideas/', (req, res) => {
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
    const newUser = {
      title: title,
      details: details
    };
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Video idea added!')
        res.redirect('/ideas');
      });
  }
});

// Edit Form process
app.put('/ideas/:id', (req, res) => {
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
app.delete('/ideas/:id', (req, res) => {
  Idea.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Video idea removed!');
      res.redirect('/ideas');
    });
});


///////////////////////////////
// Server
//////////////////////////////

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});