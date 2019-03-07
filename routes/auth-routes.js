const express = require('express');
const router = express.Router();

const passport = require('passport');
const User = require('../models/user-model');

const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

router.get('/register', (req, res, next) => {
  //res.egister
  res.render('user/register');
})

// action="/register"
router.post('/register', (req, res, next) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const userFullName = req.body.fullName;

  if(userEmail == '' || userPassword == '' || userFullName == ''){
    req.flash('error', 'Please fill all the fields.')
    res.render('user/signup');
    return;
  }

  User.findOne({ email: userEmail })
  .then(foundUser => {
    if(foundUser !==null){
      req.flash('error', 'Sorry, there is already user with the same email!');
      // here we will redirect to '/login' 
      res.redirect('/login');
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPassword = bcrypt.hashSync(userPassword, salt);

      User.create({
        email: userEmail,
        password: hashPassword,
        fullName: userFullName
      })
      .then(user => {
        // if all good, log in the user automatically
          req.login(user, (err) => {
            if(err){
              // req.flash.error = 'some message here'
              req.flash('error', 'Auto login does not work so please log in manually ✌🏻');
              res.redirect('/login');
              return;
            }
            res.redirect('/shop-home');
          })
      })
      .catch( err => next(err)); //closing User.create()
  })
  .catch( err => next(err)); // closing User.findOne();
})

//////////////// LOGIN /////////////////////
router.get('/login', (req, res, next) => {
  res.render('user/login');
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/shop-home', // <== successfully logged in
  failureRedirect: '/login', // <== login failed so go to '/login' to try again
  failureFlash: true,
  passReqToCallback: true
}));

router.get('/profile', (req, res, next) => {
  res.render('user/profile');
})

//////////////// LOGOUT /////////////////////

router.post('/logout', (req, res, next) => {
  req.logout(); // <== .logout() method comes from passport and takes care of the destroying the session for us
  res.redirect('/login');
})

module.exports = router;