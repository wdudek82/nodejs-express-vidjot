const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Index route
app.get('/', (req, res) => {
  const context = {
    title: 'Welcome',
    name: 'Neevor'
  }

  res.render('index', context);
});

// About route
app.get('/about', (req, res) => {
  res.render('about');
});

// Projects route
app.get('/projects', (req, res) => {
  res.render('projects');
});

// Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// Ideas List
app.get('/ideas', (req, res) => {
  res.render('ideas');
});

// Server
const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});