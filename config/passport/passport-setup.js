const passport =require('passport');
const User = require('../../models/user-model');
// require connect-flash for flash messages
const flash = require('connect-flash');

/////// REQUIRE ALL THE STRATEGIES ////////////
require('./local-strategy');

///////////////////////////////////////////////

// serializeUser => what to be saved in the session
                           // cb stands for callback
passport.serializeUser((user, cb) => {
  // null === no errors, all good
  cb(null, user._id); // ==> save user id into session
});

// deserializeUser => retrieve user's data from the database
// this function gets called every time we request for a user (every time when we need req.user)
passport.deserializeUser((userId, cb) => {
    User.findById(userId)
    .then(user => {
      cb(null, user);
    })
    .catch( err => cb(err));
})