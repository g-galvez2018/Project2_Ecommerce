const express = require('express');
const router  = express.Router();


router.get('/user-account', (req, res, next) => {
  if(!req.user){
    req.flash('error', 'Please login')
    res.redirect('/login');
    return;
  }
  res.render('user-pages/user-account');
});

