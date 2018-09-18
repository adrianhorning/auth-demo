const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('../config/keys');
const db = require('../db');


// generates our "identifying token" w/ done function;
passport.serializeUser((id, done) => {
    done(null, id);
});

// takes identifying piece of info from cookie (^user.id), pass in here to turn into a User.
passport.deserializeUser((user, done) => {
    db.query(`SELECT * FROM users WHERE id = ${user.id};`, (err, rows, fields) => {
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
                console.log('need to create a user');
                const name = profile.displayName.split(' ');
                const firstName = name[0];
                const lastName = name[1];
                const insertStatement = `INSERT INTO users (first_name, last_name, facebookId, accessToken) VALUES ('${firstName}', '${lastName}', '${profile.id}', '${accessToken}');`
                db.query(insertStatement, (err, result, fields) => {
                    if (err) throw err;
                    console.log(result);
                    done(null, result.insertId)
                });
            }
        })
    })
);