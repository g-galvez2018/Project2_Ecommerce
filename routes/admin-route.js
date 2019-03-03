const express = require('express');
const router = express.Router();
const path = require('path');

const Product = require('../models/product-model');

const fileUploader = require('../config/upload-setup/cloudinary');



//const adminController = require('../controllers/admin');



// /admin/add-product => GET
//router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
//router.get('/products', adminController.getProducts);

// /admin/add-product => POST
//router.post('/add-product', adminController.postAddProduct);

//router.get('/edit-product/:productId', adminController.getEditProduct);

//router.post('/edit-product', adminController.postEditProduct);

//router.post('/delete-product', adminController.postDeleteProduct);

router.get('/add-product', (req, res, next) => {
  res.render('admin/add-product');
});

router.post('/add-product', fileUploader.single('imageUrl'),(req, res, next) => {
   console.log('body: ', req.body);
   console.log(' - - -- - -- - -- - - -- - - ');
   console.log('file: ', req.file);
  const { itemName, category, price, description } = req.body;
  Product.create({
    itemName,
    category,
    price,
    description,
    imageUrl: req.file.secure_url
  })
  .then( newProduct => {
    console.log('product created: ', newProduct)
    res.redirect('/product-list');
  } )
  .catch( err => next(err) )
})


module.exports = router;