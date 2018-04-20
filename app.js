const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

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
  res.send('<h1>About</h1>');
});

// Projects route
app.get('/projects', (req, res) => {
  res.send(`<h1>Projects</h1>`);
});