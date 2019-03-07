const express = require('express');
const router = express.Router();
const path = require('path');

const Product = require('../models/product-model');

const fileUploader = require('../config/upload-setup/cloudinary');

// List all products for shopper
router.get('/shop-home', (req, res, next) => {
  console.log("here")
  Product.find()
  .then(product => {    
    res.render('shop/product-list',{ product });
  })
  .catch (err => next(err))  
})








router.get('/cart', (req, res, next) => {
  //res.render('shop/cart')
  res.send('cart')
});

router.get('/checkout', (req, res, next) => {
  //res.render('shop/cart')
  res.send('checkout')
});

router.get('/orders', (req, res, next) => {
  //res.render('shop/cart')
  res.send('orders')
});

router.get('/product-details', (req, res, next) => {
  //res.render('shop/cart')
  res.send('product details')
});



module.exports = router;

