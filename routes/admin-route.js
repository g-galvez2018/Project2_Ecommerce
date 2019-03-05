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


//Get route to display form to add product
router.get('/add-product', (req, res, next) => {
  res.render('admin/add-product');
});

//Post route to create product
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
    res.redirect('/admin/admin-product-list');
  } )
  .catch( err => next(err) )
})

//Get route to display all products
router.get('/admin-product-list', (req, res, next)=>{
  Product.find()
    .then(docs => {
      //console.log(docs)
      res.render('admin/admin-product-list',{ docs });
    })
    .catch (err => next(err))  
})

//Route to delete specific product
router.post('/admin-product-list/:id/delete', (req, res, next)=>{
  Product.findOneAndDelete(req.params.id)
  .then(() => {
    res.redirect('/admin/admin-product-list');
  })
  .catch(err => next(err));
  
})

//Route with product details to update product
router.get('/admin-product-edit/edit', (req, res, next) => {
  Product.findOne({_id: req.query.product_id})
  .then((product) => {
    console.log(product)
    res.render("admin/admin-product-edit", {product});
  })
  .catch((error) => {
    console.log(error);
  })  
});

//Route used when updating product
router.post('/admin-product-edit/:product_id/update', fileUploader.single('imageUrl'), (req, res, next) => {
  console.log(req.body);
  const { itemName, category, price, description } = req.body;
  const updatedProduct = { // <---------------------------------------
    itemName,   
    category,
    price,                                                      //  |
    description                                                 //  |
  }                                                              //  |
  // if the user changed the picture, 'req.file' will exist       //  |
  // and then we create additional property updatedProduct.imageUrl  //  |
  // inside 'updatedProduct' object                                  //  |                 
  if(req.file){                                                   //  |
    updatedProduct.imageUrl = req.file.secure_url;                   //  |
  }                                                               //  |
                                                                  //  |
  Product.findByIdAndUpdate(req.params.product_id, updatedProduct) // <----------
  .then( theUpdatedProduct => {
    // console.log(theUpdatedRoom);
    //res.redirect(`/admin/admin-product-list/${updatedProduct._id}`);
    res.redirect('/product-list')
  } )
  .catch( err => next(err) )
  })


//Route to view product details
router.get('/admin-product-details/:product_id', (req, res, next)=>{
  //res.render('admin/admin-product-details')
  Product.findById(req.params.product_id)
  .then(foundProduct => {
    res.render('admin/admin-product-details', {product: foundProduct})
  })
  .catch( err => next(err) )
})





module.exports = router;