const passport = require('passport');

module.exports = (app) => {
    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            scope: ['public_profile', 'email']
        })
    );

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/home');
        }
    );

    app.get('/api/logout', (req, res) => {
        req.logout(); // function provided by passport
        // when I have the redirect its telling me that I am sending multiple headers
        // when i have it commented out, it sends me to http://localhost:3000/api/logout
        // i wonder if the routing is messed up because of the proxy....
        res.redirect('/');
        // this sends null. I think I am sending null for redux purposes..
        // res.send(req.user);
    });

    app.get('/api/current_user', (req, res) => {
        // where does req.user come from...??
        res.send(req.user);
    });

};