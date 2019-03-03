const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  itemName: { type: String, required:true},
  category: { type: String, required:true},
  price:{type:Number, required:true, get: getPrice, set: setPrice },  
  imageUrl: { type: String },  
  description: { type: String, required:true },
})

function getPrice(num){
  return (num/100).toFixed(2);
}

function setPrice(num){
  return num*100;
}

const Product = mongoose.model('Product', productSchema);

module.exports = Product;