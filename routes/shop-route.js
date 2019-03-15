const express = require('express');
const router = express.Router();
const path = require('path');

const Cart = require('../models/cart')
const Product = require('../models/product-model');
const Order = require('../models/order-model')

const fileUploader = require('../config/upload-setup/cloudinary');

// Route to list all products for shopper
router.get('/shop-home', (req, res, next) => {
  let successMsg = req.flash('success')[0];
  Product.find()
  .then(product => {    
    res.render('shop/product-list',{ product , successMsg: successMsg, noMessages: !successMsg});
  })
  .catch (err => next(err))  
})

// Route to display cameras
router.get('/shop-home/:category', (req, res, next) => {  
  console.log(req.params.category)
  Product.find({'category':req.params.category})
  .then(product => {    
    res.render('shop/product-list',{ product });
  })
  .catch (err => next(err))  
})


// Route for product details
router.get('/product-details/:product_id', (req, res, next) => {
  Product.findById(req.params.product_id)
  .then(foundProduct => {
    res.render('shop/product-details', {product: foundProduct})
  })
  .catch( err => next(err) )
});

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
      res.redirect('/shop/shop-home');
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

// Route to handle reducing shopping cart by one item
router.get('/reduce/:id', (req, res, next) => {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shop/shopping-cart');
});

// Route to handle adding same item to shopping cart
router.get('/add/:id', (req, res, next) => {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.addOne(productId);
  req.session.cart = cart;
  res.redirect('/shop/shopping-cart');
});


// Route to checkout items
router.get('/checkout', isLoggedIn, (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {total: cart.totalPrice});
  res.render('shop/checkout')
});

// Route to handle checkout
router.post('/checkout' , isLoggedIn, function (req, res, next){
  if (!req.session.cart){
    return res.redirect('/shop/shopping-cart');
  }
  let cart = new Cart(req.session.cart);

  let order = new Order({
    user: req.user,
    cart: cart,
    address: req.body.address,
    name: req.body.name    
  });

  order.save(function(err, result) {
    req.flash('success', 'Succesfully bought product')
    req.session.cart = null;
    res.redirect('/shop/shop-home');
  });

})

router.get('/orders', (req, res, next) => {
  //res.render('shop/cart')
  res.send('orders')
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/auth/login');
}

