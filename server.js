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
  const { userFacebookId, accessToken } = req.params;
  try {
    const response = await axios.get(`https://graph.facebook.com/v3.1/${userFacebookId}/accounts?access_token=${accessToken}`);
    res.send(response.data);
  } catch (error) {
    throw(error);
  }
})

app.get("/api/getFBPageAccount/:fbPageId/:accessToken", async (req, res) => {
  const { fbPageId, accessToken } = req.params;
  try {
    const response = await axios.get(`https://graph.facebook.com/v3.1/${fbPageId}?access_token=${accessToken}`);
    res.send(response.data);
  } catch (error) {
    throw(error);
  }
})

app.get("/api/getInstaBizAccountId/:fbPageId/:accessToken", async (req, res) => {
  const { fbPageId, accessToken } = req.params;
  try {
    const response = await axios.get(`https://graph.facebook.com/v3.1/${fbPageId}?fields=instagram_business_account&access_token=${accessToken}`);
    res.send(response.data);
  } catch (error) {
    throw(error);
  }
})

app.get("/api/getInstaUserName/:instaId/:accessToken", async (req, res) => {
  const { instaId, accessToken } = req.params;
  try {
    const response = await axios.get(`https://graph.facebook.com/v3.1/${instaId}?fields=id%2Cusername&access_token=${accessToken}`);
    res.send(response.data);
  } catch (error) {
    throw(error);
  }
})

app.get("/api/getInstaMediaStats/:instaId/:instaUserName/:accessToken", async (req, res) => {
  const { instaId, instaUserName, accessToken } = req.params;
  try {
    const response = await axios.get(`https://graph.facebook.com/v3.1/${instaId}?fields=business_discovery.username(${instaUserName})%7Bfollowers_count%2Cmedia_count%2Cmedia%7Bcomments_count%2Clike_count%7D%7D&access_token=${accessToken}`);
    res.send(response.data);
  } catch (error) {
    throw(error);
  }
})

app.get("/api/getInstaMediaItemDetail/:instaMediaItemId/:accessToken", async (req, res) => {
  const { instaMediaItemId, accessToken } = req.params;
  try {
    const response = await axios.get(`https://graph.facebook.com/v3.1/${instaMediaItemId}?fields=id%2Cmedia_type%2Cmedia_url&access_token=${accessToken}`);
    res.send(response.data);
  } catch (error) {
    throw(error);
  }
})

const port = process.env.PORT || 3001;
const server = app.listen(port, function () {
  console.log('Server running at http://127.0.0.1:' + port + '/');
});