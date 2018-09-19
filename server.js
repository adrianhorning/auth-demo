const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const config = require('./config/db');
const db = require('./db');
const axios = require('axios');

require('./services/passport');

const app = express();

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

app.get("/", (req, res) => {
  res.send('hey there')
})

app.get("/api/getUserAccount/:userFacebookId/:accessToken", async (req, res) => {
  try {
    const response = await axios.get(`https://graph.facebook.com/v3.1/${req.params.userFacebookId}/accounts?access_token=${req.params.accessToken}`);
    res.send(response.data);
  } catch (error) {
    throw(error);
  }
})

app.get("/api/getFBPageAccount/:fbPageId/:accessToken", async (req, res) => {
  try {
    const response = await axios.get(`https://graph.facebook.com/v3.1/${req.params.fbPageId}?access_token=${req.params.accessToken}`);
    res.send(response.data);
  } catch (error) {
    throw(error);
  }
})

app.get("/api/getInstaBizAccountId/:fbPageId/:accessToken", async (req, res) => {
  try {
    const response = await axios.get(`https://graph.facebook.com/v3.1/${req.params.fbPageId}?fields=instagram_business_account&access_token=${req.params.accessToken}`);
    res.send(response.data);
  } catch (error) {
    throw(error);
  }
})

app.get("/api/getInstaMediaStats/:instaId/:accessToken", async (req, res) => {
  // how do I get the insta username?
  try {
    const response = await axios.get(`https://graph.facebook.com/v3.1/${req.params.instaId}?fields=business_discovery.username(adrianhorning)%7Bfollowers_count%2Cmedia_count%2Cmedia%7Bcomments_count%2Clike_count%7D%7D&access_token=${req.params.accessToken}`);
    res.send(response.data);
  } catch (error) {
    throw(error);
  }
})

const port = process.env.PORT || 3001;
const server = app.listen(port, function () {
  console.log('Server running at http://127.0.0.1:' + port + '/');
});