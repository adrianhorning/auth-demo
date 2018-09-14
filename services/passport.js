const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('../config/keys');
const db = require('../db');


// generates our "identifying token" w/ done function;
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// takes identifying piece of info from cookie (^user.id), pass in here to turn into a User.
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => { // again asynchronous promise for finds!
            done(null, user);
        });
});

passport.use(new FacebookStrategy({
    clientID: keys.facebookClientID,
    clientSecret: keys.facebookClientSecret,
    callbackURL: '/auth/facebook/callback',
    proxy: true
},
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ facebookId: profile.id }) // promise returned here
            .then((existingUser) => {
                if (existingUser) {
                    // already have existing record with this profile
                    done(null, existingUser);
                    //   ^error ^what we are saving
                } else {
                    // we don't have a user record with this ID, make a new record
                    new User({ facebookId: profile.id, name: profile.displayName, image_url: `https://graph.facebook.com/${profile.id}/picture?type=large` })
                        .save()
                        // now we have the user we get back from the database,
                        // we have the $oid, which is generated by the database
                        .then(user => done(null, user));
                }
            });
    })
);