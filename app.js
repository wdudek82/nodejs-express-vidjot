const express = require('express');
const path = require('path');
const session = require('express-session');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

///////////////////////////////
// Routing
//////////////////////////////
const mainRoutes = require('./routes/main');
const ideasRoutes = require('./routes/ideas');
const usersRoutes = require('./routes/users');

///////////////////////////////
// Passport config
//////////////////////////////
require('./config/passport')(passport);

///////////////////////////////
// Database
//////////////////////////////
const db = require('./config/database');

// Connect to mongoose
mongoose
  .connect(db.mongoURI)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

///////////////////////////////
// Middleware
//////////////////////////////

// Handlebars middleware
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(
  session({
    secret: '[#<wip4u1z;af~rmWd3w',
    resave: true,
    saveUninitiated: true,
    saveUninitialized: true
    // cookie: { secure: true }
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash middleware
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Use routes
app.use('/', mainRoutes);
app.use('/ideas', ideasRoutes);
app.use('/users', usersRoutes);

///////////////////////////////
// Server
//////////////////////////////

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
