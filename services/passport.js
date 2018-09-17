const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('../config/keys');
const db = require('../db');


// generates our "identifying token" w/ done function;
passport.serializeUser((user, done) => {
    console.log('serializing user');
    done(null, user.id);
});

// takes identifying piece of info from cookie (^user.id), pass in here to turn into a User.
passport.deserializeUser((id, done) => {
    console.log('deserializing user');
    db.query(`SELECT * FROM users WHERE id = ${id};`, (err, rows, fields) => {
        done(null, rows[0]);
    })
});

passport.use(new FacebookStrategy({
    clientID: keys.facebookClientID,
    clientSecret: keys.facebookClientSecret,
    callbackURL: '/auth/facebook/callback',
    proxy: true
},
    (accessToken, refreshToken, profile, done) => {
        const query = `SELECT * FROM users WHERE facebookId = '${profile.id}';`;
        db.query(query, (err, rows) => {
            if (rows.length !== 0) {
                // already have existing record with this profile     
                done(null, rows[0]);
                //   ^error ^what we are saving
            } else {
                // we don't have a user record with this ID, make a new record
                db.query(`INSERT INTO users (first_name, facebookId) VALUES ('${profile.displayName}', '${profile.id}')`, (err, rows, fields) => {
                    if (err) throw err;
                    console.log(`record created and rows is: ${rows[0]}`);
                    done(null, rows[0])
                });
            }
        })
    })
);