const path = require('path');

const express = require('express');

const router = express.Router();

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

router.get('/product-list', (req, res, next) => {
  //res.render('shop/cart')
  res.send('product list')
});

module.exports = router;

