const express = require('express');
const router = express.Router();
const path = require('path');


const Cart = require('../models/cart')
const Product = require('../models/product-model');

const fileUploader = require('../config/upload-setup/cloudinary');

// List all products for shopper
router.get('/shop-home', (req, res, next) => {
  Product.find()
  .then(product => {    
    res.render('shop/product-list',{ product });
  })
  .catch (err => next(err))  
})

//Route to handle adding items to Shopping Cart
router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
     if (err) {
         return res.redirect('/');
     }
      cart.add(product, product.id);
      req.session.cart = cart;
      console.log(req.session.cart);
      res.redirect('/shop-home');
  });
});

//Display Items in Shopping Cart
router.get('/shopping-cart', function(req, res, next) {
  if (!req.session.cart) {
      return res.render('shop/shopping-cart', {products: null});
  } 
   var cart = new Cart(req.session.cart);
   res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {total: cart.totalPrice});
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

