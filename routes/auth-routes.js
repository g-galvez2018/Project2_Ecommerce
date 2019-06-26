const express = require('express');
const router = express.Router();

const passport = require('passport');
const User = require('../models/user-model');
const Cart = require('../models/cart')
const Order = require('../models/order-model')

const bcrypt = require('bcryptjs');
const bcryptSalt = 10;




// Route to display register form
router.get('/register', (req, res, next) => {
   res.render('user/register');
})

// Route to handle creation for new user account
router.post('/register', (req, res, next) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const userFullName = req.body.fullName;
  const isAdmin = false;

// Check for empty fields and display error message
  if(userEmail == '' || userPassword == '' || userFullName == ''){
    req.flash('error', 'Please fill all the fields.')
    res.render('user/register');
    return;
  }

// Check if user's email address already exists in database and return error if user already exists
  User.findOne({ email: userEmail })
  .then(foundUser => {
    if(foundUser !==null){
      req.flash('error', 'Sorry, there is already user with the same email!');
      // here we will redirect to '/login' 
      res.redirect('/auth/login');
      return;
    }

// If user does not exist in database - create new user
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPassword = bcrypt.hashSync(userPassword, salt);

      User.create({
        email: userEmail,
        password: hashPassword,
        fullName: userFullName,
        isAdmin: isAdmin
      })
      .then(user => {
        // if all good, log in the user automatically
          req.login(user, (err) => {
            if(err){
              // req.flash.error = 'some message here'
              req.flash('error', 'Auto login does not work so please log in manually ✌🏻');
              res.redirect('/auth/login');
              return;
            }
            res.redirect('/shop/shop-home');
          })
      })
      .catch( err => next(err)); //closing User.create()
  })
  .catch( err => next(err)); // closing User.findOne();
})

// Route to display login form
router.get('/login', (req, res, next) => {
  res.render('user/login');
})

//Route to handle login information
router.post('/login', passport.authenticate('local', {
  successRedirect: '/shop/shop-home', // <== successfully logged in
  failureRedirect: '/auth/login', // <== login failed so go to '/login' to try again
  failureFlash: true,
  passReqToCallback: true
}));



// Route to process logout process
router.get('/logout', (req, res, next) => {
  req.logout(); // <== .logout() method comes from passport and takes care of the destroying the session for us
  req.session.cart = null; //=> Empty shopping for user that logged out
  res.redirect('/auth/login');
})

// Route to view profile - orders made by logged in user

router.get('/profile', isLoggedIn, function (req, res, next) {
  Order.find({user: req.user}, function(err, orders) {
      if (err) {
          return res.write('Error!');
      }
      var cart;
      orders.forEach(function(order) {
          cart = new Cart(order.cart);
          order.items = cart.generateArray();
      });
      res.render('user/profile', { orders: orders });
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/auth/login');
}