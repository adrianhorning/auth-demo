const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const config = require('./config/db');
const db = require('./db');
require('./services/passport');

const app = express();

const ALL_USERS = 'SELECT * FROM users;';

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

// tells passport to make use of cookies to handle auth
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes/authRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'scripts', 'build', 'index.html'));
  });
}

app.get('/', (req, res) => {
  res.send('Hey there')
})

app.get('/users', (req, res) => {
  db.query(ALL_USERS, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      })
    }
  })
})

const port = process.env.PORT || 3001;
const server = app.listen(port, function () {
  console.log('Server running at http://127.0.0.1:' + port + '/');
});