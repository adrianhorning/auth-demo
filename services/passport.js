const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('../config/keys');
const db = require('../db');


// generates our "identifying token" w/ done function;
passport.serializeUser((id, done) => {
    done(null, id);
});

// takes identifying piece of info from cookie (^user.id), pass in here to turn into a User.
passport.deserializeUser((id, done) => {
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
                const name = profile.displayName.split(' ');
                const firstName = name[0];
                const lastName = name[1];
                db.query(`INSERT INTO users (first_name, last_name, facebookId) VALUES ('${firstName}', '${lastName}', '${profile.id}');`, (err, result, fields) => {
                    if (err) throw err;
                    done(null, result.insertId)
                });
            }
        })
    })
);